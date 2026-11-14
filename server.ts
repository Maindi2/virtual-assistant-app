import "dotenv/config";
import crypto from "node:crypto";
import path from "node:path";
import express from "express";
import { GoogleGenAI } from "@google/genai";

interface StoredVideo {
  buffer: Buffer;
  mimeType: string;
  createdAt: number;
}

const MAX_STORED_VIDEOS = 20;
const videoStore = new Map<string, StoredVideo>();

function storeVideo(buffer: Buffer, mimeType: string): string {
  if (videoStore.size >= MAX_STORED_VIDEOS) {
    const oldestKey = videoStore.keys().next().value;
    if (oldestKey) {
      videoStore.delete(oldestKey);
    }
  }
  const id = crypto.randomUUID();
  videoStore.set(id, { buffer, mimeType, createdAt: Date.now() });
  return id;
}

function getApiErrorDetails(error: unknown): { status: number; message: string } {
  const errObj = error as { status?: number; code?: number; message?: string };
  const rawMessage = errObj?.message || "Video generation failed.";

  if (
    rawMessage.includes("PERMISSION_DENIED") ||
    rawMessage.includes("API_KEY_INVALID") ||
    errObj?.status === 403 ||
    errObj?.status === 400
  ) {
    return {
      status: errObj?.status || 403,
      message:
        "Gemini API key was rejected or lacks permission for gemini-omni-1.2-flash. Please verify your paid API key in Settings > Secrets.",
    };
  }

  if (rawMessage.includes("RESOURCE_EXHAUSTED") || errObj?.status === 429) {
    return {
      status: 429,
      message:
        "Quota exceeded or rate limited for gemini-omni-1.2-flash. Ensure a billing-enabled paid API key is selected in Settings > Secrets.",
    };
  }

  if (rawMessage.includes("NOT_FOUND") || errObj?.status === 404) {
    return {
      status: 404,
      message:
        "The gemini-omni-1.2-flash model endpoint returned not found. Please check model availability.",
    };
  }

  return {
    status: typeof errObj?.status === "number" && errObj.status >= 400 ? errObj.status : 500,
    message: rawMessage,
  };
}

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "25mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.post("/api/generate-video", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error:
            "GEMINI_API_KEY is not configured on the server. Please select a paid API key in Settings > Secrets.",
        });
      }

      const { imageBase64, mimeType, prompt, aspectRatio } = req.body as {
        imageBase64?: string;
        mimeType?: string;
        prompt?: string;
        aspectRatio?: string;
      };

      if (!imageBase64 || typeof imageBase64 !== "string") {
        return res.status(400).json({ error: "Please upload or select a source photo." });
      }

      if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
        return res
          .status(400)
          .json({ error: "Please enter a text prompt describing how to animate the photo." });
      }

      const selectedAspectRatio = aspectRatio === "9:16" ? "9:16" : "16:9";
      const allowedMimeTypes = new Set(["image/png", "image/jpeg", "image/webp"]);
      const normalizedMime =
        mimeType && allowedMimeTypes.has(mimeType) ? mimeType : "image/png";

      const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "");

      const ai = new GoogleGenAI({ apiKey });

      const interaction = await ai.interactions.create(
        {
          model: "gemini-omni-1.2-flash",
          input: [
            {
              type: "image",
              mime_type: normalizedMime,
              data: cleanBase64,
            },
            {
              type: "text",
              text: prompt.trim(),
            },
          ],
          background: false,
          store: true,
          stream: false,
          response_format: {
            type: "video",
            aspect_ratio: selectedAspectRatio,
          },
        },
        { timeout: 300000 }
      );

      let videoData = interaction.output_video?.data;
      let videoUri = interaction.output_video?.uri;
      let videoMime = interaction.output_video?.mime_type || "video/mp4";

      if (!videoData && !videoUri && Array.isArray(interaction.steps)) {
        for (const step of interaction.steps) {
          if (step.type === "model_output" && Array.isArray(step.content)) {
            const videoContent = step.content.find(
              (c): c is { type: "video"; data?: string; uri?: string; mime_type?: string } =>
                c.type === "video"
            );
            if (videoContent) {
              videoData = videoContent.data;
              videoUri = videoContent.uri;
              if (videoContent.mime_type) {
                videoMime = videoContent.mime_type;
              }
            }
          }
        }
      }

      let videoBuffer: Buffer | null = null;
      if (videoData) {
        videoBuffer = Buffer.from(videoData, "base64");
      } else if (videoUri) {
        const fetched = await fetch(videoUri, {
          headers: { "x-goog-api-key": apiKey },
        });
        if (!fetched.ok) {
          throw new Error(`Failed to retrieve generated video (${fetched.status}).`);
        }
        const arrBuf = await fetched.arrayBuffer();
        videoBuffer = Buffer.from(arrBuf);
      }

      if (!videoBuffer || videoBuffer.length === 0) {
        return res.status(502).json({
          error: "The model completed without returning video bytes. Try refining your prompt.",
        });
      }

      const videoId = storeVideo(videoBuffer, videoMime);

      return res.json({
        videoId,
        videoUrl: `/api/videos/${videoId}`,
        mimeType: videoMime,
        aspectRatio: selectedAspectRatio,
        interactionId: interaction.id,
      });
    } catch (error) {
      const details = getApiErrorDetails(error);
      console.error("Video generation error:", error);
      return res.status(details.status).json({ error: details.message });
    }
  });

  app.get("/api/videos/:id", (req, res) => {
    const entry = videoStore.get(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: "Video not found or expired from session cache." });
    }

    const total = entry.buffer.length;
    const download = req.query.download === "1";

    if (download) {
      res.setHeader("Content-Disposition", `attachment; filename="animated-video-${req.params.id.slice(0, 8)}.mp4"`);
    }

    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : total - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${total}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": entry.mimeType,
      });
      return res.end(entry.buffer.subarray(start, end + 1));
    }

    res.writeHead(200, {
      "Content-Length": total,
      "Accept-Ranges": "bytes",
      "Content-Type": entry.mimeType,
    });
    return res.end(entry.buffer);
  });

  app.post("/api/inquiries", (req, res) => {
    const { name, email, service, timeline, message } = req.body as {
      name?: string;
      email?: string;
      service?: string;
      timeline?: string;
      message?: string;
    };

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        error: "Name, email address, and project details are required.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    return res.status(201).json({
      referenceId: `REQ-${crypto.randomBytes(3).toString("hex").toUpperCase()}`,
      receivedAt: new Date().toISOString(),
      name: name.trim(),
      email: email.trim(),
      service: service || "General Virtual Assistance",
      timeline: timeline || "Flexible",
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });

  server.setTimeout(330000);
  server.requestTimeout = 330000;
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
