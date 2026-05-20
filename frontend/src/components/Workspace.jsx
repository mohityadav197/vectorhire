import { useMemo, useState } from 'react';
import axios from 'axios';
import { AlertCircle, ArrowLeft, BriefcaseBusiness, RefreshCcw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import UploadView from './UploadView';
import ProcessingLoader from './ProcessingLoader';
import DashboardView from './DashboardView';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const EVALUATE_ENDPOINT = `${API_BASE_URL}/api/evaluate/`;

const initialFormState = {
  jobDescription: '',
  resumeFile: null,
};

function Workspace() {
  const [view, setView] = useState('upload');
  const [formState, setFormState] = useState(initialFormState);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const canAnalyze = useMemo(() => {
    return formState.jobDescription.trim().length > 0 && formState.resumeFile instanceof File;
  }, [formState.jobDescription, formState.resumeFile]);

  const handleJobDescriptionChange = (value) => {
    setFormState((current) => ({ ...current, jobDescription: value }));
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleResumeFileChange = (file) => {
    setFormState((current) => ({ ...current, resumeFile: file }));
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleAnalyzeCandidate = async () => {
    if (!canAnalyze) {
      setErrorMessage('Add a job description and a PDF resume before starting the evaluation.');
      return;
    }

    const payload = new FormData();
    payload.append('job_description', formState.jobDescription.trim());
    payload.append('resume', formState.resumeFile);

    setErrorMessage('');
    setView('processing');

    try {
      const response = await axios.post(EVALUATE_ENDPOINT, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000,
      });

      setResult(response.data);
      setView('dashboard');
    } catch (error) {
      const fallbackMessage = 'VectorHire could not complete the evaluation. Please retry in a moment.';
      const responseMessage = error.response?.data?.detail;
      const networkMessage = error.code === 'ECONNABORTED'
        ? 'The evaluation timed out before the backend responded.'
        : error.message;

      setErrorMessage(responseMessage || networkMessage || fallbackMessage);
      setView('upload');
    }
  };

  const handleResetFlow = () => {
    setView('upload');
    setResult(null);
    setErrorMessage('');
    setFormState(initialFormState);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-975 text-slate-100">
      <div className="aurora-orb pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="aurora-orb pointer-events-none absolute right-0 top-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl [animation-delay:1.4s]" />
      <div className="aurora-orb pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl [animation-delay:2.8s]" />

      <main className="relative z-10 flex min-h-screen flex-col py-5">
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-8">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/70 px-6 py-4 shadow-glow backdrop-blur-xl transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-200 ring-1 ring-inset ring-indigo-400/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-indigo-200/80">VectorHire</p>
                <h1 className="text-lg font-semibold text-white sm:text-xl">Semantic candidate intelligence</h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-slate-800 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to overview
              </Link>

              <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-2 text-sm text-slate-300 md:flex">
                <BriefcaseBusiness className="h-4 w-4 text-emerald-300" />
                Production-ready CV evaluation pipeline
              </div>
            </div>
          </header>

          <section className="flex w-full flex-1 pt-6">
            <div className="flex w-full flex-1 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/70 shadow-glow backdrop-blur-xl transition-all duration-500">
              {errorMessage ? (
                <div className="mx-6 mt-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              ) : null}

              <div className="flex-1 transition-all duration-500">
                {view === 'upload' ? (
                  <UploadView
                    jobDescription={formState.jobDescription}
                    resumeFile={formState.resumeFile}
                    onJobDescriptionChange={handleJobDescriptionChange}
                    onResumeFileChange={handleResumeFileChange}
                    onAnalyze={handleAnalyzeCandidate}
                    canAnalyze={canAnalyze}
                  />
                ) : null}

                {view === 'processing' ? <ProcessingLoader /> : null}

                {view === 'dashboard' && result ? (
                  <DashboardView
                    result={result}
                    onStartOver={handleResetFlow}
                  />
                ) : null}
              </div>
            </div>
          </section>

          {view === 'dashboard' ? null : (
            <footer className="mt-4 flex w-full flex-wrap items-center justify-between gap-3 px-1 text-xs text-slate-400">
              <p>Structured semantic fit analysis for resumes and job descriptions.</p>
              <button
                type="button"
                onClick={handleResetFlow}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-800/80 px-3 py-1.5 text-slate-300 transition hover:border-white/20 hover:bg-slate-800 hover:text-white"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                Reset workspace
              </button>
            </footer>
          )}
        </div>
      </main>
    </div>
  );
}

export default Workspace;
