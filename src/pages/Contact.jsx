import React, { useState } from "react";

const Contact = () => {
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null); // "sending" | "success" | "error"

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    // Replace this URL with your Django endpoint when ready
    // For now it simulates a successful submission after 1.5s
    await new Promise((res) => setTimeout(res, 1500));
    setStatus("success");

    // Reset form
    setForm({ name: "", email: "", subject: "", message: "" });
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

        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-widest mb-1">
              Email
            </p>
            <p className="text-slate-300 text-sm">your@email.com</p>
          </div>
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-widest mb-1">
              GitHub
            </p>
            <a
            
              href="https://github.com/yourusername"
              target="_blank"
              rel="noreferrer"
              className="text-slate-300 text-sm hover:text-sky-400 transition"
            >
              github.com/yourusername
            </a>
          </div>
          <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-widest mb-1">
              Response time
            </p>
            <p className="text-slate-300 text-sm">Usually within 24–48 hours</p>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-2 bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-6">
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-[var(--text-primary)] font-semibold text-lg mb-2">Message sent!</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Thanks for reaching out. I'll reply to your email soon.
              </p>
              <button
                onClick={() => setStatus(null)}
                className="mt-6 text-sky-400 text-sm hover:underline"
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

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-500/50 text-white py-2.5 rounded-lg text-sm font-medium transition"
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