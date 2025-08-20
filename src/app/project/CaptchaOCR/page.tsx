'use client';
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CaptchaOCRProjectPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageTransition, setImageTransition] = useState<'none' | 'left' | 'right'>('none');


  const images = [
    {
      src: "/captcha_ocr_plots/training_losses.png",
      alt: "Training Loss Curves",
      title: "Training Loss Progression"
    },
    {
      src: "/captcha_ocr_plots/loss_comparison.png", 
      alt: "Training vs Validation Loss",
      title: "Training vs Validation Loss"
    },
    {
      src: "/captcha_ocr_plots/inference_results.png",
      alt: "Model Predictions", 
      title: "Live Predictions"
    }
  ];

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
    // Add a small delay to trigger the animation
    setTimeout(() => setLightboxVisible(true), 10);
  };

  const closeLightbox = () => {
    setLightboxVisible(false);
    // Wait for animation to complete before hiding
    setTimeout(() => {
      setLightboxOpen(false);
      setSelectedImageIndex(0);
    }, 300);
  };

  const nextImage = () => {
    setImageTransition('right');
    setTimeout(() => {
      setSelectedImageIndex((prev) => (prev + 1) % images.length);
      setImageTransition('none');
    }, 500);
  };

  const previousImage = () => {
    setImageTransition('left');
    setTimeout(() => {
      setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
      setImageTransition('none');
    }, 500);
  };

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
  }, [lightboxOpen]);

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
            <div className="mt-4 text-dust-gray">On this page</div>
            <a href="#project-details" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Project Details</a>
            <a href="#technical-architecture" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Technical Architecture</a>
            <a href="#performance-results" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Performance & Results</a>
            <a href="#dataset-training" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Dataset & Training</a>
            <a href="#live-demo" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Live Demo</a>
          </nav>
        </aside>

        {/* Back to Story button */}
        <div className="max-w-5xl mx-auto mb-8">
          <Link 
            href="/story" 
            className="inline-flex items-center gap-2 text-[var(--vintage-white)] hover:text-[var(--spider-red)] transition-colors duration-200"
          >
            <span>←</span>
            <span>Back to Story</span>
          </Link>
        </div>

        {/* Project Header */}
        <section className="max-w-5xl mx-auto mb-12">
          <header className="text-center mb-10 animate-slide-down">
            <h1 className="newspaper-headline text-5xl md:text-6xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] mb-4">
              Captcha OCR
            </h1>
                         <p className="text-xl text-[var(--dust-gray)] max-w-3xl mx-auto">
               CAPTCHA Recognition System using custom CRNN architecture with CTC loss, achieving 100% accuracy on 100k+ enhanced training images
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
                  This project implements an end-to-end CAPTCHA text recognition system using a custom Convolutional Recurrent Neural Network (CRNN) architecture. 
                  The system combines CNN layers for feature extraction with BiLSTM layers for sequence modeling, trained using Connectionist Temporal Classification (CTC) loss.
                </p>
                                 <div className="space-y-2 text-sm text-[var(--dust-gray)]">
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                     <span>Custom CRNN architecture with CNN + BiLSTM</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                     <span>Enhanced synthetic CAPTCHA generation with 100k+ images</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                     <span>100% accuracy on test data with robust training</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                     <span>Advanced image augmentation & interference patterns</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                     <span>Deployed on Hugging Face Spaces</span>
                   </div>
                 </div>
              </div>
              <div>
                <h3 className="text-xl mb-4 text-[var(--vintage-white)]">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="tag">Python</span>
                  <span className="tag">PyTorch</span>
                  <span className="tag">CNN-LSTM</span>
                  <span className="tag">CTC Loss</span>
                  <span className="tag">Computer Vision</span>
                  <span className="tag">Hugging Face</span>
                </div>
                <div className="mt-6">
                  <a
                    href="https://github.com/mohakapoor/CaptchaOCR"
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
        </section>

                 {/* Live Demo Section */}
                   <section id="live-demo" className="max-w-5xl mx-auto mb-12">
            <h2 className="newspaper-headline text-3xl mb-8 animate-slide-left">Live Demo</h2>
            <div className="glass-card p-[10px]">
              {/* Hugging Face Space iframe */}
              <iframe
                src="https://mohakapoor-captchaocr.hf.space"
                frameBorder="0"
                width="100%"
                height="600"
                className="w-full"
              ></iframe>
            </div>
          </section>

        {/* Technical Architecture Section */}
        <section id="technical-architecture" className="max-w-5xl mx-auto mb-12">
          <h2 className="newspaper-headline text-3xl my-8 animate-slide-left">Technical Architecture</h2>
          <div className="glass-card p-5">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl mb-4 text-[var(--vintage-white)]">Model Architecture (CRNN)</h3>
                <div className="space-y-3 text-sm text-[var(--dust-gray)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                    <span><strong>CNN Encoder:</strong> 3x3 convolutions with BatchNorm + ReLU</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                    <span><strong>Residual Connections:</strong> Prevents gradient vanishing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                    <span><strong>BiLSTM Decoder:</strong> 2-layer bidirectional LSTM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                    <span><strong>Output:</strong> 64×B×63 (63 character classes)</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl mb-4 text-[var(--vintage-white)]">Training Specifications</h3>
                <div className="space-y-3 text-sm text-[var(--dust-gray)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                    <span><strong>Input Size:</strong> 60×256×1 (grayscale)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                    <span><strong>Batch Size:</strong> 32-128 (GPU dependent)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                    <span><strong>Optimizer:</strong> AdamW (lr=3e-4)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                    <span><strong>Loss:</strong> CTCLoss with blank token</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Performance & Results Section */}
        <section id="performance-results" className="max-w-5xl mx-auto mb-12">
          <h2 className="newspaper-headline text-3xl my-8 animate-slide-right">Performance & Results</h2>
          <div className="glass-card p-5">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl mb-4 text-[var(--vintage-white)]">Training Performance</h3>
                <div className="space-y-3 text-sm text-[var(--dust-gray)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                    <span><strong>Current Status:</strong> Epoch 8, excellent convergence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                    <span><strong>Best Model:</strong> Validation loss: 0.1782</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                    <span><strong>Early Stopping:</strong> Working perfectly</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                    <span><strong>Training Time:</strong> 2-8 hours (GPU dependent)</span>
                  </div>
                </div>
              </div>
                             <div>
                 <h3 className="text-xl mb-4 text-[var(--vintage-white)]">Inference Results</h3>
                 <div className="space-y-3 text-sm text-[var(--dust-gray)]">
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                     <span><strong>Overall Accuracy:</strong> 100% (consistent across runs)</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                     <span><strong>Character Accuracy:</strong> 100% (perfect recognition)</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                     <span><strong>Real-time Inference:</strong> GPU accelerated</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                     <span><strong>Robust Performance:</strong> Handles complex interference patterns</span>
                   </div>
                 </div>
               </div>
            </div>

            {/* Training Metrics Visualization */}
            <div className="mt-8">
              <h3 className="text-xl mb-6 text-[var(--vintage-white)] text-center">Training Metrics & Results</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Training Losses */}
                <div className="flex flex-col h-full">
                  <div className="flex-1 flex items-center justify-center">
                    <img 
                      src="/captcha_ocr_plots/training_losses.png" 
                      alt="Training Loss Curves" 
                      className="mx-auto max-w-full rounded-lg border border-[var(--spider-red)]/20 shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200" 
                      onClick={() => openLightbox(0)}
                    />
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm text-[var(--dust-gray)] font-medium">Training Loss Progression</p>
                    <p className="text-xs text-[var(--dust-gray)] mt-1">Loss curves over training epochs</p>
                  </div>
                </div>

                {/* Loss Comparison */}
                <div className="flex flex-col h-full">
                  <div className="flex-1 flex items-center justify-center">
                    <img 
                      src="/captcha_ocr_plots/loss_comparison.png" 
                      alt="Training vs Validation Loss" 
                      className="mx-auto max-w-full rounded-lg border border-[var(--spider-red)]/20 shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200" 
                      onClick={() => openLightbox(1)}
                    />
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm text-[var(--dust-gray)] font-medium">Training vs Validation</p>
                    <p className="text-xs text-[var(--dust-gray)] mt-1">Loss comparison showing convergence</p>
                  </div>
                </div>

                {/* Inference Results */}
                <div className="flex flex-col h-full">
                  <div className="flex-1 flex items-center justify-center">
                    <img 
                      src="/captcha_ocr_plots/inference_results.png" 
                      alt="Model Predictions" 
                      className="mx-auto max-w-full rounded-lg border border-[var(--spider-red)]/20 shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200" 
                      onClick={() => openLightbox(2)}
                    />
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm text-[var(--dust-gray)] font-medium">Live Predictions</p>
                    <p className="text-xs text-[var(--dust-gray)] mt-1">Actual vs predicted CAPTCHA text</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dataset & Training Section */}
        <section id="dataset-training" className="max-w-5xl mx-auto mb-12">
          <h2 className="newspaper-headline text-3xl my-8 animate-slide-left">Dataset & Training</h2>
          <div className="glass-card p-5">
            <div className="grid md:grid-cols-2 gap-8">
                             <div>
                 <h3 className="text-xl mb-4 text-[var(--vintage-white)]">Enhanced Data Generation</h3>
                 <div className="space-y-3 text-sm text-[var(--dust-gray)]">
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                     <span><strong>Training Set:</strong> 80k synthetic CAPTCHAs</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                     <span><strong>Validation:</strong> 10k CAPTCHAs (10%)</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                     <span><strong>Test Set:</strong> 10k CAPTCHAs (10%)</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                     <span><strong>Character Set:</strong> a-z, A-Z, 0-9 (63 classes)</span>
                   </div>
                 </div>
               </div>
                             <div>
                 <h3 className="text-xl mb-4 text-[var(--vintage-white)]">Advanced Training Pipeline</h3>
                 <div className="space-y-3 text-sm text-[var(--dust-gray)]">
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                     <span><strong>Data Loading:</strong> Custom PyTorch Dataset class</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                     <span><strong>Preprocessing:</strong> Grayscale, normalize [0,1]</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                     <span><strong>Advanced Augmentation:</strong> Perspective warp, interference, noise</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                     <span><strong>CTC Collation:</strong> Variable-length sequences</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                     <span><strong>Monitoring:</strong> Real-time metrics & plots</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox */}
      {lightboxOpen && (
                 <div 
           className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-all duration-500 ease-out ${
             lightboxVisible ? 'opacity-100' : 'opacity-0'
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
             className={`relative max-w-6xl max-h-[90vh] bg-[var(--newsprint-gray)] rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden transition-all duration-500 ease-out transform ${
               lightboxVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
             }`} 
             onClick={(e) => e.stopPropagation()}
           >
             {/* Top Side (Mobile) / Left Side (Desktop) - Image */}
             <div className="flex-1 flex items-center justify-center p-4 md:p-6 relative min-h-[40vh] md:min-h-0">
               <img
                 src={images[selectedImageIndex].src}
                 alt={images[selectedImageIndex].alt}
                 title={images[selectedImageIndex].title}
                                   className={`max-w-full max-h-full object-contain rounded-lg transition-all duration-500 ease-out transform ${
                    lightboxVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                  } ${
                    imageTransition === 'left' ? 'lightbox-image-transition-left opacity-0 scale-95' : 
                    imageTransition === 'right' ? 'lightbox-image-transition-right opacity-0 scale-95' : 
                    'opacity-100 scale-100'
                  }`}
               />
             </div>
             
             {/* Bottom Side (Mobile) / Right Side (Desktop) - Description Panel */}
             <div 
               className={`w-full md:w-80 bg-[var(--newsprint-gray)] border-t md:border-t-0 md:border-l border-[var(--spider-red)]/20 p-4 md:p-6 flex flex-col transition-all duration-500 ease-out transform ${
                 lightboxVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
               }`}
             >
                             {/* Header with Title */}
               <div className="mb-4 md:mb-6">
                 <h3 
                   className={`text-xl md:text-2xl font-bold text-[var(--vintage-white)] newspaper-headline transition-all duration-500 ease-out transform ${
                     lightboxVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                   } ${
                     imageTransition !== 'none' ? 'opacity-0 scale-90 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
                   }`}
                 >
                   {images[selectedImageIndex].title}
                 </h3>
               </div>
              
                             {/* Description Content */}
                               <div 
                  className={`flex-1 transition-all duration-500 ease-out transform ${
                    imageTransition !== 'none' ? 'opacity-0 translate-y-6 scale-95' : 'opacity-100 translate-y-0 scale-100'
                  }`}
                >
                                 {images[selectedImageIndex].title === "Training Loss Progression" && (
                   <div className="space-y-3 md:space-y-4">
                     <p className="text-[var(--dust-gray)] leading-relaxed text-sm md:text-base">
                       This plot shows the training and validation loss curves over 16 epochs. The rapid convergence 
                       from high initial loss values to near-zero demonstrates excellent model training.
                     </p>
                     <div className="space-y-2">
                       <div className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                         <span className="text-xs md:text-sm text-[var(--dust-gray)]">Blue line: Training Loss</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                         <span className="text-xs md:text-sm text-[var(--dust-gray)]">Red line: Validation Loss</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                         <span className="text-xs md:text-sm text-[var(--dust-gray)]">Convergence achieved by Epoch 6</span>
                       </div>
                     </div>
                   </div>
                 )}
                
                                 {images[selectedImageIndex].title === "Training vs Validation Loss" && (
                   <div className="space-y-3 md:space-y-4">
                     <p className="text-[var(--dust-gray)] leading-relaxed text-sm md:text-base">
                       Comprehensive analysis of training dynamics with four sub-plots showing different aspects 
                       of the training process and overfitting prevention.
                     </p>
                     <div className="space-y-2">
                       <div className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                         <span className="text-xs md:text-sm text-[var(--dust-gray)]">Main loss convergence plot</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                         <span className="text-xs md:text-sm text-[var(--dust-gray)]">Overfitting indicator</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                         <span className="text-xs md:text-sm text-[var(--dust-gray)]">Loss ratio analysis</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                         <span className="text-xs md:text-sm text-[var(--dust-gray)]">Improvement tracking</span>
                       </div>
                     </div>
                   </div>
                 )}
                
                                 {images[selectedImageIndex].title === "Live Predictions" && (
                   <div className="space-y-3 md:space-y-4">
                     <p className="text-[var(--dust-gray)] leading-relaxed text-sm md:text-base">
                       Real-time CAPTCHA recognition results showing actual vs predicted text. 
                       The model achieves 100% accuracy on these test samples.
                     </p>
                     <div className="space-y-2">
                       <div className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                         <span className="text-xs md:text-sm text-[var(--dust-gray)]">4/4 predictions correct</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                         <span className="text-xs md:text-sm text-[var(--dust-gray)]">Handles various character types</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="w-2 h-2 bg-[var(--spider-red)] rounded-full"></span>
                         <span className="text-xs md:text-sm text-[var(--dust-gray)]">Real-time inference capability</span>
                       </div>
                     </div>
                   </div>
                 )}
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
      )}
    </>
  );
}
