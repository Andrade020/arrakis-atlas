// Capturas da abertura e do cabeçalho num Chrome dirigido, para conferir o que
// o --screenshot do Chrome não mostra: vídeo tocando, areia andando, índice
// aberto, e o celular com emulação de verdade.
//
// USO   node scripts/vitrine.mjs            (com `npm run preview` no ar)
// SAÍDA _capturas/v_*.png e um relatório no terminal
import puppeteer from "puppeteer-core";
import { existsSync, mkdirSync } from "node:fs";

const chrome = ["C:/Program Files/Google/Chrome/Application/chrome.exe",
                "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(existsSync);
const URL = "http://localhost:4173/#/";
if (!existsSync("_capturas")) mkdirSync("_capturas");
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

const nav = await puppeteer.launch({
  executablePath: chrome, headless: "new",
  args: ["--autoplay-policy=no-user-gesture-required"],
});
try {
  // ---- mesa
  const pg = await nav.newPage();
  await pg.setViewport({ width: 1600, height: 1000 });
  await pg.goto(URL, { waitUntil: "networkidle0" });
  await espera(2500);
  const estado = async () => pg.evaluate(() => {
    const v = document.querySelector(".orbita-planeta video");
    return { t: v ? +v.currentTime.toFixed(2) : null, pausado: v?.paused, vivo: document.querySelector(".orbita-planeta")?.classList.contains("vivo") };
  });
  console.log("planeta após 2,5 s:", await estado());
  for (const [i, ms] of [[0, 0], [1, 1500], [2, 1500]]) {
    await espera(ms);
    await pg.screenshot({ path: `_capturas/v_orbita_${i}.png`, clip: { x: 0, y: 0, width: 1600, height: 1000 } });
  }
  console.log("planeta 3 s depois:", await estado());

  // areia: dois quadros da superfície, e a diferença entre eles
  await pg.evaluate(() => document.querySelector(".superficie").scrollIntoView());
  await espera(800);
  await pg.screenshot({ path: "_capturas/v_superficie_0.png" });
  await espera(250);
  await pg.screenshot({ path: "_capturas/v_superficie_1.png" });
  const pausaFora = await pg.evaluate(() => document.querySelector(".orbita-planeta video")?.paused);
  console.log("planeta pausado com a órbita fora da tela:", pausaFora);

  await pg.evaluate(() => window.scrollTo(0, 0));
  await espera(400);
  await pg.screenshot({ path: "_capturas/v_mesa_inteira.png", fullPage: true });

  // índice aberto
  await pg.click(".abre-indice");
  await espera(400);
  const foco = await pg.evaluate(() => document.activeElement?.textContent?.trim().slice(0, 40));
  await pg.screenshot({ path: "_capturas/v_indice.png" });
  await pg.keyboard.press("Escape");
  await espera(200);
  const fechou = await pg.evaluate(() => document.querySelector(".sumario").hidden && document.activeElement?.className);
  console.log("índice: foco inicial em", JSON.stringify(foco), "· Esc fecha e devolve foco a", fechou);

  // página interna
  await pg.goto("http://localhost:4173/#/regioes", { waitUntil: "networkidle0" });
  await espera(1200);
  await pg.screenshot({ path: "_capturas/v_interna.png" });
  await pg.close();

  // ---- celular
  const cel = await nav.newPage();
  await cel.emulate({ viewport: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
                      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)" });
  await cel.goto(URL, { waitUntil: "networkidle0" });
  await espera(2000);
  await cel.screenshot({ path: "_capturas/v_cel_inteira.png", fullPage: true });
  const larg = await cel.evaluate(() => [document.documentElement.clientWidth, document.documentElement.scrollWidth]);
  console.log("celular: janela/página", larg);
  await cel.goto("http://localhost:4173/#/regioes", { waitUntil: "networkidle0" });
  await espera(800);
  await cel.screenshot({ path: "_capturas/v_cel_interna.png" });

  // ---- movimento reduzido: nada anda
  const red = await nav.newPage();
  await red.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await red.setViewport({ width: 1400, height: 900 });
  await red.goto(URL, { waitUntil: "networkidle0" });
  await espera(1000);
  console.log("movimento reduzido: vídeos do planeta =", await red.evaluate(() => document.querySelectorAll(".orbita-planeta video").length));
} finally { await nav.close(); }
