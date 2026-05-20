import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ClipboardList,
  Copy,
  Gauge,
  ListChecks,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

function MetricGauge({ score }) {
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - safeScore / 100);

  return (
    <div className="relative flex h-56 w-56 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 180 180" aria-hidden="true">
        <defs>
          <linearGradient id="metricGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="55%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="14" />
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="url(#metricGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="metric-ring-progress"
          style={{
            '--ring-full-offset': circumference,
            '--ring-target-offset': dashOffset,
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-semibold tracking-tight text-white">{safeScore}</span>
        <span className="mt-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Semantic fit</span>
      </div>
    </div>
  );
}

function SkillPill({ label, variant }) {
  const styles =
    variant === 'positive'
      ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-100'
      : 'border-rose-400/25 bg-rose-400/10 text-rose-100';

  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-3 py-2 text-sm font-medium transition-transform duration-200 hover:scale-105',
        styles,
      ].join(' ')}
    >
      {label}
    </span>
  );
}

function QuestionRow({ question }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(question);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4 transition hover:border-indigo-400/30 hover:bg-slate-900">
      <p className="pr-2 text-sm leading-6 text-slate-200">{question}</p>
      <button
        type="button"
        onClick={handleCopy}
        className={[
          'inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition',
          copied
            ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100'
            : 'border-white/10 bg-white/5 text-slate-300 hover:border-indigo-400/30 hover:bg-indigo-500/10 hover:text-white',
        ].join(' ')}
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

function SectionCard({ icon: Icon, title, subtitle, children, className = '' }) {
  return (
    <section className={[
      'rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 shadow-sm backdrop-blur-sm',
      className,
    ].join(' ')}>
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-indigo-200 ring-1 ring-inset ring-white/10">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

function DashboardView({ result, onStartOver }) {
  const matchedSkills = useMemo(() => result.matched_skills || [], [result.matched_skills]);
  const missingSkills = useMemo(() => result.missing_critical_skills || [], [result.missing_critical_skills]);
  const redFlags = useMemo(() => result.red_flags || [], [result.red_flags]);
  const questions = useMemo(() => result.recommended_interview_questions || [], [result.recommended_interview_questions]);

  return (
    <div className="flex h-full flex-col px-5 pb-5 pt-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200/80">Candidate intelligence dashboard</p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Executive-grade evaluation snapshot</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400 sm:text-base">
            Review semantic fit, evidence depth, missing skills, red flags, and interview prompts generated from the resume and job description pair.
          </p>
        </div>

        <button
          type="button"
          onClick={onStartOver}
          className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Analyze another profile
        </button>
      </div>

      <div className="scroll-panel flex-1 overflow-y-auto pr-1">
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <SectionCard
            icon={Gauge}
            title="Candidate score"
            subtitle="Semantic alignment between the role requirements and the resume evidence."
            className="flex flex-col items-center justify-center"
          >
            <MetricGauge score={result.candidate_score_out_of_100} />
            <div className="mt-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-100">
              Context-aware fit analysis
            </div>
          </SectionCard>

          <SectionCard
            icon={Sparkles}
            title="Executive summary"
            subtitle="Condensed perspective for leadership or recruiter review."
          >
            <p className="text-sm leading-7 text-slate-200 sm:text-base">{result.executive_summary}</p>
          </SectionCard>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <SectionCard
            icon={ListChecks}
            title="Matched skills"
            subtitle="Capabilities clearly supported across the job brief and candidate profile."
          >
            <div className="flex flex-wrap gap-3">
              {matchedSkills.length > 0 ? (
                matchedSkills.map((skill) => <SkillPill key={skill} label={skill} variant="positive" />)
              ) : (
                <p className="text-sm text-slate-400">No matched skills were identified in the response.</p>
              )}
            </div>
          </SectionCard>

          <SectionCard
            icon={ShieldAlert}
            title="Missing critical skills"
            subtitle="Explicit requirements in the job description that are not evidenced in the resume."
          >
            <div className="flex flex-wrap gap-3">
              {missingSkills.length > 0 ? (
                missingSkills.map((skill) => <SkillPill key={skill} label={skill} variant="negative" />)
              ) : (
                <p className="text-sm text-slate-400">No missing critical skills were surfaced in the response.</p>
              )}
            </div>
          </SectionCard>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.95fr]">
          <SectionCard
            icon={TrendingUp}
            title="Impact evaluation"
            subtitle="Assessment of quantified outcomes versus responsibility-only experience statements."
          >
            <p className="text-sm leading-7 text-slate-200 sm:text-base">{result.impact_evaluation}</p>
          </SectionCard>

          <SectionCard
            icon={AlertTriangle}
            title="Red flags"
            subtitle="Potential timeline, consistency, or evidence gaps that deserve validation."
          >
            {redFlags.length > 0 ? (
              <ul className="space-y-3">
                {redFlags.map((flag) => (
                  <li
                    key={flag}
                    className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-50"
                  >
                    {flag}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">No red flags were identified in the response.</p>
            )}
          </SectionCard>
        </div>

        <div className="mt-5 pb-1">
          <SectionCard
            icon={ClipboardList}
            title="Interview hub"
            subtitle="Targeted prompts to validate weak signals, depth, and practical ownership."
          >
            <div className="space-y-3">
              {questions.length > 0 ? (
                questions.map((question) => <QuestionRow key={question} question={question} />)
              ) : (
                <p className="text-sm text-slate-400">No interview questions were returned in the response.</p>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

export default DashboardView;
