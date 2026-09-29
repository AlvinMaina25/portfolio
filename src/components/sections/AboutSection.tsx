import { Card, Reveal, Section, SectionHeading } from "@/components/ui";
import { site } from "@/data/site";
import event400 from "@/assets/images/profile/alvin-event-400.webp";
import event640 from "@/assets/images/profile/alvin-event-640.webp";
import styles from "./AboutSection.module.css";

export default function AboutSection() {
  const { about, availability } = site;

  return (
    <Section id="about" background="secondary" labelledBy="about-heading">
      <SectionHeading id="about-heading" number={1} title="About Me" />
      <div className={styles.grid}>
        <Reveal direction="left">
          <Card interactive={false} className={styles.frame}>
            {/* Below the fold: lazy-loaded. A different photo from the hero portrait. */}
            <img
              className={styles.photo}
              src={event640}
              srcSet={`${event400} 400w, ${event640} 640w`}
              sizes="(max-width: 900px) 320px, 284px"
              width={640}
              height={800}
              alt="Alvin Maina smiling and giving two thumbs up, in a high-visibility vest in front of an event stage"
              loading="lazy"
              decoding="async"
            />
            {availability.isAvailable && (
              <p className={styles.status}>
                <span className={styles.dot} aria-hidden="true" />
                {availability.labels.about}
              </p>
            )}
            <dl className={styles.miniStats}>
              {about.miniStats.map((stat) => (
                <div key={stat.label} className={styles.mini}>
                  <dt className={styles.miniLabel}>{stat.label}</dt>
                  <dd className={styles.miniValue}>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </Reveal>

        <Reveal direction="right">
          <p className={styles.lead}>{about.lead}</p>
          {about.paragraphs.map((text) => (
            <p key={text} className={styles.text}>
              {text}
            </p>
          ))}
          <ul className={styles.values} aria-label="Values">
            {about.values.map((value) => (
              <li key={value} className={styles.value}>
                <span aria-hidden="true">◆</span> {value}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
