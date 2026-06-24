import { RoleSelector } from "@/components/RoleSelector/RoleSelector";
import { FeaturedProject } from "@/components/Landing/FeaturedProject";
import { Philosophy } from "@/components/Landing/Philosophy";
import { Stats } from "@/components/Landing/Stats";
import { Footer } from "@/components/Landing/Footer";

export default function Home() {
  return (
    <main className="bg-[#0d0d0d] min-h-screen w-full selection:bg-white/10 overflow-x-hidden">

      {/* Hero Section - Themed with noir background and responsive logic */}
      <section className="noir-hero min-h-screen relative w-full overflow-hidden">
        <RoleSelector />
      </section>

      {/* Content Sections Below-the-Fold */}
      <FeaturedProject />
      <Philosophy />
      <Stats />
      <Footer />
    </main>
  );
}
