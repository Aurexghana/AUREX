/**
 * Document-upload field names for Step 3 of the Business Owner Application
 * (see components/apply/business/DocumentUploadStep.tsx) - the validation
 * rules and ID-type list themselves are generic and shared with the
 * Investor flow's own ID Upload step; see lib/fileValidation.ts.
 */

export {
  MAX_FILE_SIZE_BYTES,
  FILE_INPUT_ACCEPT,
  ID_TYPE_OPTIONS,
  getFileError,
  formatFileSize,
} from "@/lib/fileValidation";

export type DocumentType = "id" | "business-registration";
