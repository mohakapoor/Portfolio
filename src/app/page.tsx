import Typewriter from "@/components/Typewriter";
import Link from "next/link";

export default function Home() {
  return (
    <main className="noir-hero min-h-screen flex items-center justify-center px-6 py-20 relative">
      <section className="relative z-10 max-w-5xl w-full text-center">
        <h1 className="newspaper-headline text-6xl md:text-7xl mb-4">
          Mohak Kapoor
        </h1>
        <p className="text-lg md:text-xl text-dust-gray mb-8">
          <Typewriter
            text="Machine Learning • Time‑Series • DevOps"
            className="inline-flex items-center"
            startDelayMs={1000}
            speedMs={55}
            afterBlinkMs={-1}
          />
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            className="spider-noir-button px-6 py-3 border-2"
            href="/story"
          >
            Read the full story
          </Link>
          <a
            className="spider-noir-button px-6 py-3 border-2"
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
