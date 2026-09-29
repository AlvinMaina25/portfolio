/// <reference types="vite/client" />

// Typed access to the variables documented in .env.example
interface ImportMetaEnv {
  readonly VITE_FORMSPREE_ENDPOINT?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_CONTACT_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
