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
                <section className="max-w-5xl mx-auto mb-12">
                    <header className="text-center mb-10 animate-slide-down">
                        <h1 className="newspaper-headline text-5xl md:text-6xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] mb-4">
                            CODEATLAS
                        </h1>
                        <p className="text-xl text-[var(--dust-gray)] max-w-3xl mx-auto italic">
                            Intelligent Codebase RAG & Agentic Engineering Assistant
                        </p>
                        <div className="w-24 h-[1px] bg-[var(--spider-red)] mx-auto mt-6 opacity-60" />
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
                <section id="retrieval-engineering" className="max-w-5xl mx-auto mb-20">
                    <h2 className="newspaper-headline text-3xl my-8 animate-slide-left">Retrieval Engineering</h2>
                    <p className="text-[var(--dust-gray)] mb-8 max-w-3xl">
                        Retrieving context across a diverse codebase requires balancing raw code logic with high-level documentation. The retrieval architecture evolved through several iterations to solve "The Distractor Problem."
                    </p>
                    
                    <div className="space-y-6 relative border-l border-[var(--spider-red)]/30 ml-4 pl-8">
                        <div className="relative">
                            <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-[var(--newsprint-gray)] border-2 border-[var(--spider-red)]"></div>
                            <h3 className="text-xl font-bold text-white mb-2">Iteration 1: Static Quota Retrieval</h3>
                            <p className="text-sm text-[var(--dust-gray)] mb-2">Executed isolated vector queries (top 3 Python, top 2 Markdown). Delivered high Relevancy but suffered from lower Recall due to inflexible constraints.</p>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-[var(--newsprint-gray)] border-2 border-[var(--spider-red)]"></div>
                            <h3 className="text-xl font-bold text-white mb-2">Iteration 2: Neural Hybrid Reranking</h3>
                            <p className="text-sm text-[var(--dust-gray)] mb-2">Transitioned to Qdrant's Hybrid Search + Cross-Encoder reranking. Precision increased, but Cross-Encoder prioritized code chunks, starving the LLM of Markdown context.</p>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-[var(--newsprint-gray)] border-2 border-[var(--spider-red)]"></div>
                            <h3 className="text-xl font-bold text-white mb-2">Iteration 3: Hybrid Split Reranking</h3>
                            <p className="text-sm text-[var(--dust-gray)] mb-2">Separately fetched and reranked Code vs Doc chunks. Achieved highest MRR (0.50), but suffered from the <strong>Distractor Problem</strong> (irrelevant exact-keyword code matches confusing the LLM).</p>
                        </div>

                        <div className="relative glass-card p-6 mt-6 border-l-4 border-[var(--spider-red)]">
                            <div className="absolute -left-[45px] top-6 w-5 h-5 rounded-full bg-[var(--spider-red)] shadow-[0_0_10px_rgba(204,41,54,0.8)]"></div>
                            <h3 className="text-xl font-bold text-[var(--spider-red)] mb-3">Final: Global Pooling Retrieval</h3>
                            <p className="text-sm text-[var(--dust-gray)] leading-relaxed">
                                Executes dual Hybrid Searches (15 code + 15 doc candidates). Merges into a unified 30-chunk pool. Evaluates the pool holistically using the Cross-Encoder, selecting the absolute top 5 chunks.
                                <br/><br/>
                                <strong>Outcome:</strong> Dynamic context allocation resolving the distractor problem and dramatically recovering Generation metrics.
                            </p>
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
