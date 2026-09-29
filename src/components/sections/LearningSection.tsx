import { Badge, Card, Icon, Reveal, Section, SectionHeading } from "@/components/ui";
import { learning } from "@/data/learning";
import { staggerDelay } from "@/lib/utils";
import gridStyles from "./Grid.module.css";
import styles from "./LearningSection.module.css";

export default function LearningSection() {
  return (
    <Section id="learning" labelledBy="learning-heading">
      <SectionHeading id="learning-heading" number={6} title="Currently Learning" />
      <ul className={gridStyles.learning}>
        {learning.map((item, i) => (
          <Reveal as="li" key={item.id} delay={staggerDelay(i)}>
            <Card as="article">
              <span className={styles.number} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={styles.icon} data-tone={item.tone}>
                <Icon name={item.icon} size={24} />
              </div>
              <h3 className={styles.title}>{item.title}</h3>
              <p className={styles.desc}>{item.description}</p>
              <ul className={styles.resources} aria-label={`${item.title} resources`}>
                {item.resources.map((r) => (
                  <li key={r}>
                    <Badge>{r}</Badge>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
