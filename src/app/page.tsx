import TargetCursor from "@/components/TargetCursor";
import { RoleSelector } from "@/components/RoleSelector/RoleSelector";
import { MobileHero } from "@/components/MobileHero";
import { Marquee } from "@/components/Landing/Marquee";
import { FeaturedProject } from "@/components/Landing/FeaturedProject";
import { Philosophy } from "@/components/Landing/Philosophy";
import { Stats } from "@/components/Landing/Stats";
import { Footer } from "@/components/Landing/Footer";

export default function Home() {
  return (
    <main className="bg-[#0d0d0d] min-h-screen w-full selection:bg-white/10 overflow-x-hidden">
      <TargetCursor
        targetSelector='[data-cursor-target], .cursor-target'
        spinDuration={3}
        hideDefaultCursor={true}
        color={'var(--theme-accent, var(--spider-red))'}
      />

      {/* Hero Section - Themed with noir background and responsive logic */}
      <section className="noir-hero min-h-screen relative w-full overflow-hidden">
        <div className="md:hidden">
          <MobileHero />
        </div>
        <div className="hidden md:block">
          <RoleSelector />
        </div>
      </section>

      {/* Content Sections Below-the-Fold */}
      <Marquee />
      <FeaturedProject />
      <Philosophy />
      <Stats />
      <Footer />
    </main>
  );
}
