import { useMemo, useRef, useState } from 'react';
import { ArrowRight, FileText, UploadCloud } from 'lucide-react';

function UploadView({
  jobDescription,
  resumeFile,
  onJobDescriptionChange,
  onResumeFileChange,
  onAnalyze,
  canAnalyze,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const resumeLabel = useMemo(() => {
    if (!resumeFile) {
      return 'Drop the candidate PDF here or browse locally.';
    }

    const sizeInMb = (resumeFile.size / (1024 * 1024)).toFixed(2);
    return `${resumeFile.name} · ${sizeInMb} MB`;
  }, [resumeFile]);

  const updateFile = (file) => {
    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf') {
      return;
    }

    onResumeFileChange(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    updateFile(droppedFile);
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex h-full flex-col px-6 pb-6 pt-8 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.32em] text-indigo-200/75">Candidate evaluation workspace</p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Ingest the job brief and candidate resume</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Paste the full job description, upload a PDF resume, and let VectorHire score semantic fit, impact depth, missing skills, and interview pressure points.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          Layout-aware parsing · structured JSON analytics
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="flex min-h-[450px] flex-col rounded-3xl border border-white/10 bg-slate-800/70 p-8 shadow-glow backdrop-blur-sm transition-all duration-300">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-200 ring-1 ring-inset ring-indigo-400/25">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200">Job description</h3>
              <p className="text-sm text-slate-400">Provide the complete role scope, must-have skills, and domain context.</p>
            </div>
          </div>

          <textarea
            value={jobDescription}
            onChange={(event) => onJobDescriptionChange(event.target.value)}
            placeholder="Paste the full job description here. Include required technologies, responsibilities, seniority, and business context."
            className="scroll-panel min-h-[450px] flex-1 resize-none rounded-3xl border border-white/10 bg-slate-900 px-5 py-5 text-sm leading-6 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400/60 focus:ring-4 focus:ring-indigo-500/10"
          />
        </section>

        <section className="flex min-h-[450px] flex-col rounded-3xl border border-white/10 bg-slate-800/70 p-8 shadow-glow backdrop-blur-sm transition-all duration-300">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-200 ring-1 ring-inset ring-emerald-400/25">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-200">Resume upload</h3>
              <p className="text-sm text-slate-400">Drag and drop a PDF resume with preserved structure and formatting.</p>
            </div>
          </div>

          <div
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            className={[
              'group relative flex min-h-[450px] flex-1 flex-col items-center justify-center rounded-[1.75rem] border border-dashed px-6 py-8 text-center transition-all duration-300',
              isDragging
                ? 'border-indigo-400 bg-indigo-500/10 shadow-[0_0_0_6px_rgba(99,102,241,0.08)]'
                : 'border-white/15 bg-slate-900 hover:border-indigo-400/40 hover:bg-slate-900/90',
            ].join(' ')}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={(event) => updateFile(event.target.files?.[0])}
              className="hidden"
            />

            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/5 text-indigo-200 ring-1 ring-inset ring-white/10 transition group-hover:scale-105 group-hover:bg-indigo-500/10">
              <UploadCloud className="h-7 w-7" />
            </div>

            <h4 className="text-lg font-semibold text-white">Drop resume PDF</h4>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">{resumeLabel}</p>

            <button
              type="button"
              onClick={handleBrowse}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-indigo-400/40 hover:bg-indigo-500/10"
            >
              Browse file
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-between">
        <p className="text-sm text-slate-400">PDF only · semantic fit scoring · structured evaluation payload</p>

        <button
          type="button"
          onClick={onAnalyze}
          disabled={!canAnalyze}
          className={[
            'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300',
            canAnalyze
              ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.01] hover:bg-indigo-400'
              : 'cursor-not-allowed bg-slate-800 text-slate-500',
          ].join(' ')}
        >
          Analyze Candidate Profile
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default UploadView;
