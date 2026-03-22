import Typewriter from "@/components/Typewriter";
import TargetCursor from "@/components/TargetCursor";
import Link from "next/link";
import { RoleSelector } from "@/components/RoleSelector/RoleSelector";
import { MobileHero } from "@/components/MobileHero";

export default function Home() {
  return (
    <main className="noir-hero min-h-screen relative w-full overflow-hidden bg-[#0d0d0d]">
      <TargetCursor targetSelector='[data-cursor-target], .cursor-target' spinDuration={3} hideDefaultCursor={true} color={'var(--theme-accent, var(--spider-red))'} />
      <div className="md:hidden">
        <MobileHero />
      </div>
      <div className="hidden md:block">
        <RoleSelector />
      </div>
    </main>
  );
}
