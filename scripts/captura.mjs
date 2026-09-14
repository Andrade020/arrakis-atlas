// Captura telas do site para o loop de critica visual.
//
// POR QUE assim: o Chrome instalado na maquina ja' sabe renderizar; instalar um
// Playwright inteiro so' para tirar print seria trocar 300 MB por nada. O modo
// --headless --screenshot do proprio Chrome resolve, e roda contra o build de
// producao servido pelo `vite preview`, que e' o que de fato vai ao ar.
//
// USO   node scripts/captura.mjs <rota> <arquivo> [largura] [altura] [esperaMs]
// EX.   node scripts/captura.mjs "" abertura.png 1600 1100

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const saida = path.join(raiz, "_capturas");
if (!existsSync(saida)) mkdirSync(saida, { recursive: true });

const CHROMES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
];
const chrome = CHROMES.find(existsSync);
if (!chrome) { console.error("nenhum navegador encontrado"); process.exit(1); }

const [rota = "", arquivo = "tela.png", larg = "1600", alt = "1100", espera = "2600"] =
  process.argv.slice(2);

// rota comecando com "?" ou "#" e' usada como sufixo cru da URL
const url = /^[?#]/.test(rota)
  ? `http://localhost:4173/${rota}`
  : `http://localhost:4173/#/${rota}`;
const destino = path.join(saida, arquivo);
const perfil = path.join(saida, "_perfil");

// --virtual-time-budget faz o Chrome adiantar os temporizadores ate' terminar o
// carregamento; sem ele o print sai antes das fontes e do canvas.
const args = [
  "--headless=new", "--disable-gpu", "--hide-scrollbars",
  "--force-device-scale-factor=1",
  `--window-size=${larg},${alt}`,
  `--screenshot=${destino}`,
  `--virtual-time-budget=${espera}`,
  `--user-data-dir=${perfil}`,
  "--no-first-run", "--no-default-browser-check",
  url,
];

execFileSync(chrome, args, { stdio: "ignore" });
rmSync(perfil, { recursive: true, force: true });
console.log(destino);
