"use client";

import { useEffect, useState, type SVGProps } from "react";
import { motion } from "framer-motion";
import { hoverScale } from "@/lib/motion";
import { formatDisplayDate } from "@/lib/formatters";
import { FormField, fieldClassName } from "@/components/apply/FormField";
import CustomSelect from "@/components/apply/CustomSelect";
import DocumentUploadField from "@/components/apply/DocumentUploadField";
import { useAuth } from "@/lib/auth/AuthContext";
import type { SelectOption } from "@/lib/optionalDetails";
import {
  INVESTOR_REPORT_CATEGORIES,
  BUSINESS_REPORT_CATEGORIES,
  REPORT_PRIORITY_OPTIONS,
  REPORT_STATUS_LABEL,
  NOT_RELATED_VALUE,
  NOT_RELATED_OPTION,
  submitReport,
  type Report,
  type ReportRole,
  type ReportPriority,
  type ReportStatus,
} from "@/lib/reports";

// Tone per status - same "gold for actionable, green for a good/finished
// outcome, neutral otherwise" convention as ListingStatusSection's own
// STATUS_TONE, reused here rather than inventing a fourth color scheme.
const STATUS_TONE: Record<ReportStatus, string> = {
  open: "border-grid-line text-cream-dim",
  in_progress: "border-gold/30 text-gold-bright",
  resolved: "border-[#4ade80]/30 text-[#4ade80]",
};

function SpinnerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
      <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span
      className={`inline-flex w-fit shrink-0 items-center rounded-full border px-2.5 py-0.5 font-jakarta text-[10px] font-medium uppercase tracking-wide ${STATUS_TONE[status]}`}
    >
      {REPORT_STATUS_LABEL[status]}
    </span>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-sans text-[11px] uppercase tracking-wide text-cream-dim">{label}</span>
      <span className="font-jakarta text-sm font-medium text-cream">{value}</span>
    </div>
  );
}

/** Read-only popup with everything submitted for one report, plus Admin's
 *  reply once one exists. Backdrop click and Escape both close it. */
