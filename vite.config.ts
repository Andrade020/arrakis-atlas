import { defineConfig } from "vite";

// base relativa: o surge serve na raiz do dominio, mas manter './' deixa o
// build funcionar tambem se o atlas for publicado numa subpasta.
export default defineConfig({
  base: "./",
  build: { target: "es2022", assetsInlineLimit: 2048 },
});
