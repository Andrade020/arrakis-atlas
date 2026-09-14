// Carregamento dos dados exportados pelo pipeline. Tudo e' estatico: o site
// nao tem servidor, e nenhum numero e' calculado aqui — o que chega ja veio
// conferido por scripts/10_conferir.py.

import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, Geometry } from "geojson";

export interface Distrito {
  cod: string; nome: string; nome_en: string;
  regiao: string; cod_reg: string;
  [campo: string]: string | number | null;
}

export interface Assentamento {
  i: string; t: string; d: string; n: string; e: string; x: number; y: number;
}

export interface Rotulo {
  cod: string; nome: string; en: string; x: number; y: number; area: number;
}

export interface Proc { classe: string; lastro: string; marcador: string; }

export interface CamadaRaster {
  arquivo: string; b: [number, number, number, number];
  titulo: string; nota: string; classe: string; unidade?: string;
  bandas?: number; min?: number; max?: number; p1?: number; p99?: number;
  chaves: { cor: string; rot: string }[];
}

export interface Mundo {
  crs: string; raio_m: number; metros_por_pixel_fonte: number;
  limite: [number, number, number, number];
  fan: [number, number, number, number];
}

export type Bloco =
  | { t: "h"; n: number; x: string }
  | { t: "p"; x: string }
  | { t: "hr" }
  | { t: "ul"; itens: string[] }
  | { t: "cit"; x: string; fonte: string }
  | { t: "tab"; cab: string[]; lin: string[][] };

const cache = new Map<string, Promise<unknown>>();

function pega<T>(caminho: string): Promise<T> {
  let p = cache.get(caminho) as Promise<T> | undefined;
  if (!p) {
    p = fetch(import.meta.env.BASE_URL + caminho).then((r) => {
      if (!r.ok) throw new Error(`${caminho}: ${r.status}`);
      return r.json() as Promise<T>;
    });
    cache.set(caminho, p as Promise<unknown>);
  }
  return p;
}

export const distritos = () => pega<Distrito[]>("dados/distritos.json");
export const assentamentos = () => pega<Assentamento[]>("dados/assentamentos.json");
export const rotulos = () => pega<Rotulo[]>("dados/rotulos.json");
export const mundo = () => pega<Mundo>("dados/mundo.json");
export const rasters = () => pega<Record<string, CamadaRaster>>("mapa/rasters.json");
export const docs = () => pega<Record<string, Bloco[]>>("dados/docs.json");
export const tabelas = () => pega<Record<string, any>>("dados/tabelas.json");
export const proveniencia = () =>
  pega<{ campos: Record<string, Proc>; grupos: any[] }>("dados/proveniencia.json");

/** Camadas vetoriais, ja' convertidas de TopoJSON para feicoes. */
export async function atlas(): Promise<Record<string, FeatureCollection>> {
  const topo = (await pega<Topology>("dados/atlas.topo.json")) as Topology;
  const saida: Record<string, FeatureCollection> = {};
  for (const nome of Object.keys(topo.objects)) {
    saida[nome] = feature(
      topo,
      topo.objects[nome] as GeometryCollection,
    ) as FeatureCollection<Geometry>;
  }
  return saida;
}

export type Feicao = Feature<Geometry, Record<string, any>>;

/* ------------------------------------------------------------ formatacao -- */

const pt = new Intl.NumberFormat("pt-BR");

export function num(v: number | null | undefined, casas = 0): string {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  return pt.format(Number(v.toFixed(casas)));
}

/** Numero grande em escala curta, para caber em coluna estreita. */
export function compacto(v: number | null | undefined, casas = 1): string {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  const a = Math.abs(v);
  if (a >= 1e9) return num(v / 1e9, casas) + " bi";
  if (a >= 1e6) return num(v / 1e6, casas) + " mi";
  if (a >= 1e4) return num(v / 1e3, casas) + " mil";
  return num(v, a < 10 ? casas : 0);
}
