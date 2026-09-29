import { useCallback, useState, type ReactNode } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrollState } from "@/hooks/useScrollState";
import { HOME_SECTION_ID, navItems } from "@/data/navigation";
import { site } from "@/data/site";
import { LoaderReadyContext } from "@/lib/loaderReady";
import { CustomCursor, LoadingScreen, ParticleBackground } from "@/components/effects";
import Footer from "./Footer";
import Navbar from "./Navbar";
import styles from "./PageLayout.module.css";

const MAIN_ID = "main";
const homeHref = `#${HOME_SECTION_ID}`;
// Every section the page tracks: the hero plus each navigation target, in page order.
const sectionIds = [HOME_SECTION_ID, ...navItems.map((item) => item.id)];
const lastSectionId = sectionIds[sectionIds.length - 1];

/**
 * The page shell: skip link, navbar, <main>, footer. It is the only place that
 * reads site/navigation data for the chrome and hands it down as props, so
 * Navbar and Footer stay reusable and free of content.
 *
 * It also owns the page-wide scroll state (active section, progress, scrolled) and
 * passes it to the Navbar as props. The page-wide ambient effects (loading screen, particles,
 * custom cursor) are mounted here; each one owns its own listeners and cleanup.
 */
export default function PageLayout({ children }: { children: ReactNode }) {
  // Flips to true when the loading screen starts to leave; Reveal and the counters wait for it.
  const [loaderReady, setLoaderReady] = useState(false);
  const handleLoaderLeave = useCallback(() => setLoaderReady(true), []);
  const { scrolled, progress } = useScrollState();
  const observedId = useActiveSection(sectionIds);
  // At the very bottom the last section may be too short to reach the observer's band.
  const activeId = progress > 0.995 ? lastSectionId : observedId;

  return (
    <LoaderReadyContext value={loaderReady}>
      <LoadingScreen initials={site.name.initials} onLeave={handleLoaderLeave} />
      <ParticleBackground />
      <CustomCursor />
      <a href={`#${MAIN_ID}`} className={styles.skipLink}>
        Skip to content
      </a>
      <Navbar
        initials={site.name.initials}
        homeHref={homeHref}
        items={navItems}
        activeId={activeId}
        progress={progress * 100}
        scrolled={scrolled}
      />
      <main id={MAIN_ID}>{children}</main>
      <Footer
        initials={site.name.initials}
        name={`${site.name.first} ${site.name.last}`}
        tagline={site.footerTagline}
        socials={site.socials}
        homeHref={homeHref}
      />
    </LoaderReadyContext>
  );
}
