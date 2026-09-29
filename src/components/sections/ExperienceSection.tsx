import { Badge, Card, Reveal, Section, SectionHeading } from "@/components/ui";
import { experience } from "@/data/experience";
import { staggerDelay } from "@/lib/utils";
import styles from "./ExperienceSection.module.css";

export default function ExperienceSection() {
  return (
    <Section id="experience" labelledBy="experience-heading">
      <SectionHeading id="experience-heading" number={4} title="Experience" />
      <ol className={styles.timeline}>
        {experience.map((item, i) => (
          <Reveal as="li" key={item.id} delay={staggerDelay(i)} className={styles.item}>
            <span className={styles.dot} aria-hidden="true" />
            <Card as="article" accent="gold">
              <div className={styles.header}>
                <div>
                  <h3 className={styles.role}>{item.role}</h3>
                  <span className={styles.org}>
                    {item.organization} · {item.engagement}
                  </span>
                </div>
                <span className={styles.date}>{item.period}</span>
              </div>
              <p className={styles.desc}>{item.description}</p>
              <ul className={styles.tags} aria-label={`${item.role} skills`}>
                {item.tags.map((tag) => (
                  <li key={tag}>
                    <Badge tone="gold">{tag}</Badge>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
