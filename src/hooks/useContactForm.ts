import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type { ContactFormCopy } from "@/types";
import {
  submitContact,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from "@/lib/contact";

/** idle -> submitting -> success | error. Editing after a result returns to idle. */
export type ContactStatus = "idle" | "submitting" | "success" | "error";

const EMPTY: ContactValues = { name: "", email: "", message: "" };

interface Options {
  endpoint: string;
  copy: ContactFormCopy["validation"];
}

/**
 * State and handlers for the contact form. It validates on submit, sends through Formspree
 * (see lib/contact.ts), and exposes a small status machine for the UI. A second submit while
 * one is in flight is ignored, and an in-flight request is cancelled if the form unmounts.
 */
export function useContactForm({ endpoint, copy }: Options) {
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [topic, setTopic] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<ContactStatus>("idle");
  // Honeypot value (bots fill hidden fields; people never see it).
  const [trap, setTrap] = useState("");

  const inFlight = useRef(false);
  const controller = useRef<AbortController | null>(null);

  useEffect(
    () => () => {
      controller.current?.abort();
    },
    [],
  );

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const field = event.target.name as ContactField;
      const { value } = event.target;
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
      // A finished attempt (success or failure) is stale as soon as the visitor edits again.
      setStatus((prev) => (prev === "success" || prev === "error" ? "idle" : prev));
    },
    [],
  );

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (inFlight.current) return;

      const found = validateContact(values, copy);
      setErrors(found);
      if (Object.keys(found).length > 0) {
        // Put the keyboard/screen-reader user on the first field that needs attention.
        const first = (["name", "email", "message"] as const).find((f) => found[f]);
        const control = first ? event.currentTarget.elements.namedItem(first) : null;
        if (control instanceof HTMLElement) control.focus();
        setStatus("idle");
        return;
      }

      inFlight.current = true;
      setStatus("submitting");
      const request = new AbortController();
      controller.current = request;

      const result = await submitContact(
        endpoint,
        {
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          topic: topic || undefined,
          _gotcha: trap,
        },
        request.signal,
      );

      inFlight.current = false;
      controller.current = null;
      if (request.signal.aborted) return; // the form was unmounted meanwhile: nothing to update

      if (result.ok) {
        setValues(EMPTY);
        setTopic("");
        setTrap("");
        setStatus("success");
      } else {
        if (import.meta.env.DEV) console.warn(`[contact] submission failed: ${result.reason}`);
        setStatus("error");
      }
    },
    [values, topic, trap, endpoint, copy],
  );

  return { values, topic, setTopic, trap, setTrap, errors, status, onChange, onSubmit };
}
