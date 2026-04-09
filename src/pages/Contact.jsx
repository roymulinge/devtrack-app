import { useState } from "react";

const Contact = () => {
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null); // null | "sending" | "success" | "error"

  const handleChange = (e) => {
    // [e.target.name] is a computed property key
    // it dynamically updates whichever field matches the input's name attribute
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // Web3Forms receives the form data and forwards it to your email
      // No backend needed — free service, 250 submissions/month free tier
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "131ffcd0-6d7a-4ac2-b550-7cae2042f56d", // ← paste your key here
          name:       form.name,
          email:      form.email,
          subject:    form.subject,
          message:    form.message,
          // This tells Web3Forms which subject line to use in your inbox
          from_name:  "DevTrack Contact Form",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        // Web3Forms returned an error — show it
        setStatus("error");
      }
    } catch (err) {
      // Network error or fetch failed
      console.error("Contact form error:", err);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-slate-200">

      {/* Header */}
      <section className="max-w-2xl mx-auto px-6 pt-20 pb-10 text-center">
        <span className="inline-block bg-sky-500/10 text-sky-400 text-sm font-medium px-4 py-1 rounded-full mb-6 border border-sky-500/20">
          Contact
        </span>
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Get in touch</h1>
        <p className="text-[var(--text-secondary)] text-base">
          Have a question, suggestion, or found a bug? Send a message and I'll
          get back to you as soon as possible.
        </p>
      </section>

      {/* Form + Info */}
      <section className="max-w-4xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8">

        {/* Contact Info — replace with your real details */}
        <div className="space-y-6">
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-widest mb-1">Email</p>
            <p className="text-slate-300 text-sm">mutuaroymulinge@gmail.com</p> {/* ← YOUR email */}
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-widest mb-1">GitHub</p>
            
              <a href="https://github.com/roymulinge" 
              target="_blank"
              rel="noreferrer"
              className="text-slate-300 text-sm hover:text-sky-400 transition"
            >
              github.com/roymulinge
            </a>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-widest mb-1">LinkedIn</p>
            
              <a href="https://linkedin.com/in/YOUR_LINKEDIN" // ← YOUR LinkedIn
              target="_blank"
              rel="noreferrer"
              className="text-slate-300 text-sm hover:text-sky-400 transition"
            >
              linkedin.com/in/roy-mulinge {/* ← YOUR name */}
            </a>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-widest mb-1">Response time</p>
            <p className="text-slate-300 text-sm">Usually within 24–48 hours</p>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6">

          {/* Success state */}
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h3 className="text-[var(--text-primary)] font-semibold text-base mb-2">Message sent!</h3>
              <p className="text-[var(--text-secondary)] text-xs">
                Thanks for reaching out. I'll reply to your email soon.
              </p>
              <button
                onClick={() => setStatus(null)}
                className="mt-6 text-sky-400 text-xs hover:underline"
              >
                Send another message
              </button>
            </div>

          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[var(--text-secondary)] text-xs mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] text-xs mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] text-xs mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is this about?"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] text-xs mb-1">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Write your message here..."
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition resize-none"
                />
              </div>

              {/* Error state — shown inline below message field */}
              {status === "error" && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                  Failed to send message. Please try again or email me directly.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-500/50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition active:scale-95"
              >
                {status === "sending" ? "Sending..." : "Send message"}
              </button>

            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Contact;