// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import preact from "@astrojs/preact";
import icon from "astro-icon";
// https://astro.build/config
export default defineConfig({

  site: "https://felipevogtf.github.io",
  base: "/guitar-things/",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [preact(), icon()],
});