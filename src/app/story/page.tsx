'use client';
import GitHubContributions from "@/components/GitHubContributions";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Footer } from "@/components/Landing/Footer";
import InteractiveGrid from "@/components/Story/InteractiveGrid";

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

  // Handle card click
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

              // Animate all cards in this section
              const cards = entry.target.querySelectorAll('.glass-card');
              setTimeout(() => {
                cards.forEach((card) => {
                  card.classList.add('animate-in');
                });
              }, 250); 
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    const article = document.querySelector('article');
    if (article) {
      observer.observe(article);
    }

    return () => observer.disconnect();
  }, [animatedSections]);

  // Immediate visibility + Fallback
  useEffect(() => {
    const allCards = document.querySelectorAll('.glass-card');
    allCards.forEach((card) => {
      card.classList.add('animate-in');
    });

    const fallbackTimer = setTimeout(() => {
      allCards.forEach((card) => {
        card.classList.add('animate-in');
      });
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  return (
    <main className="min-h-screen py-16 px-0 overflow-x-hidden">
      {/* Navigation Sidebar */}
      <nav 
        className={`fixed top-0 left-0 z-60 h-full w-72 glass-nav transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Story navigation"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--theme-accent)]/40">
          <span className="newspaper-headline text-2xl">Menu</span>
          <button
            aria-label="Close menu"
            className="p-2 rounded-md border border-[var(--theme-accent)] text-[var(--vintage-white)] hover:bg-[var(--theme-accent)] transition"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </div>
        <div className="px-4 py-3 space-y-2">
          <Link href="/" className="block py-2 hover:underline" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/story" className="block py-2 hover:underline" onClick={() => setMenuOpen(false)}>Story</Link>
          <Link href="/projects" className="block py-2 hover:underline" onClick={() => setMenuOpen(false)}>Projects</Link>
          <div className="mt-4 text-dust-gray">On this page</div>
          <a href="#who-am-i" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Who Am I</a>
          <a href="#featured" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Featured Projects</a>
          <a href="#experience" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Experience</a>
          <a href="#skills" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Skills</a>
          <a href="#github" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>GitHub</a>
        </div>
      </nav>

      {/* Hamburger button */}
      <button
        aria-label="Open menu"
        className="fixed top-5 left-4 sm:top-6 sm:left-6 z-30 p-3 rounded-md border border-[var(--theme-accent)] bg-[var(--newsprint-gray)] text-[var(--vintage-white)] hover:bg-[var(--theme-accent)] transition"
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

      {/* Main Content Layout */}
      <div className="w-full relative mt-[-64px]">
        <InteractiveGrid />
        <div className="px-8 md:px-20 pt-24">
          <header className="mb-10 text-center mt-5">
            <h1 className="newspaper-headline text-6xl md:text-7xl text-white drop-shadow-[0_0_12px_rgba(var(--theme-accent-rgb),0.2)]">My Story</h1>
          </header>

        <article className="space-y-20 leading-relaxed text-lg pb-8">
          <section id="who-am-i" className="glass-card p-6">
            <h2 className="newspaper-headline text-3xl mb-2">Who Am I</h2>
            <p className="text-dust-gray">
              I am an AI Integration Engineer & ML Enthusiast. I build production-grade AI systems that close the gap between models and applications, with a focus on MCP development, time-series forecasting, Computer Vision, and scalable ML Systems. I like to build quick prototypes and test new ideas.
            </p>
          </section>

          <section id="featured">
             <div className="flex items-baseline justify-between my-8">
              <h2 className="newspaper-headline text-3xl">Featured Projects</h2>
              <Link href="/projects" className="text-[var(--dust-gray)] hover:text-[var(--theme-accent)] transition-colors">VIEW ALL &rarr;</Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Featured Project Cards */}
              {[
                { 
                  id: 0, 
                  title: "Intrusion Detection System", 
                  desc: "Real-time network traffic analysis using hybrid machine learning (LightGBM + Deep Learning) to detect sophisticated cyber attacks on the CICIDS-2017 dataset.",
                  tags: ["Python", "PyTorch", "RAPIDS", "LightGBM", "CICIDS-2017"],
                  href: "/projects/IntrusionDetection"
                },
                { 
                  id: 1, 
                  title: "CaptchaOCR", 
                  desc: "End-to-end CAPTCHA text recognition using custom CRNN architecture with CTC loss, achieving 96%+ character accuracy.",
                  tags: ["Python", "PyTorch", "CNN-LSTM", "CTC Loss", "Computer Vision"],
                  href: "/projects/CaptchaOCR"
                },
                { 
                  id: 2, 
                  title: "HermesGPT", 
                  desc: "AI‑powered personalized cold emails with Gmail API, email verification, and PostgreSQL tracking.",
                  tags: ["Python", "Gmail API", "Gemini AI", "Automation", "PostgreSQL"],
                  href: "https://github.com/mohakapoor/HermesGPT"
                },
                { 
                  id: 3, 
                  title: "Solar Power Generation Predictor", 
                  desc: "Weather‑aware ML to predict hourly generation, surfaced via a Django web front‑end for user inputs.",
                  tags: ["TensorFlow", "scikit‑learn", "Pandas", "Django", "OpenWeatherMap API"],
                  href: "https://github.com/mohakapoor/Solar-Energy-Prediction"
                }
              ].map((proj) => {
                const isExternal = proj.href.startsWith('http');
                const CardWrapper = isExternal ? 'a' : Link;
                const wrapperProps = isExternal 
                  ? { href: proj.href, target: "_blank", rel: "noopener noreferrer" } 
                  : { href: proj.href };

                return (
                  <CardWrapper
                    key={proj.id}
                    {...wrapperProps}
                    ref={(el: any) => { cardRefs.current[proj.id] = el; }}
                    className={`relative overflow-hidden rounded-[12px] p-5 transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group cursor-pointer border backdrop-blur-md block ${expandedCard === proj.id ? 'scale-105 z-10 bg-[var(--theme-accent)]/[0.07] border-[var(--theme-accent)]/[0.30]' : 'bg-[var(--theme-accent)]/[0.03] border-[var(--theme-accent)]/[0.12] hover:bg-[var(--theme-accent)]/[0.07] hover:border-[var(--theme-accent)]/[0.30] hover:scale-105 hover:z-10'}`}
                    onClick={() => handleCardClick(proj.id)}
                  >
                    <div className={`absolute -top-6 -right-6 w-24 h-24 bg-[var(--theme-accent)]/20 rounded-full blur-[24px] pointer-events-none transition-opacity duration-700 ${expandedCard === proj.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    <div className="flex justify-between items-start mb-2 relative z-10">
                      <h3 className="text-xl">{proj.title}</h3>
                      <div className={`text-[14px] text-[var(--theme-accent)]/40 transition-all duration-300 ml-3 shrink-0 ${expandedCard === proj.id ? 'text-[var(--theme-accent)]/90 translate-x-[2px] -translate-y-[2px]' : 'group-hover:text-[var(--theme-accent)]/90 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]'}`}>↗</div>
                    </div>
                    <p className="text-dust-gray mb-3 text-sm">{proj.desc}</p>
                    <div className="flex flex-wrap gap-2 relative z-10">
                      {proj.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                    </div>
                  </CardWrapper>
                );
              })}
            </div>
          </section>

          <section id="experience">
            <h2 className="newspaper-headline text-3xl my-8">Experience</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div
                ref={(el) => { cardRefs.current[4] = el; }}
                className={`glass-card p-5 transition-all duration-500 ease-in group cursor-pointer ${expandedCard === 4 ? 'scale-105 z-10' : 'hover:scale-105 hover:z-10'}`}
                onClick={() => handleCardClick(4)}
              >
                <h3 className="text-xl mb-1">HumanizeIQ — AI Intern Integrations</h3>
                <p className="text-dust-gray text-sm mb-2">Developed MCP infrastructure and AI workflow orchestration for recruiter call analysis, building scalable systems with Cloudflare Workers.</p>
                <div className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-700 ${expandedCard === 4 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100'}`}>
                  <div className="min-h-0 text-dust-gray text-xs leading-relaxed">
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Developed specialized MCP servers for image and multimodal document generation.</li>
                      <li>Designed AI-powered workflow orchestration using Gemini and GPT-4.</li>
                      <li>Set up APIs for report storage, email distribution, and call event handling.</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div
                ref={(el) => { cardRefs.current[5] = el; }}
                className={`glass-card p-5 transition-all duration-500 ease-in group cursor-pointer ${expandedCard === 5 ? 'scale-105 z-10' : 'hover:scale-105 hover:z-10'}`}
                onClick={() => handleCardClick(5)}
              >
                <h3 className="text-xl mb-1">JPMorgan Chase & Co. — Quant Research Virtual</h3>
                <p className="text-dust-gray text-sm mb-2">Analyzed a loan book to estimate probability of default; transformed FICO scores with dynamic programming.</p>
                <div className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-700 ${expandedCard === 5 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100'}`}>
                  <div className="min-h-0 text-dust-gray text-xs leading-relaxed">
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Used dynamic programming to convert FICO scores into categorical data.</li>
                      <li>Developed natural gas price prediction model using SARIMA analysis.</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-xl mb-1">OSDC — Member</h3>
                <p className="text-dust-gray text-sm">Organized hackathons and open‑source events; collaborated on OSS contributions.</p>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-xl mb-1">Social Media — Strategy & Marketing</h3>
                <p className="text-dust-gray text-sm">Led strategy for two Instagram pages (55k & 17k followers), increasing engagement by 167%.</p>
              </div>
            </div>
          </section>

          <section id="skills">
            <h2 className="newspaper-headline text-3xl my-8">Skills & Technologies</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="glass-card p-5">
                <h3 className="text-xl mb-3">Machine Learning</h3>
                <div className="flex flex-wrap gap-2">
                  {["Deep Learning", "Time-Series", "CNN-LSTM", "Random Forest", "TensorFlow", "scikit-learn"].map(s => <span key={s} className="tag">{s}</span>)}
                </div>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-xl mb-3">Dev & Infrastructure</h3>
                <div className="flex flex-wrap gap-2">
                  {["Python", "C++", "TypeScript", "MCP", "Cloudflare", "PostgreSQL", "Django", "Docker"].map(s => <span key={s} className="tag">{s}</span>)}
                </div>
              </div>
              <div className="glass-card p-5 md:col-span-2 lg:col-span-1">
                <h3 className="text-xl mb-3">CI/CD & Ops</h3>
                <div className="flex flex-wrap gap-2">
                  {["GitHub Actions", "Pipelines", "Automation", "Workflow Orchestration"].map(s => <span key={s} className="tag">{s}</span>)}
                </div>
              </div>
            </div>
          </section>

          <section id="github">
            <h2 className="newspaper-headline text-3xl my-8">GitHub</h2>
            <div className="glass-card p-6">
              <div className="flex flex-col items-center text-center mb-8">
                <img src="https://github.com/mohakapoor.png?size=240" className="w-40 h-40 rounded-lg border border-[var(--theme-accent)]/40 object-cover mb-4" />
                <h3 className="text-xl font-semibold text-[var(--vintage-white)]">@mohakapoor</h3>
              </div>
              <GitHubContributions username="mohakapoor" />
            </div>
          </section>
        </article>
      </div>
    </div>

    <div className="w-full px-8 md:px-20">
      {/* Footer Area */}
      <div className="w-full h-[1px] bg-white/[0.05] mt-4" />
      <Footer isFullWidth={true} />
    </div>
  </main>
  );
}
