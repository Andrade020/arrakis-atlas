import {
  atlas, distritos, rotulos, assentamentos, rasters, mundo, num, compacto,
} from "../dados";
import { Mapa } from "../mapa";
import { cabecalho, esc, rodape } from "../ui";

interface Regiao {
  cod: string; nome: string; abertura: string;
  area: number; assent: number; pop: number; espec: number;
  poder_dominante: string;
  distritos: { cod: string; nome: string; area: number; assent: number }[];
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
    ${cabecalho("Prancha 02 · As sete regiões",
      "Sete pedaços de um planeta só",
      "As regiões não são do cânone — o agrupamento é nosso; o que cada uma é está no livro, e vem citado. As estampas são ilustração, não levantamento.")}
    <div class="corpo" style="max-width:none">
      ${regs.map((r, i) => `<section class="regiao" id="${esc(r.cod)}">
        <div>
          <figure class="estampa">
            <img src="${import.meta.env.BASE_URL}ilustracoes/${esc(r.cod)}.webp"
                 alt="Vista imaginada de ${esc(r.nome)}" loading="lazy" />
          </figure>
          <figure class="carta-regiao">
            <canvas data-reg="${esc(r.cod)}" aria-label="Localização de ${esc(r.nome)}"></canvas>
          </figure>
        </div>
        <div class="regiao-txt">
          <div class="regiao-n">${String(i + 1).padStart(2, "0")} · ${esc(r.cod)}</div>
          <h2 class="regiao-nome">${esc(r.nome)}</h2>
          <p class="abre-reg">${esc(r.abertura)}</p>
          ${r.citacao ? `<figure class="citacao">
            <blockquote>${esc(r.citacao.texto)}</blockquote>
            <figcaption class="fonte">${esc(r.citacao.autor)}, <em>${esc(r.citacao.volume)}</em>
              (${r.citacao.ano})${r.citacao.local ? " · " + esc(r.citacao.local) : ""}
              <code>${esc(r.citacao.marcador)}</code></figcaption>
          </figure>` : `<p class="sem-cita">Nenhuma frase do corpus nomeia esta região.</p>`}
          <div class="reg-num">
            <span><b>${num(r.area / 1e6, 2)}</b> milhões de km²</span>
            <span><b>${r.distritos.length}</b> distritos</span>
            <span><b>${r.assent}</b> assentamentos</span>
            <span><b>${compacto(r.pop, 1)}</b> habitantes<sup class="dag">†</sup></span>
            <span>controle: <b>${esc(r.poder_dominante)}</b></span>
          </div>
          <div class="reg-lista">${r.distritos.map((d) =>
            `<a href="#/mapa#=${esc(d.cod)}">${esc(d.nome)}</a>`).join("")}</div>
        </div>
      </section>`).join("")}
      <p class="nota-dag" style="margin:8px 0 0"><b>†</b>
        <span>população é modelo nosso; o total de 10 milhões de fremen é que é cânone</span></p>
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
