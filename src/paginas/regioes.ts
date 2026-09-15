import { prancha } from "../pranchas";
import {
  atlas, distritos, rotulos, assentamentos, rasters, mundo, num, compacto,
} from "../dados";
import { Mapa } from "../mapa";
import { cabecalho, esc, rodape } from "../ui";
import { t, emIngles, nomeRegiao, nomePoder, nomeLivro, localCitacao } from "../i18n";
import "./regioes.css";

interface Regiao {
  cod: string; nome: string; abertura: string; abertura_en?: string;
  area: number; assent: number; pop: number; espec: number;
  poder_dominante: string;
  distritos: { cod: string; nome: string; nome_en?: string; area: number; assent: number }[];
  citacao: { texto: string; marcador: string; volume: string; autor: string;
             ano: number; local: string } | null;
}

const detalhes: Record<string, [string, string]> = {
  R1: ["Crosta salina e umidade na Bacia Polar", "Salt crust and moisture in the Polar Basin"],
  R2: ["Abrigo de pedra ao pé da Muralha Escudo", "Stone shelter at the foot of the Shield Wall"],
  R3: ["Canal de pedra na Bacia Imperial", "Stone channel in the Imperial Basin"],
  R4: ["Passagem natural entre as Falsas Muralhas", "Natural passage between the False Walls"],
  R5: ["Borda do Abismo Vermelho nos Planaltos Orientais", "Rim of the Red Chasm in the Eastern Highlands"],
  R6: ["Crista de duna nos Grandes Ergs", "Dune crest in the Great Ergs"],
  R7: ["Areia e rocha na borda dos Ergs Exteriores", "Sand and rock at the edge of the Outer Ergs"],
};

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
          <figure class="estampa estampa-dupla" data-estampa="${esc(r.cod)}">
            <div class="estampa-palco">
              <img class="estampa-paisagem" src="${import.meta.env.BASE_URL}ilustracoes/${esc(r.cod)}.webp"
                   alt="${t("Vista imaginada de", "Imagined view of")} ${esc(nomeRegiao(r.nome))}" loading="lazy" />
              <img class="estampa-detalhe" data-src="${import.meta.env.BASE_URL}ilustracoes/${esc(r.cod)}_detalhe${r.cod === "R4" ? "_v2" : ""}.webp"
                   alt="${esc(t(...detalhes[r.cod]))}" aria-hidden="true" loading="lazy" />
            </div>
            <figcaption>${t("Ilustrações imaginadas · paisagem e detalhe", "Imagined illustrations · landscape and detail")}</figcaption>
            <button type="button" class="estampa-alterna" aria-pressed="false"
                    aria-label="${t("Ver detalhe de", "View detail of")} ${esc(nomeRegiao(r.nome))}">
              ${t("Ver detalhe", "View detail")}
            </button>
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

  alvo.querySelectorAll<HTMLElement>(".estampa-dupla").forEach((figura) => {
    const botao = figura.querySelector<HTMLButtonElement>(".estampa-alterna")!;
    const paisagem = figura.querySelector<HTMLImageElement>(".estampa-paisagem")!;
    const detalhe = figura.querySelector<HTMLImageElement>(".estampa-detalhe")!;
    const regiao = regs.find((r) => r.cod === figura.dataset.estampa)!;
    const nome = nomeRegiao(regiao.nome);
    const mostra = (ativo: boolean) => {
      figura.classList.toggle("detalhe-ativo", ativo);
      botao.setAttribute("aria-pressed", String(ativo));
      botao.setAttribute("aria-label", `${t(ativo ? "Ver paisagem de" : "Ver detalhe de", ativo ? "View landscape of" : "View detail of")} ${nome}`);
      botao.textContent = t(ativo ? "Ver paisagem" : "Ver detalhe", ativo ? "View landscape" : "View detail");
      paisagem.setAttribute("aria-hidden", String(ativo));
      detalhe.setAttribute("aria-hidden", String(!ativo));
    };
    botao.addEventListener("click", () => {
      if (figura.classList.contains("detalhe-ativo")) { mostra(false); return; }
      if (detalhe.complete && detalhe.naturalWidth > 0) { mostra(true); return; }
      botao.disabled = true;
      botao.textContent = t("Carregando detalhe…", "Loading detail…");
      detalhe.addEventListener("load", () => { botao.disabled = false; mostra(true); }, { once: true });
      detalhe.addEventListener("error", () => {
        botao.disabled = false;
        botao.textContent = t("Detalhe indisponível", "Detail unavailable");
      }, { once: true });
      detalhe.src = detalhe.dataset.src!;
    });
  });

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
