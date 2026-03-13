import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="bg-slate-950 text-white min-h-screen">

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">

        <h1 className="text-5xl font-bold mb-6">
          Organize Your Engineering Life
        </h1>

        <p className="text-slate-400 text-lg mb-10">
          Track projects, skills, ideas, assignments, and weekly priorities
          in one focused productivity system.
        </p>

        <div className="flex justify-center gap-6">
          <Link
            to="/register"
            className="bg-sky-500 hover:bg-sky-600 px-6 py-3 rounded-lg font-medium transition"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="border border-slate-700 hover:border-slate-500 px-6 py-3 rounded-lg transition"
          >
            Login
          </Link>
        </div>

      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8">

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-xl font-semibold mb-2">Project Tracking</h3>
          <p className="text-slate-400">
            Organize ideas and engineering work into clear projects.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-xl font-semibold mb-2">Skill Growth</h3>
          <p className="text-slate-400">
            Track learning progress and skill mastery.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-xl font-semibold mb-2">Weekly Focus</h3>
          <p className="text-slate-400">
            Define your top priorities and stay consistent.
          </p>
        </div>

      </section>

    </div>
  );
};

export default Landing;