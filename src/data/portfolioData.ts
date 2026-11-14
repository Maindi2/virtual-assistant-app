export type ServiceCategory =
  | "all"
  | "data"
  | "research"
  | "admin";

export interface ServiceItem {
  number: string;
  title: string;
  category: Exclude<ServiceCategory, "all">;
  categoryLabel: string;
  summary: string;
  deliverables: string[];
  tools: string;
}

export const SERVICES: ServiceItem[] = [
  {
    number: "01",
    title: "Data entry and data collection",
    category: "data",
    categoryLabel: "Data & Spreadsheets",
    summary:
      "Accurate manual and structured transfer of records, invoices, CRM entries, directories, and catalog data into clean digital databases.",
    deliverables: [
      "Verified spreadsheet or CRM records with zero duplicate entries",
      "Consistent field naming, ID indexing, and source tracking",
      "Batch verification against original source files",
    ],
    tools: "Microsoft Excel · Google Sheets · Airtable",
  },
  {
    number: "02",
    title: "Microsoft Excel and Google Sheets formatting",
    category: "data",
    categoryLabel: "Data & Spreadsheets",
    summary:
      "Turn plain tables into readable workbooks using clean column widths, conditional highlighting, freeze panes, validation rules, and formulas.",
    deliverables: [
      "Structured headers, frozen panes, and print-ready page layouts",
      "Dynamic SUMIFS, XLOOKUP, COUNTIF, and pivot summaries",
      "Dropdown data validation and clear number/currency formatting",
    ],
    tools: "Microsoft Excel · Google Sheets",
  },
  {
    number: "03",
    title: "Data cleaning and organization",
    category: "data",
    categoryLabel: "Data & Spreadsheets",
    summary:
      "Standardize messy exports by removing duplicates, fixing broken capitalization, normalizing dates and phone numbers, and splitting merged fields.",
    deliverables: [
      "Deduplicated master sheets with flagged anomalies separated",
      "ISO date normalization and uniform naming conventions",
      "Cleanly split First/Last name, city, and contact columns",
    ],
    tools: "Excel Power Query · Google Sheets · CSV Tools",
  },
  {
    number: "04",
    title: "Internet research and information gathering",
    category: "research",
    categoryLabel: "Research & Documents",
    summary:
      "Targeted web research to compile vendor lists, prospect contacts, market pricing comparisons, and verified background briefs with source URLs.",
    deliverables: [
      "Source-cited spreadsheets with direct reference URLs",
      "Competitor pricing, feature matrices, and directory sweeps",
      "Concise executive briefing notes for quick review",
    ],
    tools: "Web Research · Google Workspace · Notion",
  },
  {
    number: "05",
    title: "Microsoft Word and document formatting",
    category: "research",
    categoryLabel: "Research & Documents",
    summary:
      "Format reports, SOPs, proposals, and manuals with consistent heading hierarchies, automated tables of contents, headers, and clean page breaks.",
    deliverables: [
      "Uniform typography, margin grids, and paragraph spacing",
      "Linked Table of Contents, numbered sections, and clean tables",
      "Ready-to-send DOCX and print-ready PDF exports",
    ],
    tools: "Microsoft Word · Google Docs",
  },
  {
    number: "06",
    title: "PDF to Word/Excel conversion",
    category: "research",
    categoryLabel: "Research & Documents",
    summary:
      "Convert scanned statements, invoices, and multi-page PDF reports into accurately structured, editable Word documents or Excel workbooks.",
    deliverables: [
      "Line-by-line accuracy check against original PDF tables",
      "Preserved numeric precision without merged-cell distortion",
      "Editable DOCX or XLSX files ready for downstream use",
    ],
    tools: "Adobe Acrobat · Microsoft Excel · Microsoft Word",
  },
  {
    number: "07",
    title: "Email and administrative assistance",
    category: "admin",
    categoryLabel: "Admin & Web",
    summary:
      "Day-to-day remote support covering inbox triage, calendar scheduling, template replies, file organization, and recurring task tracking.",
    deliverables: [
      "Sorted inbox folders, priority flags, and draft responses",
      "Calendar coordination across international time zones",
      "Organized cloud drive hierarchies and weekly status recaps",
    ],
    tools: "Gmail · Outlook · Google Calendar · Google Drive",
  },
  {
    number: "08",
    title: "Basic website updates and content management",
    category: "admin",
    categoryLabel: "Admin & Web",
    summary:
      "Keep business websites current by publishing blog posts, updating product descriptions, refreshing contact details, and checking broken links.",
    deliverables: [
      "Cleanly formatted articles, pricing updates, and product listings",
      "Image alt-text checks and metadata consistency",
      "Scheduled content publishing and routine link audits",
    ],
    tools: "WordPress · Shopify · Webflow · CMS Dashboards",
  },
];

