import {
  AlertCircle,
  Download,
  Film,
  ImagePlus,
  Loader2,
  RectangleHorizontal,
  RectangleVertical,
  RotateCcw,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { VIDEO_PROMPT_PRESETS } from "../data/portfolioData";

type AspectRatio = "16:9" | "9:16";

interface GeneratedClip {
  videoId: string;
  videoUrl: string;
  aspectRatio: AspectRatio;
  prompt: string;
  sourceLabel: string;
  createdAt: string;
}

const PORTRAIT_ASSET_PATH = "/assets/aistudio/Jay_85fb1e37.png";

export function VideoStudio() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string>(PORTRAIT_ASSET_PATH);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [mimeType, setMimeType] = useState<string>("image/png");
  const [sourceLabel, setSourceLabel] = useState<string>("Jay_85fb1e37.png");

  const [prompt, setPrompt] = useState<string>(VIDEO_PROMPT_PRESETS[0].prompt);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [isDragging, setIsDragging] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [clips, setClips] = useState<GeneratedClip[]>([]);
  const [activeClipId, setActiveClipId] = useState<string | null>(null);

  const activeClip = clips.find((c) => c.videoId === activeClipId) || clips[0] || null;

  useEffect(() => {
    let active = true;
    async function loadDefaultPortrait() {
      try {
        const res = await fetch(PORTRAIT_ASSET_PATH);
        if (!res.ok) return;
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (active && typeof reader.result === "string") {
            setImageBase64(reader.result);
            setMimeType(blob.type || "image/png");
          }
        };
        reader.readAsDataURL(blob);
      } catch {
        // User can still upload a custom photo if default asset fetch fails
      }
    }
    loadDefaultPortrait();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isGenerating) {
      setElapsedSeconds(0);
      return;
    }
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isGenerating]);

  function handleFileSelection(file: File | undefined) {
    if (!file) return;
    const validTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Please upload a PNG, JPEG, or WebP image file.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("Please choose an image smaller than 15 MB.");
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setPreviewUrl(reader.result);
        setImageBase64(reader.result);
        setMimeType(file.type);
        setSourceLabel(file.name);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleResetToPortrait() {
    setErrorMessage(null);
    setPreviewUrl(PORTRAIT_ASSET_PATH);
    setSourceLabel("Jay_85fb1e37.png");
    try {
      const res = await fetch(PORTRAIT_ASSET_PATH);
      if (!res.ok) throw new Error("Unable to load portrait asset.");
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImageBase64(reader.result);
          setMimeType(blob.type || "image/png");
        }
      };
      reader.readAsDataURL(blob);
    } catch {
      setErrorMessage("Could not reload the default portrait. Please upload a photo instead.");
    }
  }

  async function handleGenerateVideo(e: React.FormEvent) {
    e.preventDefault();
    if (!imageBase64) {
      setErrorMessage("Please upload a source photo before generating a video.");
      return;
    }
    if (!prompt.trim()) {
      setErrorMessage("Please enter a text prompt describing the video motion.");
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          prompt: prompt.trim(),
          aspectRatio,
        }),
      });

      const data = (await response.json()) as {
        videoId?: string;
        videoUrl?: string;
        aspectRatio?: AspectRatio;
        error?: string;
      };

      if (!response.ok || !data.videoUrl || !data.videoId) {
        throw new Error(data.error || "Video generation failed. Please try again.");
      }

      const newClip: GeneratedClip = {
        videoId: data.videoId,
        videoUrl: data.videoUrl,
        aspectRatio: data.aspectRatio || aspectRatio,
        prompt: prompt.trim(),
        sourceLabel,
        createdAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setClips((prev) => [newClip, ...prev]);
      setActiveClipId(newClip.videoId);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred during generation.";
      setErrorMessage(message);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section id="video-studio" className="border-b border-slate-200 bg-[#F8FAFC] py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-blue-700">Interactive Media Tool</p>
          <h2 className="mt-2 text-balance font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Animate a photo into video from text
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Upload a photo or use the profile portrait, describe the motion and scene in plain
            text, select a landscape or vertical frame, and generate a video clip.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <form
            onSubmit={handleGenerateVideo}
            className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-5"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm font-semibold text-slate-900">
                  1. Source Photo
                </label>
                <button
                  type="button"
                  onClick={handleResetToPortrait}
                  className="inline-flex min-h-8 items-center gap-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Use Profile Portrait</span>
                </button>
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFileSelection(e.dataTransfer.files?.[0]);
                }}
                className={`mt-2.5 flex items-center gap-4 rounded-xl border p-3.5 transition-colors duration-150 ${
                  isDragging
                    ? "border-blue-700 bg-blue-50/50"
                    : "border-slate-200 bg-slate-50/60"
                }`}
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Selected source photo for video animation"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <ImagePlus className="h-6 w-6" aria-hidden="true" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {sourceLabel}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    PNG, JPEG, or WebP · Drag &amp; drop or browse
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2.5 inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  >
                    <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Upload Photo</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => handleFileSelection(e.target.files?.[0])}
                    className="sr-only"
                    aria-label="Upload source photo"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="video-prompt" className="text-sm font-semibold text-slate-900">
                  2. Text Motion Prompt
                </label>
                <span className="font-mono text-xs tabular-nums text-slate-500">
                  {prompt.length} chars
                </span>
              </div>

              <textarea
                id="video-prompt"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how the photo should come alive—camera movement, expression, lighting, and background motion..."
                className="mt-2.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/15"
              />

              <div className="mt-2.5 flex flex-wrap gap-2">
                {VIDEO_PROMPT_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setPrompt(preset.prompt);
                      setAspectRatio(preset.aspectRatio);
                    }}
                    className="min-h-8 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-blue-700 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-sm font-semibold text-slate-900">
                3. Aspect Ratio
              </span>
              <div
                role="radiogroup"
                aria-label="Video aspect ratio"
                className="mt-2.5 grid grid-cols-2 gap-3"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={aspectRatio === "16:9"}
                  onClick={() => setAspectRatio("16:9")}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                    aspectRatio === "16:9"
                      ? "border-blue-700 bg-blue-700 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <RectangleHorizontal className="h-4 w-4" aria-hidden="true" />
                  <span>16:9 Landscape</span>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={aspectRatio === "9:16"}
                  onClick={() => setAspectRatio("9:16")}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                    aspectRatio === "9:16"
                      ? "border-blue-700 bg-blue-700 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <RectangleVertical className="h-4 w-4" aria-hidden="true" />
                  <span>9:16 Portrait</span>
                </button>
              </div>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-800"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white whitespace-nowrap transition-colors duration-150 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />
                  <span className="tabular-nums">
                    Generating Video ({elapsedSeconds}s)...
                  </span>
                </>
              ) : (
                <>
                  <Film className="h-4 w-4" aria-hidden="true" />
                  <span>Generate Video from Photo</span>
                </>
              )}
            </button>
          </form>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-display text-base font-semibold text-slate-900">
                  Generated Video Output
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  {activeClip
                    ? `${activeClip.aspectRatio} · Source: ${activeClip.sourceLabel} · ${activeClip.createdAt}`
                    : `Ready for ${aspectRatio} generation`}
                </p>
              </div>

              {activeClip && (
                <a
                  href={`${activeClip.videoUrl}?download=1`}
                  download
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-blue-700 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Download MP4</span>
                </a>
              )}
            </div>

            <div className="mt-6 flex min-h-[380px] items-center justify-center rounded-xl border border-slate-200 bg-slate-950 p-4">
              {isGenerating ? (
                <div className="flex max-w-sm flex-col items-center text-center text-slate-200">
                  <Loader2
                    className="h-8 w-8 text-blue-400 motion-safe:animate-spin"
                    aria-hidden="true"
                  />
                  <p className="mt-4 font-display text-base font-semibold text-white">
                    Rendering {aspectRatio} video from your photo
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                    Video synthesis typically takes 30 to 90 seconds. Elapsed:{" "}
                    <span className="font-mono tabular-nums text-slate-200">
                      {elapsedSeconds}s
                    </span>
                  </p>
                </div>
              ) : activeClip ? (
                <div
                  className={
                    activeClip.aspectRatio === "9:16"
                      ? "w-full max-w-[280px] aspect-[9/16] overflow-hidden rounded-lg bg-black"
                      : "w-full aspect-video overflow-hidden rounded-lg bg-black"
                  }
                >
                  <video
                    key={activeClip.videoId}
                    src={activeClip.videoUrl}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex max-w-md flex-col items-center text-center text-slate-300">
                  <Film className="h-9 w-9 text-slate-500" aria-hidden="true" />
                  <p className="mt-4 font-display text-base font-semibold text-white">
                    No video generated yet
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                    Confirm your photo and text prompt on the left, choose 16:9 or 9:16, and
                    click &ldquo;Generate Video from Photo&rdquo; to preview it here.
                  </p>
                </div>
              )}
            </div>

            {activeClip && (
              <p className="mt-4 text-xs leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-800">Prompt used:</span>{" "}
                {activeClip.prompt}
              </p>
            )}

            {clips.length > 1 && (
              <div className="mt-5 border-t border-slate-200 pt-4">
                <p className="text-xs font-semibold text-slate-700">
                  Session Clips ({clips.length})
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {clips.map((clip, index) => {
                    const isSelected = clip.videoId === activeClip?.videoId;
                    return (
                      <button
                        key={clip.videoId}
                        type="button"
                        onClick={() => setActiveClipId(clip.videoId)}
                        className={`min-h-9 rounded-lg border px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                          isSelected
                            ? "border-blue-700 bg-blue-50 text-blue-800"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        Clip {clips.length - index} · {clip.aspectRatio} · {clip.createdAt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
