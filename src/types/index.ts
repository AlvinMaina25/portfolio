/**
 * Shared types for the whole portfolio.
 *
 * Rule of thumb: CONTENT (what the site says) is described here and filled in
 * under src/data/. PRESENTATION lives in components. If you add a field here,
 * make it optional (`?`) unless every existing item can supply it.
 */

/* ─────────────────────────────────────────────────────────────
   Design-system vocabulary
   ───────────────────────────────────────────────────────────── */

/**
 * Named accent colors. The actual colors are defined once, in
 * src/styles/tones.css. Data files pick a tone by name; they never contain hex codes.
 */
export type Tone =
  | "blue"
  | "gold"
  | "red"
  | "sky"
  | "purple"
  | "teal"
  | "orange"
  | "green"
  | "mint";

/** The two brand accents used for hover/active states (see Card, FilterBar). */
export type Accent = "blue" | "gold";

/**
 * Every icon available to data files (`icon: "shield"`). The drawing for each
 * name lives in components/ui/Icon.tsx, which is type-checked to cover all of these.
 */
export type IconName =
  // concepts (24x24, outline) - from the legacy skill/learning cards
  | "shield"
  | "shield-check"
  | "ai"
  | "globe"
  | "smartphone"
  | "cloud"
  | "cloud-upload"
  | "code"
  | "bar-chart"
  | "network"
  | "cube"
  | "monitor"
  // large placeholder artwork (60x60, thin outline) - legacy project image placeholders
  | "art-app"
  | "art-ai"
  | "art-security"
  | "art-data"
  | "art-cloud"
  // brands and contact (24x24, filled unless noted)
  | "github"
  | "linkedin"
  | "x"
  | "email"
  | "whatsapp"
  | "mail" // outline envelope used in the contact list
  // interface
  | "chevron-up";

/* ─────────────────────────────────────────────────────────────
   Categories and filtering
   ───────────────────────────────────────────────────────────── */

/** Stable identifier for a category, e.g. "security". Plain string so data files stay simple. */
export type CategoryId = string;

/**
 * A category that items (projects, skills) can belong to. Filter buttons and
 * badges are generated from these, so a new category only needs a new entry.
 */
export interface CategoryDefinition {
  id: CategoryId;
  label: string;
  tone: Tone;
  /** Default placeholder artwork for projects of this category that have no cover image (projects only). */
  icon?: IconName;
}

/** One button in a FilterBar. The special id "all" (ALL_FILTER_ID) means "no filter". */
export interface FilterOption {
  id: string;
  label: string;
}

/* ─────────────────────────────────────────────────────────────
   Content items (one file per collection in src/data/)
   ───────────────────────────────────────────────────────────── */

export interface Screenshot {
  src: string;
  alt: string;
}

/** Where a project stands. Optional and not displayed yet; kept in the content for later use. */
export type ProjectStatus = "completed" | "in-progress" | "archived";

/**
 * A project as the UI uses it. It is NOT written by hand: it is built and validated from
 * src/content/projects/<slug>/project.json by src/lib/projectContent.ts. To add a project,
 * add a folder there; this type only changes when the UI needs a new kind of information.
 */
export interface Project {
  /** Folder name under src/content/projects/. Stable identifier (never an array position). */
  id: string;
  /** Same as `id`; URL-safe, reserved for future /projects/:slug pages. */
  slug: string;
  title: string;
  /** Short text shown on the project card. */
  description: string;
  category: CategoryId;
  /** Overrides the category label on the badge (legacy: "Data Science" badge inside the "ai" category). */
  badge?: string;
  technologies: string[];
  /** Resolved URL of the cover image (from the project's images/ folder). Without it the card shows `icon`. */
  image?: string;
  /** Alt text for `image`. Required in practice whenever `image` is set. */
  imageAlt?: string;
  /** Placeholder artwork shown when there is no image. */
  icon?: IconName;
  githubUrl?: string;
  liveUrl?: string;
  /** Text of the live/primary link button: "Live Demo", "Case Study", "Architecture"... Defaults to "Live Demo". */
  liveLabel?: string;
  featured?: boolean;
  status?: ProjectStatus;
  /** Sort position, lowest first. Projects without one come after those that have one. */
  order?: number;

