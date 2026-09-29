import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./Container.module.css";

interface ContainerProps {
  /** HTML element to render. Defaults to "div". */
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/** Centers content and limits its width. Every section's content sits inside one. */
export default function Container({ as: Tag = "div", className, children }: ContainerProps) {
  return <Tag className={cn(styles.container, className)}>{children}</Tag>;
}
