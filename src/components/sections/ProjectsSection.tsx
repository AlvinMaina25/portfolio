import { useMemo, useState } from "react";
import { FilterBar, Reveal, Section, SectionHeading } from "@/components/ui";
import { ProjectCard } from "@/components/projects";
import { projectCategories, projects } from "@/data/projects";
import { ALL_FILTER_ID } from "@/lib/constants";
import { staggerDelay } from "@/lib/utils";
import styles from "./Grid.module.css";

/** Renders every project found in src/content/projects/ (see src/data/projects.ts). Adding a project never changes this file. */
export default function ProjectsSection() {
  const [filter, setFilter] = useState(ALL_FILTER_ID);

  // Only offer filters for categories that actually have a project.
  const options = useMemo(
    () => [
      { id: ALL_FILTER_ID, label: "All" },
      ...projectCategories
        .filter((c) => projects.some((p) => p.category === c.id))
        .map((c) => ({ id: c.id, label: c.label })),
    ],
    [],
  );

  const visible = projects
    .map((project, index) => ({ project, index }))
    .filter(({ project }) => filter === ALL_FILTER_ID || project.category === filter);

  return (
    <Section id="projects" background="secondary" labelledBy="projects-heading">
      <SectionHeading id="projects-heading" number={3} title="Projects" />
      <FilterBar
        options={options}
        value={filter}
        onChange={setFilter}
        label="Filter projects by category"
        accent="gold"
        className={styles.filters}
      />
      <ul className={styles.projects}>
        {visible.map(({ project, index }, i) => (
          <Reveal as="li" key={project.id} delay={staggerDelay(i)}>
            <ProjectCard
              project={project}
              index={index}
              category={projectCategories.find((c) => c.id === project.category)}
            />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
