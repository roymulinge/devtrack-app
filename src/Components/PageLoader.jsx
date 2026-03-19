import logo from "../assets/logo.png";

const PageLoader = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">

        {/* Spinner */}
        <div className="w-8 h-8 rounded-full border-2 border-slate-800 border-t-sky-400 animate-spin" />

        {/* Logo */}
        <img
          src={logo}
          alt="DevTrack"
          className="h-25 w-auto"
        />

      </div>
    </div>
  );
};

export default PageLoader;