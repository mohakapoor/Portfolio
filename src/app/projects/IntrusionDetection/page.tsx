'use client';
import Link from "next/link";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Line, Bar } from 'react-chartjs-2';
import { GALLERY_IMAGES, MODEL_METADATA } from './constants';
import { TechnicalIcons } from './Icons';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

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
            xgboost: number;
        };
        latencies?: {
            autoencoder: number;
            isolation_forest: number;
            ffnn: number;
            lightgbm: number;
            logreg: number;
            xgboost: number;
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
        unsupervisedAnomalies: 0,
        avgLatency: 0,
        peakLatency: 0
    });
    const [streamSummary, setStreamSummary] = useState<any | null>(null);
    const [streamView, setStreamView] = useState<'log' | 'analytics'>('analytics');
    const [latencyHistory, setLatencyHistory] = useState<number[]>([]);
    const [anomalyHistory, setAnomalyHistory] = useState<number[]>([]);
    const [attackDistribution, setAttackDistribution] = useState<Record<number, number>>({});
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
            setStreamStats({ 
                total: 0, 
                anomalies: 0, 
                unsupervisedAnomalies: 0,
                avgLatency: 0,
                peakLatency: 0
            });

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

                    // Update History for Charts
                    const batchLatencies = newBatch.map((r: any) => r.total_detection_time || 0);
                    const avgLatency = batchLatencies.reduce((a: number, b: number) => a + b, 0) / newBatch.length;
                    const maxLatency = Math.max(...batchLatencies);
                    
                    setLatencyHistory(prev => [...prev, avgLatency * 1000].slice(-30));
                    setAnomalyHistory(prev => [...prev, batchAnomalies].slice(-30));

                    setStreamStats(prev => {
                        const newTotal = prev.total + newBatch.length;
                        const newAvg = (prev.avgLatency * prev.total + avgLatency * 1000 * newBatch.length) / newTotal;
                        return {
                            total: newTotal,
                            anomalies: prev.anomalies + batchAnomalies,
                            unsupervisedAnomalies: prev.unsupervisedAnomalies + batchUnsupervised,
                            avgLatency: newAvg,
                            peakLatency: Math.max(prev.peakLatency, maxLatency * 1000)
                        };
                    });

                    // Update Attack Distribution
                    setAttackDistribution(prev => {
                        const next = { ...prev };
                        newBatch.forEach((r: any) => {
                            if (r.status === 'Attack Detected') {
                                // If ground truth target_class is 0, use the predicted class from the models
                                const predictedClass = r.target_class !== 0 ? r.target_class : (r.supervised?.xgboost || r.supervised?.lightgbm || 1);
                                if (predictedClass !== 0) {
                                    next[predictedClass] = (next[predictedClass] || 0) + 1;
                                }
                            }
                        });
                        return next;
                    });
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


    const images = GALLERY_IMAGES;

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
                                    {['Python', 'Pandas & NumPy', 'Scikit-learn', 'RAPIDS cuML', 'LightGBM', 'PyTorch', 'XGBoost','AutoEncoder','Isolation Forest','FastApi','WebSocket','CICIDS-2017'].map((tag) => (
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
                                            <span>RUN_TEST</span>
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
                                        <h2 className="text-[11px] text-white/60 uppercase tracking-[0.1em] font-bold font-mono">Anomaly Detection</h2>
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
                                        <h2 className="text-[11px] text-white/60 uppercase tracking-[0.1em] font-bold font-mono">Classifier</h2>
                                    </div>

                                    <div className="flex flex-col gap-4 flex-1 justify-center max-w-sm mx-auto w-full">
                                        {[
                                            { id: 'logreg', name: 'LogReg' },
                                            { id: 'lightgbm', name: 'LightGBM' },
                                            { id: 'xgboost', name: 'XGBoost' },
                                            { id: 'ffnn', name: 'FFNN' }
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
                        <h2 className="newspaper-headline text-3xl my-8 animate-slide-right">Sequential Inference Stream</h2>
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

                        <div className="relative z-10 w-full min-h-[650px] grid grid-cols-1 md:grid-cols-12 gap-0">

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
                                        
                                        <div className="pt-4 border-t border-white/5 space-y-4">
                                            <div>
                                                <div className="text-[9px] text-white/20 uppercase font-mono mb-1">Avg_Inference_Time</div>
                                                <div className="text-xl font-bold font-mono text-white/60">
                                                    {streamStats.avgLatency.toFixed(3)}ms
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[9px] text-white/20 uppercase font-mono mb-1">Peak_Inference_Spike</div>
                                                <div className="text-xl font-bold font-mono text-[var(--spider-red)]/60">
                                                    {streamStats.peakLatency.toFixed(3)}ms
                                                </div>
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
                                    <div className="flex items-center gap-4">
                                        <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Inference_Engine_v4.2</span>
                                        <div className="flex bg-white/5 p-0.5 rounded-md">
                                            <button
                                                onClick={() => setStreamView('analytics')}
                                                className={`px-3 py-1 text-[8px] font-mono uppercase rounded transition-all ${streamView === 'analytics' ? 'bg-[var(--spider-red)]/20 text-[var(--spider-red)]' : 'text-white/20 hover:text-white/40'}`}
                                            >
                                                Analytics
                                            </button>
                                            <button
                                                onClick={() => setStreamView('log')}
                                                className={`px-3 py-1 text-[8px] font-mono uppercase rounded transition-all ${streamView === 'log' ? 'bg-[var(--spider-red)]/20 text-[var(--spider-red)]' : 'text-white/20 hover:text-white/40'}`}
                                            >
                                                Live_Log
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-white/5 rounded-full" />
                                        <div className="w-2 h-2 bg-white/5 rounded-full" />
                                        <div className="w-2 h-2 bg-white/5 rounded-full" />
                                    </div>
                                </div>
                                
                                {streamView === 'analytics' && !streamSummary && (
                                    <div className="flex-1 p-6 flex flex-col gap-6 animate-in fade-in duration-500 overflow-hidden">
                                        {/* Latency Chart - 60% Height */}
                                        <div className="flex-[6] min-h-[280px] relative">
                                            <Line
                                                data={{
                                                    labels: Array.from({ length: latencyHistory.length }, (_, i) => i),
                                                    datasets: [
                                                        {
                                                            label: 'Avg Latency (ms)',
                                                            data: latencyHistory,
                                                            borderColor: 'rgba(204, 41, 54, 0.8)',
                                                            backgroundColor: 'rgba(204, 41, 54, 0.1)',
                                                            fill: true,
                                                            tension: 0.4,
                                                            pointRadius: 0,
                                                            borderWidth: 2,
                                                        }
                                                    ]
                                                }}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        legend: { display: false },
                                                        tooltip: {
                                                            backgroundColor: 'rgba(0,0,0,0.8)',
                                                            titleFont: { family: 'monospace', size: 10 },
                                                            bodyFont: { family: 'monospace', size: 10 },
                                                            displayColors: false
                                                        }
                                                    },
                                                    scales: {
                                                        x: { display: false },
                                                        y: {
                                                            grid: { color: 'rgba(255,255,255,0.05)' },
                                                            ticks: { color: 'rgba(255,255,255,0.2)', font: { size: 9, family: 'monospace' } }
                                                        }
                                                    },
                                                    animation: { duration: 0 }
                                                }}
                                            />
                                            <div className="absolute top-2 left-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-[var(--spider-red)] rounded-full animate-pulse" />
                                                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Real_Time_Latency_ms</span>
                                            </div>
                                        </div>
                                        
                                        {/* Attack Distribution - 40% Height */}
                                        <div className="flex-[4] border border-white/5 bg-white/[0.02] p-5 rounded-lg flex flex-col overflow-hidden">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="text-[10px] text-white/20 uppercase font-mono tracking-widest flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-[var(--spider-red)] rounded-full" />
                                                    Threat_Distribution_Log_Scale
                                                </div>
                                                <span className="text-[8px] font-mono text-white/10 uppercase">Type: Logarithmic_Analysis</span>
                                            </div>
                                            <div className="flex-1 min-h-0">
                                                <Bar
                                                    data={{
                                                        labels: ['Bot', 'BruteForce', 'DDoS', 'DoS', 'PortScan', 'WebAttack'],
                                                        datasets: [{
                                                            data: [1, 2, 3, 4, 5, 6].map(c => attackDistribution[c] || 0),
                                                            backgroundColor: 'rgba(204, 41, 54, 0.4)',
                                                            borderColor: 'rgba(204, 41, 54, 0.8)',
                                                            borderWidth: 1,
                                                            borderRadius: 2,
                                                            hoverBackgroundColor: 'rgba(204, 41, 54, 0.6)',
                                                        }]
                                                    }}
                                                    options={{
                                                        responsive: true,
                                                        maintainAspectRatio: false,
                                                        plugins: {
                                                            legend: { display: false },
                                                            tooltip: {
                                                                backgroundColor: 'rgba(0,0,0,0.8)',
                                                                titleFont: { family: 'monospace', size: 10 },
                                                                bodyFont: { family: 'monospace', size: 10 },
                                                                displayColors: false
                                                            }
                                                        },
                                                        scales: {
                                                            x: {
                                                                grid: { display: false },
                                                                ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 9, family: 'monospace' } }
                                                            },
                                                            y: {
                                                                type: 'logarithmic',
                                                                min: 0.1, // Set minimum to handle log(0) issues
                                                                grid: { color: 'rgba(255,255,255,0.05)' },
                                                                ticks: { 
                                                                    color: 'rgba(255,255,255,0.2)', 
                                                                    font: { size: 9, family: 'monospace' },
                                                                    callback: function(value: any) {
                                                                        return Number.isInteger(value) ? value : null;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                                    className={`flex-1 p-6 font-mono text-[11px] overflow-y-auto max-h-[450px] scrollbar-hide relative ${streamView !== 'log' && !streamSummary ? 'hidden' : ''}`}
                                >
                                    {streamView === 'log' && !isStreaming && streamResults.length === 0 && !streamSummary && (
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
                                            <li><strong className="text-white">Logistic Regression:</strong> Baseline w/ L2 regularization for linear separability.</li>
                                            <li><strong className="text-white">SVM:</strong> RBF/Linear kernels for high-dimensional attack isolation.</li>
                                            <li><strong className="text-white">LightGBM:</strong> Leaf-wise growth optimized for high speed.</li>
                                            <li><strong className="text-white">XGBoost:</strong> Level-wise tree growth (multiclass) w/ balanced weights.</li>
                                            <li><strong className="text-white">Isolation Forest:</strong> Unsupervised anomaly detection via random partitioning.</li>
                                        </ul>
                                    </div>

                                    {/* Deep Learning Sub-card */}
                                    <div className="bg-[var(--newsprint-white)]/5 p-4 rounded-lg border border-[var(--spider-red)]/20">
                                        <h4 className="text-[var(--vintage-white)] font-bold mb-2 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                                            Deep Learning
                                        </h4>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-[var(--dust-gray)] mb-2">
                                                    <strong className="text-white font-mono text-xs">ANN // FEEDFORWARD</strong>
                                                </p>
                                                <div className="text-[10px] text-[var(--dust-gray)] font-mono bg-black/30 p-2 rounded border border-white/5">
                                                    Input(69) → Dense(128) → BN → ReLU → Dropout(0.2) → Dense(64) → Softmax
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-[var(--dust-gray)] mb-2">
                                                    <strong className="text-white font-mono text-xs">DAE // DENOISING_AUTOENCODER</strong>
                                                </p>
                                                <div className="text-[10px] text-[var(--dust-gray)] font-mono bg-black/30 p-2 rounded border border-white/5">
                                                    Encoder(69→128→64→32) → Decoder(32→64→128→69) → Sigmoid
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl mb-4 text-[var(--vintage-white)] border-b border-[var(--spider-red)]/30 pb-2">Training Pipeline</h3>
                                <div className="space-y-4">
                                    {[
                                        { title: "Time-Aware Splitting", desc: "Mon–Thu (Train) / Fri (Test) to simulate real-world deployment." },
                                        { title: "Data Balancing", desc: "Random undersampling of benign class to 20% to handle extreme skew." },
                                        { title: "Feature Selection", desc: "Automated removal of 8 constant-value columns (zero variance)." },
                                        { title: "Preprocessing", desc: "Median imputation, Standard Scaling, Incremental PCA (~99% var)." },
                                        { title: "Attack Consolidation", desc: "Rare attacks (Heartbleed, etc.) grouped into high-level categories." },
                                        { title: "Optimization", desc: "RandomizedSearchCV (LightGBM) & Grid Search (SVM) on Macro-F1." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-3 items-start group">
                                            <div className="mt-1.5 w-1.5 h-1.5 bg-[var(--spider-red)]/50 group-hover:bg-[var(--spider-red)] transform rotate-45 transition-colors shadow-[0_0_5px_rgba(204,41,54,0.4)]"></div>
                                            <div>
                                                <strong className="text-[var(--vintage-white)] block text-base mb-0.5">{item.title}</strong>
                                                <p className="text-[var(--dust-gray)] text-sm leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Deployment & Acceleration Row */}
                        <div className="mt-10 pt-10 border-t border-white/10 grid md:grid-cols-2 gap-8">
                            <div className="bg-white/5 p-6 rounded-lg border border-[var(--spider-red)]/20">
                                <h4 className="text-[var(--vintage-white)] font-bold mb-4 flex items-center gap-2 text-xl">
                                    <span className="w-2.5 h-2.5 bg-[var(--spider-red)] rounded-full animate-pulse shadow-[0_0_8px_rgba(255,0,0,0.5)]"></span>
                                    Edge Deployment (Pi 5)
                                </h4>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="space-y-1">
                                        <span className="text-[11px] text-white/40 uppercase font-mono tracking-tighter">Hardware</span>
                                        <p className="text-base text-white font-bold italic">Raspberry Pi 5</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[11px] text-white/40 uppercase font-mono tracking-tighter">Architecture</span>
                                        <p className="text-base text-white font-bold italic">ARM64 / Cortex-A76</p>
                                    </div>
                                </div>
                                <p className="text-sm text-[var(--dust-gray)] leading-relaxed">
                                    Optimized for <strong className="text-white/80">edge and personal monitoring</strong>. Uses ONNX Runtime to maintain sub-millisecond inference on live packet streams.
                                </p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-lg border border-[var(--spider-red)]/20">
                                <h4 className="text-[var(--vintage-white)] font-bold mb-4 flex items-center gap-2 text-xl">
                                    <span className="w-2.5 h-2.5 bg-[var(--spider-red)] rounded-full animate-pulse shadow-[0_0_8px_rgba(255,0,0,0.5)]"></span>
                                    Live Inference Stack
                                </h4>
                                <ul className="space-y-4">
                                    <li className="flex gap-3 text-sm text-[var(--dust-gray)] items-start">
                                        <span className="text-[var(--spider-red)] font-bold text-base">»</span>
                                        <span><strong className="text-white/70">FastAPI:</strong> High-performance async backend for model serving.</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-[var(--dust-gray)] items-start">
                                        <span className="text-[var(--spider-red)] font-bold text-base">»</span>
                                        <span><strong className="text-white/70">WebSockets:</strong> Bi-directional stream for real-time packet telemetry.</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-[var(--dust-gray)] items-start">
                                        <span className="text-[var(--spider-red)] font-bold text-base">»</span>
                                        <span><strong className="text-white/70">Sequential Buffer:</strong> Sliding-window inference logic for packet chains.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section >

                {/* Unsupervised Anomaly Detection Section */}
                <section id="unsupervised-detection" className="max-w-5xl mx-auto px-6 mb-12">
                    <h2 className="newspaper-headline text-3xl my-8 animate-slide-right">Performance Metrics - Unsupervised</h2>
                    <div className="glass-card p-6">
                        <div className="grid md:grid-cols-2 gap-8 mb-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                     <div className="w-8 h-8 rounded bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                                         <TechnicalIcons.Autoencoder />
                                     </div>
                                     <h3 className="text-xl font-bold text-white uppercase tracking-tight">Denoising Autoencoder</h3>
                                </div>
                                <p className="text-sm text-[var(--dust-gray)] leading-relaxed">
                                    Trained exclusively on benign traffic to establish a "normalcy baseline." Detects novel, zero-day attacks by measuring reconstruction error—anomalous packets deviate from the learned latent representation.
                                </p>
                                <div className="bg-black/40 p-4 rounded border border-white/5 space-y-3">
                                    <div>
                                        <div className="text-[10px] text-white/40 uppercase font-mono mb-1">Architecture</div>
                                        <div className="text-xs font-mono text-blue-400">Encoder (69→128→64→32) / Decoder (32→64→128→69)</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-white/40 uppercase font-mono mb-1">Error Metric</div>
                                        <div className="text-xs font-mono text-white/80">0.5 × MSE + 0.5 × Max per-feature error</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-[10px] text-white/40 uppercase font-mono mb-1">ROC AUC</div>
                                            <div className="text-xl font-bold text-white">0.7801</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-white/40 uppercase font-mono mb-1">Output Layer</div>
                                            <div className="text-sm font-mono text-white/60">Sigmoid</div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-[var(--dust-gray)] italic">
                                    Preferred detector for subtle attacks like Bot traffic (73.5% recall).
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                     <div className="w-8 h-8 rounded bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                                         <TechnicalIcons.IsolationForest />
                                     </div>
                                     <h3 className="text-xl font-bold text-white uppercase tracking-tight">Isolation Forest</h3>
                                </div>
                                <p className="text-sm text-[var(--dust-gray)] leading-relaxed">
                                    Detects anomalies by isolating samples via random recursive splits. Anomalies are isolated significantly faster (shorter path lengths) than nominal samples.
                                </p>
                                <div className="bg-black/40 p-4 rounded border border-white/5 space-y-3">
                                    <div>
                                        <div className="text-[10px] text-white/40 uppercase font-mono mb-1">Best Config</div>
                                        <div className="text-xs font-mono text-green-400">n_estimators=200, max_samples=2048</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-white/40 uppercase font-mono mb-1">Tuning Strategy</div>
                                        <div className="text-xs font-mono text-white/80">Manual Grid Search (48 combinations)</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-[10px] text-white/40 uppercase font-mono mb-1">ROC AUC</div>
                                            <div className="text-xl font-bold text-white">0.7156</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-white/40 uppercase font-mono mb-1">Feature Max</div>
                                            <div className="text-sm font-mono text-white/60">1.0 (Full)</div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-[var(--dust-gray)] italic">
                                    Excels at structural attacks like PortScan (99.3% recall).
                                </p>
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="mt-8 border-t border-white/10 pt-8">
                            <h3 className="text-base font-bold text-white uppercase tracking-widest mb-6 text-center">Unsupervised Performance Comparison</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left font-mono">
                                    <thead>
                                        <tr className="border-b border-white/10 text-[var(--spider-red)]">
                                            <th className="py-3 px-4 uppercase tracking-tighter">Metric</th>
                                            <th className="py-3 px-4 uppercase tracking-tighter">Autoencoder</th>
                                            <th className="py-3 px-4 uppercase tracking-tighter">Isolation Forest</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[var(--dust-gray)]">
                                        <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3 px-4 font-bold text-white/60">ROC AUC</td>
                                            <td className="py-3 px-4 text-white">0.7801</td>
                                            <td className="py-3 px-4">0.7156</td>
                                        </tr>
                                        <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3 px-4 font-bold text-white/60">F1 (Anomaly)</td>
                                            <td className="py-3 px-4 text-white">0.66</td>
                                            <td className="py-3 px-4">0.63</td>
                                        </tr>
                                        <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3 px-4 font-bold text-white/60">Bot Recall</td>
                                            <td className="py-3 px-4 text-blue-400">73.5%</td>
                                            <td className="py-3 px-4">39.3%</td>
                                        </tr>
                                        <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3 px-4 font-bold text-white/60">DDoS Recall</td>
                                            <td className="py-3 px-4">83.1%</td>
                                            <td className="py-3 px-4 text-green-400 font-bold">84.0%</td>
                                        </tr>
                                        <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3 px-4 font-bold text-white/60">PortScan Recall</td>
                                            <td className="py-3 px-4">96.6%</td>
                                            <td className="py-3 px-4 text-green-400 font-bold">99.3%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-6 p-4 bg-[var(--spider-red)]/5 rounded-lg border border-[var(--spider-red)]/20 text-center">
                                <p className="text-xs text-[var(--dust-gray)] leading-relaxed">
                                    The <strong className="text-[var(--spider-red)] text-sm">Denoising Autoencoder</strong> is the preferred anomaly detector due to its higher AUC and significantly better detection of subtle attacks like Bot traffic.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Performance & Results Section */}
                <section id="performance-results" className="max-w-5xl mx-auto px-6 mb-12">
                    <h2 className="newspaper-headline text-3xl mb-8 animate-slide-right">Performance Metrics - SUPERVISED</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {Object.values(MODEL_METADATA).map((model, idx) => (
                            <div key={idx} className={`glass-card p-6 border-t-4 ${model.border}`}>
                                <h3 className="text-2xl font-bold text-white mb-1">{model.title}</h3>
                                <p className={`text-sm ${model.text} font-mono mb-4 text-center`}>{model.tag}</p>
                                <div className="text-center space-y-2">
                                    <div className="text-5xl font-bold text-white">{model.accuracy}</div>
                                    <div className="text-[var(--dust-gray)] text-sm uppercase tracking-widest">Accuracy</div>
                                </div>
                                <p className="mt-4 text-[var(--dust-gray)] text-sm text-center">
                                    {model.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
                {/* Hybrid Inference Pipeline Section */}
                <section id="hybrid-pipeline" className="max-w-5xl mx-auto px-6 mb-12">
                    <h2 className="newspaper-headline text-3xl mb-8 animate-slide-left ">Hybrid Inference Pipeline</h2>
                    <div className="glass-card p-8 border border-[var(--spider-red)]/20">
                        <div className="grid md:grid-cols-12 gap-8 items-center">
                            {/* Logic Explanation */}
                            <div className="md:col-span-7 space-y-6">
                                <p className="text-[var(--dust-gray)] text-lg leading-relaxed">
                                    To balance <strong>real-time responsiveness</strong> on edge hardware with <strong>high detection accuracy</strong>, the system implements a two-phase sequential pipeline.
                                </p>
                                
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full border border-[var(--spider-red)]/30 flex items-center justify-center flex-shrink-0 text-[var(--spider-red)] font-bold font-mono">01</div>
                                        <div>
                                            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-1">Unsupervised Check</h4>
                                            <p className="text-[var(--dust-gray)] text-sm">
                                                Every packet is first processed by the <strong>Autoencoder</strong> and <strong>Isolation Forest</strong>. This phase is computationally inexpensive and serves as a low-latency "first-pass" filter.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full border border-[var(--spider-red)]/30 flex items-center justify-center flex-shrink-0 text-[var(--spider-red)] font-bold font-mono">02</div>
                                        <div>
                                            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-1">Supervised Trigger</h4>
                                            <p className="text-[var(--dust-gray)] text-sm">
                                                If <strong>either</strong> unsupervised model flags an anomaly, the packet is escalated. This prevents the high-compute supervised models from running on benign traffic, saving ~70% of processing power.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full border border-[var(--spider-red)]/30 flex items-center justify-center flex-shrink-0 text-[var(--spider-red)] font-bold font-mono">03</div>
                                        <div>
                                            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-1">Final Authority</h4>
                                            <p className="text-[var(--dust-gray)] text-sm">
                                                Escalated packets are analyzed by the <strong>XGBoost / LightGBM / FFNN / Logreg</strong> ensemble. While multiple models provide input, the final classification decision is arbitrated by <strong>LightGBM</strong> for maximum precision.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Visual Logic Flow (Simulated Code/Flow) */}
                            <div className="md:col-span-5 bg-black/40 rounded-xl p-6 border border-white/5 font-mono text-[10px] space-y-4">
                                <div className="text-white/20 uppercase tracking-widest border-b border-white/5 pb-2 mb-4">Pipeline_Logic_Flow</div>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                        <span>INCOMING_PACKET_STREAM</span>
                                    </div>
                                    
                                    <div className="ml-4 border-l border-white/10 pl-4 space-y-2">
                                        <div className="bg-white/5 p-2 rounded">
                                            <span className="text-white/40"># Phase 1</span><br/>
                                            <span className="text-green-400">RUN_UNSUPERVISED(AE, IF)</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 text-yellow-500 py-1">
                                            <TechnicalIcons.Alert />
                                            <span>IF flag_detected == 1:</span>
                                        </div>

                                        <div className="bg-[var(--spider-red)]/10 p-2 rounded border border-[var(--spider-red)]/20">
                                            <span className="text-white/40"># Phase 2</span><br/>
                                            <span className="text-[var(--spider-red)]">ENGAGE_CLASSIFIER_ENSEMBLE()</span>
                                            <div className="mt-1 pl-2 border-l border-[var(--spider-red)]/30 text-[9px] text-white/60">
                                                - LightGBM_Final_Verdict<br/>
                                                - XGBoost<br/>
                                                - FFNN<br/>
                                                - Logreg
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-white/20">
                                        <div className="w-2 h-2 bg-white/20 rounded-full" />
                                        <span>RESULT_DISPATCH</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hybrid Performance Validation - Dedicated Mini Gallery */}
                        <div className="mt-12 pt-8 border-t border-white/5">
                            <h4 className="text-[var(--spider-red)] font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-[var(--spider-red)] rounded-full animate-pulse" />
                                Pipeline Performance Validation
                            </h4>
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Classification Report Card */}
                                <div 
                                    className="glass-card p-2 border-[var(--spider-red)]/10 hover:border-[var(--spider-red)]/30 transition-all duration-500 group cursor-pointer overflow-hidden"
                                    onClick={() => openLightbox(8)}
                                >
                                    <div className="relative aspect-video md:aspect-auto">
                                        <img 
                                            src="/intrusion_detection_plots/hybrid_test_cr.png" 
                                            alt="Hybrid Pipeline Classification Report" 
                                            className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity"
                                        />
                                        <div className="absolute inset-0 bg-[var(--spider-red)]/0 group-hover:bg-[var(--spider-red)]/5 transition-colors duration-500 flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 p-2 rounded-full border border-[var(--spider-red)]/30">
                                                <svg className="w-5 h-5 text-[var(--spider-red)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 px-2 pb-2">
                                        <div className="text-[10px] text-white/80 font-bold uppercase tracking-widest mb-1">Hybrid Strategy: Classification</div>
                                        <div className="text-[9px] text-white/30 font-mono uppercase truncate">hybrid_test_cr.png</div>
                                    </div>
                                </div>

                                {/* Confusion Matrix Card */}
                                <div 
                                    className="glass-card p-2 border-[var(--spider-red)]/10 hover:border-[var(--spider-red)]/30 transition-all duration-500 group cursor-pointer overflow-hidden"
                                    onClick={() => openLightbox(9)}
                                >
                                    <div className="relative aspect-video md:aspect-auto">
                                        <img 
                                            src="/intrusion_detection_plots/hybrid_test_cm.png" 
                                            alt="Hybrid Pipeline Confusion Matrix" 
                                            className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity"
                                        />
                                        <div className="absolute inset-0 bg-[var(--spider-red)]/0 group-hover:bg-[var(--spider-red)]/5 transition-colors duration-500 flex items-center justify-center">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 p-2 rounded-full border border-[var(--spider-red)]/30">
                                                <svg className="w-5 h-5 text-[var(--spider-red)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 px-2 pb-2">
                                        <div className="text-[10px] text-white/80 font-bold uppercase tracking-widest mb-1">Hybrid Strategy: Confusion Matrix</div>
                                        <div className="text-[9px] text-white/30 font-mono uppercase truncate">hybrid_test_cm.png</div>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-6 text-sm text-[var(--dust-gray)] italic text-center max-w-2xl mx-auto leading-relaxed">
                                "The integration of unsupervised screening reduces processing overhead by <strong>~70%</strong>, allowing the high-fidelity ensemble to maintain sub-millisecond precision on critical threats."
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
                            {images.slice(0, 8).map((img, index) => (
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
                        <div className="grid md:grid-cols-2 gap-8 mb-10">
                            {/* Dataset Overview */}
                            <div className="bg-white/5 p-6 rounded-lg border border-[var(--spider-red)]/20 shadow-none">
                                <h3 className="text-xl mb-4 text-[var(--vintage-white)] flex items-center gap-2 font-bold">
                                    <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full animate-pulse" />
                                    Source & Scale
                                </h3>
                                <p className="text-[var(--dust-gray)] text-base leading-relaxed">
                                    Leveraging the <strong>CICIDS-2017</strong> benchmark from the Canadian Institute for Cybersecurity. 
                                    Contains <strong>2.8M+ network flows</strong> with ~80 high-dimensional features, representing a comprehensive set of modern attack vectors.
                                </p>
                            </div>

                            {/* Time-Aware Partitioning */}
                            <div className="bg-white/5 p-6 rounded-lg border border-[var(--spider-red)]/20 shadow-none">
                                <h3 className="text-xl mb-4 text-[var(--vintage-white)] flex items-center gap-2 font-bold">
                                    <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full animate-pulse" />
                                    Temporal Isolation
                                </h3>
                                <p className="text-[var(--dust-gray)] text-base leading-relaxed">
                                    To prevent look-ahead bias, data is split temporally:
                                    <br />
                                    <span className="text-[var(--spider-red)] font-mono text-lg font-bold">Mon-Thu (Train)</span> <span className="text-white/20">vs</span> <span className="text-[var(--spider-red)] font-mono text-lg font-bold">Fri (Test)</span>.
                                </p>
                            </div>
                        </div>

                        {/* Processing Pipeline - Stage 1, 2, 3 */}
                        <div className="pt-10 border-t border-white/10">
                            <h3 className="text-xl mb-8 text-[var(--vintage-white)] text-center font-bold tracking-[0.2em] uppercase newspaper-headline">Processing Pipeline</h3>
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Stage 1 */}
                                <div className="bg-black/40 p-6 rounded border border-white/5 hover:border-[var(--spider-red)]/20 transition-all space-y-4">
                                    <div className="text-[10px] text-white/40 font-mono uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1 h-1 bg-[var(--spider-red)] rounded-full" />
                                        STAGE_01 // SPLIT
                                    </div>
                                    <h4 className="text-lg font-bold text-white tracking-tight">Data Splitting</h4>
                                    <ul className="space-y-3">
                                        {[
                                            "Verifies column consistency",
                                            "Rare attack consolidation",
                                            "Label mapping logic",
                                            "Parquet shard exports"
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-3 items-start group">
                                                <div className="mt-1.5 w-1.5 h-1.5 bg-[var(--spider-red)]/50 group-hover:bg-[var(--spider-red)] transform rotate-45 transition-colors shadow-[0_0_5px_rgba(204,41,54,0.4)]"></div>
                                                <span className="text-sm text-[var(--dust-gray)] group-hover:text-white/80 transition-colors">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Stage 2 */}
                                <div className="bg-black/40 p-6 rounded border border-white/5 hover:border-[var(--spider-red)]/20 transition-all space-y-4">
                                    <div className="text-[10px] text-white/40 font-mono uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1 h-1 bg-[var(--spider-red)] rounded-full" />
                                        STAGE_02 // CLEAN
                                    </div>
                                    <h4 className="text-lg font-bold text-white tracking-tight">Cleaning & EDA</h4>
                                    <ul className="space-y-3">
                                        {[
                                            "NaN/Inf handling via utils",
                                            "Header whitespace cleanup",
                                            "Distribution balancing",
                                            "Dtype optimization"
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-3 items-start group">
                                                <div className="mt-1.5 w-1.5 h-1.5 bg-[var(--spider-red)]/50 group-hover:bg-[var(--spider-red)] transform rotate-45 transition-colors shadow-[0_0_5px_rgba(204,41,54,0.4)]"></div>
                                                <span className="text-sm text-[var(--dust-gray)] group-hover:text-white/80 transition-colors">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Stage 3 */}
                                <div className="bg-black/40 p-6 rounded border border-white/5 hover:border-[var(--spider-red)]/20 transition-all space-y-4">
                                    <div className="text-[10px] text-white/40 font-mono uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1 h-1 bg-[var(--spider-red)] rounded-full" />
                                        STAGE_03 // PREPROCESS
                                    </div>
                                    <h4 className="text-lg font-bold text-white tracking-tight">Engineering</h4>
                                    <div className="space-y-3 pt-2">
                                        <div className="p-3 rounded bg-black/60 border border-white/5">
                                            <span className="text-[10px] text-blue-400 font-bold block mb-1 uppercase tracking-widest">Supervised Path</span>
                                            <span className="text-xs text-white/60 font-mono">StandardScaler + IPCA (69→34)</span>
                                        </div>
                                        <div className="p-3 rounded bg-black/60 border border-white/5">
                                            <span className="text-[10px] text-green-400 font-bold block mb-1 uppercase tracking-widest">Unsupervised Path</span>
                                            <span className="text-xs text-white/60 font-mono">MinMaxScaler (69 Features)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 p-5 bg-black/40 border-l-2 border-[var(--spider-red)] text-sm text-[var(--dust-gray)] italic rounded-r">
                                <strong className="text-white/80 not-italic mr-2">Core Optimization:</strong> 
                                Dtypes downcasted to float32/int32. Friday-only attacks dropped from training to ensure zero-leakage evaluation.
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
                                    <p className="text-sm md:text-base text-[var(--dust-gray)] leading-relaxed italic border-l-2 border-[var(--spider-red)]/30 pl-4">
                                        {(images[selectedImageIndex] as any).description || "Detailed technical breakdown of model performance and convergence metrics."}
                                    </p>
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
