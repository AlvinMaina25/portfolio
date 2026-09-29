import type { Experience } from "@/types";

/**
 * Experience entries. `engagement` states what kind of role each one is, so nothing reads as
 * employment when it is not. None of these entries is presented as paid employment or an
 * internship; if that changes, say so in `engagement`.
 *
 * Unconfirmed: the debate society's actual name, the "40+ members" figure, and all three
 * start dates (see CONTENT_REVIEW.md).
 */
export const experience: Experience[] = [
  {
    id: "debate-chair",
    role: "Debate Club Chairperson",
    organization: "University Debate Society",
    engagement: "Campus leadership",
    period: "2023 — Present",
    description:
      "Lead a club of 40+ members. Run debate tournaments and inter-university competitions, with discussion topics such as technology policy, AI ethics and digital rights.",
    tags: ["Leadership", "Public Speaking", "Critical Thinking", "Event Management"],
  },
  {
    id: "independent-developer",
    role: "Independent Software Developer",
    organization: "Personal & Freelance Projects",
    engagement: "Independent / personal projects",
    period: "2021 — Present",
    description:
      "Design and build web, mobile and cloud applications on my own, using Firebase, Python and Flutter, and write technical documentation for what I build.",
    tags: ["Full Stack", "Firebase", "Python", "APIs", "Flutter"],
  },
  {
    id: "security-practice",
    role: "Cybersecurity Lab Practice",
    organization: "Personal virtual lab",
    engagement: "Self-directed study",
    period: "2022 — Present",
    description:
      "Hands-on security practice in a personal virtualized lab. Topics include exploit development, network intrusion detection, malware analysis and post-quantum cryptography, alongside CTF challenges on TryHackMe and HackTheBox.",
    tags: ["Penetration Testing", "CTF", "Malware Analysis", "Cryptography"],
  },
];
