import { Button, Reveal, Section, SocialLinks } from "@/components/ui";
import { WhatsAppButton } from "@/components/contact";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { HOME_SECTION_ID } from "@/data/navigation";
import { site } from "@/data/site";
import portrait480 from "@/assets/images/profile/alvin-portrait-480.webp";
import portrait800 from "@/assets/images/profile/alvin-portrait-800.webp";
import HeroStat from "./HeroStat";
import styles from "./HeroSection.module.css";

/**
 * Hero. The role line types and rotates (useTypingEffect) and the stats count up once
 * (HeroStat). With reduced motion both show stable final content. Particles and the
 * hex-ring animation are a later phase.
 */
export default function HeroSection() {
  const { name, roles, heroIntro, availability, stats, socials, resumeUrl } = site;
  const typedRole = useTypingEffect(roles);

  return (
    <Section id={HOME_SECTION_ID} labelledBy="hero-heading">
      <div className={styles.hero}>
        <Reveal className={styles.content}>
          {availability.isAvailable && (
            <p className={styles.tag}>
              <span className={styles.dot} aria-hidden="true" />
              {availability.labels.hero}
            </p>
          )}
          <h1 id="hero-heading" className={styles.name}>
            <span className={styles.first}>{name.first}</span> <span className={styles.last}>{name.last}</span>
          </h1>
          <p className={styles.subtitle}>
            I am a{" "}
            {/* Screen readers get the full list once; the changing text is hidden so it isn't re-announced. */}
            <span className={styles.srOnly}>{roles.join(", ")}</span>
            <span className={styles.role} aria-hidden="true">
              {typedRole}
              <span className={styles.caret}>|</span>
            </span>
          </p>
          <p className={styles.intro}>{heroIntro}</p>

          <dl className={styles.stats}>
            {stats.map((stat) => (
              <HeroStat key={stat.id} stat={stat} />
            ))}
          </dl>

          <div className={styles.cta}>
            <Button href="#projects" icon="▸">View Projects</Button>
            <WhatsAppButton />
            <Button href="#contact" variant="secondary" icon="▶">Contact Me</Button>
            {resumeUrl && (
              <Button href={resumeUrl} variant="ghost" icon="⇣" download>
                Download CV
              </Button>
            )}
          </div>
          <SocialLinks links={socials} label="Social links" />
        </Reveal>

        <Reveal direction="right" className={styles.visual}>
          <figure className={styles.photoFrame}>
            {/* Above the fold and the largest element: loaded eagerly, high priority. */}
            <img
              className={styles.photo}
              src={portrait800}
              srcSet={`${portrait480} 480w, ${portrait800} 800w`}
              sizes="(max-width: 1100px) 320px, 380px"
              width={800}
              height={1000}
              alt="Alvin Maina, in a dark suit and tie, seated with his hands clasped, looking at the camera"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}
