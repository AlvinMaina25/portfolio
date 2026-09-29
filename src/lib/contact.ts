import type { ContactFormCopy } from "@/types";
import { MAX_MESSAGE_LENGTH } from "./constants";

/* ── WhatsApp ─────────────────────────────────────────────── */

/**
 * Builds a click-to-chat link (the standard wa.me URL, which opens the app on phones and
 * WhatsApp Web / Desktop on computers). The number comes from VITE_WHATSAPP_NUMBER and may be
 * written with "+", spaces or dashes; only the digits are used. Returns undefined when there is
 * no usable number (missing or not 8-15 digits), so callers simply hide the button.
 */
export function buildWhatsAppUrl(number: string, message: string): string | undefined {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return undefined;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}

/* ── Validation ───────────────────────────────────────────── */

export interface ContactValues {
  name: string;
  email: string;
  message: string;
}
export type ContactField = keyof ContactValues;
export type ContactErrors = Partial<Record<ContactField, string>>;

/** Deliberately simple: something@something.tld. Formspree does the real check. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns one message per invalid field; an empty object means the values are valid. */
export function validateContact(
  values: ContactValues,
  copy: ContactFormCopy["validation"],
): ContactErrors {
  const errors: ContactErrors = {};
  const email = values.email.trim();
  const message = values.message.trim();

  if (!values.name.trim()) errors.name = copy.nameRequired;
  if (!email) errors.email = copy.emailRequired;
  else if (!EMAIL_PATTERN.test(email)) errors.email = copy.emailInvalid;
  if (!message) errors.message = copy.messageRequired;
  else if (message.length > MAX_MESSAGE_LENGTH) errors.message = copy.messageTooLong;
  return errors;
}

/* ── Formspree submission ─────────────────────────────────── */

const SUBMIT_TIMEOUT_MS = 15000;
const SUBJECT_PREFIX = "New portfolio inquiry";

/** `reason` is for developers/debugging only; the UI never shows it. */
export type SubmitResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "network" | "http" | "malformed" };

export interface ContactPayload extends ContactValues {
  /** Selected topic chip, if any. */
  topic?: string;
  /** Honeypot: real visitors never fill it in (Formspree discards submissions where it is set). */
  _gotcha?: string;
}

/**
 * POSTs the message to Formspree as JSON and reports what happened. Never throws.
 * Success means an HTTP 2xx response whose JSON body says ok: true; everything else
 * (no endpoint, no network, timeout, non-2xx, unreadable body) is a failure.
 * `signal` lets the caller cancel (e.g. when the form unmounts).
 */
export async function submitContact(
  endpoint: string,
  payload: ContactPayload,
  signal?: AbortSignal,
): Promise<SubmitResult> {
  if (!endpoint) return { ok: false, reason: "not-configured" };

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);
  const forwardAbort = () => controller.abort();
  signal?.addEventListener("abort", forwardAbort, { once: true });

  try {
    const { topic, ...rest } = payload;
    // Formspree uses `_subject` as the email subject and the `email` field as the reply-to address.
    const body = {
      ...rest,
      ...(topic ? { topic } : {}),
      _subject: topic ? `${SUBJECT_PREFIX} — ${topic}` : SUBJECT_PREFIX,
    };
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) return { ok: false, reason: "http" };

    // Formspree answers 2xx with JSON such as {"ok": true, "next": "..."}. Anything else
    // (an HTML page from a proxy, an empty body, {"errors": [...]}) is not a confirmed send.
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      return { ok: false, reason: "malformed" };
    }
    if (typeof data !== "object" || data === null) return { ok: false, reason: "malformed" };
    // Formspree's documented success body contains "ok": true.
    if ((data as { ok?: unknown }).ok !== true) return { ok: false, reason: "malformed" };
    return { ok: true };
  } catch {
    return { ok: false, reason: "network" };
  } finally {
    window.clearTimeout(timer);
    signal?.removeEventListener("abort", forwardAbort);
  }
}
