// Verificação de movimento quadro a quadro, num Chrome de verdade.
//
// POR QUE: a captura estática (captura.mjs) não sabe passar o mouse, nem deixar
// o tempo correr. Os cinemagraphs da abertura só tocam com hover — ou, sem
// mouse, quando o cartão está centralizado — e nada disso aparece num print
// isolado. Aqui o Chrome instalado é dirigido pelo protocolo de depuração
// (puppeteer-core, que não baixa navegador próprio) e cada situação é medida:
// o vídeo tocou? o tempo avançou? a estampa parada voltou quando o mouse saiu?
//
// USO   node scripts/movimento.mjs         (com `npm run preview` no ar)
// SAÍDA _capturas/mov_*.png e um relatório no terminal
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const saida = path.join(raiz, "_capturas");
if (!existsSync(saida)) mkdirSync(saida, { recursive: true });
const chrome = ["C:/Program Files/Google/Chrome/Application/chrome.exe",
                "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(existsSync);
const URL = "http://localhost:4173/#/";
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const estado = (pg, i) => pg.evaluate((i) => {
  const c = document.querySelectorAll(".cartao")[i];
  const v = c.querySelector("video");
  return {
    vivo: c.classList.contains("vivo"),
    pausado: v.paused, tempo: +v.currentTime.toFixed(2),
    pronto: v.readyState, opacidade: getComputedStyle(v).opacity,
    fonte: (v.currentSrc || "").split("/").pop(),
  };
}, i);

const nav = await puppeteer.launch({ executablePath: chrome, headless: "new",
  args: ["--autoplay-policy=no-user-gesture-required"] });

try {
  // ---------------------------------------------------------- 1. com mouse --
  const pg = await nav.newPage();
  await pg.setViewport({ width: 1600, height: 1000 });
  await pg.goto(URL, { waitUntil: "networkidle0" });
  const cartoes = await pg.$$(".cartao");
  await cartoes[2].scrollIntoView();
  await espera(600);
  console.log("antes do hover   ", await estado(pg, 2));

  const caixa = await (await cartoes[2].$(".estampa-viva")).boundingBox();
  await pg.mouse.move(caixa.x + caixa.width / 2, caixa.y + caixa.height / 2);
  for (const ms of [300, 1200, 2400, 3600]) {
    await espera(ms === 300 ? 300 : 1200);
    const e = await estado(pg, 2);
    console.log("hover +%sms".padEnd(17).replace("%s", ms), e);
    await (await cartoes[2].$(".estampa-viva")).screenshot({
      path: path.join(saida, `mov_hover_${ms}.png`) });
  }
  await pg.mouse.move(5, 5);
  await espera(900);
  console.log("mouse saiu       ", await estado(pg, 2));
  console.log("outros cartões   ", await estado(pg, 0), await estado(pg, 1));
  await pg.close();

  // ------------------------------------------------ 2. movimento reduzido --
  const pr = await nav.newPage();
  await pr.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await pr.setViewport({ width: 1600, height: 1000 });
  await pr.goto(URL, { waitUntil: "networkidle0" });
  const c2 = await pr.$$(".cartao");
  await c2[2].scrollIntoView();
  const b2 = await (await c2[2].$(".estampa-viva")).boundingBox();
  await pr.mouse.move(b2.x + b2.width / 2, b2.y + b2.height / 2);
  await espera(1500);
  console.log("reduced-motion   ", await estado(pr, 2));
  await pr.close();

  // ------------------------------------------------------- 3. sem mouse --
  const pt = await nav.newPage();
  await pt.emulate({ viewport: { width: 430, height: 900, isMobile: true, hasTouch: true },
                     userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)" });
  await pt.goto(URL, { waitUntil: "networkidle0" });
  const c3 = await pt.$$(".cartao");
  await pt.evaluate((el) => el.scrollIntoView({ block: "center" }), c3[1]);
  await espera(2500);
  const tres = [await estado(pt, 0), await estado(pt, 1), await estado(pt, 2)];
  console.log("toque, centro=1  ", tres.map((e) => (e.vivo ? "TOCA" : "parado") + " t=" + e.tempo).join(" | "));
  await (await c3[1].$(".estampa-viva")).screenshot({ path: path.join(saida, "mov_toque.png") });
  await pt.close();
} finally {
  await nav.close();
}
