import type { Certification } from "@/types";

/**
 * Certificates and courses.
 *
 * - `status: "completed"` means the owner finished it. It is not third-party verification: add
 *   `credentialUrl` (the real credential link) to an entry so visitors can check it themselves.
 *   No credential links were provided, so none are shown.
 * - `kindLabel` says what the item actually is (a course is not a certification exam), taken from
 *   how the issuer names the program. Left out when unsure (AWS Cloud Practitioner: the exam
 *   credential and the Essentials course share the name; see CONTENT_REVIEW.md).
 * - Items still being worked on are `in-progress` and are never presented as achieved.
 *
 * Logo colors are the legacy per-issuer colors.
 */
export const certifications: Certification[] = [
  {
    id: "ccna-intro-networks",
    name: "CCNA: Introduction to Networks",
    issuer: "Cisco Networking Academy",
    kindLabel: "Course",
    description:
      "Networking fundamentals, IP addressing, routing and switching concepts, network security basics.",
    status: "completed",
    logo: { text: "CISCO", color: "#1ba0d7" },
  },
  {
    id: "aws-cloud-practitioner",
    name: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    description:
      "Cloud concepts, AWS core services, security, architecture, pricing and support models.",
    status: "completed",
    logo: { text: "AWS", color: "#ff9900" },
  },
  {
    id: "google-it-support",
    name: "Google IT Support Professional Certificate",
    issuer: "Google / Coursera",
    kindLabel: "Professional Certificate",
    description:
      "Technical support, system administration, networking, operating systems, security and IT automation.",
    status: "completed",
    logo: { text: "Google", color: "#4285f4" },
  },
  {
    id: "ml-specialization",
    name: "Machine Learning Specialization",
    issuer: "Stanford / DeepLearning.AI",
    kindLabel: "Specialization",
    description:
      "Supervised and unsupervised learning, neural networks, reinforcement learning and ML deployment.",
    status: "completed",
    logo: { text: "Coursera", color: "#0056d2" },
  },
  {
    id: "google-cybersecurity",
    name: "Google Cybersecurity Certificate",
    issuer: "Google / Coursera",
    kindLabel: "Professional Certificate",
    description:
      "Security frameworks, SIEM tools, Python for security automation, threat analysis and incident response.",
    status: "in-progress",
    logo: { text: "Google", color: "#4285f4" },
  },
  {
    id: "thm-jr-pentester",
    name: "Jr. Penetration Tester Path",
    issuer: "TryHackMe",
    kindLabel: "Learning path",
    description:
      "Web exploitation, network pentesting, privilege escalation, Metasploit, Burp Suite and Active Directory attacks.",
    status: "in-progress",
    logo: { text: "TryHackMe", color: "#1db954" },
  },
];
