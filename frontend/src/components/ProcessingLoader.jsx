import { useEffect, useState } from 'react';
import { BrainCircuit, FileSearch, Radar, Sparkles } from 'lucide-react';

const stages = [
  {
    label: 'Parsing layout structures...',
    description: 'Extracting semantic sections, chronology, and technology signals from the resume PDF.',
    icon: FileSearch,
  },
  {
    label: 'Running vector alignment...',
    description: 'Cross-referencing candidate evidence against explicit and implicit job requirements.',
    icon: Radar,
  },
  {
    label: 'Synthesizing feedback...',
    description: 'Scoring semantic fit, highlighting red flags, and generating focused interview probes.',
    icon: BrainCircuit,
  },
];

function ProcessingLoader() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % stages.length);
    }, 1800);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex h-full min-h-[640px] items-center justify-center px-6 py-8">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/85 p-8 shadow-glow backdrop-blur-xl sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(99,102,241,0.12),transparent)] bg-[length:200%_100%] animate-shimmer" />

        <div className="relative z-10 flex flex-col gap-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-indigo-500/15 text-indigo-200 ring-1 ring-inset ring-indigo-400/25 animate-pulseGlow">
            <Sparkles className="h-9 w-9" />
          </div>

          <div className="text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.34em] text-indigo-200/80">VectorHire engine</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Vectorizing and parsing resume profiles</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              The pipeline is extracting evidence, measuring contextual alignment, and structuring executive-ready candidate analytics.
            </p>
          </div>

          <div className="grid gap-3">
            {stages.map((stage, index) => {
              const isActive = index === activeIndex;
              const Icon = stage.icon;

              return (
                <div
                  key={stage.label}
                  className={[
                    'rounded-3xl border px-5 py-4 transition-all duration-500',
                    isActive
                      ? 'loader-text-pulse border-indigo-400/40 bg-indigo-500/10 shadow-lg shadow-indigo-950/20'
                      : 'border-white/10 bg-white/[0.03] opacity-70',
                  ].join(' ')}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={[
                        'mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset transition-all',
                        isActive
                          ? 'bg-indigo-500/15 text-indigo-100 ring-indigo-400/30'
                          : 'bg-white/5 text-slate-400 ring-white/10',
                      ].join(' ')}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <p className={isActive ? 'text-base font-semibold text-white' : 'text-base font-medium text-slate-300'}>
                        {stage.label}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{stage.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProcessingLoader;
