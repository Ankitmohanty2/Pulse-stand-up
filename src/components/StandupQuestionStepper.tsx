import { z } from "zod";

export const StandupQuestionStepperSchema = z.object({
  sessionId: z.string().optional().describe("Unique session id for the current stand-up flow"),
  questionIndex: z
    .number()
    .min(1)
    .max(3)
    .optional()
    .describe("Current question number, from 1 to 3"),
  totalQuestions: z.number().optional().describe("Total number of stand-up questions"),
  currentQuestion: z
    .string()
    .optional()
    .describe("The exact question to ask now, usually one of the 3 classic stand-up questions"),
  responsePreview: z
    .string()
    .optional()
    .describe("Optional short preview of the user's latest response for context"),
  completed: z
    .boolean()
    .optional()
    .describe("Whether all stand-up questions have been answered"),
  nextPrompt: z
    .string()
    .optional()
    .describe("Optional prompt to guide the user to answer this question"),
});

type StandupQuestionStepperProps = z.infer<typeof StandupQuestionStepperSchema>;

export function StandupQuestionStepper({
  questionIndex = 1,
  totalQuestions = 3,
  currentQuestion = "What did you do yesterday?",
  responsePreview,
  completed = false,
  nextPrompt,
}: StandupQuestionStepperProps) {
  const progress = Math.round((questionIndex / totalQuestions) * 100);

  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Pulse Stand-up</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          Question {questionIndex}/{totalQuestions}
        </span>
      </div>

      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-slate-500">
        Current question
      </p>
      <p className="mb-4 text-base text-slate-900">{currentQuestion}</p>

      {responsePreview ? (
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
            Last response
          </p>
          <p className="text-sm text-slate-700">{responsePreview}</p>
        </div>
      ) : null}

      {nextPrompt ? <p className="text-sm text-slate-600">{nextPrompt}</p> : null}

      {completed ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          All 3 questions answered. Generating your summary card.
        </div>
      ) : null}
    </section>
  );
}
