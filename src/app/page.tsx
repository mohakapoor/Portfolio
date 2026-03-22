import Typewriter from "@/components/Typewriter";
import TargetCursor from "@/components/TargetCursor";
import Link from "next/link";
import { RoleSelector } from "@/components/RoleSelector/RoleSelector";

export default function Home() {
  return (
    <main className="noir-hero min-h-screen relative w-full overflow-hidden bg-[#0d0d0d]">
      <TargetCursor targetSelector='[data-cursor-target], .cursor-target' spinDuration={3} hideDefaultCursor={true} color={'var(--theme-accent, var(--spider-red))'} />
      <RoleSelector />
    </main>
  );
}
