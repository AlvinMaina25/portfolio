import { useEffect, useId, useRef } from "react";
import type { ContactFormCopy } from "@/types";
import { Button, FilterBar } from "@/components/ui";
import { useContactForm } from "@/hooks/useContactForm";
import { MAX_MESSAGE_LENGTH } from "@/lib/constants";
import { cn } from "@/lib/utils";
import styles from "./ContactForm.module.css";

interface ContactFormProps {
  /** Formspree endpoint (VITE_FORMSPREE_ENDPOINT). May be empty: sending then fails gracefully. */
  endpoint: string;
  /** Topic chips above the message box. */
  topics: string[];
  copy: ContactFormCopy;
  /** Click-to-chat link, offered as an alternative when sending fails. Undefined = not configured. */
  whatsappUrl?: string;
}

/**
 * The contact form. Native HTML semantics throughout: real labels, `required`, aria-invalid and
 * aria-describedby on invalid fields (validation runs on submit, then moves focus to the first
 * problem), and two always-present live regions for progress/success (polite) and failure (alert).
 * All text comes from `copy`; all logic lives in useContactForm / lib/contact.
 */
export default function ContactForm({ endpoint, topics, copy, whatsappUrl }: ContactFormProps) {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const { values, topic, setTopic, trap, setTrap, errors, status, onChange, onSubmit } =
    useContactForm({ endpoint, copy: copy.validation });

  const submitting = status === "submitting";
  const topicOptions = topics.map((t) => ({ id: t, label: t }));

  // Disabling the button while sending can drop keyboard focus to <body>; hand it back
  // to the button when the attempt finishes so the visitor can retry or carry on.
  useEffect(() => {
    if (status !== "success" && status !== "error") return;
    const active = document.activeElement;
    if (active && active !== document.body && active !== formRef.current) return;
    formRef.current?.querySelector<HTMLButtonElement>('button[type="submit"]')?.focus();
  }, [status]);

  const fieldProps = (name: "name" | "email" | "message") => {
    const errorId = `${id}-${name}-error`;
    return {
      id: `${id}-${name}`,
      name,
      value: values[name],
      onChange,
      required: true,
      "aria-invalid": errors[name] ? (true as const) : undefined,
      "aria-describedby": errors[name] ? errorId : undefined,
    };
  };
  const errorText = (name: "name" | "email" | "message") =>
    errors[name] ? (
      <p id={`${id}-${name}-error`} className={styles.error}>
        {errors[name]}
      </p>
    ) : null;

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate aria-busy={submitting}>
      <FilterBar options={topicOptions} value={topic} onChange={setTopic} label="Message topic" />

      <div className={cn(styles.field, errors.name && styles.invalid)}>
        <label htmlFor={`${id}-name`}>Name</label>
        <input {...fieldProps("name")} type="text" placeholder="Your full name" autoComplete="name" />
        {errorText("name")}
      </div>

      <div className={cn(styles.field, errors.email && styles.invalid)}>
        <label htmlFor={`${id}-email`}>Email</label>
        <input {...fieldProps("email")} type="email" placeholder="your@email.com" autoComplete="email" />
        {errorText("email")}
      </div>

      <div className={cn(styles.field, errors.message && styles.invalid)}>
        <label htmlFor={`${id}-message`}>Message</label>
        <textarea
          {...fieldProps("message")}
          rows={5}
          maxLength={MAX_MESSAGE_LENGTH}
          placeholder="Tell me about your project or opportunity..."
        />
        {errorText("message")}
        <span className={styles.counter} aria-hidden="true">
          {values.message.length}/{MAX_MESSAGE_LENGTH}
        </span>
      </div>

      {/* Honeypot: hidden from people and assistive tech, not focusable. Bots fill it in. */}
      <div className={styles.trap} aria-hidden="true">
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input
          id={`${id}-website`}
          name="_gotcha"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={submitting} icon="►" iconPosition="end">
        {submitting ? copy.submittingLabel : copy.submitLabel}
      </Button>

      {/* Live regions exist before their text does, so screen readers announce the changes. */}
      <div role="status" className={cn(styles.feedback, status === "success" && styles.success)}>
        {status === "success" && copy.success}
      </div>
      <div role="alert" className={cn(styles.feedback, status === "error" && styles.failure)}>
        {status === "error" && (
          <>
            <p>{whatsappUrl ? copy.failure : copy.failureNoWhatsApp}</p>
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.fallback}>
                {copy.whatsappFallbackLabel}
              </a>
            )}
          </>
        )}
      </div>
    </form>
  );
}