export interface DataCleaningRow {
  id: string;
  rawName: string;
  rawEmail: string;
  rawDate: string;
  rawAmount: string;
  rawStatus: string;
  cleanName: string;
  cleanEmail: string;
  cleanDate: string;
  cleanAmount: string;
  cleanNote: string;
}

export const DATA_CLEANING_SAMPLE: DataCleaningRow[] = [
  {
    id: "1041",
    rawName: "  amina OCHIENG",
    rawEmail: "Amina.Ochieng@GMAIL.com ",
    rawDate: "14/11/26",
    rawAmount: "kes 14500",
    rawStatus: "paid ",
    cleanName: "Amina Ochieng",
    cleanEmail: "amina.ochieng@gmail.com",
    cleanDate: "2026-11-14",
    cleanAmount: "KES 14,500.00",
    cleanNote: "Verified",
  },
  {
    id: "1042",
    rawName: "DAVID mwangi",
    rawEmail: "dmwangi@company.co.ke",
    rawDate: "Nov 15 2026",
    rawAmount: "28900.5",
    rawStatus: "PENDING",
    cleanName: "David Mwangi",
    cleanEmail: "dmwangi@company.co.ke",
    cleanDate: "2026-11-15",
    cleanAmount: "KES 28,900.50",
    cleanNote: "Follow-up",
  },
  {
    id: "1043",
    rawName: "amina ochieng (dup)",
    rawEmail: "amina.ochieng@gmail.com",
    rawDate: "2026.11.14",
    rawAmount: "14,500",
    rawStatus: "Paid",
    cleanName: "Removed (Duplicate #1041)",
    cleanEmail: "amina.ochieng@gmail.com",
    cleanDate: "2026-11-14",
    cleanAmount: "KES 0.00",
    cleanNote: "Deduplicated",
  },
  {
    id: "1044",
    rawName: "grace WANJIKU ",
    rawEmail: "grace.w@outlook.com",
    rawDate: "16-11-2026",
    rawAmount: "9200",
    rawStatus: "paid",
    cleanName: "Grace Wanjiku",
    cleanEmail: "grace.w@outlook.com",
    cleanDate: "2026-11-16",
    cleanAmount: "KES 9,200.00",
    cleanNote: "Verified",
  },
];

export const VIDEO_PROMPT_PRESETS = [
  {
    label: "Executive Intro",
    aspectRatio: "16:9" as const,
    prompt:
      "Natural studio portrait motion: the subject looks calmly into the camera with a warm, confident smile and subtle natural blinking while soft morning daylight gently shifts across a tidy modern office background.",
  },
  {
    label: "Vertical Bio Reel",
    aspectRatio: "9:16" as const,
    prompt:
      "Vertical professional introduction clip: smooth slow camera push-in as the subject gives a friendly nod and subtle reassuring smile, crisp studio lighting, natural fabric movement, clean shallow depth of field.",
  },
  {
    label: "Workspace Atmosphere",
    aspectRatio: "16:9" as const,
    prompt:
      "Cinematic slow camera pan around the subject in a bright minimalist workspace, gentle natural breathing and posture shift, warm window highlights reflecting softly on the background.",
  },
];
