import type { LearningItem } from "@/types";

/**
 * "Currently learning" items. These are topics being studied, not completed work, and they carry
 * no progress figures: the legacy percentages were self-estimates and are not shown.
 * Keep this list to what is actually being studied right now; move finished items to
 * certifications.ts or src/content/projects/.
 */
export const learning: LearningItem[] = [
  {
    id: "advanced-pentesting",
    title: "Advanced Penetration Testing",
    description:
      "Studying offensive security topics beyond the basics: buffer overflows, shellcode, Active Directory exploitation, evasion techniques and command-and-control frameworks.",
    icon: "shield-check",
    tone: "red",
    resources: ["TryHackMe", "HackTheBox", "PortSwigger"],
  },
  {
    id: "ai-engineering",
    title: "AI Engineering",
    description:
      "Learning how to build applications on top of language models: retrieval-augmented generation (RAG), fine-tuning, agent workflows and vector databases.",
    icon: "cube",
    tone: "blue",
    resources: ["DeepLearning.AI", "LangChain Docs", "Papers"],
  },
  {
    id: "cloud-security",
    title: "Cloud Security",
    description:
      "Studying IAM, secure cloud architecture, zero-trust networking, secrets management and compliance frameworks such as SOC 2 and ISO 27001, in the context of AWS and GCP.",
    icon: "cloud-upload",
    tone: "teal",
    resources: ["AWS Security Specialty", "CISA Guides"],
  },
  {
    id: "os-internals",
    title: "Operating Systems Internals",
    description:
      "Studying how operating systems work: memory management, process scheduling, system calls, file systems and Linux internals.",
    icon: "monitor",
    tone: "gold",
    resources: ["OSTEP Book", "Linux Kernel Source"],
  },
];
