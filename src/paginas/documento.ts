import { docs } from "../dados";
import { blocos, cabecalho, rodape, esc } from "../ui";
import { t, emIngles } from "../i18n";

export interface OpcDoc {
  indice: string;
  titulo: string;
  linha: string;
  figura?: [string, string];
  /** Quantos blocos do inicio de cada documento o cabecalho ja' cobre. */
  pular?: number | number[];
  /** Trecho que conta o enredo: vai atras de um aviso, do titulo `desde` ate'
      o titulo `ate` (ou o fim do documento). */
  spoiler?: { desde: string; ate?: string; aviso: string };
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
      const bs = (emIngles() && d[q + "_EN"]) ? d[q + "_EN"] : d[q];
      if (!bs) return "";
      const achaTitulo = (t: string) => bs.findIndex((b: any) => b.t === "h" && String(b.x).includes(t));
      const ini = o.spoiler ? achaTitulo(o.spoiler.desde) : -1;
      if (ini < 0) return blocos(bs, { pularAte: pular });
      const fim = o.spoiler!.ate ? achaTitulo(o.spoiler!.ate) : -1;
      const antes = blocos(bs.slice(0, ini), { pularAte: pular });
      const meio = blocos(fim > ini ? bs.slice(ini, fim) : bs.slice(ini));
      const depois = fim > ini ? blocos(bs.slice(fim)) : "";
      return `${antes}
        <div class="trecho-spoiler">
          <div class="aviso-spoiler"><p>${esc(o.spoiler!.aviso)}</p>
            <button class="btn-spoiler" type="button">${t("Mostrar", "Show")}</button></div>
          <div class="trecho-conteudo" hidden>${meio}</div>
        </div>
        ${depois}`;
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
  alvo.querySelectorAll<HTMLElement>(".trecho-spoiler").forEach((t) => {
    t.querySelector(".btn-spoiler")!.addEventListener("click", () => {
      t.querySelector<HTMLElement>(".aviso-spoiler")!.hidden = true;
      t.querySelector<HTMLElement>(".trecho-conteudo")!.hidden = false;
    });
  });
}
