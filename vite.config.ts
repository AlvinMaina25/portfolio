import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import projectContentPlugin from "./tools/projectContentPlugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Fails the build with a readable message if a project.json in src/content/projects/ is invalid.
    projectContentPlugin(fileURLToPath(new URL("./src/content/projects", import.meta.url))),
  ],
  resolve: {
    // "@/components/ui/Button" -> "src/components/ui/Button"
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
