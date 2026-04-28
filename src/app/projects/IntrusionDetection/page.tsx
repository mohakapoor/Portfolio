'use client';
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";

export default function IntrusionDetectionProjectPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxVisible, setLightboxVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [imageTransition, setImageTransition] = useState<'none' | 'left' | 'right'>('none');
    const [selectedAttackType, setSelectedAttackType] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    interface HybridPredictionResult {
        target_class: number;
        status: string;
        row_index: number;
        unsupervised: {
            autoencoder: number;
            isolation_forest: number;
        };
        supervised: {
            ffnn: number;
            lightgbm: number;
            logreg: number;
        };
        latencies?: {
            autoencoder: number;
            isolation_forest: number;
            ffnn: number;
            lightgbm: number;
            logreg: number;
        };
        total_detection_time?: number;
        error?: string;
    }

    const [results, setResults] = useState<HybridPredictionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSystemHealthy, setIsSystemHealthy] = useState<boolean>(true);
    const [showSupervised, setShowSupervised] = useState(false);

    // Stream States
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamResults, setStreamResults] = useState<any[]>([]);
    const [streamStats, setStreamStats] = useState({
        total: 0,
        anomalies: 0,
        unsupervisedAnomalies: 0
    });
    const [streamSummary, setStreamSummary] = useState<any | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const streamLogEndRef = useRef<HTMLDivElement>(null);
    const logContainerRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom of stream log
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [streamResults]);

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
        setShowSupervised(false);

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

            // Staggered animation: Wait 0.5s before showing supervised results
            setTimeout(() => {
                setShowSupervised(true);
            }, 500);

        } catch (err) {
            console.error(err);
            setError("PREDICTION FAILED");
        } finally {
            setLoading(false);
        }
    };

    const toggleStream = async () => {
        if (isStreaming) {
            if (wsRef.current) {
                wsRef.current.close();
            }
            setIsStreaming(false);
            setStreamSummary(null);
            return;
        }

        try {
            setStreamSummary(null);
            setStreamResults([]);
            setStreamStats({ total: 0, anomalies: 0, unsupervisedAnomalies: 0 });

            // Get token
            const configRes = await fetch('/api/intrusion-detection/config');
            const configData = await configRes.json();
            const token = configData.token;

            console.log('Inference : Auth Token Received?', !!token);

            if (!token) {
                console.error('Inference : Token retrieval failed', configData);
                throw new Error('Failed to retrieve authentication token');
            }

            console.log('Inference : Initiating WebSocket Handshake...');
            const ws = new WebSocket('wss://api.mohakapoor.in/intrusiondetection/ws/stream');
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('Inference : Connection Established. Sending sequence start in 200ms...');
                setIsStreaming(true);

                // Small delay to ensure handshake is fully settled on the server
                setTimeout(() => {
                    const startCommand = {
                        command: "start",
                        token: token.trim(),
                        start_at: 0
                    };
                    console.log('Inference : Sending Sequence Start command');
                    ws.send(JSON.stringify(startCommand));
                }, 200);
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('Received WS Message:', data);

                if (data.type === 'batch') {
                    const newBatch = data.data;
                    setStreamResults(prev => [...prev, ...newBatch].slice(-50)); // Keep last 50 for performance

                    const batchAnomalies = newBatch.filter((r: any) => r.status === 'Attack Detected').length;
                    const batchUnsupervised = newBatch.filter((r: any) =>
                        r.unsupervised && (r.unsupervised.autoencoder === 1 || r.unsupervised.isolation_forest === 1)
                    ).length;

                    setStreamStats(prev => ({
                        total: prev.total + newBatch.length,
                        anomalies: prev.anomalies + batchAnomalies,
                        unsupervisedAnomalies: prev.unsupervisedAnomalies + batchUnsupervised
                    }));
                } else if (data.type === 'summary') {
                    setStreamSummary(data.statistics);
                    setIsStreaming(false);
                }
            };

            ws.onerror = (e) => {
                console.error('WebSocket connection error:', e);
                setError('Inference server connection failed. Please verify if the server is online.');
                setIsStreaming(false);
            };

            ws.onclose = () => {
                setIsStreaming(false);
            };

        } catch (err: any) {
            setError(err.message);
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

    // Isometric Background for the Demo section
    const DemoBackground = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none opacity-20">
            <div
                className="absolute inset-0 w-[200%] h-[200%] -left-1/2 -top-1/2"
                style={{
                    transform: 'perspective(1200px) rotateX(55deg) rotateZ(-45deg)',
                    transformStyle: 'preserve-3d'
                }}
            >
                <svg width="100%" height="100%" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="isoGridDemo" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#isoGridDemo)" />
                </svg>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] via-transparent to-[#0d0d0d]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-transparent to-[#0d0d0d]" />
        </div>
    );

    const shimmerStyle = (
        <style jsx>{`
            @keyframes shimmer {
                100% {
                    transform: translateX(100%);
                }
            }
        `}</style>
    );

    return (
        <>
            {shimmerStyle}
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

            <main className="min-h-screen py-16">
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
                <div className="max-w-5xl mx-auto px-6 mb-8">
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-[var(--vintage-white)] hover:text-[var(--spider-red)] transition-colors duration-200"
                    >
                        <span>←</span>
                        <span>Back to Projects</span>
                    </Link>
                </div>

                {/* Project Header */}
                <section className="max-w-5xl mx-auto px-6 mb-12">
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
                <section id="project-details" className="max-w-5xl mx-auto px-6 mb-12">
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
                                        href="https://github.com/mohakapoor/Network_Anomaly_Detection_CICIDS2017"
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
                <section id="live-demo" className="w-full mb-20 relative border-y border-white/[0.05]">
                    <div className="max-w-5xl mx-auto px-6">
                        <h2 className="newspaper-headline text-3xl my-8 animate-slide-left">Live Inference </h2>
                    </div>

                    <div className="relative overflow-hidden bg-[#090909]/80 backdrop-blur-xl border-y border-white/[0.05] shadow-2xl">
                        <DemoBackground />

                        {/* HUD Header */}
                        <div className="relative z-10 border-b border-white/[0.05] px-6 py-3 flex items-center justify-between bg-black/40">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${isSystemHealthy ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-red-500'}`} />
                                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
                                        Status: {isSystemHealthy ? 'Operational' : 'Offline'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                {results?.total_detection_time !== undefined && (
                                    <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest animate-in fade-in slide-in-from-right duration-500">
                                        TOTAL LATENCY: <span className="text-[var(--spider-red)]">{(results.total_detection_time! * 1000).toFixed(3)}ms</span>
                                    </div>
                                )}
                                <div className="text-[9px] font-mono text-[var(--spider-red)] uppercase tracking-widest font-bold">
                                    {loading ? 'Processing_Packet_Batch...' : 'System_Ready'}
                                </div>
                            </div>
                        </div>

                        {/* Offline Overlay */}
                        {!isSystemHealthy && (
                            <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center border border-[var(--spider-red)]/30 rounded-lg">
                                <div className="p-8 border border-[var(--spider-red)]/20 bg-black/40 rounded-xl flex flex-col items-center max-w-md text-center">
                                    <span className="text-4xl mb-6">⚠️</span>
                                    <h3 className="newspaper-headline text-4xl text-[var(--spider-red)] mb-4">Connection Lost</h3>
                                    <p className="text-white/60 font-mono text-xs leading-relaxed mb-6">
                                        Inference server is currently self-hosted and periodically offline.
                                        For a live demonstration, please initiate contact.
                                    </p>
                                    <a href="mailto:contact.mohakapoor@gmail.com" className="spider-noir-button px-6 py-2 text-xs font-bold rounded-md">
                                        Request Access
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Demo Content */}
                        <div className="relative z-10 w-full min-h-[500px] grid grid-cols-1 md:grid-cols-12 gap-0">

                            {/* Column 1: Input Control Panel */}
                            <div className="p-8 md:col-span-3 border-r border-white/[0.05] bg-black/20">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-1.5 h-1.5 bg-[var(--spider-red)] rotate-45" />
                                    <h3 className="text-[11px] text-white/60 uppercase tracking-[0.1em] font-bold font-mono">Control_Panel</h3>
                                </div>

                                <div className="flex flex-col gap-2 mb-8">
                                    {['BENIGN', 'Bot', 'Brute Force', 'DDoS', 'DoS', 'Port Scan', 'Web Attack'].map((type, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setSelectedAttackType(prev => prev === type ? null : type);
                                                setError(null);
                                            }}
                                            className={`group relative flex items-center justify-between px-4 py-2.5 border rounded-md text-[10px] font-mono transition-all duration-300 ${selectedAttackType === type
                                                ? 'bg-[var(--spider-red)]/10 border-[var(--spider-red)] text-white shadow-[0_0_15px_rgba(204,41,54,0.1)]'
                                                : 'bg-white/[0.02] border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                                                }`}
                                        >
                                            <span className="tracking-widest uppercase">{type}</span>
                                            <div className={`w-1.5 h-1.5 rounded-full ${selectedAttackType === type ? 'bg-white animate-pulse' : 'bg-white/10 group-hover:bg-white/20'}`} />
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-auto">
                                    <button
                                        onClick={handlePredict}
                                        disabled={loading || !selectedAttackType}
                                        className={`group relative w-full px-6 py-4 rounded-md border text-[12px] font-bold font-mono uppercase tracking-[0.2em] transition-all duration-500 ${loading || !selectedAttackType
                                            ? 'border-white/5 text-white/10 cursor-not-allowed'
                                            : 'border-[var(--spider-red)] text-white hover:bg-[var(--spider-red)] hover:shadow-[0_0_30px_rgba(204,41,54,0.3)]'
                                            }`}
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                <span>Analyzing</span>
                                            </div>
                                        ) : (
                                            <span>Inject_Packet</span>
                                        )}
                                    </button>
                                    {error && (
                                        <div className="mt-3 text-center">
                                            <span className="text-[9px] font-mono text-[var(--spider-red)] uppercase tracking-tighter font-bold">
                                                !! CRITICAL_ERROR: {error} !!
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Column 2: Pipeline Visuals */}
                            <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-0 relative">

                                {/* Background Flow Lines */}
                                <div className="absolute inset-0 pointer-events-none opacity-10">
                                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--spider-red)] to-transparent" />
                                </div>

                                {/* Stage 1: Detection */}
                                <div className="p-8 border-r border-white/[0.05] flex flex-col">
                                    <div className="flex items-center gap-2 mb-8">
                                        <span className="text-[10px] font-mono text-white/20">01</span>
                                        <h3 className="text-[11px] text-white/60 uppercase tracking-[0.1em] font-bold font-mono">Anomaly_Detection_Core</h3>
                                    </div>

                                    <div className="flex flex-col gap-4 flex-1 justify-center max-w-sm mx-auto w-full">
                                        {[
                                            { id: 'autoencoder', name: 'Autoencoder' },
                                            { id: 'isolation_forest', name: 'Isolation Forest' }
                                        ].map((model, i) => {
                                            const val = results?.unsupervised?.[model.id as keyof typeof results.unsupervised];
                                            const isActive = results !== null;
                                            const isAnomaly = val === 1;
                                            const isCorrect = (selectedAttackType === 'BENIGN' && !isAnomaly) || (selectedAttackType !== 'BENIGN' && isAnomaly);

                                            return (
                                                <div
                                                    key={i}
                                                    className={`relative p-5 border rounded-lg transition-all duration-500 overflow-hidden ${isActive
                                                        ? isCorrect ? 'border-green-500/30 bg-green-500/[0.02]' : 'border-[var(--spider-red)]/30 bg-[var(--spider-red)]/[0.02]'
                                                        : 'border-white/5 bg-white/[0.01]'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center relative z-10">
                                                        <div>
                                                            <div className="text-xs text-white/80 font-bold uppercase tracking-wider">{model.name}</div>
                                                        </div>
                                                        {isActive && (
                                                            <div className={`px-3 py-1 rounded text-[10px] font-mono font-bold border ${isAnomaly ? 'border-[var(--spider-red)]/50 text-[var(--spider-red)] bg-[var(--spider-red)]/5' : 'border-green-500/50 text-green-500 bg-green-500/5'}`}>
                                                                {isAnomaly ? 'ANOMALY_FOUND' : 'CLEAN_PACKET'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mt-3 flex justify-between items-center relative z-10">
                                                        <div className="text-[9px] font-mono text-white/20 uppercase">Latency</div>
                                                        <div className="text-[10px] font-mono text-white/60">
                                                            {isActive && results?.latencies?.[model.id as keyof typeof results.latencies] !== undefined 
                                                                ? `${(results.latencies[model.id as keyof typeof results.latencies]! * 1000).toFixed(2)}ms` 
                                                                : '---'}
                                                        </div>
                                                    </div>
                                                    {/* Technical stats placeholder */}
                                                    <div className="mt-3 flex gap-4">
                                                        <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                                                            <div className={`h-full transition-all duration-1000 ${isActive ? 'w-[85%] bg-white/20' : 'w-0'}`} />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Stage 2: Classification */}
                                <div className="p-8 flex flex-col bg-black/10">
                                    <div className="flex items-center gap-2 mb-8">
                                        <span className="text-[10px] font-mono text-white/20">02</span>
                                        <h3 className="text-[11px] text-white/60 uppercase tracking-[0.1em] font-bold font-mono">Classifier_Matrix</h3>
                                    </div>

                                    <div className="flex flex-col gap-4 flex-1 justify-center max-w-sm mx-auto w-full">
                                        {[
                                            { id: 'logreg', name: 'LogRegression' },
                                            { id: 'lightgbm', name: 'LightGBM_Boost' },
                                            { id: 'ffnn', name: 'Neural_Network' }
                                        ].map((model, i) => {
                                            const prediction = results?.supervised?.[model.id as keyof typeof results.supervised];
                                            const isVisible = showSupervised && results;
                                            const ATTACK_TYPES = ['BENIGN', 'Bot', 'Brute Force', 'DDoS', 'DoS', 'Port Scan', 'Web Attack'];

                                            let predictionText = '...';
                                            let isMatch = false;

                                            if (prediction !== undefined) {
                                                if (model.id === 'logreg') {
                                                    // LogReg is Binary (0: Benign, 1: Attack)
                                                    predictionText = prediction === 0 ? 'BENIGN' : 'ATTACK';
                                                    isMatch = (selectedAttackType === 'BENIGN' && prediction === 0) || (selectedAttackType !== 'BENIGN' && prediction === 1);
                                                } else {
                                                    // Others are Multiclass
                                                    predictionText = ATTACK_TYPES[prediction] || 'UNKNOWN';
                                                    isMatch = predictionText === selectedAttackType;
                                                }
                                            }

                                            return (
                                                <div
                                                    key={i}
                                                    className={`relative p-5 border rounded-lg transition-all duration-700 overflow-hidden ${isVisible
                                                        ? isMatch ? 'border-green-500/40 bg-green-500/[0.03]' : 'border-[var(--spider-red)]/40 bg-[var(--spider-red)]/[0.03]'
                                                        : 'border-white/5 bg-white/[0.01]'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center relative z-10">
                                                        <div>
                                                            <div className="text-xs text-white/80 font-bold uppercase tracking-wider">{model.name}</div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            {isVisible && results?.latencies?.[model.id as keyof typeof results.latencies] !== undefined && (
                                                                <div className="text-[9px] font-mono text-white/30 uppercase tracking-tighter">
                                                                    LAT: {(results.latencies[model.id as keyof typeof results.latencies]! * 1000).toFixed(2)}ms
                                                                </div>
                                                            )}
                                                            {isVisible ? (
                                                            <div className={`px-3 py-1 rounded text-[10px] font-mono font-bold animate-in fade-in zoom-in duration-500 ${isMatch ? 'text-green-500 border-green-500/20 bg-green-500/10' : 'text-[var(--spider-red)] border-[var(--spider-red)]/20 bg-[var(--spider-red)]/10'}`}>
                                                                {predictionText.toUpperCase()}
                                                            </div>
                                                        ) : (
                                                            <div className="text-[8px] font-mono text-white/20 tracking-widest flex items-center gap-2">
                                                                {results && !showSupervised ? (
                                                                    <>
                                                                        <div className="w-1.5 h-1.5 bg-[var(--spider-red)] rounded-full animate-ping" />
                                                                        ANALYZING
                                                                    </>
                                                                ) : 'AWAITING_SIGNAL'}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                    {/* Shimmer pulse effect when scanning */}
                                                    {results && !showSupervised && (
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--spider-red)]/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Footer HUD line */}
                        <div className="relative z-10 border-t border-white/[0.05] px-6 py-2 flex items-center justify-between bg-black/20">
                            <div className="flex gap-4">
                                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">© 2026_MOHAK_KAPOOR</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sequential Dataset Stream Section */}
                <section id="dataset-stream" className="w-full mb-20 relative border-y border-white/[0.05]">
                    <div className="max-w-5xl mx-auto px-6">
                        <h2 className="newspaper-headline text-3xl my-8 animate-slide-right">Sequential Dataset Stream</h2>
                    </div>

                    <div className="relative overflow-hidden bg-[#090909]/80 backdrop-blur-xl border-y border-white/[0.05] shadow-2xl">
                        <DemoBackground />

                        {/* HUD Header */}
                        <div className="relative z-10 border-b border-white/[0.05] px-6 py-3 flex items-center justify-between bg-black/40">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-white/10'}`} />
                                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
                                        Stream_Status: {isStreaming ? 'Receiving_Data' : 'Standby'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${isSystemHealthy ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-red-500'}`} />
                                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">
                                        Server_Link: {isSystemHealthy ? 'Established' : 'Offline'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={toggleStream}
                                className={`text-[10px] font-mono px-4 py-1 rounded border transition-all duration-300 ${isStreaming
                                    ? 'border-[var(--spider-red)] text-[var(--spider-red)] hover:bg-[var(--spider-red)] hover:text-white'
                                    : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white'}`}
                            >
                                {isStreaming ? 'ABORT_STREAM' : 'INITIALIZE_SEQUENCE'}
                            </button>
                        </div>

                        {/* Offline Overlay for Sequential Stream */}
                        {!isSystemHealthy && (
                            <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center border border-[var(--spider-red)]/30">
                                <div className="p-8 border border-[var(--spider-red)]/20 bg-black/40 rounded-xl flex flex-col items-center max-w-md text-center">
                                    <span className="text-4xl mb-6">📡</span>
                                    <h3 className="newspaper-headline text-4xl text-[var(--spider-red)] mb-4">Signal Lost</h3>
                                    <p className="text-white/60 font-mono text-xs leading-relaxed mb-6">
                                        Inference server is currently self-hosted and periodically offline.
                                        The sequential stream requires a stable high-bandwidth link.
                                    </p>
                                    <a href="mailto:contact.mohakapoor@gmail.com" className="spider-noir-button px-6 py-2 text-xs font-bold rounded-md">
                                        Request Access
                                    </a>
                                </div>
                            </div>
                        )}

                        <div className="relative z-10 w-full min-h-[500px] grid grid-cols-1 md:grid-cols-12 gap-0">

                            {/* Column 1: Stream Stats */}
                            <div className="p-8 md:col-span-3 border-r border-white/[0.05] bg-black/20 flex flex-col gap-8">
                                <div>
                                    <h3 className="text-[10px] text-white/20 uppercase tracking-widest font-mono mb-4">Batch_Metrics</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="text-[9px] text-white/40 uppercase font-mono mb-1">Total_Packets</div>
                                            <div className="text-3xl font-bold font-mono text-white tracking-tighter">
                                                {streamStats.total.toLocaleString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[9px] text-white/40 uppercase font-mono mb-1">Threats_Detected</div>
                                            <div className="text-3xl font-bold font-mono text-[var(--spider-red)] tracking-tighter">
                                                {streamStats.anomalies.toLocaleString()}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[9px] text-white/40 uppercase font-mono mb-1">Anomaly_Rate</div>
                                            <div className="text-3xl font-bold font-mono text-white tracking-tighter">
                                                {streamStats.total > 0 ? ((streamStats.anomalies / streamStats.total) * 100).toFixed(2) : '0.00'}%
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto border-t border-white/5 pt-6">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="text-[9px] text-white/20 uppercase font-mono">Stream_Progress</div>
                                        <div className="text-[9px] text-white/40 font-mono">
                                            {Math.min((streamStats.total / 23324) * 100, 100).toFixed(1)}%
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[var(--spider-red)]/60 transition-all duration-500"
                                            style={{ width: `${Math.min((streamStats.total / 23324) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Column 2: Live Log Feed */}
                            <div className="md:col-span-9 bg-black/40 relative flex flex-col">
                                <div className="p-4 border-b border-white/5 bg-black/20 flex items-center justify-between">
                                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Inference_Log_v4.2</span>
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-white/5 rounded-full" />
                                        <div className="w-2 h-2 bg-white/5 rounded-full" />
                                        <div className="w-2 h-2 bg-white/5 rounded-full" />
                                    </div>
                                </div>
                                {streamSummary && (
                                    <div className="absolute inset-0 z-50 bg-[#090909]/95 backdrop-blur-md p-8 animate-in fade-in zoom-in duration-500 overflow-y-auto">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="w-1.5 h-6 bg-green-500" />
                                            <h3 className="text-xl text-white uppercase tracking-widest font-bold">Inference_Summary_Report</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                            <div className="p-4 border border-white/10 bg-white/[0.02] rounded-lg">
                                                <div className="text-[10px] text-white/40 uppercase mb-2">Final_Accuracy</div>
                                                <div className="text-4xl font-bold text-green-500 tracking-tighter">
                                                    {(streamSummary.accuracy * 100).toFixed(2)}%
                                                </div>
                                            </div>
                                            <div className="p-4 border border-white/10 bg-white/[0.02] rounded-lg">
                                                <div className="text-[10px] text-white/40 uppercase mb-2">Total_Processed</div>
                                                <div className="text-4xl font-bold text-white tracking-tighter">
                                                    {streamSummary.total_processed.toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="p-4 border border-white/10 bg-white/[0.02] rounded-lg">
                                                <div className="text-[10px] text-white/40 uppercase mb-2">Precision_Hit</div>
                                                <div className="text-4xl font-bold text-white tracking-tighter">
                                                    {streamSummary.correct_predictions.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <h4 className="text-[10px] text-white/40 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Class_Distribution (Actual)</h4>
                                                <div className="space-y-2">
                                                    {Object.entries(streamSummary.actual_counts).map(([cls, count]: [string, any]) => (
                                                        <div key={cls} className="flex items-center justify-between">
                                                            <span className="text-white/60">Class_{cls}</span>
                                                            <div className="flex items-center gap-4 flex-1 mx-4">
                                                                    <div className="h-1 bg-white/5 flex-1 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-white/20" style={{ width: `${(count / streamSummary.total_processed) * 100}%` }} />
                                                                    </div>
                                                            </div>
                                                            <span className="text-white font-mono">{count}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] text-white/40 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Model_Inference (Predicted)</h4>
                                                <div className="space-y-2">
                                                    {Object.entries(streamSummary.predicted_counts).map(([cls, count]: [string, any]) => (
                                                        <div key={cls} className="flex items-center justify-between">
                                                            <span className="text-white/60">Class_{cls}</span>
                                                            <div className="flex items-center gap-4 flex-1 mx-4">
                                                                    <div className="h-1 bg-white/5 flex-1 rounded-full overflow-hidden">
                                                                        <div className="h-full bg-[var(--spider-red)]/40" style={{ width: `${(count / streamSummary.total_processed) * 100}%` }} />
                                                                    </div>
                                                            </div>
                                                            <span className="text-white font-mono">{count}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-12 flex justify-center">
                                            <button
                                                onClick={() => setStreamSummary(null)}
                                                className="px-8 py-2 border border-white/20 text-white/60 hover:text-white hover:border-white transition-all uppercase text-[10px] tracking-widest font-mono"
                                            >
                                                Dismiss_Report
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div 
                                    ref={logContainerRef}
                                    className="flex-1 p-6 font-mono text-[11px] overflow-y-auto max-h-[450px] scrollbar-hide relative"
                                >
                                    {!isStreaming && streamResults.length === 0 && !streamSummary && (
                                        <div className="h-full flex items-center justify-center text-white/10 uppercase tracking-[0.3em] animate-pulse">
                                            Awaiting_Signal...
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        {streamResults.map((row, idx) => {
                                            const isAttack = row.status === 'Attack Detected';
                                            return (
                                                <div key={idx} className={`flex items-center gap-4 border-l-2 pl-4 py-4 transition-all duration-300 ${isAttack ? 'border-[var(--spider-red)] bg-[var(--spider-red)]/5' : 'border-green-500/20 bg-green-500/[0.02]'}`}>
                                                    <span className="text-white/20 w-16">[{row.row_index.toString().padStart(6, '0')}]</span>
                                                    <span className={`font-bold w-32 ${isAttack ? 'text-[var(--spider-red)]' : 'text-green-500/60'}`}>
                                                        {isAttack ? '!! THREAT !!' : 'OK_SECURE'}
                                                    </span>
                                                    <span className="text-white/40 flex-1 truncate">
                                                        SEQ_DATA_BATCH::{row.row_index} // ENCODING_UTF8 // {isAttack ? 'MITIGATION_ACTIVE' : 'MONITORING'}
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <span className={`text-[8px] px-1.5 border rounded ${row.unsupervised?.autoencoder === 1 ? 'border-[var(--spider-red)]/50 text-[var(--spider-red)]' : 'border-white/10 text-white/10'}`}>AE</span>
                                                        <span className={`text-[8px] px-1.5 border rounded ${row.supervised?.lightgbm !== 0 ? 'border-[var(--spider-red)]/50 text-[var(--spider-red)]' : 'border-white/10 text-white/10'}`}>LIGHTGBM</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={streamLogEndRef} />
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Footer HUD line */}
                        <div className="relative z-10 border-t border-white/[0.05] px-6 py-2 flex items-center justify-between bg-black/20">
                            <div className="flex gap-4">
                                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">DATASET_INDEX: {streamStats.total.toLocaleString()} / 23,324</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 bg-green-500 rounded-full animate-ping" />
                                    <span className="text-[8px] font-mono text-green-500/50 uppercase">Socket_Live</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Technical Architecture Section */}
                <section id="technical-architecture" className="max-w-5xl mx-auto px-6 mb-12">
                    <h2 className="newspaper-headline text-3xl my-8 animate-slide-left">Technical Architecture</h2>
                    <div className="glass-card p-5">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl mb-4 text-[var(--vintage-white)] border-b border-[var(--spider-red)]/30 pb-2">Model Architecture</h3>
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
                                                <strong className="text-[var(--vintage-white)] block text-base mb-0.5">{item.title}</strong>
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
                <section id="performance-results" className="max-w-5xl mx-auto px-6 mb-12">
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
                <section id="gallery" className="max-w-5xl mx-auto px-6 mb-12">
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
                <section id="dataset-training" className="max-w-5xl mx-auto px-6 mb-12">
                    <h2 className="newspaper-headline text-3xl my-8 animate-slide-left">Dataset & Training</h2>
                    <div className="glass-card p-5">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="flex flex-col h-full">
                                <h3 className="text-xl mb-4 text-[var(--vintage-white)]">Dataset Overview</h3>
                                <div className="flex flex-col gap-4 flex-1">
                                    <div className="p-6 rounded-lg border border-[var(--spider-red)]/20 flex-1 flex flex-col justify-center">
                                        <h4 className="text-[var(--vintage-white)] font-bold mb-2 text-base">Source & Scale</h4>
                                        <p className="text-[var(--dust-gray)] text-base leading-relaxed">
                                            Leveraging the <strong>CICIDS-2017</strong> benchmark from the Canadian Institute for Cybersecurity.
                                            Contains <strong>2.8M+ network flows</strong> with ~80 high-dimensional features.
                                        </p>
                                    </div>
                                    <div className="p-6 rounded-lg border border-[var(--spider-red)]/20 flex-1 flex flex-col justify-center">
                                        <h4 className="text-[var(--vintage-white)] font-bold mb-2 text-base">Time-Aware Partitioning</h4>
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
                                                <strong className="text-[var(--vintage-white)] block text-base">{step.title}</strong>
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
