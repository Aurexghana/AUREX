/**
 * Generic document-upload rules shared by every "attach a file" field
 * across both application flows - the Investor flow's ID Upload step (see
 * lib/idUpload.ts, now a thin investor-specific wrapper around this file)
 * and the Business Owner flow's two document fields (see
 * lib/businessDocuments.ts). Extracted here once a second flow needed the
 * exact same JPG/PNG/PDF-under-10MB rule and ID-type list, rather than
 * duplicating either.
 */

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const ACCEPTED_FILE_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf"];
export const ACCEPTED_FILE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".pdf"];

// Passed straight to a file input's `accept` attribute.
export const FILE_INPUT_ACCEPT = [...ACCEPTED_FILE_MIME_TYPES, ...ACCEPTED_FILE_EXTENSIONS].join(",");

export type SelectOption = { value: string; label: string };

// Which kind of government-issued ID was uploaded - optional context for
// AUREX admin, doesn't gate "Continue" the way the file itself does.
// Shared by both flows' ID fields since the options themselves don't vary
// by what the applicant is applying for.
export const ID_TYPE_OPTIONS: SelectOption[] = [
  { value: "passport", label: "Passport" },
  { value: "national-id", label: "National ID" },
  { value: "drivers-license", label: "Driver's License" },
];

/**
 * Returns a user-facing error message, or null if the file is acceptable.
 * Checked against MIME type first; a handful of browsers/OSes leave
 * `file.type` blank for some sources (e.g. certain camera-capture flows),
 * so an empty type falls back to checking the file's extension instead of
 * being rejected outright.
 */
export function getFileError(file: File): string | null {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  const typeOk = file.type
    ? ACCEPTED_FILE_MIME_TYPES.includes(file.type)
    : ACCEPTED_FILE_EXTENSIONS.includes(extension);

  if (!typeOk) {
    return "Upload a JPG, PNG, or PDF file.";
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `That file is too large: the maximum size is ${Math.round(MAX_FILE_SIZE_BYTES / (1024 * 1024))}MB.`;
  }

  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
