/* Duas línguas, um site.
 *
 * O idioma vem do endereço: "#/en/mapa" é inglês, "#/mapa" é português. Cada
 * texto é escrito no próprio lugar com as duas versões lado a lado,
 * t("português", "English"), para as duas nunca se desencontrarem de posição.
 * Os textos longos que vêm de dados (documentos, eventos, glossário) têm a
 * versão inglesa guardada junto da portuguesa.
 */

export type Lingua = "pt" | "en";

let atual: Lingua = "pt";

export function lingua(): Lingua { return atual; }
export const emIngles = () => atual === "en";

export function defineLingua(l: Lingua) {
  atual = l;
  document.documentElement.lang = l === "en" ? "en" : "pt-BR";
  // o link de pular fica fora do shell que a rota redesenha
  const pular = document.querySelector(".pular");
  if (pular) pular.textContent = l === "en" ? "Skip to content" : "Pular para o conteúdo";
}

/** Texto nas duas línguas. */
export const t = (pt: string, en: string) => (atual === "en" ? en : pt);

/** Localidade para números e ordenação. */
export const localidade = () => (atual === "en" ? "en-US" : "pt-BR");

/** Link interno no idioma atual: rota("mapa#=AR-20") -> "#/en/mapa#=AR-20". */
export const rota = (caminho = "") => (atual === "en" ? `#/en/${caminho}` : `#/${caminho}`);

/** Lê o idioma e a rota de um hash: "#/en/mapa#=AR-20" -> ["en", "mapa#=AR-20"]. */
export function lerHash(hash: string): [Lingua, string] {
  const s = hash.replace(/^#\/?/, "");
  if (s === "en" || s.startsWith("en/")) return ["en", s.slice(3)];
  return ["pt", s];
}

/* Nomes que vêm dos dados em português e aparecem em muitos lugares. */
const REGIOES_EN: Record<string, string> = {
  "Bacia Polar": "Polar Basin", "Muralha Escudo": "Shield Wall", "Bacia Imperial": "Imperial Basin",
  "Falsas Muralhas": "False Walls", "Planaltos Orientais": "Eastern Highlands",
  "Grandes Ergs": "Great Ergs", "Ergs Exteriores": "Outer Ergs",
};
const PODER_EN: Record<string, string> = {
  "Imperio": "Empire", "Império": "Empire", "Fremen": "Fremen",
  "Contrabandistas": "Smugglers", "Sem controle efetivo": "No effective control",
};
const TERRENO_EN: Record<string, string> = {
  "Erg": "Erg", "erg": "erg", "Misto": "Mixed", "misto": "mixed", "Relevo": "Rock", "relevo": "rock",
  "Bacia": "Basin", "bacia": "basin", "Rocha": "Rock", "rocha": "rock", "Macico": "Massif",
};

export const nomeRegiao = (pt: string) => t(pt, REGIOES_EN[pt] ?? pt);
export const nomePoder = (pt: string) => t(pt, PODER_EN[pt] ?? pt);
export const nomeTerreno = (pt: string) => t(pt, TERRENO_EN[pt] ?? pt);

/** Rótulo de lugar no livro, vindo do citar.py em português. */
export function localCitacao(pt: string): string {
  if (atual === "pt" || !pt) return pt;
  return pt
    .replace(/^Notas Cartográficas$/, "Cartographic Notes")
    .replace(/^Terminologia do Império \(glossário\)$/, "Terminology of the Imperium")
    .replace(/^Apêndice I: A Ecologia de Duna$/, "Appendix I: The Ecology of Dune")
    .replace(/^Apêndice II: A Religião de Duna$/, "Appendix II: The Religion of Dune")
    .replace(/^Apêndice III: .*$/, "Appendix III: Report on Bene Gesserit Motives and Purposes")
    .replace(/^Apêndice IV: .*$/, "Appendix IV: The Almanak en-Ashraf")
    .replace(/^capítulo (\d+)$/, "chapter $1")
    .replace(/^seção (\d+) de (\d+) \(cerca de (\d+)% do volume\)$/, "section $1 of $2 (about $3% of the book)")
    .replace(/^material final do volume$/, "back matter");
}

/** Nome do livro: "Duna" -> "Dune". */
const LIVROS_EN: Record<string, string> = {
  "Duna": "Dune", "O Messias de Duna": "Dune Messiah", "Os Filhos de Duna": "Children of Dune",
  "O Imperador-Deus de Duna": "God Emperor of Dune", "Os Hereges de Duna": "Heretics of Dune",
  "Casa Capitular Duna": "Chapterhouse: Dune",
};
export const nomeLivro = (pt: string) => t(pt, LIVROS_EN[pt] ?? pt);
