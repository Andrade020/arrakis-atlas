import { emIngles, localidade } from "./i18n";
// Dicionario de variaveis: rotulo legivel, unidade e formato de cada um dos
// campos da malha. E' a unica coisa do site escrita a mao sobre os dados — e
// escrita aqui, num lugar so', para que a ficha do distrito, o seletor de
// coropleto e as tabelas nunca divirjam entre si.
//
// A classe de procedencia NAO esta aqui: vem de dados/proveniencia.json, que o
// pipeline gera. Assim nao existe a chance de o site declarar como canonico um
// campo que o projeto classificou como simulado.

export type Formato = "int" | "dec1" | "dec2" | "pct" | "txt" | "comp";

export interface Campo {
  rot: string;
  un?: string;
  fmt: Formato;
  /** true quando um valor ALTO e' a situacao ruim (isolamento, risco). */
  inverso?: boolean;
  ajuda?: string;
}

export interface Grupo { rot: string; campos: string[]; }

const CAMPOS_PT: Record<string, Campo> = {
  // --- identificacao
  regiao:     { rot: "Região", fmt: "txt" },
  fonte_nome: { rot: "Origem do topônimo", fmt: "txt" },
  canon_st:   { rot: "Situação no gazetteer", fmt: "txt" },
  alias:      { rot: "Grafia divergente", fmt: "txt" },
  sober_nom:  { rot: "Soberania nominal", fmt: "txt" },
  poder_ef:   { rot: "Controle efetivo", fmt: "txt" },

  // --- territorio
  area_km2:   { rot: "Área", un: "km²", fmt: "int",
                ajuda: "Medida sobre a esfera, com a correção de área da azimutal equidistante." },
  perim_km:   { rot: "Perímetro", un: "km", fmt: "int" },
  lat:        { rot: "Latitude do centroide", un: "°", fmt: "dec2" },
  lon:        { rot: "Longitude do centroide", un: "°", fmt: "dec2" },
  tipo_terr:  { rot: "Terreno dominante", fmt: "txt" },
  p_erg:      { rot: "Erg aberto", un: "%", fmt: "dec1" },
  p_relevo:   { rot: "Rocha e crista", un: "%", fmt: "dec1" },
  p_bacia:    { rot: "Bacia clara", un: "%", fmt: "dec1" },
  area_nuc:   { rot: "Área do núcleo", un: "km²", fmt: "int",
                ajuda: "Parte do distrito que corresponde à feição desenhada no mapa; o resto é território atribuído." },
  p_nucleo:   { rot: "Fração de núcleo", un: "%", fmt: "dec1" },
  alt_m:      { rot: "Cota canônica", un: "m", fmt: "int",
                ajuda: "Altitude declarada nas Notas Cartográficas ou em rótulo do mapa." },
  alt_mod:    { rot: "Cota média modelada", un: "m", fmt: "int" },
  alt_min:    { rot: "Cota mínima modelada", un: "m", fmt: "int" },
  alt_max:    { rot: "Cota máxima modelada", un: "m", fmt: "int" },
  declive:    { rot: "Declividade média", un: "°", fmt: "dec2" },

  // --- assentamento
  n_assent:   { rot: "Assentamentos no mapa", fmt: "int" },
  n_sietch:   { rot: "Sietches desenhados", fmt: "int" },
  n_pyon:     { rot: "Vilas pyon", fmt: "int" },
  n_botan:    { rot: "Estações botânicas", fmt: "int" },
  n_sietch_e: { rot: "Sietches estimados", fmt: "int",
                ajuda: "O mapa desenha 46 sietches; o cânone exige cerca de mil. A diferença é sub-registro cartográfico, não ausência." },

  // --- populacao
  populacao:  { rot: "População", fmt: "comp" },
  pop_fremen: { rot: "Fremen", fmt: "comp" },
  pop_pyon:   { rot: "Pyon", fmt: "comp" },
  pop_urbana: { rot: "Urbana", fmt: "comp" },
  pop_nomade: { rot: "Nômade", fmt: "comp" },
  dens_Mkm2:  { rot: "Densidade", un: "hab/Mkm²", fmt: "int" },
  taxa_urb:   { rot: "Taxa de urbanização", un: "%", fmt: "dec1" },

  // --- economia
  espec_t:    { rot: "Especiaria colhida", un: "t/ano", fmt: "dec1" },
  esp_kg_km2: { rot: "Rendimento", un: "kg/km²", fmt: "dec2" },
  pib_Msol:   { rot: "Produto", un: "M solaris", fmt: "dec1" },
  p_esp_pib:  { rot: "Especiaria no produto", un: "%", fmt: "dec1" },
  renda_Msol: { rot: "Renda gerada", un: "M solaris", fmt: "dec1" },
  renda_pc:   { rot: "Renda por habitante", un: "solaris", fmt: "int" },
  saldo_Msol: { rot: "Saldo local", un: "M solaris", fmt: "dec1" },
  p_retido:   { rot: "Parcela retida", un: "%", fmt: "dec1" },
  massa_mkt:  { rot: "Massa de mercado", fmt: "comp",
                ajuda: "População ponderada pela propensão de cada grupo a transacionar com a economia imperial." },
  acesso_mkt: { rot: "Acesso ao mercado", fmt: "dec2" },

  // --- agua e risco
  agua_Ml:    { rot: "Água captada", un: "Ml/ano", fmt: "dec1" },
  agua_hab_l: { rot: "Água por habitante", un: "l/ano", fmt: "int" },
  risco_verm: { rot: "Risco de verme", un: "0–100", fmt: "dec1", inverso: true },
  risco_temp: { rot: "Risco de tempestade", un: "0–100", fmt: "dec1", inverso: true },

  // --- acessibilidade
  dist_arrak: { rot: "Distância a Arrakeen", un: "km", fmt: "int", inverso: true,
                ajuda: "Geodésica sobre a esfera — a distância que um mapa mostra." },
  cd_arrak:   { rot: "Custo até Arrakeen", un: "km eq.", fmt: "int", inverso: true,
                ajuda: "Travessia acumulada com a fricção imperial: o que custa chegar, e não o quanto dista." },
  cd_tabr:    { rot: "Custo até Sietch Tabr", un: "km eq.", fmt: "int", inverso: true,
                ajuda: "O mesmo cálculo com a fricção fremen, para quem monta o verme." },
  isolam:     { rot: "Isolamento", fmt: "dec2", inverso: true,
                ajuda: "Razão entre o custo de travessia e a distância em linha reta. Acima de 1, o terreno cobra pedágio." },
  acesso_cd:  { rot: "Acesso por custo", fmt: "dec2" },
  ganho_gap:  { rot: "Ganho com a Velha Fenda", un: "%", fmt: "dec1",
                ajuda: "Contrafactual: quanto o custo cairia se a passagem fosse transitável." },
};


