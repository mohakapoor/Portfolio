'use client';
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CodeAtlasProjectPage() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
            <style jsx>{`
                .glass-card:hover {
                    transform: none !important;
                    scale: none !important;
                }
            `}</style>

            <main className="min-h-screen px-6 py-16">
                {/* Hamburger button */}
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
                    aria-label="Project navigation"
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
                        <Link href="/projects" className="block py-2 hover:underline" onClick={() => setMenuOpen(false)}>Projects</Link>
                        <div className="mt-4 text-dust-gray">On this page</div>
                        <a href="#project-details" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Project Overview</a>
                        <a href="#architecture" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Architecture</a>
                        <a href="#retrieval-engineering" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Retrieval Engineering</a>
                        <a href="#performance" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Performance & Benchmarks</a>
                    </nav>
                </aside>

                {/* Back to Projects button */}
                <div className="max-w-5xl mx-auto mb-8">
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-[var(--vintage-white)] hover:text-[var(--spider-red)] transition-colors duration-200"
                    >
                        <span>←</span>
                        <span>Back to Projects</span>
                    </Link>
                </div>

                {/* Project Header */}
                <section className="max-w-5xl mx-auto mb-8">
                    <header className="text-center mb-6 animate-slide-down">
                        <h1 className="newspaper-headline text-5xl md:text-7xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] mb-4">
                            CODEATLAS
                        </h1>
                        <p className="text-xl md:text-2xl text-[var(--dust-gray)] max-w-3xl mx-auto italic font-crimson">
                            Intelligent Codebase RAG & Agentic Engineering Assistant
                        </p>
                    </header>
                </section>

                {/* Project Overview Section */}
                <section id="project-details" className="max-w-5xl mx-auto mb-16">
                    <h2 className="newspaper-headline text-3xl my-8 animate-slide-right">Project Overview</h2>

                    <div className="glass-card p-6 md:p-8 mb-8 animate-slide-up">
                        <div className="grid md:grid-cols-3 gap-8 items-start">
                            <div className="md:col-span-2">
                                <h3 className="text-xl mb-4 text-[var(--vintage-white)] flex items-center gap-2">
                                    The Idea
                                </h3>
                                <p className="text-[var(--dust-gray)] leading-relaxed text-lg mb-6">
                                    <strong>CodeAtlas</strong> is an agentic engineering assistant designed to ingest, index, and provide a Retrieval-Augmented Generation (RAG) interface across an entire GitHub portfolio. 
                                    <br /><br />
                                    By aggregating multiple repositories into a centralized, structure-aware semantic knowledge base, CodeAtlas delivers accurate answers to complex architectural queries with precise file and line-level citations.
                                </p>
                            </div>
                            <div className="md:col-span-1">
                                <h3 className="text-xl mb-4 text-[var(--vintage-white)]">Tech Stack</h3>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {['Python', 'LangChain', 'Qdrant', 'Gemini', 'Flask', 'HuggingFace'].map((tag) => (
                                        <span key={tag} className="px-3 py-1 text-xs bg-[var(--spider-red)]/10 text-[var(--spider-red)] border border-[var(--spider-red)]/30 rounded-full font-mono">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <a
                                    href="https://github.com/mohakapoor/CodeAtlas"
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="spider-noir-button w-full py-3 border-2 text-center rounded-lg inline-block text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(204,41,54,0.3)]"
                                >
                                    View Source Code
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Live Demo Terminal CTA */}
                <section className="max-w-5xl mx-auto mb-16 px-4 md:px-0">
                    <div className="relative glass-card border border-[var(--spider-red)]/40 overflow-hidden shadow-[0_0_40px_rgba(204,41,54,0.1)]">
                        {/* Terminal Header */}
                        <div className="bg-black/60 border-b border-[var(--spider-red)]/20 px-4 py-3 flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            </div>
                            <div className="ml-4 font-mono text-xs text-[var(--dust-gray)] opacity-60">root@codeatlas:~# start_terminal</div>
                        </div>
                        
                        {/* Terminal Body */}
                        <div className="p-8 md:p-12 bg-[url('/bg_landscape1.png')] bg-cover bg-center bg-blend-overlay bg-black/80 flex flex-col items-center justify-center text-center">
                            <div className="mb-6 font-mono text-[10px] md:text-xs text-[#a1faff] inline-block px-4 py-2 bg-black/60 border border-[#a1faff]/30 rounded shadow-[0_0_10px_rgba(161,250,255,0.2)] uppercase tracking-[0.2em] animate-pulse">
                                System Online :: Awaiting Query
                            </div>
                            <h2 className="text-3xl md:text-4xl text-white font-bold mb-4 font-sans tracking-tight">Access the Live Demo</h2>
                            <p className="text-[var(--dust-gray)] max-w-2xl mb-8 leading-relaxed text-lg">
                                Experience the agentic retrieval system in real-time. Ask questions about the codebase architecture, dependencies, or implementation details and watch the LLM synthesize answers using cross-encoder reranking.
                            </p>
                            <Link 
                                href="/chat"
                                className="relative overflow-hidden spider-noir-button px-10 py-4 border-2 border-[var(--spider-red)] bg-transparent text-white rounded font-bold tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_40px_rgba(204,41,54,0.6)] hover:bg-[var(--spider-red)] group"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    Launch Terminal
                                    <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
                                </span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* System Architecture */}
                <section id="architecture" className="max-w-5xl mx-auto mb-20">
                    <h2 className="newspaper-headline text-3xl my-8 animate-slide-right">Architecture</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="glass-card p-8">
                            <h3 className="text-xl mb-6 text-[var(--vintage-white)] border-b border-[var(--spider-red)]/30 pb-2">Ingestion & Synchronization</h3>
                            <p className="text-sm text-[var(--dust-gray)] leading-relaxed mb-4">
                                <strong>Incremental Synchronization:</strong> Integrates with the GitHub API to pull repositories. Uses a local <code className="text-[var(--spider-red)] bg-white/5 px-1 rounded">manifest.json</code> queue to parse and index only files modified between commits, optimizing ingestion efficiency.
                            </p>
                            <p className="text-sm text-[var(--dust-gray)] leading-relaxed">
                                <strong>Fault Tolerance:</strong> The manifest serves as a persistent index queue, ensuring at-least-once execution guarantees and seamless recovery.
                            </p>
                        </div>
                        
                        <div className="glass-card p-8">
                            <h3 className="text-xl mb-6 text-[var(--vintage-white)] border-b border-[var(--spider-red)]/30 pb-2">Structure-Aware Parsing</h3>
                            <p className="text-sm text-[var(--dust-gray)] leading-relaxed mb-4">
                                <strong>Python AST Parser:</strong> Utilizes Python's Abstract Syntax Tree (<code className="text-[var(--spider-red)] bg-white/5 px-1 rounded">ast.parse</code>) to extract <code className="text-[var(--spider-red)] bg-white/5 px-1 rounded">FunctionDef</code> and <code className="text-[var(--spider-red)] bg-white/5 px-1 rounded">ClassDef</code> blocks as cohesive, semantic units.
                            </p>
                            <p className="text-sm text-[var(--dust-gray)] leading-relaxed">
                                <strong>Markdown Parser:</strong> Leverages LangChain's <code className="text-[var(--spider-red)] bg-white/5 px-1 rounded">MarkdownHeaderTextSplitter</code> to segment documentation based on structural headers.
                            </p>
                        </div>

                        <div className="glass-card p-8 bg-[var(--spider-red)]/[0.02]">
                            <h3 className="text-xl mb-6 text-[var(--vintage-white)] border-b border-[var(--spider-red)]/30 pb-2">Embedding & Vector Storage</h3>
                            <p className="text-sm text-[var(--dust-gray)] leading-relaxed mb-4">
                                <strong>Embedding Model:</strong> Employs <code className="text-[var(--spider-red)] bg-white/5 px-1 rounded">all-MiniLM-L6-v2</code> via HuggingFace for efficient, private, and localized embeddings.
                            </p>
                            <p className="text-sm text-[var(--dust-gray)] leading-relaxed">
                                <strong>Vector Database:</strong> Utilizes a Qdrant instance for persistent storage, indexing chunks alongside structured metadata (repository, filepath, language, symbol).
                            </p>
                        </div>

                        <div className="glass-card p-8">
                            <h3 className="text-xl mb-6 text-[var(--vintage-white)] border-b border-[var(--spider-red)]/30 pb-2">Interface & Generation</h3>
                            <p className="text-sm text-[var(--dust-gray)] leading-relaxed mb-4">
                                <strong>Application Layer:</strong> A Flask-based orchestration server providing a modern, responsive user interface.
                            </p>
                            <p className="text-sm text-[var(--dust-gray)] leading-relaxed">
                                <strong>Generation Engine:</strong> Integrates with LangChain and Google's Gemini models (<code className="text-[var(--spider-red)] bg-white/5 px-1 rounded">gemini-3.1-flash-lite</code>), strictly grounding responses in retrieved context to mitigate hallucinations.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Retrieval Architecture Evolution */}
                <section id="retrieval-engineering" className="max-w-5xl mx-auto mb-24 px-4 md:px-0">
                    <div className="flex items-baseline justify-between mb-8">
                        <h2 className="newspaper-headline text-3xl animate-slide-left">Retrieval Engineering</h2>
                        <span className="text-[var(--spider-red)] font-mono text-xs tracking-widest uppercase">Solving the Distractor Problem</span>
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-4 mb-8">
                        {/* Flow Steps */}
                        <div className="glass-card p-6 flex flex-col justify-center text-center group hover:bg-white/[0.03] transition-colors border-t-2 border-white/10">
                            <span className="font-mono text-4xl text-white/10 font-bold mb-2 group-hover:text-white/20 transition-colors">01</span>
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-3">Static Quota</h3>
                            <p className="text-[11px] text-[var(--dust-gray)]">Strict top-3 Python / top-2 Markdown limits. High relevancy but suffered from poor recall.</p>
                        </div>
                        <div className="glass-card p-6 flex flex-col justify-center text-center group hover:bg-white/[0.03] transition-colors border-t-2 border-white/10 relative">
                            <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 text-white/20">→</div>
                            <span className="font-mono text-4xl text-white/10 font-bold mb-2 group-hover:text-white/20 transition-colors">02</span>
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-3">Hybrid Rerank</h3>
                            <p className="text-[11px] text-[var(--dust-gray)]">Cross-Encoder reprioritized code heavily, starving the LLM of necessary explanatory Markdown.</p>
                        </div>
                        <div className="glass-card p-6 flex flex-col justify-center text-center group hover:bg-white/[0.03] transition-colors border-t-2 border-[var(--spider-red)]/40 relative">
                            <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 text-white/20">→</div>
                            <span className="font-mono text-4xl text-[var(--spider-red)]/30 font-bold mb-2 group-hover:text-[var(--spider-red)]/50 transition-colors">03</span>
                            <h3 className="text-[var(--spider-red)] font-bold text-sm uppercase tracking-widest mb-3">Hybrid Split</h3>
                            <p className="text-[11px] text-[var(--dust-gray)]">Separated Code & Doc pipelines. Resulted in high MRR but introduced the fatal <strong>Distractor Problem</strong>.</p>
                        </div>
                        <div className="glass-card p-6 flex flex-col justify-center text-center bg-[var(--spider-red)]/10 border-t-2 border-[var(--spider-red)] relative shadow-[0_0_30px_rgba(204,41,54,0.15)]">
                            <div className="hidden md:block absolute -left-3 top-1/2 -translate-y-1/2 text-[var(--spider-red)]/50">→</div>
                            <span className="absolute top-2 right-3 text-[9px] font-mono text-[var(--spider-red)] animate-pulse">DEPLOYED</span>
                            <span className="font-mono text-4xl text-white font-bold mb-2">04</span>
                            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-3">Global Pooling</h3>
                            <p className="text-[11px] text-[var(--dust-gray)] text-white/80">Dynamic context allocation resolving exact-match distractions, dramatically recovering generation metrics.</p>
                        </div>
                    </div>
                </section>

                {/* Evaluation Metrics */}
                <section id="performance" className="max-w-5xl mx-auto mb-24">
                    <h2 className="newspaper-headline text-3xl mb-8 flex items-center gap-4">
                        <span className="w-8 h-[1px] bg-[var(--spider-red)]" />
                        Performance & Benchmarks
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="glass-card p-8 bg-[var(--spider-red)]/[0.02]">
                            <h3 className="text-sm text-[var(--dust-gray)] uppercase tracking-widest mb-6">Retrieval Performance</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-white font-bold">Precision</span>
                                        <span className="text-[var(--spider-red)]">0.78</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-[var(--spider-red)]" style={{ width: '78%' }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-white font-bold">Recall</span>
                                        <span className="text-[var(--spider-red)]">0.83</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-[var(--spider-red)]" style={{ width: '83%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-8">
                            <h3 className="text-sm text-[var(--dust-gray)] uppercase tracking-widest mb-6">Generation Performance</h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-white font-bold">Faithfulness</span>
                                        <span className="text-green-500">0.88</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500/80" style={{ width: '88%' }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-white font-bold">Relevance</span>
                                        <span className="text-green-500">0.91</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500/80" style={{ width: '91%' }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-white font-bold">Correctness</span>
                                        <span className="text-green-500">0.82</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500/80" style={{ width: '82%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
