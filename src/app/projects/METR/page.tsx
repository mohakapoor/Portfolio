'use client';
import Link from "next/link";
import { useState, useEffect } from "react";

export default function METRProjectPage() {
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
                        <a href="#backtest-results" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Backtest Results</a>
                        <a href="#strategy-architecture" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Strategy Architecture</a>
                        <a href="#statistical-rigor" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Statistical Rigor</a>
                        <a href="#data-engineering" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Data Engineering</a>
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
                            METR
                        </h1>
                        <p className="text-xl text-[var(--dust-gray)] max-w-3xl mx-auto italic">
                            Market Exposure Timing vs Randomness
                        </p>
                        <div className="w-24 h-[1px] bg-[var(--spider-red)] mx-auto mt-6 opacity-60" />
                    </header>
                </section>

                {/* Project Overview Section */}
                <section id="project-details" className="max-w-5xl mx-auto mb-16">
                    <h2 className="newspaper-headline text-3xl my-8 animate-slide-right">Project Overview</h2>

                    {/* Card 1: The Idea */}
                    <div className="glass-card p-6 md:p-8 mb-8 animate-slide-up">
                        <div className="grid md:grid-cols-3 gap-8 items-start">
                            <div className="md:col-span-2">
                                <h3 className="text-xl mb-4 text-[var(--vintage-white)] flex items-center gap-2">
                                    The Idea
                                </h3>
                                <p className="text-[var(--dust-gray)] leading-relaxed text-lg mb-6">
                                    Can a machine learning model trained purely on historical price, volume, and publicly available implied volatility data — without any live sentiment, news, macro indicators, or order flow — actually beat random market entries in the long term?
                                    <br /><br />
                                    By training an <strong>XGBoost Trade-Filter</strong> on price action, volume, and implied volatility (VIX), the study isolates true statistical predictive edge from market drift. Validated against <strong>10,000 Monte Carlo simulations</strong>, the results confirm that while benchmark indices are highly efficient, specific commodity instruments like Gold hold exploitable temporal windows.
                                </p>
                            </div>
                            <div className="md:col-span-1">
                                <h3 className="text-xl mb-4 text-[var(--vintage-white)]">Tech Stack</h3>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {['Python', 'XGBoost', 'Polars', 'Scikit-Learn', 'NumPy', 'Gaussian HMM'].map((tag) => (
                                        <span key={tag} className="px-3 py-1 text-xs bg-[var(--spider-red)]/10 text-[var(--spider-red)] border border-[var(--spider-red)]/30 rounded-full font-mono">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <a
                                    href="https://github.com/mohakapoor/METR"
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

                {/* Backtest Results Section */}
                <section id="backtest-results" className="max-w-5xl mx-auto mb-20">
                    <h2 className="newspaper-headline text-3xl mb-8 animate-slide-left">Backtest Results (OOS 2024–2025)</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* GoldBees Card */}
                        <div className="glass-card p-6 border-t-4 border-[var(--spider-red)] relative overflow-hidden group">
                            <div className="absolute top-2 right-4 text-[10px] font-mono text-[var(--spider-red)] opacity-60">STAT-SIG ALPHA</div>
                            <h3 className="text-2xl font-bold text-white mb-6">GOLDBEES</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
                                    <span className="text-[var(--dust-gray)] text-sm uppercase">Return</span>
                                    <span className="text-3xl font-bold text-white">+17.92%</span>
                                </div>
                                <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
                                    <span className="text-[var(--dust-gray)] text-sm uppercase">Account Sharpe</span>
                                    <span className="text-3xl font-bold text-white">1.48</span>
                                </div>
                                <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
                                    <span className="text-[var(--dust-gray)] text-sm uppercase">Max Drawdown</span>
                                    <span className="text-xl font-bold text-[var(--spider-red)]">7.99%</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[var(--dust-gray)] text-sm uppercase">Calmar Ratio</span>
                                    <span className="text-xl font-bold text-white">1.87</span>
                                </div>
                            </div>
                            <div className="mt-8 p-3 bg-white/5 rounded text-xs text-center text-[var(--dust-gray)] italic">
                                Successful conversion of suboptimal signal (-0.73 Sharpe) into verified alpha.
                            </div>
                        </div>

                        {/* Nifty Card */}
                        <div className="glass-card p-6 border-t-4 border-gray-600 opacity-80">
                            <div className="absolute top-2 right-4 text-[10px] font-mono text-gray-500">NULL RESULT</div>
                            <h3 className="text-2xl font-bold text-gray-300 mb-6">NIFTY 50</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
                                    <span className="text-gray-500 text-sm uppercase">Return</span>
                                    <span className="text-2xl font-medium text-gray-400">-8.01%</span>
                                </div>
                                <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
                                    <span className="text-gray-500 text-sm uppercase">Sharpe</span>
                                    <span className="text-2xl font-medium text-gray-400">-0.40</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-gray-500 text-sm uppercase">Max Drawdown</span>
                                    <span className="text-2xl font-medium text-gray-400">15.57%</span>
                                </div>
                            </div>
                            <p className="mt-8 text-xs text-gray-500 leading-relaxed">
                                Zero directional separation. Validates the high institutional efficiency of India's benchmark index.
                            </p>
                        </div>

                        {/* USD/INR Card */}
                        <div className="glass-card p-6 border-t-4 border-gray-600 opacity-80">
                            <div className="absolute top-2 right-4 text-[10px] font-mono text-gray-500">RISK REJECTION</div>
                            <h3 className="text-2xl font-bold text-gray-300 mb-6">USD / INR</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
                                    <span className="text-gray-500 text-sm uppercase">Return</span>
                                    <span className="text-2xl font-medium text-gray-400">-2.82%</span>
                                </div>
                                <div className="flex justify-between items-baseline border-b border-white/5 pb-2">
                                    <span className="text-gray-500 text-sm uppercase">Sharpe</span>
                                    <span className="text-2xl font-medium text-gray-400">-0.60</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-gray-500 text-sm uppercase">Max Drawdown</span>
                                    <span className="text-2xl font-medium text-gray-400">4.97%</span>
                                </div>
                            </div>
                            <p className="mt-8 text-xs text-gray-500 leading-relaxed">
                                Managed float constraints (RBI intervention) create a structural ceiling on momentum-based prediction.
                            </p>
                        </div>
                    </div>
                </section>



                {/* Strategy Architecture Section */}
                <section id="strategy-architecture" className="max-w-5xl mx-auto mb-20">
                    <h2 className="newspaper-headline text-3xl my-8 animate-slide-right">Architecture</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Two-Layer Logic */}
                        <div className="glass-card p-8">
                            <h3 className="text-xl mb-6 text-[var(--vintage-white)] border-b border-[var(--spider-red)]/30 pb-2">Execution Pipeline</h3>
                            <div className="space-y-6">
                                <div className="relative pl-8">
                                    <div className="absolute left-0 top-1 w-5 h-5 bg-[var(--spider-red)]/20 border border-[var(--spider-red)] rounded-full flex items-center justify-center text-[10px] font-bold text-[var(--spider-red)]">1</div>
                                    <h4 className="text-white font-bold mb-1 border-b border-white/5 pb-1">Primary Signal Generator</h4>
                                    <p className="text-xs text-[var(--dust-gray)] leading-relaxed">
                                        Initial trade recommendations are generated via a volatility-normalized 5-day momentum trigger. This acts as the "Base Logic" that identifies raw price anomalies.
                                    </p>
                                </div>
                                <div className="relative pl-8">
                                    <div className="absolute left-0 top-1 w-5 h-5 bg-[var(--spider-red)]/20 border border-[var(--spider-red)] rounded-full flex items-center justify-center text-[10px] font-bold text-[var(--spider-red)]">2</div>
                                    <h4 className="text-white font-bold mb-1 border-b border-white/5 pb-1">Meta Labeling Framework</h4>
                                    <p className="text-xs text-[var(--dust-gray)] leading-relaxed">
                                        Each signal is assigned a "Success" label only if the Triple Barrier profit target is hit before the stop-loss or horizontal time-out, creating a clean binary audit trail for the ML filter.
                                    </p>
                                </div>
                                <div className="relative pl-8">
                                    <div className="absolute left-0 top-1 w-5 h-5 bg-[var(--spider-red)]/20 border border-[var(--spider-red)] rounded-full flex items-center justify-center text-[10px] font-bold text-[var(--spider-red)]">3</div>
                                    <h4 className="text-white font-bold mb-1 border-b border-white/5 pb-1">Conditional Model Training</h4>
                                    <p className="text-xs text-[var(--dust-gray)] leading-relaxed font-mono">
                                        Train: [Observations | Signal != 0]
                                        <span className="block mt-1 normal-case font-sans">The XGBoost classifier is trained exclusively on active signal instances to isolate trade verification from signal discovery.</span>
                                    </p>
                                </div>
                                <div className="relative pl-8">
                                    <div className="absolute left-0 top-1 w-5 h-5 bg-[var(--spider-red)]/20 border border-[var(--spider-red)] rounded-full flex items-center justify-center text-[10px] font-bold text-[var(--spider-red)]">4</div>
                                    <h4 className="text-white font-bold mb-1 border-b border-white/5 pb-1">Verification Pipeline</h4>
                                    <p className="text-xs text-[var(--dust-gray)] leading-relaxed">
                                        The combined logic undergoes probability threshold optimization, iterative backtesting, and finally a 10,000-pass Monte Carlo simulation for statistical validation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Triple Barrier Method */}
                        <div className="glass-card p-8 bg-[var(--spider-red)]/[0.02]">
                            <h3 className="text-xl mb-6 text-[var(--vintage-white)] border-b border-[var(--spider-red)]/30 pb-2">Triple Barrier Labeling</h3>
                            <p className="text-sm text-[var(--dust-gray)] mb-6">
                                Instead of simple binary "Up/Down" labels, METR uses a volatility-adaptive exit framework to capture paths, not just endpoints.
                            </p>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded border-l-2 border-green-500">
                                    <span className="text-xs font-mono">UPPER BARRIER</span>
                                    <span className="text-white text-xs">+k * Sigma (Profit Target)</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded border-l-2 border-red-500">
                                    <span className="text-xs font-mono">LOWER BARRIER</span>
                                    <span className="text-white text-xs">-k * Sigma (Stop Loss)</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-white/5 rounded border-l-2 border-blue-500">
                                    <span className="text-xs font-mono">VERTICAL BARRIER</span>
                                    <span className="text-white text-xs">Time T expires (Timeout)</span>
                                </div>
                            </div>

                            {/* Fractional Differentiation Subsection */}
                            <div className="mt-10">
                                <h4 className="text-xl mb-6 text-[var(--vintage-white)] border-b border-[var(--spider-red)]/30 pb-2">Feature Stationarity</h4>
                                <p className="text-sm text-[var(--dust-gray)] mb-6">
                                    To balance the stationarity-memory trade-off, METR implements <strong>Fractional Differentiation</strong>. This maintains statistical stationarity while preserving critical historical memory required for momentum discovery.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Strategic Specifications Section */}
                <section id="specs" className="max-w-5xl mx-auto mb-24 px-4 md:px-0">
                    <h2 className="newspaper-headline text-3xl mb-8 animate-slide-left">Specifications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card p-6 border-l-2 border-[var(--spider-red)] transition-all duration-300 hover:bg-white/[0.03] hover:shadow-[0_0_20px_rgba(204,41,54,0.1)]">
                            <span className="text-white block font-bold text-xs mb-3 uppercase tracking-[0.2em] opacity-60">Primary Assets</span>
                            <span className="text-[var(--dust-gray)] text-base font-mono italic leading-relaxed">
                                Nifty 50 Index <br />
                                Gold (GOLDBEES) <br />
                                USD / INR
                            </span>
                        </div>
                        <div className="glass-card p-6 border-l-2 border-[var(--spider-red)] transition-all duration-300 hover:bg-white/[0.03] hover:shadow-[0_0_20px_rgba(204,41,54,0.1)]">
                            <span className="text-white block font-bold text-xs mb-3 uppercase tracking-[0.2em] opacity-60">Testing Window</span>
                            <span className="text-2xl font-bold font-mono text-white">2024–2025</span>
                            <span className="block text-[10px] text-[var(--dust-gray)] mt-2 uppercase tracking-widest font-mono">Out-of-Sample Set</span>
                        </div>
                        <div className="glass-card p-6 border-l-2 border-[var(--spider-red)] transition-all duration-300 hover:bg-white/[0.03] hover:shadow-[0_0_20px_rgba(204,41,54,0.1)]">
                            <span className="text-white block font-bold text-xs mb-3 uppercase tracking-[0.2em] opacity-60">Execution Friction</span>
                            <span className="text-2xl font-bold font-mono text-[var(--spider-red)]">5 BPS</span>
                            <span className="block text-[10px] text-[var(--dust-gray)] mt-2 uppercase tracking-widest font-mono">Per Round-Trip</span>
                        </div>
                    </div>
                </section>


                {/* Statistical Rigor Section */}
                <section id="statistical-rigor" className="max-w-5xl mx-auto mb-20">
                    <div className="flex items-baseline justify-between mb-8">
                        <h2 className="newspaper-headline text-3xl animate-slide-left">Statistical Rigor</h2>
                        <span className="text-[var(--spider-red)] font-mono text-xs tracking-widest uppercase">Skill over Luck</span>
                    </div>

                    <div className="grid md:grid-cols-5 gap-6">
                        {/* Monte Carlo Results */}
                        <div className="md:col-span-3 glass-card p-8">
                            <h3 className="text-xl mb-6 text-[var(--vintage-white)]">Monte Carlo Simulation (10,000 Iterations)</h3>
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div className="text-center p-4 bg-white/5 rounded-lg">
                                    <span className="block text-[var(--dust-gray)] text-xs uppercase mb-2">Model Win Rate</span>
                                    <span className="text-4xl font-bold text-white">66.1%</span>
                                </div>
                                <div className="text-center p-4 bg-white/5 rounded-lg">
                                    <span className="block text-[var(--dust-gray)] text-xs uppercase mb-2">P-Value</span>
                                    <span className="text-4xl font-bold text-green-500">0.0104</span>
                                </div>
                            </div>
                            <p className="text-sm text-[var(--dust-gray)] leading-relaxed italic">
                                "The null hypothesis—that model-selected trades perform no better than stochastic selection—is rejected at p &lt; 0.05. The meta-filter successfully converted a suboptimal baseline signal into a statistically significant alpha."
                            </p>
                        </div>

                        {/* Feature Importance */}
                        <div className="md:col-span-2 glass-card p-8 bg-[var(--spider-red)]/[0.03]">
                            <h3 className="text-xl mb-6 text-[var(--vintage-white)] border-b border-[var(--spider-red)]/30 pb-2 text-center">Gold Drivers</h3>
                            <div className="space-y-4">
                                {[
                                    { name: "Vol Efficiency", val: 19.63, sub: "Risk-adjusted momentum" },
                                    { name: "VIX Momentum", val: 13.30, sub: "Stress-regime persistence" },
                                    { name: "USD/INR Interaction", val: 9.80, sub: "Exchange rate exposure" },
                                    { name: "RSI Trend", val: 11.06, sub: "Overbought conviction" }
                                ].map((feat, i) => (
                                    <div key={i} className="group">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-white font-bold">{feat.name}</span>
                                            <span className="text-[var(--spider-red)]">{feat.val} Gain</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[var(--spider-red)] group-hover:bg-white transition-colors duration-500"
                                                style={{ width: `${(feat.val / 20) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-[var(--dust-gray)] mt-1 block">{feat.sub}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Data Engineering Section */}
                <section id="data-engineering" className="max-w-5xl mx-auto mb-20 pb-16">
                    <h2 className="newspaper-headline text-3xl my-8 animate-slide-right">Data Engineering</h2>
                    <div className="glass-card p-8">
                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-xl mb-6 text-[var(--vintage-white)]">Asset Configuration</h3>
                                <p className="text-sm text-[var(--dust-gray)] mb-6 leading-relaxed">
                                    To balance the stationarity-memory trade-off, METR applies asset-specific differentiation (d) and profit-taking multipliers (k). This ensures each model is tuned to its instrument's unique volatility signature.
                                </p>
                                <div className="overflow-hidden rounded-lg border border-[var(--spider-red)]/20 shadow-lg">
                                    <table className="w-full text-left font-mono text-xs">
                                        <thead className="bg-white/5 text-white/50 uppercase tracking-widest border-b border-[var(--spider-red)]/20">
                                            <tr>
                                                <th className="p-3">Asset</th>
                                                <th className="p-3 text-center">Diff (d)</th>
                                                <th className="p-3 text-center">Barrier (k)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            <tr className="hover:bg-[var(--spider-red)]/5 transition-colors">
                                                <td className="p-3 text-white font-bold">GOLDBEES</td>
                                                <td className="p-3 text-center text-[var(--spider-red)]">0.50</td>
                                                <td className="p-3 text-center text-[var(--spider-red)]">1.25</td>
                                            </tr>
                                            <tr className="hover:bg-[var(--spider-red)]/5 transition-colors">
                                                <td className="p-3 text-white font-bold">NIFTY 50</td>
                                                <td className="p-3 text-center text-[var(--spider-red)]">0.45</td>
                                                <td className="p-3 text-center text-[var(--spider-red)]">1.50</td>
                                            </tr>
                                            <tr className="hover:bg-[var(--spider-red)]/5 transition-colors">
                                                <td className="p-3 text-white font-bold">USD / INR</td>
                                                <td className="p-3 text-center text-[var(--spider-red)]">0.30</td>
                                                <td className="p-3 text-center text-[var(--spider-red)]">1.50</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 p-3 bg-white/5 rounded text-[10px] text-[var(--dust-gray)] text-center uppercase tracking-widest">
                                    Horizon: T = 5 Days
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl mb-6 text-[var(--vintage-white)]">Cross-Asset Interactors</h3>
                                <ul className="space-y-4">
                                    <li className="flex gap-4 items-start">
                                        <div className="w-1.5 h-1.5 bg-[var(--spider-red)] rounded-full mt-1.5 shrink-0" />
                                        <p className="text-sm text-[var(--dust-gray)]">
                                            <strong className="text-white block">Usdinr_Stress_Filter</strong>
                                            Identifies when Indian equity stress (rising vol) aligns with global risk-off flight.
                                        </p>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="w-1.5 h-1.5 bg-[var(--spider-red)] rounded-full mt-1.5 shrink-0" />
                                        <p className="text-sm text-[var(--dust-gray)]">
                                            <strong className="text-white block">VIX_Relative_Regime</strong>
                                            Normalizes current implied volatility against its monthly trailing average to detect pricing shocks.
                                        </p>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="w-1.5 h-1.5 bg-[var(--spider-red)] rounded-full mt-1.5 shrink-0" />
                                        <p className="text-sm text-[var(--dust-gray)]">
                                            <strong className="text-white block">Usdinr_Vol_Ratio</strong>
                                            Analyzes the relative volatility of the currency pair to identify macro stress regimes.
                                        </p>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <div className="w-1.5 h-1.5 bg-[var(--spider-red)] rounded-full mt-1.5 shrink-0" />
                                        <p className="text-sm text-[var(--dust-gray)]">
                                            <strong className="text-white block">Momentum_Align</strong>
                                            Identifies synchronized momentum signals across primary and secondary asset classes.
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
