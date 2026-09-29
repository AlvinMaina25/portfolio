import { Badge, Card, Reveal, Section, SectionHeading } from "@/components/ui";
import { certifications } from "@/data/certifications";
import { staggerDelay } from "@/lib/utils";
import gridStyles from "./Grid.module.css";
import styles from "./CertificationsSection.module.css";

export default function CertificationsSection() {
  return (
    <Section id="certifications" background="secondary" labelledBy="certifications-heading">
      <SectionHeading id="certifications-heading" number={5} title="Certifications & Courses" />
      <ul className={gridStyles.certs}>
        {certifications.map((cert, i) => {
          const completed = cert.status === "completed";
          return (
            <Reveal as="li" key={cert.id} delay={staggerDelay(i)}>
              <Card as="article" className={styles.card}>
                {/* Text mark, as on the legacy site. The issuer is also printed below, so hide it from screen readers. */}
                <div className={styles.logo} style={{ color: cert.logo.color }} aria-hidden="true">
                  {cert.logo.text}
                </div>
                <h3 className={styles.name}>{cert.name}</h3>
                <span className={styles.issuer}>
                  {cert.kindLabel ? `${cert.kindLabel} · ${cert.issuer}` : cert.issuer}
                </span>
                <p className={styles.desc}>{cert.description}</p>
                <div className={styles.footer}>
                  <Badge tone={completed ? "mint" : "gold"} variant="label" size="md" icon={completed ? "✓" : "■"}>
                    {completed ? "Completed" : "In Progress"}
                  </Badge>
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      View credential
                    </a>
                  )}
                </div>
              </Card>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
