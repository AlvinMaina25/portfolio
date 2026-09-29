import type { CategoryDefinition, Skill } from "@/types";

/** Filter buttons for the Skills section. Only categories used by a skill are shown. */
export const skillCategories: CategoryDefinition[] = [
  { id: "security", label: "Security", tone: "red" },
  { id: "ai", label: "AI / ML", tone: "blue" },
  { id: "web", label: "Web", tone: "sky" },
  { id: "cloud", label: "Cloud", tone: "teal" },
  { id: "mobile", label: "Mobile", tone: "purple" },
];

/**
 * Skills.
 *
 * `proficiency` is the owner's own assessment, shown as a labelled category ("Self-assessed").
 * It replaces the legacy percentage bars, which looked like measurements but were not. The
 * categories keep the legacy relative ordering (advanced: 85+, proficient: 78-82, intermediate: 72-76).
 *
 * Unconfirmed: whether each tag reflects real use. Several tags (TensorFlow, scikit-learn,
 * Wireshark, Nmap, NumPy, Matplotlib, GCP, Java, Android) do not appear in any project;
 * see CONTENT_REVIEW.md.
 */
export const skills: Skill[] = [
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description:
      "Penetration testing, threat modeling, network security, vulnerability assessment, malware analysis",
    icon: "shield",
    tone: "red",
    category: "security",
    tags: ["Kali Linux", "Metasploit", "Wireshark", "Nmap"],
    proficiency: "proficient",
  },
  {
    id: "artificial-intelligence",
    name: "Artificial Intelligence",
    description:
      "Machine learning, neural networks, NLP, model deployment, data pipelines",
    icon: "ai",
    tone: "blue",
    category: "ai",
    tags: ["Python", "TensorFlow", "scikit-learn", "OpenAI API"],
    proficiency: "proficient",
  },
  {
    id: "web-development",
    name: "Web Development",
    description:
      "Full-stack development, REST APIs, real-time applications, progressive web apps, responsive design",
    icon: "globe",
    tone: "sky",
    category: "web",
    tags: ["HTML/CSS", "JavaScript", "Node.js", "APIs"],
    proficiency: "advanced",
  },
  {
    id: "mobile-development",
    name: "Mobile Development",
    description:
      "Cross-platform mobile applications, real-time data sync, Firebase integration",
    icon: "smartphone",
    tone: "purple",
    category: "mobile",
    tags: ["Flutter", "Firebase", "Dart", "Android"],
    proficiency: "intermediate",
  },
  {
    id: "cloud-computing",
    name: "Cloud Computing",
    description:
      "Cloud architecture, serverless functions, containerization, CI/CD pipelines, infrastructure as code",
    icon: "cloud",
    tone: "teal",
    category: "cloud",
    tags: ["AWS", "GCP", "Docker", "GitHub Actions"],
    proficiency: "intermediate",
  },
  {
    id: "software-engineering",
    name: "Software Engineering",
    description:
      "System design, data structures, algorithms, OOP, version control, agile methodologies",
    icon: "code",
    tone: "gold",
    category: "web",
    tags: ["Python", "Java", "SQL", "GitHub"],
    proficiency: "advanced",
  },
  {
    id: "data-science",
    name: "Data Science",
    description:
      "Data analysis, statistical modeling, visualization, predictive analytics, ETL pipelines",
    icon: "bar-chart",
    tone: "orange",
    category: "ai",
    tags: ["Pandas", "NumPy", "SQL", "Matplotlib"],
    proficiency: "intermediate",
  },
  {
    id: "networking-linux",
    name: "Networking & Linux",
    description:
      "TCP/IP, network protocols, Linux administration, firewall configuration, VPNs, packet analysis",
    icon: "network",
    tone: "green",
    category: "security",
    tags: ["Linux", "Bash", "TCP/IP", "Cisco"],
    proficiency: "proficient",
  },
];
