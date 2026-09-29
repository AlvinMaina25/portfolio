import {
  AboutSection,
  CertificationsSection,
  ContactSection,
  ExperienceSection,
  HeroSection,
  LearningSection,
  ProjectsSection,
  SkillsSection,
} from "@/components/sections";

/**
 * The single page: sections in order. Anchor ids (#home, #about, ...) are set inside each
 * section and must match src/data/navigation.ts. The surrounding shell (navbar, <main>,
 * footer) comes from PageLayout, so this file is only the list of sections.
 */
export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <CertificationsSection />
      <LearningSection />
      <ContactSection />
    </>
  );
}
