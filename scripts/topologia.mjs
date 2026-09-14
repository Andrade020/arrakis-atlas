// Constroi o TopoJSON do atlas a partir do estagio escrito por
// scripts/30_exportar_web.py.
//
// POR QUE mapshaper e nao uma simplificacao poligono a poligono: os 44
// distritos formam uma particao SEM frestas nem sobreposicoes - foi o trabalho
// mais delicado do projeto. Simplificar cada poligono isoladamente reabriria
// frestas ao longo de cada fronteira compartilhada. O mapshaper constroi a
// topologia primeiro (arcos compartilhados), simplifica o ARCO uma unica vez, e
// por construcao os dois vizinhos continuam colados.
//
// As sete camadas entram na MESMA topologia: distritos, regioes e esferas de
// poder sao dissolucoes uma da outra, entao devem compartilhar os mesmos arcos.
// Isso tambem derruba o tamanho, porque a fronteira comum e' gravada uma vez.
//
// ENTRADA  site/_estagio/*.geojson  (metros da azimutal equidistante polar)
// SAIDA    site/public/dados/atlas.topo.json

import { statSync, readFileSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const raiz = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const estagio = path.join(raiz, "_estagio");
const saida = path.join(raiz, "public", "dados", "atlas.topo.json");

// A ordem importa: o mapshaper nomeia as camadas pelo arquivo de entrada.
const camadas = ["distritos", "regioes", "poder", "limite", "grade",
                 "rede_imperial", "rede_fremen"];
const entradas = camadas
  .map((c) => path.join(estagio, `${c}.geojson`))
  .filter((f) => existsSync(f));

if (entradas.length === 0) {
  console.error("estagio vazio - rode antes: python ../scripts/30_exportar_web.py");
  process.exit(1);
}

// 4 km de tolerancia. O raster de origem tem 5.954 m por pixel, entao os
// vertices ja nascem numa grade de ~6 km em escada; 4 km alisa a escada sem
// mover nenhuma fronteira para alem da resolucao da propria fonte.
const args = [
  "-i", ...entradas, "combine-files",
  "-simplify", "interval=4000", "planar", "keep-shapes",
  "-o", saida, "format=topojson", "precision=1",
];

// Chamada pelo modulo, e nao pelo .bin: o shim .cmd do Windows exige
// shell:true, e abrir shell com caminhos que tem espaco e' pedir problema.
const mapshaper = (await import("mapshaper")).default;
console.log("mapshaper", args.join(" "));
await mapshaper.runCommands(args.map((a) => (/[\s]/.test(a) ? `"${a}"` : a))
                                .join(" "));

const kb = statSync(saida).size / 1024;
const topo = JSON.parse(readFileSync(saida, "utf8"));
console.log(`\n${path.relative(raiz, saida)}  ${kb.toFixed(1)} KB`);
for (const [nome, obj] of Object.entries(topo.objects)) {
  const n = obj.type === "GeometryCollection" ? obj.geometries.length : 1;
  console.log(`  ${nome.padEnd(16)} ${String(n).padStart(4)} feicoes`);
}

// O estagio e' intermediario: nao deve sobreviver ao build nem entrar no
// controle de versao do site.
rmSync(estagio, { recursive: true, force: true });
