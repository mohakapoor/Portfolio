'use client';
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

export default function IntrusionDetectionProjectPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxVisible, setLightboxVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [imageTransition, setImageTransition] = useState<'none' | 'left' | 'right'>('none');
    const [selectedAttackType, setSelectedAttackType] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    interface PredictionResult {
        prediction?: number;
        row_index?: number;
        error?: string;
    }

    const [results, setResults] = useState<Record<string, PredictionResult> | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSystemHealthy, setIsSystemHealthy] = useState<boolean>(true);

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const res = await fetch('/api/intrusion-detection');
                const data = await res.json();
                if (data.status !== 'healthy') {
                    setIsSystemHealthy(false);
                }
            } catch {
                setIsSystemHealthy(false);
            }
        };
        checkHealth();
    }, []);

    const handlePredict = async () => {
        if (!selectedAttackType) {
            setError("SELECT ATTACK TYPE");
            return;
        }

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await fetch('/api/intrusion-detection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attackType: selectedAttackType }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Prediction failed');
            }

            setResults(data);
        } catch (err) {
            console.error(err);
            setError("PREDICTION FAILED");
        } finally {
            setLoading(false);
        }
    };


    const images = [
        {
            src: "/intrusion_detection_plots/logreg_test_cr.png",
            alt: "Logistic Regression Classification Report",
            title: "LogReg Results"
        },
        {
            src: "/intrusion_detection_plots/svm_test_cr.png",
            alt: "SVM Classification Report",
            title: "SVM Results"
        },
        {
            src: "/intrusion_detection_plots/lightgbm_test_cr.png",
            alt: "LightGBM Classification Report",
            title: "LightGBM Results"
        },
        {
            src: "/intrusion_detection_plots/ffnn_test_cr.png",
            alt: "FFNN Classification Report",
            title: "FFNN Results"
        }
    ];

    const openLightbox = (index: number) => {
        setSelectedImageIndex(index);
        setLightboxOpen(true);
        // Add a small delay to trigger the animation
        setTimeout(() => setLightboxVisible(true), 10);
    };

    const closeLightbox = useCallback(() => {
        setLightboxVisible(false);
        // Wait for animation to complete before hiding
        setTimeout(() => {
            setLightboxOpen(false);
            setSelectedImageIndex(0);
        }, 300);
    }, []);

    const nextImage = useCallback(() => {
        setImageTransition('right');
        setTimeout(() => {
            setSelectedImageIndex((prev) => (prev + 1) % images.length);
            setImageTransition('none');
        }, 500);
    }, [images.length]);

    const previousImage = useCallback(() => {
        setImageTransition('left');
        setTimeout(() => {
            setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
            setImageTransition('none');
        }, 500);
    }, [images.length]);

    // Keyboard navigation
    useEffect(() => {
        if (!lightboxOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                previousImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'Escape') {
                closeLightbox();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, previousImage, nextImage, closeLightbox]);

    return (
        <>
            <style jsx>{`
         .glass-card:hover {
           transform: none !important;
           scale: none !important;
         }
         
         /* Mobile-first transitions - images slide down on mobile */
         @media (max-width: 767px) {
           .lightbox-image-transition-left {
             transform: translateY(-150%) scale(0.95) !important;
           }
           .lightbox-image-transition-right {
             transform: translateY(150%) scale(0.95) !important;
           }
         }
         
         /* Desktop transitions - images slide left/right on desktop */
         @media (min-width: 768px) {
           .lightbox-image-transition-left {
             transform: translateX(-150%) scale(0.95) !important;
           }
           .lightbox-image-transition-right {
             transform: translateX(150%) scale(0.95) !important;
           }
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
                        <a href="#project-details" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Project Details</a>
                        <a href="#technical-architecture" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Technical Architecture</a>
                        <a href="#performance-results" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Performance & Results</a>
                        <a href="#dataset-training" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Dataset & Training</a>
                        <a href="#live-demo" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Live Demo</a>
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
                            Intrusion Detection
                        </h1>
                        <p className="text-xl text-[var(--dust-gray)] max-w-3xl mx-auto">
                            Modern networks face sophisticated threats that evade traditional signatures. This project leverages advanced machine learning to detect anomalies in complex network traffic flows.
                        </p>
                    </header>
                </section>

                {/* Project Details Section */}
                <section id="project-details" className="max-w-5xl mx-auto mb-12">
                    <h2 className="newspaper-headline text-3xl my-8 animate-slide-right">Project Details</h2>
                    <div className="glass-card p-5">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl mb-4 text-[var(--vintage-white)]">About the Project</h3>
                                <p className="text-[var(--dust-gray)] mb-4 leading-relaxed">
                                    With the rapid digitalization of services, modern networks have become highly dynamic, expanding the attack surface for cyber threats. Anomalies often disguise themselves within normal traffic, making them invisible to traditional rule-based systems.
                                    <br /><br />
                                    This project explores a structured machine-learning workflow to identify these anomalies. By leveraging the CICIDS-2017 benchmark dataset, we compare classical models (Logistic Regression, SVM) against advanced gradient boosting (LightGBM) and deep learning (Feedforward Neural Networks) to build a robust intrusion detection system.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl mb-4 text-[var(--vintage-white)]">Tech Stack</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Python', 'Pandas & NumPy', 'Scikit-learn', 'RAPIDS cuML', 'LightGBM', 'PyTorch', 'CICIDS-2017'].map((tag) => (
                                        <span key={tag} className="px-3 py-1 text-sm bg-[var(--spider-red)]/20 text-[var(--spider-red)] border border-[var(--spider-red)]/40 rounded-full font-mono">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-6">
                                    <a
                                        href="https://github.com/mohakapoor/IntrusionDetection"
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="spider-noir-button px-6 py-3 border-2 text-lg rounded-lg inline-block"
                                    >
                                        View Source Code
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section >

                {/* Live Demo Section */}
                < section id="live-demo" className="max-w-5xl mx-auto mb-12" >
                    <h2 className="newspaper-headline text-3xl mb-8 animate-slide-left">Live Demo</h2>
                    <div className="glass-card p-[10px] relative overflow-hidden">
                        {/* Offline Overlay */}
                        {!isSystemHealthy && (
                            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center border border-[var(--spider-red)]/50 rounded-lg">
                                <span className="text-4xl mb-4">⚠️</span>
                                <h3 className="text-5xl font-bold text-[var(--spider-red)] tracking-widest uppercase mb-2">System Offline</h3>
                                <p className="text-[var(--dust-gray)] font-mono text-lg max-w-3xl text-center px-4">
                                    This is a self hosted system and is not available 24/7. Please contact me on <a href="mailto:contact.mohakapoor@gmail.com" className="text-[var(--spider-red)] hover:underline">contact.mohakapoor@gmail.com</a> if you want a demo.
                                </p>
                            </div>
                        )}
                        {/* Demo Content */}
                        {/* Demo Content */}
                        <div className="w-full min-h-[400px] grid grid-cols-1 md:grid-cols-4 gap-6 p-4">

                            {/* Column 1: Attack Type Input Buttons */}
                            <div className="flex flex-col gap-3 justify-center md:col-span-1">
                                <h3 className="text-[var(--dust-white)] text-base mb-2 uppercase tracking-wider text-center">Attack Type</h3>
                                {['BENIGN', 'Bot', 'Brute Force', 'DDoS', 'DoS', 'Port Scan', 'Web Attack'].map((type, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setSelectedAttackType(prev => prev === type ? null : type);
                                            setError(null);
                                        }}
                                        className={`spider-noir-button px-4 py-2 border rounded text-sm text-center transition-all duration-200 ${selectedAttackType === type
                                            ? '!bg-[var(--spider-red)] !border-[var(--spider-red)] !text-white !shadow-[0_0_15px_rgba(204,41,54,0.6)]'
                                            : 'border-[var(--spider-red)]/50 hover:border-[var(--spider-red)] hover:shadow-[0_0_10px_rgba(204,41,54,0.2)]'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {/* Column 2: Predict Button */}
                            <div className="flex flex-col items-center justify-center md:col-span-1 relative">
                                <button
                                    onClick={handlePredict}
                                    disabled={loading}
                                    className={`spider-noir-button px-8 py-8 rounded-xl border-2 border-[var(--spider-red)] text-xl font-bold transition-all duration-300 shadow-[0_0_30px_rgba(204,41,54,0.15)] ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 hover:shadow-[0_0_50px_rgba(204,41,54,0.4)]'
                                        }`}
                                >
                                    {loading ? (
                                        <span className="inline-block w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                                    ) : 'PREDICT'}
                                </button>
                                {error && (
                                    <div className="absolute -bottom-2 w-60 text-center animate-pulse z-20">
                                        <p className="text-[var(--spider-red)] text-xs font-mono font-bold tracking-widest bg-black/90 px-2 py-1 border border-[var(--spider-red)] rounded shadow-[0_0_10px_rgba(204,41,54,0.3)]">
                                            ⚠ {error}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Column 3: Model Cards */}
                            <div className="flex flex-col gap-4 h-full md:col-span-2">
                                <h3 className="text-[var(--dust-white)] text-base mb-2 uppercase tracking-wider text-center">Models</h3>
                                <div className="flex flex-col gap-4 flex-1">
                                    {['logreg', 'lightgbm', 'ffnn'].map((model, i) => {
                                        const result = results?.[model];
                                        const prediction = result?.prediction;
                                        const rowIndex = result?.row_index;

                                        let predictionText = '...';
                                        let isMatch = false;

                                        if (result && !result.error && prediction !== undefined) {
                                            if (model === 'logreg') {
                                                predictionText = prediction === 0 ? 'BENIGN' : 'Attack';
                                                // LogReg Match Logic: Input 'BENIGN' -> 0, Input *Attack* -> 1
                                                isMatch = (selectedAttackType === 'BENIGN' && prediction === 0) ||
                                                    (selectedAttackType !== 'BENIGN' && prediction === 1);
                                            } else {
                                                const types = ['BENIGN', 'Bot', 'Brute Force', 'DDoS', 'DoS', 'Port Scan', 'Web Attack'];
                                                predictionText = types[prediction] || 'Unknown';
                                                isMatch = predictionText === selectedAttackType;
                                            }
                                        }

                                        // Dynamic Border & Shadow Class
                                        let borderClass = 'border-[var(--spider-red)]/30 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]';
                                        if (results && !result?.error) {
                                            borderClass = isMatch
                                                ? '!border-green-500/30 !shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                                                : '!border-[var(--spider-red)]/30 !shadow-[0_0_20px_rgba(204,41,54,0.2)]';
                                        }

                                        return (
                                            <div
                                                key={i}
                                                className={`glass-card flex-1 flex flex-col justify-center p-4 border rounded-lg text-[var(--vintage-white)] transition-all duration-500 relative overflow-hidden ${borderClass} ${loading ? 'animate-pulse opacity-50' : 'opacity-100'
                                                    }`}
                                            >
                                                {/* Top Row: Model Name (Left) and Prediction (Right) */}
                                                <div className="flex justify-between items-center w-full">
                                                    <span className="text-sm text-white font-bold uppercase tracking-wider">
                                                        {model === 'logreg' ? 'Logistic Regression' : model === 'lightgbm' ? 'LightGBM' : 'FFNN'}
                                                    </span>
                                                    {result?.error ? (
                                                        <span className="text-[var(--spider-red)] text-sm font-bold">Error</span>
                                                    ) : (
                                                        <span className={`text-lg font-mono font-bold ${isMatch ? 'text-green-500' : 'text-[var(--spider-red)]'}`}>
                                                            {results ? predictionText : ''}
                                                        </span>
                                                    )}
                                                </div>

                                                {!results && !loading && (
                                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                                                        <span className="text-4xl font-bold uppercase tracking-widest text-[var(--spider-red)] rotate-12">
                                                            Ready
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>
                    </div>
                </section >

                {/* Technical Architecture Section */}
                < section id="technical-architecture" className="max-w-5xl mx-auto mb-12" >
                    <h2 className="newspaper-headline text-3xl my-8 animate-slide-left">Technical Architecture</h2>
                    <div className="glass-card p-5">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <div className="space-y-4">
                                    {/* Classical Models Sub-card */}
                                    <div className="bg-[var(--newsprint-white)]/5 p-4 rounded-lg border border-[var(--spider-red)]/20">
                                        <h4 className="text-[var(--vintage-white)] font-bold mb-2 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                                            Classical & Hybrid
                                        </h4>
                                        <ul className="space-y-2 text-sm text-[var(--dust-gray)]">
                                            <li><strong className="text-white">Logistic Regression (cuML):</strong> GPU-accelerated baseline w/ L2 reg.</li>
                                            <li><strong className="text-white">SVM (cuML):</strong> Linear kernel for high-dimensional separation.</li>
                                            <li><strong className="text-white">LightGBM (GPU):</strong> Gradient boosting w/ leaf-wise growth.</li>
                                        </ul>
                                    </div>

                                    {/* Deep Learning Sub-card */}
                                    <div className="bg-[var(--newsprint-white)]/5 p-4 rounded-lg border border-[var(--spider-red)]/20">
                                        <h4 className="text-[var(--vintage-white)] font-bold mb-2 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                                            Deep Learning
                                        </h4>
                                        <p className="text-sm text-[var(--dust-gray)] mb-2">
                                            <strong className="text-white">Feedforward Neural Network (PyTorch)</strong>
                                        </p>
                                        <div className="text-xs text-[var(--dust-gray)] font-mono bg-black/30 p-2 rounded">
                                            Input → Dense(128) → BN → ReLU → Dropout(0.2) → Dense(64) → Softmax
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl mb-4 text-[var(--vintage-white)] border-b border-[var(--spider-red)]/30 pb-2">Training Pipeline</h3>
                                <div className="space-y-4">
                                    {[
                                        { title: "Time-Aware Splitting", desc: "Mon–Thu (Train) / Fri (Test) to simulate real-world deployment." },
                                        { title: "Preprocessing", desc: "Median imputation, Standard Scaling, Incremental PCA (~99% var)." },
                                        { title: "Imbalance Handling", desc: "Consolidated rare attacks & class-weighted loss functions." },
                                        { title: "Optimization", desc: "RandomizedSearchCV (LightGBM) & Grid Search (SVM) on Macro-F1." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-3 items-start group">
                                            <div className="mt-1.5 w-1.5 h-1.5 bg-[var(--spider-red)]/50 group-hover:bg-[var(--spider-red)] transform rotate-45 transition-colors"></div>
                                            <div>
                                                <strong className="text-[var(--vintage-white)] block text-sm mb-0.5">{item.title}</strong>
                                                <p className="text-[var(--dust-gray)] text-sm leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section >

                {/* Performance & Results Section */}
                <section id="performance-results" className="max-w-5xl mx-auto mb-12">
                    <h2 className="newspaper-headline text-3xl mb-8 animate-slide-right">Performance Metrics</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* LightGBM Card */}
                        <div className="glass-card p-6 border-t-4 border-green-500">
                            <h3 className="text-2xl font-bold text-white mb-1">LightGBM</h3>
                            <p className="text-sm text-green-400 font-mono mb-4 text-center">BEST MULTICLASS</p>
                            <div className="text-center space-y-2">
                                <div className="text-5xl font-bold text-white">~99%</div>
                                <div className="text-[var(--dust-gray)] text-sm uppercase tracking-widest">Accuracy</div>
                            </div>
                            <p className="mt-4 text-[var(--dust-gray)] text-sm text-center">
                                Outperformed all models in multiclass detection with exceptional precision across major attack types.
                            </p>
                        </div>

                        {/* SVM Card */}
                        <div className="glass-card p-6 border-t-4 border-blue-500">
                            <h3 className="text-2xl font-bold text-white mb-1">SVM</h3>
                            <p className="text-sm text-blue-400 font-mono mb-4 text-center">BEST BINARY</p>
                            <div className="text-center space-y-2">
                                <div className="text-5xl font-bold text-white">96.7%</div>
                                <div className="text-[var(--dust-gray)] text-sm uppercase tracking-widest">Accuracy</div>
                            </div>
                            <p className="mt-4 text-[var(--dust-gray)] text-sm text-center">
                                Superior margin-based separation for binary (Attack vs. Benign) classification.
                            </p>
                        </div>

                        {/* FFNN Card */}
                        <div className="glass-card p-6 border-t-4 border-purple-500">
                            <h3 className="text-2xl font-bold text-white mb-1">FFNN</h3>
                            <p className="text-sm text-purple-400 font-mono mb-4 text-center">DEEP LEARNING</p>
                            <div className="text-center space-y-2">
                                <div className="text-5xl font-bold text-white">~98%</div>
                                <div className="text-[var(--dust-gray)] text-sm uppercase tracking-widest">Accuracy</div>
                            </div>
                            <p className="mt-4 text-[var(--dust-gray)] text-sm text-center">
                                Strong baseline for neural approaches, competitive with gradient boosting.
                            </p>
                        </div>

                        {/* Logistic Regression Card */}
                        <div className="glass-card p-6 border-t-4 border-yellow-500">
                            <h3 className="text-2xl font-bold text-white mb-1">Logistic Regression</h3>
                            <p className="text-sm text-yellow-500 font-mono mb-4 text-center">BASELINE</p>
                            <div className="text-center space-y-2">
                                <div className="text-5xl font-bold text-white">~93%</div>
                                <div className="text-[var(--dust-gray)] text-sm uppercase tracking-widest">Accuracy</div>
                            </div>
                            <p className="mt-4 text-[var(--dust-gray)] text-sm text-center">
                                Effective linear baseline, demonstrating the value of model complexity.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Gallery Section */}
                <section id="gallery" className="max-w-5xl mx-auto mb-12">
                    <h2 className="newspaper-headline text-3xl mb-8 animate-slide-left">Classification Reports</h2>
                    <div className="glass-card p-6">
                        <p className="text-[var(--dust-gray)] mb-6 max-w-3xl">
                            Detailed performance breakdowns for each model, showing precision, recall, and F1-scores across all attack classes.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className="relative group cursor-pointer overflow-hidden rounded-lg border border-[var(--spider-red)]/20 hover:border-[var(--spider-red)] transition-all duration-300"
                                    onClick={() => openLightbox(index)}
                                >
                                    <div className="aspect-square bg-black/40 flex items-center justify-center overflow-hidden">
                                        {/* Using img tag for simplicity in grid, Next.js Image would be better but requires size knowledge */}
                                        <img
                                            src={img.src}
                                            alt={img.alt}
                                            className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                        />
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 bg-black/80 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <p className="text-xs text-[var(--vintage-white)] text-center truncate">{img.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Dataset & Training Section */}
                <section id="dataset-training" className="max-w-5xl mx-auto mb-12">
                    <h2 className="newspaper-headline text-3xl my-8 animate-slide-left">Dataset & Training</h2>
                    <div className="glass-card p-5">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="flex flex-col h-full">
                                <h3 className="text-xl mb-4 text-[var(--vintage-white)]">Dataset Overview</h3>
                                <div className="flex flex-col gap-4 flex-1">
                                    <div className="p-6 rounded-lg border border-[var(--spider-red)]/20 flex-1 flex flex-col justify-center">
                                        <h4 className="text-[var(--vintage-white)] font-bold mb-2 text-lg">Source & Scale</h4>
                                        <p className="text-[var(--dust-gray)] text-base leading-relaxed">
                                            Leveraging the <strong>CICIDS-2017</strong> benchmark from the Canadian Institute for Cybersecurity.
                                            Contains <strong>2.8M+ network flows</strong> with ~80 high-dimensional features.
                                        </p>
                                    </div>
                                    <div className="p-6 rounded-lg border border-[var(--spider-red)]/20 flex-1 flex flex-col justify-center">
                                        <h4 className="text-[var(--vintage-white)] font-bold mb-2 text-lg">Time-Aware Partitioning</h4>
                                        <p className="text-[var(--dust-gray)] text-base leading-relaxed">
                                            To prevent look-ahead bias, data is split by time rather than random shuffling:
                                            <br />
                                            <span className="text-[var(--spider-red)] font-mono text-sm">Mon-Thu (Train)</span> vs <span className="text-[var(--spider-red)] font-mono text-sm">Fri (Test)</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl mb-4 text-[var(--vintage-white)]">Training Pipeline</h3>
                                <ul className="space-y-3">
                                    {[
                                        { title: "Noise Reduction", desc: "Removed constant/near-zero variance features and duplicate columns." },
                                        { title: "Robust Imputation", desc: "Median-based strategy to handle missing values and infinity without outlier sensitivity." },
                                        { title: "Feature Extraction", desc: "Incremental PCA reduced dimensionality while retaining 99% of total variance." },
                                        { title: "Class Downsampling", desc: "Strategically undersampled majority classes to reduce training bias." },
                                        { title: "Class Balancing", desc: "Applied class weights to penalize misclassification of rare attacks (e.g., Bot, Web Attack)." }
                                    ].map((step, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-[var(--dust-gray)]">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--spider-red)]/20 text-[var(--spider-red)] flex items-center justify-center font-mono text-xs border border-[var(--spider-red)]/40">
                                                {i + 1}
                                            </span>
                                            <span>
                                                <strong className="text-[var(--vintage-white)] block">{step.title}</strong>
                                                {step.desc}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Lightbox */}
            {
                lightboxOpen && (
                    <div
                        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-all duration-500 ease-out ${lightboxVisible ? 'opacity-100' : 'opacity-0'
                            }`}
                        onClick={closeLightbox}
                    >
                        {/* Left Navigation Button - Outside Lightbox */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                previousImage();
                            }}
                            className="absolute left-2 md:left-8 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--spider-red)]/80 text-[var(--vintage-white)] hover:bg-[var(--spider-red)] transition-all duration-200 shadow-lg hover:scale-110 flex items-center justify-center text-lg font-bold z-10 animate-in slide-in-from-left-4 duration-300 delay-100"
                            aria-label="Previous image"
                        >
                            ←
                        </button>

                        {/* Right Navigation Button - Outside Lightbox */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                nextImage();
                            }}
                            className="absolute right-2 md:right-8 top-1/2 transform -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--spider-red)]/80 text-[var(--vintage-white)] hover:bg-[var(--spider-red)] transition-all duration-200 shadow-lg hover:scale-110 flex items-center justify-center text-lg font-bold z-10 animate-in slide-in-from-right-4 duration-300 delay-100"
                            aria-label="Next image"
                        >
                            →
                        </button>

                        {/* Close Button - Outside Lightbox */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                closeLightbox();
                            }}
                            className="absolute top-2 md:top-8 right-2 md:right-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-[var(--spider-red)]/80 text-[var(--vintage-white)] hover:bg-[var(--spider-red)] transition-all duration-200 shadow-lg hover:scale-110 flex items-center justify-center text-lg font-bold z-10 animate-in slide-in-from-top-4 duration-300 delay-100"
                            aria-label="Close lightbox"
                        >
                            ✕
                        </button>

                        <div
                            className={`relative max-w-6xl max-h-[90vh] bg-[var(--newsprint-gray)] rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden transition-all duration-500 ease-out transform ${lightboxVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                                }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Top Side (Mobile) / Left Side (Desktop) - Image */}
                            <div className="flex-1 flex items-center justify-center p-4 md:p-6 relative min-h-[40vh] md:min-h-0">
                                <img
                                    src={images[selectedImageIndex].src}
                                    alt={images[selectedImageIndex].alt}
                                    title={images[selectedImageIndex].title}
                                    className={`max-w-full max-h-full object-contain rounded-lg transition-all duration-500 ease-out transform ${lightboxVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                                        } ${imageTransition === 'left' ? 'lightbox-image-transition-left opacity-0 scale-95' :
                                            imageTransition === 'right' ? 'lightbox-image-transition-right opacity-0 scale-95' :
                                                'opacity-100 scale-100'
                                        }`}
                                />
                            </div>

                            {/* Bottom Side (Mobile) / Right Side (Desktop) - Description Panel */}
                            <div
                                className={`w-full md:w-80 bg-[var(--newsprint-gray)] border-t md:border-t-0 md:border-l border-[var(--spider-red)]/20 p-4 md:p-6 flex flex-col transition-all duration-500 ease-out transform ${lightboxVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                                    }`}
                            >
                                {/* Header with Title */}
                                <div className="mb-4 md:mb-6">
                                    <h3
                                        className={`text-xl md:text-2xl font-bold text-[var(--vintage-white)] newspaper-headline transition-all duration-500 ease-out transform ${lightboxVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                                            } ${imageTransition !== 'none' ? 'opacity-0 scale-90 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
                                            }`}
                                    >
                                        {images[selectedImageIndex].title}
                                    </h3>
                                </div>

                                {/* Description Content */}
                                <div
                                    className={`flex-1 transition-all duration-500 ease-out transform ${imageTransition !== 'none' ? 'opacity-0 translate-y-6 scale-95' : 'opacity-100 translate-y-0 scale-100'
                                        }`}
                                >
                                    {/* Image description placeholder */}
                                </div>

                                {/* Footer */}
                                <div className="mt-4 md:mt-6 pt-4 border-t border-[var(--spider-red)]/20">
                                    <p className="text-xs text-[var(--dust-gray)] text-center">
                                        Click outside or press ESC to close
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}
