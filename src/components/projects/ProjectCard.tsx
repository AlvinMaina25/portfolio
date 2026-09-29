import type { CategoryDefinition, Project } from "@/types";
import { Badge, Button, Card, Icon } from "@/components/ui";
import { Tilt } from "@/components/effects";
import { cn } from "@/lib/utils";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: Project;
  /** Position in the full project list, shown as "01", "02"... */
  index: number;
  /** The project's category (for the badge). Optional: falls back to the raw category id. */
  category?: CategoryDefinition;
}

/** One project. Everything it shows comes from the `project` object; it holds no content. */
export default function ProjectCard({ project, index, category }: ProjectCardProps) {
  const headingId = `project-${project.id}-title`;
  const number = String(index + 1).padStart(2, "0");
  const badgeText = project.badge ?? category?.label ?? project.category;

  return (
    <Tilt>
    <Card as="article" accent="gold" padding="none" className={styles.card}>
      <div className={styles.image}>
        {project.image ? (
          <img src={project.image} alt={project.imageAlt ?? ""} className={styles.img} loading="lazy" decoding="async" />
        ) : (
          <div className={cn(styles.placeholder, project.icon && styles[project.icon])} aria-hidden="true">
            {project.icon && <Icon name={project.icon} size={60} />}
          </div>
        )}
        <span className={styles.number} aria-hidden="true">
          {number}
        </span>
      </div>

      <div className={styles.body}>
        <div className={styles.headerRow}>
          <h3 id={headingId} className={styles.title}>
            {project.title}
          </h3>
          <Badge tone={category?.tone} variant="label">
            {badgeText}
          </Badge>
        </div>
        <p className={styles.description}>{project.description}</p>
        <ul className={styles.tech} aria-label={`${project.title} technologies`}>
          {project.technologies.map((tech) => (
            <li key={tech}>
              <Badge>{tech}</Badge>
            </li>
          ))}
        </ul>
        {(project.liveUrl || project.githubUrl) && (
          <div className={styles.actions}>
            {project.liveUrl && (
              <Button href={project.liveUrl} external size="sm" aria-label={`${project.liveLabel ?? "Live Demo"}: ${project.title}`}>
                {project.liveLabel ?? "Live Demo"}
              </Button>
            )}
            {project.githubUrl && (
              <Button href={project.githubUrl} external size="sm" variant="ghost" aria-label={`GitHub: ${project.title}`}>
                GitHub
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
    </Tilt>
  );
}
