import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./Button.module.css";

interface ButtonBaseProps {
  /** primary = solid blue, secondary = gold outline, ghost = quiet outline, whatsapp = green, only for the WhatsApp chat link. */
  variant?: "primary" | "secondary" | "ghost" | "whatsapp";
  /** md = hero/form buttons, sm = compact buttons inside cards. */
  size?: "md" | "sm";
  /** Decorative icon or symbol shown beside the label. */
  icon?: ReactNode;
  iconPosition?: "start" | "end";
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonBaseProps> & { href?: undefined };

type ButtonAsLink = ButtonBaseProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof ButtonBaseProps> & {
    href: string;
    /** Opens in a new tab safely (adds rel="noopener noreferrer"). */
    external?: boolean;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * One button component for both actions and navigation:
 *   <Button onClick={save}>Save</Button>                  -> <button>
 *   <Button href="#projects">View projects</Button>       -> <a>
 *   <Button href="https://..." external>GitHub</Button>   -> <a target="_blank">
 */
export default function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "start",
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(styles.button, styles[variant], styles[size], className);
  const iconNode = icon ? (
    <span className={styles.icon} aria-hidden="true">
      {icon}
    </span>
  ) : null;
  const content = (
    <>
      {iconPosition === "start" && iconNode}
      {children}
      {iconPosition === "end" && iconNode}
    </>
  );

  if (rest.href !== undefined) {
    const { external, ...anchorProps } = rest;
    return (
      <a
        {...anchorProps}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  const { type = "button", ...buttonProps } = rest;
  return (
    <button {...buttonProps} type={type} className={classes}>
      {content}
    </button>
  );
}
