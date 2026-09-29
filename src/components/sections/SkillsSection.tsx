import { useMemo, useState } from "react";
import { Badge, Card, FilterBar, Icon, Reveal, Section, SectionHeading } from "@/components/ui";
import type { Proficiency } from "@/types";
import { skillCategories, skills } from "@/data/skills";
import { ALL_FILTER_ID } from "@/lib/constants";
import { staggerDelay } from "@/lib/utils";
import gridStyles from "./Grid.module.css";
import styles from "./SkillsSection.module.css";

/** Display text for each self-assessed level. */
const PROFICIENCY_LABEL: Record<Proficiency, string> = {
  intermediate: "Intermediate",
  proficient: "Proficient",
  advanced: "Advanced",
};

export default function SkillsSection() {
  const [filter, setFilter] = useState(ALL_FILTER_ID);

  const options = useMemo(
    () => [
      { id: ALL_FILTER_ID, label: "All" },
      ...skillCategories
        .filter((c) => skills.some((s) => s.category === c.id))
        .map((c) => ({ id: c.id, label: c.label })),
    ],
    [],
  );

  const visible = skills.filter((s) => filter === ALL_FILTER_ID || s.category === filter);

  return (
    <Section id="skills" labelledBy="skills-heading">
      <SectionHeading id="skills-heading" number={2} title="Technical Skills" />
      <FilterBar
        options={options}
        value={filter}
        onChange={setFilter}
        label="Filter skills by category"
        className={gridStyles.filters}
      />
      <ul className={gridStyles.skills}>
        {visible.map((skill, i) => (
          <Reveal as="li" key={skill.id} delay={staggerDelay(i)}>
            <Card as="article">
              <div className={styles.icon} data-tone={skill.tone}>
                <Icon name={skill.icon} size={24} />
              </div>
              <h3 className={styles.name}>{skill.name}</h3>
              <p className={styles.desc}>{skill.description}</p>
              <ul className={styles.tags} aria-label={`${skill.name} tools`}>
                {skill.tags.map((tag) => (
                  <li key={tag}>
                    <Badge>{tag}</Badge>
                  </li>
                ))}
              </ul>
              <p className={styles.proficiency}>
                <span className={styles.proficiencyLabel}>Self-assessed</span>
                <span className={styles.proficiencyValue} data-tone={skill.tone}>
                  {PROFICIENCY_LABEL[skill.proficiency]}
                </span>
              </p>
            </Card>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