/* Rótulos em inglês. Unidade e formato são os mesmos; só o texto muda. */
const EN: Record<string, [string, string?, string?]> = {
  regiao: ["Region"], fonte_nome: ["Place-name source"], canon_st: ["Gazetteer status"],
  alias: ["Variant spelling"], sober_nom: ["Nominal sovereignty"], poder_ef: ["Effective control"],
  area_km2: ["Area", undefined, "Measured on the sphere, with the area correction of the azimuthal equidistant projection."],
  perim_km: ["Perimeter"], lat: ["Centroid latitude"], lon: ["Centroid longitude"],
  tipo_terr: ["Dominant terrain"], p_erg: ["Open erg"], p_relevo: ["Rock and ridge"], p_bacia: ["Light basin"],
  area_nuc: ["Core area", undefined, "The part of the district that matches the feature drawn on the map; the rest is assigned territory."],
  p_nucleo: ["Core share"],
  alt_m: ["Canon altitude", undefined, "Altitude given in the Cartographic Notes or on a map label."],
  alt_mod: ["Modelled mean altitude"], alt_min: ["Modelled minimum altitude"], alt_max: ["Modelled maximum altitude"],
  declive: ["Mean slope"],
  n_assent: ["Settlements on the map"], n_sietch: ["Sietches drawn"], n_pyon: ["Pyon villages"], n_botan: ["Botanical stations"],
  n_sietch_e: ["Estimated sietches", undefined, "The map draws 46 sietches; the books call for about a thousand. The gap is under-recording on the map, not absence."],
  populacao: ["Population"], pop_fremen: ["Fremen"], pop_pyon: ["Pyon"], pop_urbana: ["Urban"], pop_nomade: ["Nomadic"],
  dens_Mkm2: ["Density", "people/Mkm²"], taxa_urb: ["Urbanisation rate"],
  espec_t: ["Spice harvested", "t/year"], esp_kg_km2: ["Yield"], pib_Msol: ["Output"], p_esp_pib: ["Spice share of output"],
  renda_Msol: ["Income generated"], renda_pc: ["Income per person"], saldo_Msol: ["Local balance"], p_retido: ["Share retained"],
  massa_mkt: ["Market mass", undefined, "Population weighted by each group's tendency to trade with the Imperial economy."],
  acesso_mkt: ["Market access"],
  agua_Ml: ["Water captured", "Ml/year"], agua_hab_l: ["Water per person", "l/year"],
  risco_verm: ["Worm risk"], risco_temp: ["Storm risk"],
  dist_arrak: ["Distance to Arrakeen", undefined, "Geodesic distance on the sphere, the distance a map shows."],
  cd_arrak: ["Cost to Arrakeen", "km eq.", "Accumulated crossing cost with Imperial friction: what it takes to get there, not how far it is."],
  cd_tabr: ["Cost to Sietch Tabr", "km eq.", "The same calculation with Fremen friction, for those who ride the worm."],
  isolam: ["Isolation", undefined, "Crossing cost divided by straight-line distance. Above 1, the terrain charges a toll."],
  acesso_cd: ["Access by cost"],
  ganho_gap: ["Gain from Old Gap", undefined, "Counterfactual: how much the cost would drop if the pass were open."],
};

