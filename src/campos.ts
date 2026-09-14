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

export const CAMPOS: Record<string, Campo> = {
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

export const GRUPOS: Grupo[] = [
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
export const COROPLETOS: { grupo: string; campos: string[] }[] = [
  { grupo: "Território", campos: ["area_km2", "p_erg", "p_relevo", "p_nucleo", "alt_mod", "declive"] },
  { grupo: "População", campos: ["populacao", "dens_Mkm2", "taxa_urb", "n_assent", "n_sietch_e"] },
  { grupo: "Economia", campos: ["espec_t", "esp_kg_km2", "pib_Msol", "renda_pc", "p_retido", "acesso_mkt"] },
  { grupo: "Acessibilidade", campos: ["dist_arrak", "cd_arrak", "cd_tabr", "isolam", "ganho_gap"] },
  { grupo: "Água e risco", campos: ["agua_hab_l", "risco_verm", "risco_temp"] },
];

const fmtPt = new Intl.NumberFormat("pt-BR");

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

export function formata(campo: string, v: unknown): string {
  const c = CAMPOS[campo];
  if (v === null || v === undefined || v === "") return "—";
  if (!c || c.fmt === "txt") return LEGIVEL[String(v)] ?? String(v);
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  switch (c.fmt) {
    case "int":  return fmtPt.format(Math.round(n));
    case "dec1": return fmtPt.format(Number(n.toFixed(1)));
    case "dec2": return fmtPt.format(Number(n.toFixed(2)));
    case "pct":  return fmtPt.format(Number(n.toFixed(1)));
    case "comp": {
      if (Math.abs(n) >= 1e6) return fmtPt.format(Number((n / 1e6).toFixed(2))) + " mi";
      if (Math.abs(n) >= 1e4) return fmtPt.format(Number((n / 1e3).toFixed(1))) + " mil";
      return fmtPt.format(Math.round(n));
    }
    default: return String(v);
  }
}
