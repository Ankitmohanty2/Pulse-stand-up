import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";

const BlockerSchema = z.object({
  id: z.string().describe("Unique identifier for the blocker item"),
  text: z.string().describe("A blocker, risk, or dependency item"),
});

export const StandupSummaryCardSchema = z.object({
  title: z.string().optional().describe("Title for the summary card"),
  dateLabel: z.string().optional().describe("Human-readable date label for this stand-up"),
  yesterday: z.string().optional().describe("Summary of what was completed yesterday"),
  today: z.string().optional().describe("Summary of what is planned for today"),
  blockers: z
    .array(BlockerSchema)
    .optional()
    .describe("List of blockers or dependencies, empty when there are none"),
  moodVibe: z
    .enum(["great", "good", "neutral", "stretched", "blocked"])
    .optional()
    .describe("Overall mood vibe check for the stand-up"),
  moodReason: z
    .string()
    .optional()
    .describe("Optional short reason behind the mood vibe"),
  slackCopy: z
    .string()
    .optional()
    .describe("Preformatted stand-up text optimized for posting in Slack"),
  discordCopy: z
    .string()
    .optional()
    .describe("Preformatted stand-up text optimized for posting in Discord"),
});

type StandupSummaryCardProps = z.infer<typeof StandupSummaryCardSchema>;

export function StandupSummaryCard({
  title = "Daily Stand-up Summary",
  dateLabel = "Today",
  yesterday = "No updates provided yet.",
  today = "No plan provided yet.",
  blockers = [],
  moodVibe = "neutral",
  moodReason,
  slackCopy,
  discordCopy,
}: StandupSummaryCardProps) {
  const [copiedTarget, setCopiedTarget] = useState<"slack" | "discord" | null>(null);

  const fallbackCopy = useMemo(() => {
    const blockerText =
      blockers.length > 0
        ? blockers.map((blocker) => `- ${blocker.text}`).join("\n")
        : "- None";

    return `*${title}* (${dateLabel})\nYesterday: ${yesterday}\nToday: ${today}\nBlockers:\n${blockerText}\nMood: ${moodVibe}${moodReason ? ` (${moodReason})` : ""}`;
  }, [blockers, dateLabel, moodReason, moodVibe, title, today, yesterday]);

  const copyText = async (target: "slack" | "discord") => {
    const text = target === "slack" ? slackCopy || fallbackCopy : discordCopy || fallbackCopy;
    await navigator.clipboard.writeText(text);
    setCopiedTarget(target);
    window.setTimeout(() => setCopiedTarget(null), 1800);
  };

  const moodTone: Record<NonNullable<StandupSummaryCardProps["moodVibe"]>, string> = {
    great: "bg-emerald-100 text-emerald-700",
    good: "bg-teal-100 text-teal-700",
    neutral: "bg-slate-100 text-slate-700",
    stretched: "bg-amber-100 text-amber-700",
    blocked: "bg-rose-100 text-rose-700",
  };

  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{dateLabel}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${moodTone[moodVibe]}`}>
          vibe: {moodVibe}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Yesterday</h3>
          <p className="text-sm text-slate-800">{yesterday}</p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Today</h3>
          <p className="text-sm text-slate-800">{today}</p>
        </article>
      </div>

      <article className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Blockers</h3>
        {blockers.length === 0 ? (
          <p className="text-sm text-slate-700">No blockers reported.</p>
        ) : (
          <ul className="space-y-2">
            {blockers.map((blocker) => (
              <li key={blocker.id} className="text-sm text-slate-800">
                - {blocker.text}
              </li>
            ))}
          </ul>
        )}
      </article>

      {moodReason ? <p className="mt-4 text-sm text-slate-600">Mood note: {moodReason}</p> : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => copyText("slack")}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          {copiedTarget === "slack" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copiedTarget === "slack" ? "Copied for Slack" : "Copy to Slack"}
        </button>

        <button
          type="button"
          onClick={() => copyText("discord")}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          {copiedTarget === "discord" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copiedTarget === "discord" ? "Copied for Discord" : "Copy to Discord"}
        </button>
      </div>
    </section>
  );
}
