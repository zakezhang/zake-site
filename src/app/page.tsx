import { AboutSection } from "@/components/AboutSection";
import { BackgroundCanvas } from "@/components/BackgroundCanvas";
import { GrainOverlay } from "@/components/GrainOverlay";
import { HeroSection } from "@/components/HeroSection";
import { Loader } from "@/components/Loader";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyCta } from "@/components/StickyCta";
import { WorkGrid } from "@/components/WorkGrid";

export default function Home() {
  return (
    <>
      <Loader />
      <GrainOverlay />
      <SiteHeader />
      <div className="fixed inset-0 w-full h-full">
        <div className="w-full h-full overflow-y-auto overscroll-contain no-scrollbar">
          <div className="[animation:hsstFadeIn_.9s_.5s_both]">
            <HeroSection />
            <AboutSection />
            <WorkGrid />
            <StickyCta />
            <SiteFooter />
          </div>
        </div>
      </div>
      <BackgroundCanvas />
    </>
  );
}
