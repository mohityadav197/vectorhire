import { ArrowRight, BarChart3, BrainCircuit, FileText, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const featureCards = [
  {
    title: 'Layout-aware parsing',
    description:
      'VectorHire preserves section structure, chronology, and document hierarchy during PDF extraction so downstream evaluation reflects how the resume is actually composed, not just raw text fragments.',
    icon: FileText,
    accent: 'from-indigo-500/20 to-sky-400/10',
  },
  {
    title: 'Semantic vector alignment',
    description:
      'Instead of brittle keyword matching, VectorHire evaluates role requirements against candidate evidence with contextual reasoning, surfacing true capability overlap, missing depth, and suspicious mismatches.',
    icon: BrainCircuit,
    accent: 'from-emerald-500/20 to-indigo-400/10',
  },
  {
    title: 'Actionable analytics payloads',
    description:
      'Every evaluation resolves into a structured JSON response with score, executive narrative, skills analysis, red flags, and interview prompts that can plug directly into recruiter workflows.',
    icon: BarChart3,
    accent: 'from-violet-500/20 to-emerald-400/10',
  },
];

function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-975 text-slate-100">
      <div className="aurora-orb pointer-events-none absolute left-0 top-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="aurora-orb pointer-events-none absolute right-0 top-16 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl [animation-delay:1.8s]" />
      <div className="pointer-events-none absolute inset-0 bg-hero-grid opacity-60" />

      <div className="relative z-10">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto w-full px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-200 ring-1 ring-inset ring-indigo-400/30">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-indigo-200/80">VectorHire</p>
                  <h1 className="text-lg font-semibold text-white">Semantic hiring intelligence</h1>
                </div>
              </div>

              <Link
                to="/workspace"
                className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.01] hover:bg-indigo-400"
              >
                Go to Workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </header>

        <main>
          <section className="py-24 lg:py-32">
            <div className="max-w-7xl mx-auto w-full px-6 lg:px-8">
              <div className="grid w-full gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100">
                    <ShieldCheck className="h-4 w-4" />
                    Built for modern recruiting teams that need signal, not noise
                  </div>

                  <h2 className="max-w-5xl text-5xl font-semibold tracking-tight leading-[1.02] text-white lg:text-7xl">
                    Move beyond keyword matching.
                    <span className="relative ml-0 block bg-gradient-to-r from-indigo-200 via-white to-emerald-200 bg-clip-text text-transparent sm:ml-1">
                      Evaluate talent with semantic intelligence.
                    </span>
                  </h2>

                  <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-400">
                    VectorHire reads resumes the way experienced recruiters do: it interprets technical depth, maps evidence against role requirements, checks whether claims are backed by measurable outcomes, and surfaces the interview questions that matter before you spend calendar time.
                  </p>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Link
                      to="/workspace"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:scale-[1.01] hover:bg-indigo-400"
                    >
                      Launch evaluation workspace
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <a
                      href="#architecture"
                      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-slate-800/70 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-slate-800 hover:text-white"
                    >
                      Explore architecture
                    </a>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-indigo-500/20 via-transparent to-emerald-500/10 blur-2xl" />
                  <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-glow backdrop-blur-xl transition-all duration-300">
                    <div className="grid gap-4">
                      <div className="rounded-3xl border border-white/10 bg-slate-800/70 p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-200/80">Evaluation engine</p>
                        <h3 className="mt-2 text-xl font-semibold text-white">From raw resume input to decision-ready insight</h3>
                        <p className="mt-3 text-sm leading-7 text-slate-400">
                          VectorHire transforms unstructured candidate documents into a structured assessment layer recruiters can trust, compare, and operationalize.
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl border border-white/10 bg-indigo-500/10 p-8">
                          <p className="text-3xl font-semibold text-white">2–3</p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">Sentence executive summary for fast hiring-manager context.</p>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-emerald-500/10 p-8">
                          <p className="text-3xl font-semibold text-white">100%</p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">Structured output designed for dashboards, ATS enrichment, and downstream automation.</p>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-white/10 bg-slate-800/70 p-8">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-emerald-200 ring-1 ring-inset ring-white/10">
                            <BarChart3 className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="text-base font-semibold text-white">Analytics that pressure-test candidate quality</h4>
                            <p className="mt-2 text-sm leading-7 text-slate-400">
                              Surface matched skills, missing capabilities, quantified impact signals, timeline anomalies, and interview prompts from a single evaluation flow.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="architecture" className="pb-24 lg:pb-28">
            <div className="max-w-7xl mx-auto w-full px-6 lg:px-8">
              <div className="mb-10 max-w-3xl">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-indigo-200/80">Architecture overview</p>
                <h3 className="text-3xl font-semibold text-white sm:text-4xl">A recruiter-facing AI stack built for defensible hiring decisions</h3>
                <p className="mt-4 text-base leading-8 text-slate-400">
                  VectorHire combines document intelligence, semantic reasoning, and structured analytics so hiring teams can move from resume intake to calibrated interviews with more confidence and less manual screening overhead.
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-3 xl:gap-12">
                {featureCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <article
                      key={card.title}
                      className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-800/70 p-8 shadow-glow backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/20"
                    >
                      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.accent} opacity-70`} />
                      <div className="relative z-10">
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900/70 text-indigo-100 ring-1 ring-inset ring-white/10">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h4 className="text-xl font-semibold text-white">{card.title}</h4>
                        <p className="mt-3 text-sm leading-7 text-slate-300">{card.description}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 bg-slate-900/80">
          <div className="max-w-7xl mx-auto w-full px-6 lg:px-8">
            <div className="flex flex-col gap-2 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <p>VectorHire transforms resume screening into structured semantic intelligence for modern recruiting teams.</p>
              <p>React · FastAPI · structured AI evaluation pipeline</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
