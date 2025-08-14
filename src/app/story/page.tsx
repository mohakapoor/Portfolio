'use client';
import GitHubContributions from "@/components/GitHubContributions";
import { useState } from "react";

export default function StoryPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen px-6 py-16">
      {/* Hamburger button (story page only) */}
      <button
        aria-label="Open menu"
        className="fixed top-4 left-4 z-20 p-2 rounded-md border border-[var(--spider-red)] bg-[var(--newsprint-gray)] text-[var(--vintage-white)] hover:bg-[var(--spider-red)] transition"
        onClick={() => setMenuOpen(true)}
      >
        <span className="block w-6 h-0.5 bg-[var(--vintage-white)] mb-1" />
        <span className="block w-6 h-0.5 bg-[var(--vintage-white)] mb-1" />
        <span className="block w-6 h-0.5 bg-[var(--vintage-white)]" />
      </button>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/50"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Left sidebar */}
      <aside
        className={`fixed top-0 left-0 z-20 h-full w-72 glass-nav transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Story navigation"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--spider-red)]/40">
          <span className="newspaper-headline text-2xl">Menu</span>
          <button
            aria-label="Close menu"
            className="p-2 rounded-md border border-[var(--spider-red)] text-[var(--vintage-white)] hover:bg-[var(--spider-red)] transition"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="px-4 py-3 space-y-2">
          <a href="/" className="block py-2 hover:underline" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="/story" className="block py-2 hover:underline" onClick={() => setMenuOpen(false)}>Story</a>
          <div className="mt-4 text-dust-gray">On this page</div>
          <a href="#who-am-i" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Who Am I</a>
          <a href="#featured" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Featured Investigations</a>
          <a href="#experience" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Experience</a>
          <a href="#github" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>GitHub</a>
          <a href="#contact" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
      </aside>

      <section className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="newspaper-headline text-5xl md:text-6xl">The Full Story</h1>
          <p className="text-dust-gray mt-2">A case file in the Spider‑Man Noir universe</p>
        </header>

        <article className="space-y-10 leading-relaxed text-lg">
          <section id="who-am-i" className="glass-card p-6">
            <h2 className="newspaper-headline text-3xl mb-2">Who Am I</h2>
            <p className="text-dust-gray">
              Mohak Kapoor — ML/DevOps practitioner. I turn messy data into clear signals:
              forecasting indices, predicting generation, and shipping reliable, production‑ready systems.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="tag">Time‑Series</span>
              <span className="tag">Regression</span>
              <span className="tag">Classification</span>
              <span className="tag">TensorFlow</span>
              <span className="tag">scikit‑learn</span>
              <span className="tag">Pandas</span>
              <span className="tag">NumPy</span>
              <span className="tag">Polars</span>
              <span className="tag">Docker</span>
              <span className="tag">GitHub Actions</span>
              <span className="tag">PostgreSQL</span>
              <span className="tag">REST APIs</span>
            </div>
          </section>

          <section id="featured">
            <h2 className="newspaper-headline text-3xl mb-4">Featured Investigations</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="glass-card p-5">
                <h3 className="text-xl mb-2">CMFM v1.0 — Cross‑Market Index Forecasting</h3>
                <p className="text-dust-gray mb-3">
                  Deep learning model predicting bid‑open prices using 7M rows of 1‑minute Dukascopy data.
                  MAPE: 3.1% (JP), 4.2% (UK), 12% (US) on 2025 test data.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="tag">Python</span>
                  <span className="tag">Polars</span>
                  <span className="tag">TensorFlow</span>
                  <span className="tag">CNN‑LSTM</span>
                  <span className="tag">Self‑Attention</span>
                </div>
              </div>

              <div className="glass-card p-5">
                <h3 className="text-xl mb-2">
                  <a href="https://github.com/mohakapoor/Nifty50TrendPrediction" target="_blank" rel="noreferrer noopener">
                    Nifty50 Trend Prediction
                  </a>
                </h3>
                <p className="text-dust-gray mb-3">Random Forest classifier predicting short‑term market trends using historical Yahoo Finance data.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="tag">Python</span>
                  <span className="tag">scikit‑learn</span>
                  <span className="tag">Pandas</span>
                  <span className="tag">NumPy</span>
                  <span className="tag">yfinance</span>
                </div>
              </div>

              <div className="glass-card p-5">
                <h3 className="text-xl mb-2">
                  <a href="https://github.com/mohakapoor/Solar-Energy-Generation-Prediction" target="_blank" rel="noreferrer noopener">
                    Solar Power Generation Predictor
                  </a>
                </h3>
                <p className="text-dust-gray mb-3">Weather‑aware ML to predict hourly generation, surfaced via a Django web front‑end for user inputs.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="tag">TensorFlow</span>
                  <span className="tag">scikit‑learn</span>
                  <span className="tag">Pandas</span>
                  <span className="tag">NumPy</span>
                  <span className="tag">Django</span>
                  <span className="tag">OpenWeatherMap API</span>
                </div>
              </div>

              <div className="glass-card p-5">
                <h3 className="text-xl mb-2">
                  <a
                    href="https://github.com/mohakapoor/HermesGPT"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    HermesGPT — Automated Internship Outreach Bot
                  </a>
                </h3>
                <p className="text-dust-gray mb-3">AI‑powered personalized cold emails with Gmail API, email verification, and PostgreSQL tracking.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="tag">Python</span>
                  <span className="tag">Gmail API</span>
                  <span className="tag">Gemini AI</span>
                  <span className="tag">PostgreSQL</span>
                  <span className="tag">SMTP</span>
                  <span className="tag">Automation</span>
                </div>
              </div>
            </div>
          </section>

          <section id="experience">
            <h2 className="newspaper-headline text-3xl mb-4">Experience</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="glass-card p-5">
                <h3 className="text-xl mb-1">HumanizeIQ — DevOps & Backend Intern</h3>
                <ul className="list-disc pl-5 text-dust-gray space-y-1">
                  <li>Built CI/CD pipelines with GitHub Actions and Docker.</li>
                  <li>Developed webhook APIs backed by PostgreSQL with robust data handling.</li>
                  <li>Filtered 88k+ incoming records to 5.1k valid; archived the rest for audit.</li>
                  <li>Contributed to Helm‑based container orchestration.</li>
                </ul>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-xl mb-1">JPMorgan Chase & Co. — Quant Research Virtual</h3>
                <p className="text-dust-gray">Analyzed a loan book to estimate probability of default; transformed FICO scores into categorical features with dynamic programming.</p>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-xl mb-1">OSDC — Member</h3>
                <p className="text-dust-gray">Organized hackathons and open‑source events; collaborated on OSS contributions.</p>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-xl mb-1">Social Media — Strategy & Marketing</h3>
                <p className="text-dust-gray">Led strategy for two Instagram pages (55k & 17k followers), increasing engagement by 167%.</p>
              </div>
            </div>
          </section>

	      

          <section id="github">
            <h2 className="newspaper-headline text-3xl mb-4">GitHub</h2>
            <div className="glass-card p-5">
              <div className="grid md:grid-cols-[220px,1fr] gap-6 items-center">
                <a
                  href="https://github.com/mohakapoor"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex flex-col items-center text-center"
                >
                  <img
                    src="https://github.com/mohakapoor.png?size=240"
                    alt="GitHub avatar of mohakapoor"
                    className="w-40 h-40 md:w-52 md:h-52 rounded-lg border border-[var(--spider-red)]/40 object-cover"
                  />
                  <span className="mt-3 underline">github.com/mohakapoor</span>
                </a>
                <GitHubContributions username="mohakapoor" />
              </div>
            </div>
          </section>

          <section id="contact" className="glass-card p-6">
            <h2 className="newspaper-headline text-3xl mb-2">Contact</h2>
            <p className="text-dust-gray">Want the full dossier? Download from the homepage or reach out at <span className="underline">contact.mohakapoor@gmail.com</span>.</p>
          </section>
        </article>
      </section>
    </main>
  );
}