/* O mesmo dicionário, no idioma do momento. */
export const CAMPOS: Record<string, Campo> = new Proxy(CAMPOS_PT, {
  get(alvo, chave: string) {
    const c = alvo[chave];
    if (!c || !emIngles()) return c;
    const e = EN[chave];
    return e ? { ...c, rot: e[0], un: e[1] ?? c.un, ajuda: e[2] ?? c.ajuda } : c;
  },
});

const GRUPOS_PT: Grupo[] = [
  { rot: "Situação", campos: ["regiao", "sober_nom", "poder_ef", "canon_st", "alias", "fonte_nome"] },
  { rot: "Território", campos: ["area_km2", "perim_km", "tipo_terr", "p_erg", "p_relevo", "p_bacia", "p_nucleo", "lat", "lon"] },
  { rot: "Relevo", campos: ["alt_m", "alt_mod", "alt_min", "alt_max", "declive"] },
  { rot: "Assentamento", campos: ["n_assent", "n_sietch", "n_pyon", "n_botan", "n_sietch_e"] },
  { rot: "População", campos: ["populacao", "pop_fremen", "pop_pyon", "pop_urbana", "pop_nomade", "dens_Mkm2", "taxa_urb"] },
  { rot: "Economia", campos: ["espec_t", "esp_kg_km2", "pib_Msol", "p_esp_pib", "renda_Msol", "renda_pc", "saldo_Msol", "p_retido", "massa_mkt", "acesso_mkt"] },
  { rot: "Água e risco", campos: ["agua_Ml", "agua_hab_l", "risco_verm", "risco_temp"] },
  { rot: "Acessibilidade", campos: ["dist_arrak", "cd_arrak", "cd_tabr", "isolam", "acesso_cd", "ganho_gap"] },
];

