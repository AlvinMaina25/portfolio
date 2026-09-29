import type { SocialLink } from "@/types";
import { cn } from "@/lib/utils";
import Icon from "./Icon";
import styles from "./SocialLinks.module.css";

interface SocialLinksProps {
  links: SocialLink[];
  /** Names the list for screen readers. */
  label?: string;
  className?: string;
}

/** A row of square icon links (hero, footer). Data comes from `site.socials`. */
export default function SocialLinks({ links, label = "Social links", className }: SocialLinksProps) {
  return (
    <ul className={cn(styles.list, className)} aria-label={label}>
      {links.map((link) => {
        // mailto: and tel: links stay in the same tab; web links open a new one.
        const isWeb = /^https?:\/\//.test(link.href);
        return (
          <li key={link.id}>
            <a
              className={styles.link}
              href={link.href}
              aria-label={link.label}
              {...(isWeb ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <Icon name={link.icon} size={17} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
