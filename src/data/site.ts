import type { SiteConfig, SocialLink } from "@/types";
import { env } from "@/lib/constants";
import { certifications } from "./certifications";
import { projects } from "./projects";

/**
 * Site-wide content.
 *
 * Everything countable is DERIVED from the other data files, so a number here can never
 * disagree with the section it summarises (the legacy "15+ projects" claim could not be
 * backed by any project data and was removed).
 *
 * The contact email is not written here: it comes from VITE_CONTACT_EMAIL (see .env.example)
 * and is the only place it is defined. When it is empty, no email link is rendered anywhere.
 * The WhatsApp number and Formspree endpoint work the same way (src/lib/constants.ts).
 *
 * Open questions about facts in this file are tracked in CONTENT_REVIEW.md.
 */

const contactEmail = env.contactEmail.trim() || undefined;

const socials: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/AlvinMaina25",
    icon: "github",
    displayText: "github.com/AlvinMaina25",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/alvin-maina-2170522a8/",
    icon: "linkedin",
    displayText: "linkedin.com/in/alvin-maina-2170522a8",
  },
  // No X/Twitter entry: the legacy site only linked to the bare twitter.com homepage and no
  // handle exists anywhere in the source. Add { id: "x", ... } here once the real profile URL is known.
  ...(contactEmail
    ? [{ id: "email", label: "Email", href: `mailto:${contactEmail}`, icon: "email" } satisfies SocialLink]
    : []),
];

export const site: SiteConfig = {
  name: { first: "Alvin", last: "Maina", initials: "AM" },

  roles: ["Full-Stack & AI Developer", "Security-Focused Developer", "Software & AI Developer"],

  heroIntro:
    "I'm a Computer Science graduate and developer in Kenya. I build full-stack and AI software with a security-focused technical background, aimed at practical solutions. Below are the projects I've built and what I'm learning next.",

  availability: {
    isAvailable: true,
    labels: {
      hero: "Open to opportunities",
      about: "Open to opportunities",
      contact: "Open to projects, roles and collaboration",
      unavailable: "Currently unavailable",
    },
  },

  // Derived from the data files, so they always match what the page shows.
  stats: [
    { id: "projects", label: "Projects", value: projects.length },
    {
      id: "certifications",
      label: "Credentials Completed",
      value: certifications.filter((c) => c.status === "completed").length,
    },
    { id: "domains", label: "Project Areas", value: new Set(projects.map((p) => p.category)).size },
  ],

  about: {
    lead: "I'm a Computer Science graduate and developer based in Kenya. I build web, mobile and AI projects, and I keep studying cybersecurity and cloud engineering alongside them.",
    paragraphs: [
      "My projects so far include a Flutter and Firebase community app, an LLM-based assistant and a data analytics dashboard. Beyond my projects I practise security in a personal virtual lab and work through courses and certificates in networking, cloud and machine learning.",
      "I've also chaired my university's debate club, which is where I practise public speaking and leading a team.",
    ],
    values: ["Security-Minded Development", "Continuous Learning"],
    miniStats: [
      { value: "CS", label: "Graduate" },
      { value: "KE", label: "Based" },
      { value: "2021", label: "Building Since" },
    ],
  },

  contact: {
    email: contactEmail,
    intro:
      "I'm open to freelance projects, job opportunities and collaboration, particularly in web development, AI and security. Message me directly on WhatsApp, use the form, or email me.",
    whatsappMessage: "Hi Alvin, I found your portfolio and I'd like to discuss a project.",
    topics: ["Freelance Project", "Full-Time Role", "Collaboration", "Just Saying Hi 👋"],
    form: {
      validation: {
        nameRequired: "Please enter your name.",
        emailRequired: "Please enter your email address.",
        emailInvalid: "Please enter a valid email address.",
        messageRequired: "Please write a message.",
        messageTooLong: "Your message is too long. Please shorten it.",
      },
      submitLabel: "Send Message",
      submittingLabel: "Sending...",
      success: "Thank you! Your message has been sent. I'll get back to you soon.",
      failure:
        "Something went wrong while sending your message. Please try again or contact me through WhatsApp.",
      failureNoWhatsApp:
        "Something went wrong while sending your message. Please try again in a moment.",
      whatsappFallbackLabel: "Message me on WhatsApp",
    },
  },

  socials,

  // Set to e.g. "/resume/alvin-maina-cv.pdf" once the CV file is in public/resume/.
  // No CV was provided, so the Download CV button stays hidden.
  resumeUrl: undefined,

  footerTagline: "Full-stack, AI and security projects.",
};
