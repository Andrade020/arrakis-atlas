// Procura transbordo horizontal: a página não pode ser mais larga que a tela.
// Lista os elementos cuja borda direita passa da largura da janela, do mais
// externo para dentro — o primeiro costuma ser o culpado.
//
// USO   node scripts/transbordo.mjs [rota] [largura]   (com `npm run preview` no ar)
import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const chrome = ["C:/Program Files/Google/Chrome/Application/chrome.exe",
                "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(existsSync);
const [rota = "", larg = "430"] = process.argv.slice(2);
const nav = await puppeteer.launch({ executablePath: chrome, headless: "new" });
try {
  const pg = await nav.newPage();
  await pg.emulate({ viewport: { width: +larg, height: 900, isMobile: true, hasTouch: true },
                     userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)" });
  await pg.goto(`http://localhost:4173/#/${rota}`, { waitUntil: "networkidle0" });
  const r = await pg.evaluate(() => {
    const w = document.documentElement.clientWidth;
    const fora = [];
    // elementos dentro de uma caixa com rolagem própria não empurram a página
    const recortado = (el) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX;
        if (o === "auto" || o === "scroll" || o === "hidden") return true;
      }
      return false;
    };
    for (const el of document.querySelectorAll("body *")) {
      if (recortado(el)) continue;
      const b = el.getBoundingClientRect();
      if (b.right > w + 1 && b.width > 0) {
        const cls = typeof el.className === "string" ? el.className : "";
        fora.push(`${el.tagName.toLowerCase()}${cls ? "." + cls.split(" ").join(".") : ""} → ${Math.round(b.right)}px`);
      }
    }
    return { janela: w, pagina: document.documentElement.scrollWidth, fora: fora.slice(0, 8) };
  });
  console.log(`rota "${rota}" a ${larg}px: janela ${r.janela}, página ${r.pagina}`);
  // print com emulação de celular de verdade: o --window-size do Chrome headless
  // tem largura mínima no Windows e mente sobre layouts estreitos
  if (process.argv.includes("--print")) {
    await pg.screenshot({ path: `_capturas/emulado_${rota || "abertura"}.png`, fullPage: true });
  }
  r.fora.forEach((f) => console.log("   " + f));
  if (r.pagina <= r.janela) console.log("   sem transbordo");
} finally { await nav.close(); }
