import type { SocialLink } from "@/types";
import { Container, Icon, SocialLinks } from "@/components/ui";
import styles from "./Footer.module.css";

interface FooterProps {
  /** Two-letter mark shown as "[AM]". */
  initials: string;
  /** Full name for the copyright line. */
  name: string;
  tagline: string;
  socials: SocialLink[];
  /** Where the back-to-top link goes (the first section). */
  homeHref: string;
  /** Defaults to the current year. */
  year?: number;
}

/** Page footer. Everything it shows is passed in, so it holds no content of its own. */
export default function Footer({
  initials,
  name,
  tagline,
  socials,
  homeHref,
  year = new Date().getFullYear(),
}: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.gridLine} aria-hidden="true" />
      <Container>
        <div className={styles.inner}>
          <div className={styles.brand}>
            <span className={styles.logo}>{`[${initials}]`}</span>
            <p className={styles.tagline}>{tagline}</p>
          </div>
          <SocialLinks links={socials} label="Footer social links" className={styles.socials} />
        </div>
        <div className={styles.bottom}>
          <span className={styles.copy}>
            &copy; {year} {name}
          </span>
          <a href={homeHref} className={styles.backToTop} aria-label="Back to top">
            <Icon name="chevron-up" size={18} />
          </a>
        </div>
      </Container>
    </footer>
  );
}
