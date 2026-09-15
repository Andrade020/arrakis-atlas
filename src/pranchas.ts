/* A ordem das pranchas, num lugar só.
 *
 * O número de cada prancha ("Prancha 07") e das seções dela ("7.2") sai da
 * posição nesta lista. Antes estava escrito à mão em cada página, e cada
 * prancha nova obrigava a renumerar o site inteiro. Fica fora de main.ts para
 * as páginas poderem importar sem importar o roteador de volta. */
export const ORDEM = [
  "", "mapa", "regioes", "distritos", "verme", "vida", "fuga",
  "padroes", "acessibilidade", "poder", "economia", "agua", "comparacao",
  "contradicoes", "metodo", "glossario", "fontes",
] as const;

export type IdPrancha = typeof ORDEM[number];

export function plac(id: IdPrancha): string {
  const i = ORDEM.indexOf(id);
  if (i < 0) throw new Error(`prancha desconhecida: ${id}`);
  return String(i).padStart(2, "0");
}

/** "Prancha 07" */
export const prancha = (id: IdPrancha) => `Prancha ${plac(id)}`;

/** Número de seção dentro da prancha: secao("economia", 2) -> "10.2" */
export const secao = (id: IdPrancha, n: number) => `${ORDEM.indexOf(id)}.${n}`;
