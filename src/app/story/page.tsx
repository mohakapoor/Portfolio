'use client';
import GitHubContributions from "@/components/GitHubContributions";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function StoryPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [animatedSections, setAnimatedSections] = useState<Set<string>>(new Set());

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

  // Enhanced Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (!animatedSections.has(sectionId)) {
              setAnimatedSections(prev => new Set(prev).add(sectionId));
              
              // Animate all cards in this section simultaneously with a slight delay
              const cards = entry.target.querySelectorAll('.glass-card');
              setTimeout(() => {
                cards.forEach((card) => {
                  card.classList.add('animate-in');
                });
              }, 250); // 250ms delay before starting animation
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Observe all sections with IDs
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    // Also observe the main article for any cards that might not be in sections
    const article = document.querySelector('article');
    if (article) {
      observer.observe(article);
    }

    return () => observer.disconnect();
  }, [animatedSections]);

  // Immediate visibility + Fallback: Make all cards visible immediately and after 3 seconds
  useEffect(() => {
    // Make all cards visible immediately to prevent disappearing
    const allCards = document.querySelectorAll('.glass-card');
    allCards.forEach((card) => {
      card.classList.add('animate-in');
    });

    // Also keep the 3-second fallback as backup
    const fallbackTimer = setTimeout(() => {
      allCards.forEach((card) => {
        card.classList.add('animate-in');
      });
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, []);

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
          <div className="mt-4 text-dust-gray">Projects</div>
          <Link href="/project/CaptchaOCR" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>CaptchaOCR</Link>
          <div className="mt-4 text-dust-gray">On this page</div>
          <a href="#who-am-i" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Who Am I</a>
          <a href="#featured" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Featured Projects</a>
          <a href="#experience" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Experience</a>
          <a href="#skills" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Skills</a>
          <a href="#github" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>GitHub</a>
          <a href="#contact" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
      </aside>

      <section className="max-w-5xl mx-auto">
                 <header className="mb-10 text-center mt-5 animate-slide-down">
           <h1 className="newspaper-headline text-6xl md:text-7xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">My Story</h1>
         </header>

        <article className="space-y-20 leading-relaxed text-lg">
          <section id="who-am-i" className="glass-card p-6 animate-slide-left">
            <h2 className="newspaper-headline text-3xl mb-2">Who Am I</h2>
            <p className="text-dust-gray mb-4">
            I am an AI Integration Engineer & ML Enthusiast. I build production-grade AI systems that close the gap between models and applications, with a focus on MCP development, time-series forecasting, Computer Vision, and scalable ML Systems. I like to build quick prototypes and test new ideas.
            </p>
          </section>

          <section id="featured">
            <h2 className="newspaper-headline text-3xl my-8 animate-slide-right">Featured Projects</h2>
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
                <div
                  className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-700 ease-in ${
                    expandedCard === 0
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100'
                  }`}
                >
                  <div className="min-h-0 text-dust-gray mb-3 text-sm leading-relaxed">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>CNN-LSTM architecture with self-attention mechanisms</li>
                      <li>Multi-currency support: JPY, GBP, USD pairs</li>
                      <li>High-frequency 1-minute data processing</li>
                      <li>Real-time inference pipeline</li>
                    </ul>
                  </div>
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
                <div
                  className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-700 ease-in ${
                    expandedCard === 1
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100'
                  }`}
                >
                  <div className="min-h-0 text-dust-gray mb-3 text-sm leading-relaxed">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Gemini AI integration for dynamic content generation</li>
                      <li>Automated email verification and deliverability checks</li>
                      <li>Response rate analytics and engagement tracking</li>
                      <li>Customizable email templates and personalization</li>
                    </ul>
                  </div>
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
                <div
                  className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-700 ease-in ${
                    expandedCard === 2
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100'
                  }`}
                >
                  <div className="min-h-0 text-dust-gray mb-3 text-sm leading-relaxed">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Multi-variate time series forecasting model</li>
                      <li>Seasonal trend analysis and panel degradation modeling</li>
                      <li>Real-time weather data integration via OpenWeatherMap API</li>
                      <li>User-configurable prediction parameters</li>
                    </ul>
                  </div>
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
                  <a href="https://github.com/mohakapoor/CaptchaOCR" target="_blank" rel="noreferrer noopener">CaptchaOCR — CAPTCHA Recognition System</a>
                </h3>
                <p className="text-dust-gray mb-3">End-to-end CAPTCHA text recognition using custom CRNN architecture with CTC loss, achieving 96%+ character accuracy through synthetic data generation and deep learning.</p>
                <div
                  className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-700 ease-in ${
                    expandedCard === 3
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100'
                  }`}
                >
                  <div className="min-h-0 text-dust-gray mb-3 text-sm leading-relaxed">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>CNN + BiLSTM architecture with Connectionist Temporal Classification</li>
                      <li>Synthetic CAPTCHA generation for robust training data</li>
                      <li>Real-time inference with GPU acceleration and deployment on Hugging Face</li>
                      <li>Comprehensive training pipeline with early stopping and performance metrics</li>
                    </ul>
                    <div className="mt-4 text-center my-2">
                      <div className="flex gap-4 justify-center">
                        <a
                          href="https://huggingface.co/spaces/mohakapoor/captchaOCR"
                          target="_blank"
                          rel="noreferrer noopener"
                          className="spider-noir-button px-6 py-2 border-2 text-lg rounded-lg"
                        >
                          Live Demo
                        </a>
                        <a
                          href="/project/CaptchaOCR"
                          className="spider-noir-button px-6 py-2 border-2 text-lg rounded-lg bg-[var(--spider-red)]/10 hover:bg-[var(--spider-red)]/20"
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="tag">Python</span>
                  <span className="tag">PyTorch</span>
                  <span className="tag">CNN-LSTM</span>
                  <span className="tag">CTC Loss</span>
                  <span className="tag">Computer Vision</span>
                  <span className="tag">Deep Learning</span>
                  <span className="tag">Hugging Face</span>
                </div>
              </div>
            </div>
          </section>

          <section id="experience">
            <h2 className="newspaper-headline text-3xl my-8 animate-slide-left">Experience</h2>
            <div className="grid gap-6 md:grid-cols-2">
                                                                                                                       <div 
                   ref={(el) => { cardRefs.current[4] = el; }}
                   className={`glass-card p-5 transition-all duration-500 ease-in group cursor-pointer ${
                     expandedCard === 4 ? 'scale-105 z-10' : 'hover:scale-105 hover:z-10'
                   }`}
                   onClick={() => handleCardClick(4)}
                 >
                <h3 className="text-xl mb-1">HumanizeIQ — AI Intern Integrations</h3>
                <p className="text-dust-gray mb-3">Developed MCP infrastructure and AI workflow orchestration for recruiter call analysis, building scalable systems with Cloudflare Workers and multi-model AI integration.</p>
                                 <div
                   className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-700 ease-in ${
                     expandedCard === 4
                       ? 'grid-rows-[1fr] opacity-100'
                       : 'grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100'
                   }`}
                 >
                   <div className="min-h-0 text-dust-gray mb-3 text-sm leading-relaxed">
                     <ul className="list-disc pl-5 space-y-1">
                       <li>Developed two specialized MCP servers using Cloudflare Workers: image generation and multimodal document generation (text + images), with async processing and R2 bucket storage.</li>
                       <li>Built scalable MCP infrastructure implementing background processing, result retrieval, and integration with LLM chat systems.</li>
                       <li>Designed AI-powered workflow orchestration for recruiter call analysis using Gemini and GPT-4 models, automating report generation and email distribution.</li>
                       <li>Set up APIs for report storage, email distribution, and call event handling to support the recruiter analysis workflow.</li>
                     </ul>
                   </div>
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
                                 <div
                   className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-700 ease-in ${
                     expandedCard === 5
                       ? 'grid-rows-[1fr] opacity-100'
                       : 'grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100'
                   }`}
                 >
                   <div className="min-h-0 text-dust-gray mb-3 text-sm leading-relaxed">
                     <ul className="list-disc pl-5 space-y-1">
                       <li>Applied quantitative research methods in a simulated banking environment for loan default analysis</li>
                       <li>Used dynamic programming to convert FICO scores into categorical data, enhancing default prediction model robustness</li>
                       <li>Developed a natural gas price prediction model using SARIMA time series analysis</li>
                     </ul>
                   </div>
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

          <section id="skills">
            <h2 className="newspaper-headline text-3xl my-8 animate-slide-right">Skills & Technologies</h2>
                                                   <div className="grid gap-6 md:grid-cols-2">
                <div className="glass-card p-5">
                  <h3 className="text-xl mb-3">Machine Learning</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="tag">Deep Learning</span>
                    <span className="tag">Time-Series Forecasting</span>
                    <span className="tag">CNN-LSTM</span>
                    <span className="tag">Random Forest</span>
                    <span className="tag">TensorFlow</span>
                    <span className="tag">scikit-learn</span>
                  </div>
                </div>
                <div className="glass-card p-5">
                  <h3 className="text-xl mb-3">Development & Infrastructure</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="tag">Python</span>
                    <span className="tag">C++</span>
                    <span className="tag">TypeScript</span>
                    <span className="tag">MCP Development</span>
                    <span className="tag">Cloudflare Workers</span>
                    <span className="tag">Async Systems</span>
                    <span className="tag">PostgreSQL</span>
                    <span className="tag">REST APIs</span>
                    <span className="tag">Django</span>
                    <span className="tag">Docker</span>
                  </div>
                </div>
                <div className="glass-card p-5">
                  <h3 className="text-xl mb-3">CI/CD</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="tag">GitHub Actions</span>
                    <span className="tag">CI/CD Pipelines</span>
                    <span className="tag">Deployment Automation</span>
                    <span className="tag">Workflow Orchestration</span>
                  </div>
                </div>
              </div>
          </section>

          <section id="github">
            <h2 className="newspaper-headline text-3xl my-8 animate-slide-left">GitHub</h2>
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
            <h2 className="newspaper-headline text-3xl my-6 animate-slide-right">Get in touch</h2>
                                                   <div className="grid gap-6 md:grid-cols-2">
                <a
                  className="glass-card p-6 block no-underline cursor-pointer"
                  href="mailto:contact.mohakapoor@gmail.com"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <h3 className="text-xl mb-2">Contact</h3>
                  <p className="text-dust-gray">Got a case for me? Let&apos;s talk.</p>
                </a>
                <a
                  className="glass-card p-6 block no-underline cursor-pointer"
                  href="/MOHAK_KAPOOR_ML.pdf"
                  download="MOHAK_KAPOOR_ML.pdf"
                >
                  <h3 className="text-xl mb-2">Download Resume</h3>
                  <p className="text-dust-gray">Grab the Resume as a PDF.</p>
                </a>
              </div>
          </section>
        </article>
      </section>
    </main>
  );
}


