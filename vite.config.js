import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import vercel from 'vite-plugin-vercel';
import { getEntriesFromFs } from "vite-plugin-vercel/utils";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    vercel({
      entries: [
        ...(await getEntriesFromFs("endpoints/api", {
          // Auto mapping examples:
          //   endpoints/api/page.ts -> /api/page
          //   endpoints/api/name/[name].ts -> /api/name/*
          destination: "api",
        })),
      ],
    }),
  ],
  base: "/",
});
