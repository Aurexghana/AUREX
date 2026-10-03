/**
 * Investor-flow-specific names for Step 3 of the Investor Application (see
 * components/apply/investor/IdUploadStep.tsx). The actual validation rules
 * and ID-type list are generic - shared with the Business Owner flow's own
 * document fields - and live in lib/fileValidation.ts; this file just
 * re-exports them under the names IdUploadStep.tsx already imports.
 */

import {
  MAX_FILE_SIZE_BYTES,
  FILE_INPUT_ACCEPT,
  ID_TYPE_OPTIONS,
  getFileError,
  formatFileSize,
  type SelectOption,
} from "@/lib/fileValidation";

export const MAX_ID_FILE_SIZE_BYTES = MAX_FILE_SIZE_BYTES;
export const ID_FILE_INPUT_ACCEPT = FILE_INPUT_ACCEPT;
export const getIdFileError = getFileError;
export { formatFileSize, ID_TYPE_OPTIONS };
export type IdType = SelectOption;
