import Typewriter from "@/components/Typewriter";
import AutoRedirect from "@/components/AutoRedirect";
import Link from "next/link";

export default function Home() {
  return (
    <main className="noir-hero min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20 relative">
      <AutoRedirect href="/story" delayMs={5000} />
      <section className="relative z-10 max-w-4xl w-full text-center">
        <h1 className="newspaper-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 sm:mb-6">
          Mohak Kapoor
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-vintage-white mb-6 sm:mb-8 px-2">
          <Typewriter
            text="Machine Learning • Time‑Series • DevOps"
            className="inline-flex items-center"
            startDelayMs={1000}
            speedMs={55}
            afterBlinkMs={-1}
          />
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
          <Link
            className="spider-noir-button px-4 sm:px-6 py-2.5 sm:py-3 border-2 w-full sm:w-auto text-sm sm:text-base"
            href="/story"
          >
            Read the full story
          </Link>
          <a
            className="spider-noir-button px-4 sm:px-6 py-2.5 sm:py-3 border-2 w-full sm:w-auto text-sm sm:text-base"
            href="/Mohak_Kapoor_ML_INTERN.pdf"
            download="Mohak_Kapoor_ML_INTERN.pdf"
          >
            Download Dossier
          </a>
        </div>
      </section>
    </main>
  );
}
