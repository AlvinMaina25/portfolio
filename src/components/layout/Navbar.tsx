import { useEffect, useId, useRef, useState } from "react";
import type { NavigationItem } from "@/types";
import { cn } from "@/lib/utils";
import styles from "./Navbar.module.css";

interface NavbarProps {
  /** Two-letter mark shown as "[AM]". */
  initials: string;
  /** Where the logo links to (the first section). */
  homeHref: string;
  items: NavigationItem[];
  /**
   * Id of the section currently on screen; its link is highlighted.
   * Supplied by PageLayout (useActiveSection).
   */
  activeId?: string;
  /**
   * How far down the page the visitor is, 0-100, drawn as the thin bar under the navbar.
   * Supplied by PageLayout (useScrollProgress).
   */
  progress?: number;
  /** True once the page has scrolled a little: the navbar gets its blurred background. Supplied by PageLayout. */
  scrolled?: boolean;
}

/**
 * Fixed top navigation. Desktop: logo + links. Mobile (<=768px): logo + menu button
 * that opens a full-width panel. Purely presentational apart from the open/closed
 * state of the mobile menu; scroll behaviour is passed in through props.
 */
export default function Navbar({
  initials,
  homeHref,
  items,
  activeId,
  progress = 0,
  scrolled = false,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Escape closes the mobile menu and hands focus back to the button that opened it.
  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={cn(styles.navbar, scrolled && styles.scrolled)}>
      <nav className={styles.container} aria-label="Primary">
        <a href={homeHref} className={styles.logo} aria-label="Home" onClick={closeMenu}>
          <span className={styles.bracket} aria-hidden="true">[</span>
          <span aria-hidden="true">{initials}</span>
          <span className={styles.bracket} aria-hidden="true">]</span>
        </a>

        <ul id={menuId} className={cn(styles.links, menuOpen && styles.open)}>
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className={cn(styles.link, item.id === activeId && styles.active)}
                aria-current={item.id === activeId ? "true" : undefined}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          ref={buttonRef}
          type="button"
          className={cn(styles.hamburger, menuOpen && styles.open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div className={styles.progress} style={{ width: `${progress}%` }} aria-hidden="true" />
    </header>
  );
}
