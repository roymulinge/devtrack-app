const PageLoader = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">

        {/* Spinner */}
        <div className="w-8 h-8 rounded-full border-2 border-slate-800 border-t-sky-400 animate-spin" />

        {/* Logo */}
        <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-slate-500">
          <span className="text-sky-400">[</span>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block" />
          <span>DevTrack</span>
          <span className="text-sky-400">]</span>
        </div>

      </div>
    </div>
  );
};

export default PageLoader;