function ReportDetailModal({ report, onClose }: { report: Report; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-detail-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-amainblack/70 backdrop-blur-sm"
      />
      <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col gap-5 overflow-y-auto border border-gold/20 bg-panel/95 p-6 backdrop-blur-2xl sm:p-8">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 flex size-8 items-center justify-center text-cream-dim transition-colors hover:text-gold-bright"
        >
          <svg viewBox="0 0 20 20" fill="none" className="size-4" aria-hidden="true">
            <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex flex-col gap-2 pr-8">
          <StatusBadge status={report.status} />
          <h2 id="report-detail-title" className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">
            {report.subject}
          </h2>
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-sans text-[11px] uppercase tracking-wide text-cream-dim">Description</span>
          <p className="whitespace-pre-wrap font-sans text-sm text-cream">{report.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-t border-grid-line pt-4">
          <DetailField label="Category" value={report.categoryLabel} />
          <DetailField label="Priority" value={report.priorityLabel} />
          <DetailField label="Related Record" value={report.relatedRecordLabel ?? "Not related to a specific record"} />
          <DetailField label="Submitted" value={formatDisplayDate(report.submittedAt)} />
          {report.attachmentName && <DetailField label="Attachment" value={report.attachmentName} />}
        </div>

        {report.adminReply ? (
          <div className="flex flex-col gap-1.5 border border-gold/20 bg-gold/5 p-4">
            <span className="font-jakarta text-xs font-medium uppercase tracking-[1.4px] text-gold-muted">
              Admin Response · {formatDisplayDate(report.adminReply.respondedAt)}
            </span>
            <p className="whitespace-pre-wrap font-sans text-sm text-cream">{report.adminReply.message}</p>
          </div>
        ) : (
          <p className="font-sans text-xs text-cream-dim">Admin hasn&apos;t responded yet. Check back soon.</p>
        )}
      </div>
    </div>
  );
}

type ReportSectionProps = {
  role: ReportRole;
  /** Used only when there's no real signed-in nickname/name yet (see
   *  useAuth's own `nickname ?? MOCK_INVESTOR.nickname` fallback every
   *  other dashboard screen already applies) - same mock-account
   *  situation, just centralized here instead of repeated per page. */
  fallbackNickname: string;
  fallbackRealName: string;
  /** Built by the page itself - see lib/reports.ts's getMyInvestmentOptions
   *  (investor) / getBusinessRelatedRecordOptions (business) - so this
   *  component doesn't need to know how each role's records are shaped,
   *  only how to list them. */
  relatedRecordOptions: SelectOption[];
  initialReports: Report[];
};

/**
 * The "Report" tab - one component shared by both dashboards (a role
 * prop, not a role-specific copy, per the brief), submitting a report or
 * complaint to Admin plus the member's own report history. Nickname and
 * real name come from the logged-in account (via context, same pattern
 * every other dashboard screen uses) and are shown read-only, never
 * re-entered.
 */
export default function ReportSection({
  role,
  fallbackNickname,
  fallbackRealName,
  relatedRecordOptions,
  initialReports,
}: ReportSectionProps) {
  const { user } = useAuth();
  const nickname = user?.nickname ?? fallbackNickname;
  const realName = [user?.firstname, user?.lastname].filter(Boolean).join(" ") || fallbackRealName;

  const categoryOptions = role === "investor" ? INVESTOR_REPORT_CATEGORIES : BUSINESS_REPORT_CATEGORIES;

  const [category, setCategory] = useState("");
  const [relatedRecord, setRelatedRecord] = useState<string>(NOT_RELATED_VALUE);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<ReportPriority>("medium");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [touched, setTouched] = useState(false);
  const [pendingAction, setPendingAction] = useState<"submit" | "retry" | null>(null);
  const submitting = pendingAction !== null;
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [showForm, setShowForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const isValid = category !== "" && subject.trim() !== "" && description.trim() !== "";

  const attemptSubmit = async (trigger: "submit" | "retry") => {
    setPendingAction(trigger);
    setSubmitError(null);
    try {
      const categoryLabel = categoryOptions.find((c) => c.value === category)?.label ?? category;
      const relatedRecordLabel =
        relatedRecord === NOT_RELATED_VALUE
          ? null
          : (relatedRecordOptions.find((r) => r.value === relatedRecord)?.label ?? null);
      const priorityLabel = REPORT_PRIORITY_OPTIONS.find((p) => p.value === priority)?.label ?? priority;

      const created = await submitReport({
        categoryLabel,
        relatedRecordLabel,
        subject: subject.trim(),
        description: description.trim(),
        priorityLabel,
        attachmentName: attachment?.name ?? null,
        priorityValue: priority,
        investmentId: role === "investor" && relatedRecord !== NOT_RELATED_VALUE ? relatedRecord : null,
        attachment,
      });

      setReports((prev) => [created, ...prev]);
      resetForm();
      setShowForm(false);
      setJustSubmitted(true);
      window.setTimeout(() => setJustSubmitted(false), 4000);
    } catch {
      setSubmitError("Something went wrong submitting your report. Please try again.");
    } finally {
      setPendingAction(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid || submitting) return;
    void attemptSubmit("submit");
  };

  const resetForm = () => {
    setCategory("");
    setRelatedRecord(NOT_RELATED_VALUE);
    setSubject("");
    setDescription("");
    setPriority("medium");
    setAttachment(null);
    setTouched(false);
    setSubmitError(null);
  };

  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  return (
    <div className="flex flex-col gap-8">
      {showForm && (
        <section className="flex flex-col gap-6 border border-gold/20 bg-panel/40 p-6 backdrop-blur-2xl sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">Create a Report</h2>
              <p className="font-sans text-sm text-cream-dim">
                Flag a problem or ask AUREX Admin a question. They&apos;ll respond here once they&apos;ve looked into
                it.
              </p>
            </div>
            <button
              type="button"
              onClick={closeForm}
              disabled={submitting}
              className="shrink-0 font-sans text-sm text-cream-dim transition-colors hover:text-gold-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-y border-grid-line py-4">
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-[11px] uppercase tracking-wide text-cream-dim">Nickname</span>
              <span className="font-jakarta text-sm font-medium text-cream">{nickname}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-[11px] uppercase tracking-wide text-cream-dim">Name</span>
              <span className="font-jakarta text-sm font-medium text-cream">{realName}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Category"
                htmlFor="report-category"
                error={touched && category === "" ? "Select a category." : null}
              >
                <CustomSelect
                  id="report-category"
                  value={category}
                  onChange={setCategory}
                  onBlur={() => setTouched(true)}
                  options={categoryOptions}
                  placeholder="Select a category"
                  hasError={touched && category === ""}
                  triggerClassName="w-full"
                />
              </FormField>

              <FormField label="Related Record (optional)" htmlFor="report-related-record">
                <CustomSelect
                  id="report-related-record"
                  value={relatedRecord}
                  onChange={setRelatedRecord}
                  options={[NOT_RELATED_OPTION, ...relatedRecordOptions]}
                  triggerClassName="w-full"
                />
              </FormField>
            </div>

            <FormField
              label="Subject"
              htmlFor="report-subject"
              error={touched && subject.trim() === "" ? "Enter a short subject." : null}
            >
              <input
                id="report-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="e.g. Earnings figure looks off for my Core holding"
                className={fieldClassName(touched && subject.trim() === "")}
              />
            </FormField>

            <FormField
              label="Description"
              htmlFor="report-description"
              error={touched && description.trim() === "" ? "Tell us what happened." : null}
            >
              <textarea
                id="report-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="What happened, and when? Include any details that would help Admin look into it."
                className={fieldClassName(touched && description.trim() === "", "min-h-24 resize-y")}
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <DocumentUploadField
                id="report-attachment"
                label="Attachment (optional)"
                hint="Screenshot or PDF, up to 10MB."
                file={attachment}
                onFileSelected={setAttachment}
                onRemove={() => setAttachment(null)}
              />

              <FormField label="Priority" htmlFor="report-priority">
                <CustomSelect
                  id="report-priority"
                  value={priority}
                  onChange={(v) => setPriority(v as ReportPriority)}
                  options={REPORT_PRIORITY_OPTIONS}
                  triggerClassName="w-full"
                />
              </FormField>
            </div>

            {submitError && (
              <div className="flex flex-wrap items-center justify-between gap-3 border border-[#f87171]/30 bg-[#f87171]/5 px-4 py-3">
                <p role="alert" className="font-sans text-xs text-[#f87171]">
                  {submitError}
                </p>
                <button
                  type="button"
                  onClick={() => void attemptSubmit("retry")}
                  disabled={submitting}
                  className="shrink-0 font-jakarta text-xs font-medium text-gold-bright underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pendingAction === "retry" ? <SpinnerIcon className="size-4 animate-spin" /> : "Retry"}
                </button>
              </div>
            )}

            <motion.button
              {...(submitting ? {} : hoverScale)}
              type="submit"
              disabled={!isValid || submitting}
              className="flex w-full items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3 font-jakarta text-sm font-medium text-amainblack transition-opacity disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit sm:self-start sm:px-8"
            >
              {pendingAction === "submit" ? <SpinnerIcon className="size-4 animate-spin" /> : "Submit Report"}
            </motion.button>
          </form>
        </section>
      )}

      <section className="flex flex-col gap-6 border border-grid-line bg-panel/20 p-6 sm:p-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1">
            <h2 className="font-jakarta text-xl font-semibold text-cream sm:text-2xl">My Reports</h2>
            <p className="font-sans text-sm text-cream-dim">Reports you&apos;ve submitted to Admin.</p>
          </div>
          {!showForm && (
            <motion.button
              {...hoverScale}
              type="button"
              onClick={() => {
                setJustSubmitted(false);
                setShowForm(true);
              }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-gold via-gold-light via-50% to-gold px-6 py-3 font-jakarta text-sm font-medium text-amainblack"
            >
              Create Report
            </motion.button>
          )}
        </div>

        {justSubmitted && (
          <p role="status" className="font-sans text-xs text-[#4ade80]">
            Report submitted. Admin has been notified.
          </p>
        )}

        {reports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-grid-line">
                  {["Subject", "Category", "Priority", "Status", "Submitted", ""].map((heading) => (
                    <th
                      key={heading || "actions"}
                      scope="col"
                      className="px-3 py-3 font-sans text-[11px] font-medium uppercase tracking-wide text-cream-dim first:pl-0 last:pr-0"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b border-grid-line last:border-b-0">
                    <td className="max-w-[220px] truncate px-3 py-4 font-jakarta text-sm font-semibold text-cream first:pl-0">
                      {report.subject}
                    </td>
                    <td className="px-3 py-4 font-sans text-sm text-cream-dim">{report.categoryLabel}</td>
                    <td className="px-3 py-4 font-sans text-sm text-cream-dim">{report.priorityLabel}</td>
                    <td className="px-3 py-4">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 font-sans text-sm text-cream-dim">
                      {formatDisplayDate(report.submittedAt)}
                    </td>
                    <td className="px-3 py-4 text-right last:pr-0">
                      <button
                        type="button"
                        onClick={() => setSelectedReport(report)}
                        className="font-jakarta text-sm font-medium text-gold-bright underline-offset-4 transition-colors hover:text-gold-light hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 border border-grid-line py-12 text-center">
            <p className="font-jakarta text-sm font-medium text-cream">No reports yet.</p>
            <p className="max-w-sm font-sans text-sm text-cream-dim">
              When you create a report to flag a problem or ask Admin a question, it will show up here.
            </p>
          </div>
        )}
      </section>

      {selectedReport && <ReportDetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />}
    </div>
  );
}
