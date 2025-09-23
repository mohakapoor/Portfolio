import Typewriter from "@/components/Typewriter";
import AutoRedirect from "@/components/AutoRedirect";
import TargetCursor from "@/components/TargetCursor";
import Link from "next/link";

export default function Home() {
  return (
    <main className="noir-hero min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20 relative">
      <TargetCursor targetSelector='[data-cursor-target], .cursor-target' spinDuration={3} hideDefaultCursor={true} color={'var(--spider-red)'} />
      <AutoRedirect href="/story" delayMs={10000} />
      <section className="relative z-10 max-w-4xl w-full text-center">
        <h1 className="newspaper-headline text-5xl sm:text-6xl md:text-7-5xl lg:text-8xl mb-4 sm:mb-6 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
          Mohak Kapoor
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-vintage-white mb-6 sm:mb-8 px-2">
          <Typewriter
            text="Data Science • Machine Learning • Agentic AI"
            className="inline-block text-center"
            startDelayMs={1000}
            speedMs={55}
            afterBlinkMs={-1}
          />
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
          <Link
            className="spider-noir-button px-6 sm:px-8 py-3 sm:py-4 border-2 w-full sm:w-auto text-lg sm:text-xl"
            data-cursor-target
            href="/story"
          >
            Read the full story
          </Link>
          <a
            className="spider-noir-button px-6 sm:px-8 py-3 sm:py-4 border-2 w-full sm:w-auto text-lg sm:text-xl"
            data-cursor-target
            href="/MOHAK_KAPOOR_ML.pdf"
            download="MOHAK_KAPOOR_ML.pdf"
          >
            Download Resume
          </a>
        </div>
      </section>
    </main>
  );
}
