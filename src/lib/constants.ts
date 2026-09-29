/**
 * App-wide configuration. Environment values come from .env.local
 * (see .env.example) and are PUBLIC once built - never put secrets here.
 */
export const env = {
  formspreeEndpoint: import.meta.env.VITE_FORMSPREE_ENDPOINT ?? "",
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER ?? "",
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL ?? "",
} as const;

/** Contact form limit, carried over from legacy script.js (CONFIG.maxMessageLength) */
export const MAX_MESSAGE_LENGTH = 500;

/** Id of the "show everything" option in every FilterBar. */
export const ALL_FILTER_ID = "all";