/** Campos numericos que fazem sentido como coropleto, na ordem do seletor. */
const COROPLETOS_PT: { grupo: string; campos: string[] }[] = [
  { grupo: "Território", campos: ["area_km2", "p_erg", "p_relevo", "p_nucleo", "alt_mod", "declive"] },
  { grupo: "População", campos: ["populacao", "dens_Mkm2", "taxa_urb", "n_assent", "n_sietch_e"] },
  { grupo: "Economia", campos: ["espec_t", "esp_kg_km2", "pib_Msol", "renda_pc", "p_retido", "acesso_mkt"] },
  { grupo: "Acessibilidade", campos: ["dist_arrak", "cd_arrak", "cd_tabr", "isolam", "ganho_gap"] },
  { grupo: "Água e risco", campos: ["agua_hab_l", "risco_verm", "risco_temp"] },
];

const GRUPOS_EN: Record<string, string> = {
  "Situação": "Status", "Território": "Territory", "Relevo": "Relief", "Assentamento": "Settlement",
  "População": "Population", "Economia": "Economy", "Água e risco": "Water and risk", "Acessibilidade": "Accessibility",
};
/** Grupos da ficha, no idioma do momento. */
export const grupos = (): Grupo[] =>
  GRUPOS_PT.map((g) => (emIngles() ? { ...g, rot: GRUPOS_EN[g.rot] ?? g.rot } : g));
/** Grupos do seletor de coropleto, no idioma do momento. */
export const coropletos = () =>
  COROPLETOS_PT.map((g) => (emIngles() ? { ...g, grupo: GRUPOS_EN[g.grupo] ?? g.grupo } : g));

const fmtNum = () => new Intl.NumberFormat(localidade());

/* Valores de codigo que nao devem chegar ao leitor como codigo. */
const LEGIVEL: Record<string, string> = {
  canonico_fh: "nomeado por Herbert",
  so_no_mapa: "só no mapa",
  contradicao_grafia: "grafia divergente",
  mapa: "mapa do apêndice",
  derivado: "derivado",
  erg: "erg", relevo: "relevo", bacia: "bacia",
  Imperio: "Império",
};
const LEGIVEL_EN: Record<string, string> = {
  canonico_fh: "named by Herbert",
  so_no_mapa: "only on the map",
  contradicao_grafia: "variant spelling",
  mapa: "appendix map",
  derivado: "derived",
  erg: "erg", relevo: "rock", bacia: "basin",
  Imperio: "Empire", Fremen: "Fremen", Contrabandistas: "Smugglers", "Sem controle efetivo": "No effective control",
  Bacia: "Basin", Erg: "Erg", Macico: "Massif", Misto: "Mixed",
  "Bacia Polar": "Polar Basin", "Muralha Escudo": "Shield Wall", "Bacia Imperial": "Imperial Basin",
  "Falsas Muralhas": "False Walls", "Planaltos Orientais": "Eastern Highlands", "Grandes Ergs": "Great Ergs",
  "Ergs Exteriores": "Outer Ergs", "Feudo imperial (contrato CHOAM)": "Imperial fief (CHOAM contract)",
};

export function formata(campo: string, v: unknown): string {
  const c = CAMPOS[campo];
  if (v === null || v === undefined || v === "") return "—";
  if (!c || c.fmt === "txt") return (emIngles() ? LEGIVEL_EN[String(v)] : LEGIVEL[String(v)]) ?? String(v);
  const fmtPt = fmtNum();
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  switch (c.fmt) {
    case "int":  return fmtPt.format(Math.round(n));
    case "dec1": return fmtPt.format(Number(n.toFixed(1)));
    case "dec2": return fmtPt.format(Number(n.toFixed(2)));
    case "pct":  return fmtPt.format(Number(n.toFixed(1)));
    case "comp": {
      if (Math.abs(n) >= 1e6) return fmtPt.format(Number((n / 1e6).toFixed(2))) + (emIngles() ? " m" : " mi");
      if (Math.abs(n) >= 1e4) return fmtPt.format(Number((n / 1e3).toFixed(1))) + (emIngles() ? "k" : " mil");
      return fmtPt.format(Math.round(n));
    }
    default: return String(v);
  }
}
