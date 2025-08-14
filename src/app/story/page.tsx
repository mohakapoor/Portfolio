'use client';
import GitHubContributions from "@/components/GitHubContributions";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function StoryPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Handle click outside to close expanded card
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (expandedCard !== null) {
        const target = event.target as Node;
        const expandedCardElement = cardRefs.current[expandedCard];
        
        if (expandedCardElement && !expandedCardElement.contains(target)) {
          setExpandedCard(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expandedCard]);

  // Handle card click (mobile)
  const handleCardClick = (index: number) => {
    if (expandedCard === index) {
      setExpandedCard(null); // Close if already expanded
    } else {
      setExpandedCard(index); // Expand this card
    }
  };

  return (
    <main className="min-h-screen px-6 py-16">
      {/* Hamburger button (story page only) */}
      <button
        aria-label="Open menu"
        className="fixed top-5 left-4 sm:top-6 sm:left-6 z-30 p-3 rounded-md border border-[var(--spider-red)] bg-[var(--newsprint-gray)] text-[var(--vintage-white)] hover:bg-[var(--spider-red)] transition"
        onClick={() => setMenuOpen(true)}
      >
        <span className="block w-7 h-[3px] bg-[var(--vintage-white)] mb-1" />
        <span className="block w-7 h-[3px] bg-[var(--vintage-white)] mb-1" />
        <span className="block w-7 h-[3px] bg-[var(--vintage-white)]" />
      </button>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Left sidebar */}
      <aside
        className={`fixed top-0 left-0 z-60 h-full w-72 glass-nav transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
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
          <Link href="/" className="block py-2 hover:underline" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/story" className="block py-2 hover:underline" onClick={() => setMenuOpen(false)}>Story</Link>
          <div className="mt-4 text-dust-gray">On this page</div>
          <a href="#who-am-i" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Who Am I</a>
          <a href="#featured" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Featured Projects</a>
          <a href="#experience" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Experience</a>
          <a href="#github" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>GitHub</a>
          <a href="#contact" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
      </aside>

      <section className="max-w-5xl mx-auto">
        <header className="mb-10 text-center mt-5">
          <h1 className="newspaper-headline text-6xl md:text-7xl">My Story</h1>
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
            <h2 className="newspaper-headline text-3xl mb-4">Featured Projects</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Card 1,1 - Left column, expands right */}
              <div 
                ref={(el) => { cardRefs.current[0] = el; }}
                className={`glass-card p-5 transition-all duration-500 ease-in group cursor-pointer ${
                  expandedCard === 0 ? 'scale-105 z-10' : 'hover:scale-105 hover:z-10'
                }`}
                onClick={() => handleCardClick(0)}
              >
                <h3 className="text-xl mb-2">CMFM v1.0 — Cross‑Market Index Forecasting</h3>
                <p className="text-dust-gray mb-3">
                  Deep learning model predicting bid‑open prices using 7M rows of 1‑minute Dukascopy data.
                  MAPE: 3.1% (JP), 4.2% (UK), 12% (US) on 2025 test data.
                </p>
                <div className={`${expandedCard === 0 ? 'block' : 'hidden group-hover:block'} text-dust-gray mb-3 text-sm leading-relaxed`}>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>CNN-LSTM architecture with self-attention mechanisms</li>
                    <li>Multi-currency support: JPY, GBP, USD pairs</li>
                    <li>High-frequency 1-minute data processing</li>
                    <li>Real-time inference pipeline</li>
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="tag">Python</span>
                  <span className="tag">Polars</span>
                  <span className="tag">TensorFlow</span>
                  <span className="tag">CNN‑LSTM</span>
                  <span className="tag">Self‑Attention</span>
                </div>
              </div>

              {/* Card 1,2 - Right column, expands left */}
              <div 
                ref={(el) => { cardRefs.current[1] = el; }}
                className={`glass-card p-5 transition-all duration-500 ease-in group cursor-pointer ${
                  expandedCard === 1 ? 'scale-105 z-10' : 'hover:scale-105 hover:z-10'
                }`}
                onClick={() => handleCardClick(1)}
              >
                <h3 className="text-xl mb-2">
                  <a href="https://github.com/mohakapoor/HermesGPT" target="_blank" rel="noreferrer noopener">
                    HermesGPT — Automated Internship Outreach Bot
                  </a>
                </h3>
                <p className="text-dust-gray mb-3">AI‑powered personalized cold emails with Gmail API, email verification, and PostgreSQL tracking.</p>
                <div className={`${expandedCard === 1 ? 'block' : 'hidden group-hover:block'} text-dust-gray mb-3 text-sm leading-relaxed`}>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Gemini AI integration for dynamic content generation</li>
                    <li>Automated email verification and deliverability checks</li>
                    <li>Response rate analytics and engagement tracking</li>
                    <li>Customizable email templates and personalization</li>
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="tag">Python</span>
                  <span className="tag">Gmail API</span>
                  <span className="tag">Gemini AI</span>
                  <span className="tag">PostgreSQL</span>
                  <span className="tag">SMTP</span>
                  <span className="tag">Automation</span>
                </div>
              </div>

              {/* Card 2,1 - Left column, expands right */}
              <div 
                ref={(el) => { cardRefs.current[2] = el; }}
                className={`glass-card p-5 transition-all duration-500 ease-in group cursor-pointer ${
                  expandedCard === 2 ? 'scale-105 z-10' : 'hover:scale-105 hover:z-10'
                }`}
                onClick={() => handleCardClick(2)}
              >
                <h3 className="text-xl mb-2">
                  <a href="https://github.com/mohakapoor/Solar-Energy-Generation-Prediction" target="_blank" rel="noreferrer noopener">Solar Power Generation Predictor</a>
                </h3>
                <p className="text-dust-gray mb-3">Weather‑aware ML to predict hourly generation, surfaced via a Django web front‑end for user inputs.</p>
                <div className={`${expandedCard === 2 ? 'block' : 'hidden group-hover:block'} text-dust-gray mb-3 text-sm leading-relaxed`}>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Multi-variate time series forecasting model</li>
                    <li>Seasonal trend analysis and panel degradation modeling</li>
                    <li>Real-time weather data integration via OpenWeatherMap API</li>
                    <li>User-configurable prediction parameters</li>
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="tag">TensorFlow</span>
                  <span className="tag">scikit‑learn</span>
                  <span className="tag">Pandas</span>
                  <span className="tag">NumPy</span>
                  <span className="tag">Django</span>
                  <span className="tag">OpenWeatherMap API</span>
                </div>
              </div>

              {/* Card 2,2 - Right column, expands left */}
              <div 
                ref={(el) => { cardRefs.current[3] = el; }}
                className={`glass-card p-5 transition-all duration-500 ease-in group cursor-pointer ${
                  expandedCard === 3 ? 'scale-105 z-10' : 'hover:scale-105 hover:z-10'
                }`}
                onClick={() => handleCardClick(3)}
              >
                <h3 className="text-xl mb-2">
                  <a href="https://github.com/mohakapoor/Nifty50TrendPrediction" target="_blank" rel="noreferrer noopener">Nifty50 Trend Prediction</a>
                </h3>
                <p className="text-dust-gray mb-3">Random Forest classifier predicting short‑term market trends using historical Yahoo Finance data.</p>
                <div className={`${expandedCard === 3 ? 'block' : 'hidden group-hover:block'} text-dust-gray mb-3 text-sm leading-relaxed`}>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Ensemble-based Random Forest classification</li>
                    <li>Technical indicator feature engineering</li>
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="tag">Python</span>
                  <span className="tag">scikit‑learn</span>
                  <span className="tag">Pandas</span>
                  <span className="tag">NumPy</span>
                  <span className="tag">yfinance</span>
                </div>
              </div>
            </div>
          </section>

          <section id="experience">
            <h2 className="newspaper-headline text-3xl mb-4">Experience</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div 
                ref={(el) => { cardRefs.current[4] = el; }}
                className={`glass-card p-5 transition-all duration-500 ease-in group cursor-pointer ${
                  expandedCard === 4 ? 'scale-105 z-10' : 'hover:scale-105 hover:z-10'
                }`}
                onClick={() => handleCardClick(4)}
              >
                <h3 className="text-xl mb-1">HumanizeIQ — AI Intern Integrations</h3>
                <p className="text-dust-gray mb-3">Developed Model Context Protocol (MCP) servers using Cloudflare Workers for AI-powered image and document generation, with async processing and R2 bucket storage.</p>
                <div className={`${expandedCard === 4 ? 'block' : 'hidden group-hover:block'} text-dust-gray mb-3 text-sm leading-relaxed`}>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Developed Model Context Protocol (MCP) servers using Cloudflare Workers for AI-powered image and document generation, with async processing and R2 bucket storage.</li>
                    <li>Built scalable MCP infrastructure that returns immediate job IDs and processes generation requests in the background, implementing polling-based result retrieval.</li>
                    <li>Integrated MCP tools with LLM chat systems, enabling seamless generation workflows for various document types with embedded AI-generated content.</li>
                    <li>Implemented robust async job management with status tracking & result fetching for production AI tools.</li>
                  </ul>
                </div>
              </div>
              <div 
                ref={(el) => { cardRefs.current[5] = el; }}
                className={`glass-card p-5 transition-all duration-500 ease-in group cursor-pointer ${
                  expandedCard === 5 ? 'scale-105 z-10' : 'hover:scale-105 hover:z-10'
                }`}
                onClick={() => handleCardClick(5)}
              >
                <h3 className="text-xl mb-1">JPMorgan Chase & Co. — Quant Research Virtual</h3>
                <p className="text-dust-gray mb-3">Analyzed a loan book to estimate probability of default; transformed FICO scores into categorical features with dynamic programming.</p>
                <div className={`${expandedCard === 5 ? 'block' : 'hidden group-hover:block'} text-dust-gray mb-3 text-sm leading-relaxed`}>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Applied quantitative research methods in a simulated banking environment for loan default analysis</li>
                    <li>Used dynamic programming to convert FICO scores into categorical data, enhancing default prediction model robustness</li>
                    <li>Developed a natural gas price prediction model using SARIMA time series analysis</li>
                  </ul>
                </div>
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
                </a>
                <GitHubContributions username="mohakapoor" />
              </div>
            </div>
          </section>

          <section id="contact">
            <h2 className="newspaper-headline text-3xl mb-4">Get in touch</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <a
                className="glass-card p-6 block no-underline cursor-pointer"
                href="mailto:contact.mohakapoor@gmail.com"
                target="_blank"
                rel="noreferrer noopener"
              >
                <h3 className="text-xl mb-2">Contact</h3>
                <p className="text-dust-gray">Got a case for me? Let’s talk.</p>
              </a>
              <a
                className="glass-card p-6 block no-underline cursor-pointer"
                href="/MOHAK_KAPOOR_ML.pdf"
                download="MOHAK_KAPOOR_ML.pdf"
              >
                <h3 className="text-xl mb-2">Download Resume</h3>
                <p className="text-dust-gray">Grab the dossier as a PDF.</p>
              </a>
            </div>
          </section>
        </article>
      </section>
    </main>
  );
}


