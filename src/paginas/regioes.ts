import { prancha } from "../pranchas";
import {
  atlas, distritos, rotulos, assentamentos, rasters, mundo, num, compacto,
} from "../dados";
import { Mapa } from "../mapa";
import { cabecalho, esc, rodape } from "../ui";
import { t, emIngles, nomeRegiao, nomePoder, nomeLivro, localCitacao } from "../i18n";

interface Regiao {
  cod: string; nome: string; abertura: string; abertura_en?: string;
  area: number; assent: number; pop: number; espec: number;
  poder_dominante: string;
  distritos: { cod: string; nome: string; nome_en?: string; area: number; assent: number }[];
  citacao: { texto: string; marcador: string; volume: string; autor: string;
             ano: number; local: string } | null;
}

/** Prancha das regioes: o lugar antes do numero.
 *
 *  O atlas estava entregando tabela sem dizer que chao e' aquele. Aqui cada
 *  regiao abre com uma linha de contexto e, quando existe, com a frase que o
 *  proprio Herbert escreveu sobre o lugar — literal, com marcador. So depois
 *  vem a medida. */
export async function regioes(alvo: HTMLElement) {
  const regs = (await fetch(import.meta.env.BASE_URL + "dados/regioes.json")
    .then((r) => r.json())) as Regiao[];

  alvo.innerHTML = `<article class="folha">
    ${cabecalho(`${prancha("regioes")} · ${t("As sete regiões", "The seven regions")}`,
      t("Sete regiões de um planeta", "Seven regions of one planet"),
      t("O livro não divide Arrakis em regiões, então o agrupamento é nosso. O que se diz de cada uma vem do texto, com a citação. As imagens são ilustrações.",
        "The book doesn't divide Arrakis into regions, so the grouping is ours. What is said about each one comes from the text, with the quotation. The pictures are illustrations."))}
    <div class="corpo" style="max-width:none">
      ${regs.map((r, i) => `<section class="regiao" id="${esc(r.cod)}">
        <div>
          <figure class="estampa">
            <img src="${import.meta.env.BASE_URL}ilustracoes/${esc(r.cod)}.webp"
                 alt="${t("Vista imaginada de", "Imagined view of")} ${esc(nomeRegiao(r.nome))}" loading="lazy" />
          </figure>
          <figure class="carta-regiao">
            <canvas data-reg="${esc(r.cod)}" aria-label="${t("Localização de", "Location of")} ${esc(nomeRegiao(r.nome))}"></canvas>
          </figure>
        </div>
        <div class="regiao-txt">
          <div class="regiao-n">${String(i + 1).padStart(2, "0")} · ${esc(r.cod)}</div>
          <h2 class="regiao-nome">${esc(nomeRegiao(r.nome))}</h2>
          <p class="abre-reg">${esc(emIngles() ? (r.abertura_en || r.abertura) : r.abertura)}</p>
          ${r.citacao ? `<figure class="citacao">
            <blockquote>${esc(r.citacao.texto)}</blockquote>
            <figcaption class="fonte">${esc(r.citacao.autor)}, <em>${esc(nomeLivro(r.citacao.volume))}</em>
              (${r.citacao.ano})${r.citacao.local ? " · " + esc(localCitacao(r.citacao.local)) : ""}
              <code>${esc(r.citacao.marcador)}</code></figcaption>
          </figure>` : `<p class="sem-cita">${t("Sem citação para esta região.", "No quotation for this region.")}</p>`}
          <div class="reg-num">
            <span><b>${num(r.area / 1e6, 2)}</b> ${t("milhões de km²", "million km²")}</span>
            <span><b>${r.distritos.length}</b> ${t("distritos", "districts")}</span>
            <span><b>${r.assent}</b> ${t("assentamentos", "settlements")}</span>
            <span><b>${compacto(r.pop, 1)}</b> ${t("habitantes", "inhabitants")}<sup class="dag">†</sup></span>
            <span>${t("controle", "control")}: <b>${esc(nomePoder(r.poder_dominante))}</b></span>
          </div>
          <div class="reg-lista">${r.distritos.map((d) =>
            `<a href="#/mapa#=${esc(d.cod)}">${esc(emIngles() ? (d.nome_en || d.nome) : d.nome)}</a>`).join("")}</div>
        </div>
      </section>`).join("")}
      <p class="nota-dag" style="margin:8px 0 0"><b>†</b>
        <span>${t("população estimada pelo modelo; só o total de 10 milhões de fremen vem do livro",
                  "population estimated by the model; only the total of 10 million Fremen comes from the book")}</span></p>
    </div>
    ${rodape()}
  </article>`;

  // ---- as cartinhas: mesmo motor, a regiao acesa sobre a folha inteira ----
  const [atl, d, rots, ass, ras, mun] = await Promise.all([
    atlas(), distritos(), rotulos(), assentamentos(), rasters(), mundo(),
  ]);
  const vivos: (() => void)[] = [];
  alvo.querySelectorAll("canvas[data-reg]").forEach((el) => {
    const tela = el as HTMLCanvasElement;
    const cod = tela.dataset.reg!;
    const m = new Mapa(tela, {
      raster: "relevo", coropleto: "",
      camadas: new Set(["distritos"]), selecionado: null,
    });
    m.carrega(atl, d, rots, ass, ras);
    m.estatica = true;
    m.folha = mun.fan;
    m.margem = 6;
    m.molduraDupla = false;
    m.destaque = new Set(regs.find((r) => r.cod === cod)!.distritos.map((x) => x.cod));
    const ajusta = () => { m.redimensiona(); m.enquadra(mun.fan, 0.01); };
    ajusta();
    requestAnimationFrame(ajusta);
    const ro = new ResizeObserver(ajusta);
    ro.observe(tela);
    vivos.push(() => ro.disconnect());
  });
  const obs = new MutationObserver(() => {
    if (!document.body.contains(alvo.querySelector("canvas") as Node)) {
      vivos.forEach((f) => f()); obs.disconnect();
    }
  });
  obs.observe(alvo, { childList: true });
}