  // Reserved for individual project pages later. Nothing renders these yet.
  longDescription?: string;
  screenshots?: Screenshot[];
  features?: string[];
  challenges?: string[];
  solution?: string;
  results?: string[];
}

/** Self-assessed level. Deliberately coarse: it is the owner's own estimate, not a measurement. */
export type Proficiency = "intermediate" | "proficient" | "advanced";

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  tone: Tone;
  category: CategoryId;
  /** Tools/technologies shown as small tags. */
  tags: string[];
  /** Self-assessed level, shown as a labelled category (never as a percentage). */
  proficiency: Proficiency;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  /** Free text, exactly as displayed: "2023 — Present". */
  period: string;
  /**
   * What kind of role this is, shown beside the organization so visitors can tell employment
   * from leadership, freelance or self-directed work: "Campus leadership", "Self-directed"...
   */
  engagement: string;
  description: string;
  tags: string[];
}

/** "completed" = finished by the owner; it says nothing about outside verification (see credentialUrl). */
export type CertificationStatus = "completed" | "in-progress";

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  /**
   * What the item actually is, in the issuer's own terms: "Course", "Professional Certificate",
   * "Specialization", "Learning path". Leave out when unsure rather than guessing.
   */
  kindLabel?: string;
  description: string;
  status: CertificationStatus;
  /** Text-based issuer mark, as on the legacy site. */
  logo: {
    text: string;
    /** Any CSS color, e.g. the issuer's brand color. */
    color: string;
  };
  /** Link to the credential, so a visitor can check it. Only set when the real link is known. */
  credentialUrl?: string;
}

export interface LearningItem {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  tone: Tone;
  /** Books, courses, platforms being used to study it. */
  resources: string[];
}

/* ─────────────────────────────────────────────────────────────
   Site-wide configuration (src/data/site.ts, src/data/navigation.ts)
   ───────────────────────────────────────────────────────────── */

export interface NavigationItem {
  /** Must match the id of the section it points to (used for the active-link highlight). */
  id: string;
  label: string;
  /** "#about" today; becomes "/about" if pages are added later. */
  href: string;
}

export interface SocialLink {
  id: string;
  /** Accessible name, e.g. "GitHub". */
  label: string;
  href: string;
  icon: IconName;
  /** Human-readable form for the contact list, e.g. "github.com/name". */
  displayText?: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: number;
  /** Appended after the number, e.g. "+". */
  suffix?: string;
}

export interface AvailabilityConfig {
  isAvailable: boolean;
  /** One flag, several places: each place words the status differently. */
  labels: {
    hero: string;
    about: string;
    contact: string;
    /** Shown in the contact section when isAvailable is false. */
    unavailable: string;
  };
}

export interface AboutConfig {
  lead: string;
  paragraphs: string[];
  values: string[];
  miniStats: Array<{ value: string; label: string }>;
}

/** All user-facing copy of the contact form (validation, progress, success, failure). */
export interface ContactFormCopy {
  validation: {
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    messageRequired: string;
    messageTooLong: string;
  };
  submitLabel: string;
  submittingLabel: string;
  success: string;
  /** Shown when sending fails and a WhatsApp number is configured. */
  failure: string;
  /** Shown when sending fails and there is no WhatsApp number to suggest. */
  failureNoWhatsApp: string;
  whatsappFallbackLabel: string;
}

export interface ContactConfig {
  /**
   * Public contact email. Comes from VITE_CONTACT_EMAIL (see .env.example); undefined when not
   * configured, in which case every email link and address is left out of the page.
   */
  email?: string;
  intro: string;
  /** Pre-fills the WhatsApp chat. */
  whatsappMessage: string;
  /** Topic chips above the message box. */
  topics: string[];
  form: ContactFormCopy;
}

export interface SiteConfig {
  name: { first: string; last: string; initials: string };
  /** Words cycled by the hero typing effect. */
  roles: string[];
  heroIntro: string;
  availability: AvailabilityConfig;
  stats: StatItem[];
  about: AboutConfig;
  contact: ContactConfig;
  socials: SocialLink[];
  /** File in /public/resume, e.g. "/resume/name.pdf". Leave undefined until the CV exists. */
  resumeUrl?: string;
  footerTagline: string;
}
