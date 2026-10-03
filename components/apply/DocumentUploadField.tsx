"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import { getFileError, formatFileSize, FILE_INPUT_ACCEPT } from "@/lib/fileValidation";
import { FormField } from "@/components/apply/FormField";
import { DocumentIcon } from "@/components/icons";

function UploadCloudIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M7 18a4.5 4.5 0 0 1-.5-8.973 5.5 5.5 0 0 1 10.71-2.012A4.5 4.5 0 0 1 17 18M12 10v8m0-8-3 3m3-3 3 3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RemoveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

type DocumentUploadFieldProps = {
  id: string;
  label: string;
  hint?: string;
  file: File | null;
  onFileSelected: (file: File) => void;
  onRemove: () => void;
};

/**
 * A single drag-and-drop document upload field - extracted from the
 * Investor flow's original ID Upload step once the Business Owner flow
 * needed the exact same drag-drop/preview/remove behavior for not one but
 * two separate document fields (ID + business registration). Fully
 * controlled: the caller owns the actual File value in its own form
 * state (`file`/`onFileSelected`/`onRemove`); this component only owns
 * the transient UI state around it (drag hover, the local validation
 * message, the image preview URL).
 *
 * The preview is derived from the `file` prop via an effect rather than
 * only being set at the moment a file is chosen - the original version of
 * this (Investor Step 3, before this was its own component) only ever set
 * the preview inside its own "file was just selected" handler, so
 * navigating Back to a step that already had an image file attached from
 * earlier would show the generic document-icon fallback instead of the
 * real thumbnail, since nothing recomputed the preview for a file the
 * component didn't itself just receive. Deriving it from `file` fixes
 * that for both flows at once.
 */
export default function DocumentUploadField({ id, label, hint, file, onFileSelected, onRemove }: DocumentUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const acceptFile = (candidate: File) => {
    const error = getFileError(candidate);
    if (error) {
      setFileError(error);
      return;
    }
    setFileError(null);
    onFileSelected(candidate);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) acceptFile(selected);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) acceptFile(dropped);
  };

  const handleRemove = () => {
    setFileError(null);
    onRemove();
    // Cleared so selecting the exact same file again still fires
    // onChange - browsers don't re-fire it for an unchanged file path
    // unless the input's own value is reset first.
    if (inputRef.current) inputRef.current.value = "";
  };

  const openFilePicker = () => inputRef.current?.click();

  return (
    <FormField label={label} htmlFor={id} error={fileError}>
      <input ref={inputRef} id={id} name={id} type="file" accept={FILE_INPUT_ACCEPT} onChange={handleInputChange} className="sr-only" />

      {file ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 border border-gold/20 bg-panel/40 p-4">
            {previewUrl ? (
              // A transient client-side object URL, not a static asset
              // next/image could optimize, hence a plain <img>.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="" className="size-14 shrink-0 rounded-sm object-cover" />
            ) : (
              <div className="flex size-14 shrink-0 items-center justify-center border border-gold/20 bg-ink-light/50 text-gold-muted">
                <DocumentIcon className="size-6" />
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate font-jakarta text-sm font-medium text-cream">{file.name}</span>
              <span className="font-sans text-xs text-cream-dim">{formatFileSize(file.size)}</span>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              aria-label={`Remove ${label}`}
              className="flex size-8 shrink-0 items-center justify-center text-cream-dim transition-colors hover:text-[#f87171]"
            >
              <RemoveIcon className="size-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={openFilePicker}
            className="self-start font-sans text-xs font-medium text-gold-bright underline-offset-4 transition-colors hover:text-gold-light hover:underline"
          >
            Choose a different file
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={openFilePicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openFilePicker();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingOver(true);
          }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center gap-3 border border-dashed px-6 py-10 text-center transition-colors ${
            isDraggingOver ? "border-gold bg-gold/5" : fileError ? "border-[#f87171]" : "border-grid-line hover:border-gold/40"
          }`}
        >
          <UploadCloudIcon className="size-8 text-gold-muted" />
          <div className="flex flex-col gap-1">
            <p className="font-sans text-sm font-medium text-cream">Drag and drop your file here</p>
            <p className="font-sans text-xs text-cream-dim">or</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openFilePicker();
            }}
            className="border border-gold-muted/40 px-4 py-2 font-jakarta text-xs font-medium text-gold-bright transition-colors hover:bg-gold-bright/10"
          >
            Browse files
          </button>
          {hint && <p className="font-sans text-xs text-cream-dim/70">{hint}</p>}
        </div>
      )}
    </FormField>
  );
}
