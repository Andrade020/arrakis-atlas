import { docs } from "../dados";
import { blocos, cabecalho, rodape, esc } from "../ui";

export interface OpcDoc {
  indice: string;
  titulo: string;
  linha: string;
  figura?: [string, string];
  /** Quantos blocos do inicio de cada documento o cabecalho ja' cobre. */
  pular?: number | number[];
}

/** Pagina montada a partir de um ou mais documentos do projeto. O texto vem de
    docs/*.md pelo exportador: o site nao guarda uma segunda copia da prosa, e
    por isso nao existe a chance de o site e o repositorio contarem historias
    diferentes. */
export async function paginaDoc(alvo: HTMLElement, quais: string[], o: OpcDoc) {
  const d = await docs();
  const corpo = quais
    .map((q, i) => {
      const pular = Array.isArray(o.pular) ? (o.pular[i] ?? 3) : (o.pular ?? 3);
      return d[q] ? blocos(d[q], { pularAte: pular }) : "";
    })
    .join("\n");

  alvo.innerHTML = `<article class="folha">
    ${cabecalho(o.indice, o.titulo, o.linha)}
    <div class="corpo">
      ${o.figura ? `<figure class="figura">
        <img src="${import.meta.env.BASE_URL}figuras/${esc(o.figura[0])}" alt="${esc(o.figura[1])}" loading="lazy" />
      </figure>` : ""}
      ${corpo}
    </div>
    ${rodape()}
  </article>`;
}
