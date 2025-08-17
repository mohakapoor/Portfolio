'use client';
import Link from "next/link";
import CaptchaOCRClient from "@/components/CaptchaOCRClient";
import { useState } from "react";

export default function CaptchaOCRProjectPage() {
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
            <div className="mt-4 text-dust-gray">On this page</div>
            <a href="#project-details" className="block py-1 hover:underline" onClick={() => setMenuOpen(false)}>Project Details</a>
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
              CAPTCHA Recognition System using custom CRNN architecture with CTC loss, achieving 96%+ character accuracy
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
                    <span className="w-2 h-2 bg-[var(--dust-gray)] rounded-full"></span>
                    <span>Synthetic CAPTCHA generation for robust training</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--dust-gray)] rounded-full"></span>
                    <span>96%+ character accuracy on test data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[var(--dust-gray)] rounded-full"></span>
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
        <section id="live-demo" className="max-w-6xl mx-auto mb-12">
          <h2 className="newspaper-headline text-3xl my-8 animate-slide-left">Live Demo</h2>
          <div className="glass-card p-5">
            <p className="text-center text-[var(--dust-gray)] mb-6">
              Try out the CAPTCHA recognition system below. Generate a CAPTCHA image and see the tool in action!
            </p>
            
            {/* Native CaptchaOCR Client Component */}
            <div className="flex justify-center">
              <CaptchaOCRClient />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
