import { t } from "../i18n";
import { plac } from "../pranchas";
import { atlas, distritos, assentamentos, rotulos, rasters, mundo } from "../dados";
import { Mapa } from "../mapa";
import { rodape } from "../ui";
import { areia } from "../areia";

/* A abertura conta o mundo, não o trabalho. Três tempos, de cima para baixo:
 *
 *  1. Órbita — Arrakis girando no escuro e uma frase que dá vontade de saber
 *     mais. O planeta é um vídeo renderizado (scripts/oneshot/
 *     2026-09-13_planeta_render.py); a geografia dele é ilustração, não a malha.
 *  2. Superfície — as dunas, com areia soprando por cima, e quatro fatos do
 *     mundo. Só cânone: nenhum número daqui depende do modelo, então nenhum
 *     precisa de adaga nem de desculpa.
 *  3. A carta — uma faixa do mapa de verdade, parada, que abre a prancha 01.
 *     Quem clica em "Abrir o mapa" já viu o que vai encontrar.
 *  4. As três pranchas do argumento, com seus cinemagraphs.
 */
const fatos = (): { v: string; u: string; texto: string; rota: string }[] => [
  { v: "700", u: "km/h", rota: "regioes",
    texto: t("de vento numa tempestade de Coriolis, carregado de areia.", "of wind in a Coriolis storm, loaded with sand.") },
  { v: "400", u: t("metros", "metres"), rota: "verme",
    texto: t("de comprimento. Já viram vermes desse tamanho no deserto profundo.", "long. Worms that size have been seen in the deep desert.") },
  { v: t("620 mil", "620,000"), u: "solaris", rota: "economia",
    texto: t("por um único decagrama de especiaria, no pico do preço.", "for a single decagram of spice, at the peak price.") },
  { v: "10", u: t("milhões", "million"), rota: "poder",
    texto: t("de fremen, no mínimo. O Barão que governava o planeta achava que eram poucos.", "Fremen, at least. The Baron who ruled the planet thought there were only a few.") },
];

export async function inicio(alvo: HTMLElement) {
  const B = import.meta.env.BASE_URL;
  const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Cada cartão tem a estampa parada e, por cima, o cinemagraph dela. O vídeo
     não toca sozinho: ver ligaEstampasVivas, no fim do arquivo. */
  const cartao = (rota: string, plac: string, titulo: string, nome: string, texto: string) =>
    `<a href="#/${rota}" class="cartao">
      <div class="n">${t("Prancha", "Plate")} ${plac}</div>
      <h3>${titulo}</h3>
      <div class="estampa-viva">
        <img class="miniatura" src="${B}ilustracoes/${nome}.webp" alt="" loading="lazy" />
        <video muted loop playsinline preload="none" aria-hidden="true" tabindex="-1">
          <source src="${B}videos/${nome}.webm" type="video/webm" />
          <source src="${B}videos/${nome}.mp4" type="video/mp4" />
        </video>
      </div>
      <p>${texto}</p>
      <span class="ler">${t("Ler a prancha →", "Read the plate →")}</span>
    </a>`;

  alvo.innerHTML = `
  <section class="orbita">
    <div class="orbita-texto">
      <h1>${t("O lugar mais valioso do universo é um deserto onde nunca choveu.",
              "The most valuable place in the universe is a desert where it has never rained.")}</h1>
      <p class="abre">${t(`Não há mar nem nuvem de chuva. Aqui a água de um morto
      pertence à tribo — e a areia esconde a especiaria de que o Império inteiro
      depende.`, `No sea, no rain clouds. Here a dead man's water belongs to the tribe,
      and the sand hides the spice the whole Empire depends on.`)}</p>
      <a class="cta" href="#/mapa">${t("Abrir o mapa", "Open the map")}<span aria-hidden="true">→</span></a>
    </div>
    <div class="orbita-planeta" aria-hidden="true">
      <img src="${B}capa/planeta.webp" alt="" />
      ${quieto ? "" : `<video muted loop playsinline autoplay preload="auto" tabindex="-1">
        <source src="${B}capa/planeta_1080.webm" type="video/webm" media="(min-width: 900px)" />
        <source src="${B}capa/planeta_1080.mp4" type="video/mp4" media="(min-width: 900px)" />
        <source src="${B}capa/planeta.webm" type="video/webm" />
        <source src="${B}capa/planeta.mp4" type="video/mp4" />
      </video>`}
    </div>
  </section>

  <section class="superficie">
    <canvas class="areia" aria-hidden="true"></canvas>
    <ul class="fatos">
      ${fatos().map((f) => `<li><a href="#/${f.rota}">
        <span class="v">${f.v}<small>${f.u}</small></span>
        <span class="t">${f.texto}</span>
      </a></li>`).join("")}
    </ul>
  </section>

  <a class="faixa-carta" href="#/mapa" aria-label="${t("Abrir o mapa", "Open the map")}">
    <canvas aria-hidden="true"></canvas>
    <span class="rotulo-carta">
      <small>${t("Prancha 01 · Arrakis vista do polo", "Plate 01 · Arrakis seen from the pole")}</small>
      <b>${t("A carta inteira", "The full map")} <span aria-hidden="true">→</span></b>
    </span>
  </a>

  <h2 class="titulo-argumentos">${t("O que o mapa mostra", "What the map shows")}</h2>
  <section class="argumentos">
    ${cartao("padroes", plac("padroes"), t("O terreno pesa mais que o mercado", "Terrain matters more than the market"), "c_padroes",
      t("Os assentamentos de Arrakis não seguem a capital. Seguem a rocha firme.",
        "Settlements on Arrakis don't follow the capital. They follow solid rock."))}
    ${cartao("acessibilidade", plac("acessibilidade"), t("Duas geografias no mesmo território", "Two geographies on the same ground"), "c_acessibilidade",
      t("Para o Império, a areia é barreira. Para os fremen, é estrada.",
        "To the Empire, sand is a barrier. To the Fremen, it's a road."))}
    ${cartao("poder", plac("poder"), t("Quem manda no chão", "Who runs the ground"), "c_poder",
      t("O Imperador deu o planeta a uma Casa. Mais da metade da especiaria sai de terra que ninguém governa.",
        "The Emperor gave the planet to one House. More than half the spice comes from land nobody governs."))}
  </section>

  ${rodape()}`;

  ligaEstampasVivas(alvo);
  ligaPlaneta(alvo);
  ligaCarta(alvo);

  const desligaAreia = areia(alvo.querySelector(".superficie .areia") as HTMLCanvasElement);
  const obs = new MutationObserver(() => {
    if (!document.body.contains(alvo.querySelector(".superficie"))) { desligaAreia(); obs.disconnect(); }
  });
  obs.observe(alvo, { childList: true });
}


/* A faixa da carta usa o mesmo motor da prancha 01, parado (sem cursor, sem
 * zoom), cobrindo a faixa e cortado na metade norte, onde estão a Muralha e as
 * cidades. Os dados só são pedidos quando a faixa chega perto da tela. */
function ligaCarta(raiz: HTMLElement) {
  const tela = raiz.querySelector<HTMLCanvasElement>(".faixa-carta canvas");
  if (!tela) return;
  let feito = false;
  const io = new IntersectionObserver(async ([e]) => {
    if (!e.isIntersecting || feito) return;
    feito = true; io.disconnect();
    const [atl, d, rots, a, ras, mun] = await Promise.all(
      [atlas(), distritos(), rotulos(), assentamentos(), rasters(), mundo()]);
    if (!document.body.contains(tela)) return;
    const carta = new Mapa(tela, {
      raster: "relevo", coropleto: "",
      camadas: new Set(["distritos", "assentamentos", "grade", "rotulos"]),
      selecionado: null,
    });
    carta.carrega(atl, d, rots, a, ras);
    carta.estatica = true;
    carta.folha = mun.fan;
    const f = mun.fan;
    const recorte: [number, number, number, number] = [f[0], f[1] + (f[3] - f[1]) * 0.30, f[2], f[3]];
    const ajusta = () => { carta.redimensiona(); carta.enquadra(recorte, 0, true); };
    ajusta();
    requestAnimationFrame(ajusta);
    const ro = new ResizeObserver(ajusta);
    ro.observe(tela);
    const obs = new MutationObserver(() => {
      if (!document.body.contains(tela)) { ro.disconnect(); obs.disconnect(); }
    });
    obs.observe(raiz, { childList: true });
  }, { rootMargin: "500px 0px" });
  io.observe(tela);
}


/* O vídeo do planeta entra por cima do pôster só quando já está tocando, e
 * pausa fora da tela: 48 s de loop decodificando atrás do rodapé é bateria
 * gasta à toa. */
function ligaPlaneta(raiz: HTMLElement) {
  const caixa = raiz.querySelector<HTMLElement>(".orbita-planeta");
  const v = caixa?.querySelector("video");
  if (!caixa || !v) return;
  v.addEventListener("playing", () => caixa.classList.add("vivo"), { once: true });
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) v.play().catch(() => {}); else v.pause();
  }, { rootMargin: "-40px 0px" });   // encostar na borda também conta como visível
  // observa a seção, não a caixa: o planeta é maior que a órbita e sangra por baixo dela
  io.observe(caixa.closest(".orbita") ?? caixa);
  const obs = new MutationObserver(() => {
    if (!document.body.contains(caixa)) { io.disconnect(); obs.disconnect(); v.pause(); }
  });
  obs.observe(raiz, { childList: true });
}


/* Os cinemagraphs não tocam sozinhos. Três vídeos em movimento lado a lado
 * disputam o olho entre si, e o da tempestade engoliria os outros dois.
 *
 *  - com mouse: toca o cartão sob o cursor (ou com foco de teclado);
 *  - sem mouse: toca só o cartão que está pelo menos 60% dentro da tela — em
 *    coluna única, é no máximo um de cada vez;
 *  - prefers-reduced-motion: nunca toca, fica a estampa parada.
 *
 * O vídeo só é baixado na primeira vez que precisa tocar (preload="none") e
 * entra por cima da estampa com fade: em rede lenta o leitor continua vendo a
 * imagem, nunca um retângulo preto. */
function ligaEstampasVivas(raiz: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const comMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const cartoes = [...raiz.querySelectorAll<HTMLElement>(".cartao")];
  if (!cartoes.length) return;

  const toca = (c: HTMLElement) => {
    const v = c.querySelector("video");
    if (!v) return;
    if (v.preload === "none") v.preload = "auto";
    v.play().then(() => c.classList.add("vivo")).catch(() => {});
  };
  const para = (c: HTMLElement) => {
    c.classList.remove("vivo");
    c.querySelector("video")?.pause();
  };

  let io: IntersectionObserver | null = null;
  let desliga = () => {};
  if (comMouse) {
    for (const c of cartoes) {
      c.addEventListener("mouseenter", () => toca(c));
      c.addEventListener("mouseleave", () => para(c));
      c.addEventListener("focus", () => toca(c));
      c.addEventListener("blur", () => para(c));
    }
  } else {
    /* "60% visível" não basta: numa tela alta de celular cabem dois cartões
       assim, e os dois tocavam juntos (a verificação em scripts/movimento.mjs
       pegou). A regra é outra: entre os cartões visíveis, toca só o de centro
       mais perto do centro da tela. */
    const visiveis = new Set<HTMLElement>();
    const escolhe = () => {
      const meio = window.innerHeight / 2;
      let melhor: HTMLElement | null = null, dist = Infinity;
      for (const c of visiveis) {
        const r = c.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - meio);
        if (d < dist) { dist = d; melhor = c; }
      }
      for (const c of cartoes) (c === melhor ? toca : para)(c);
    };
    io = new IntersectionObserver((vistos) => {
      for (const e of vistos) {
        const c = e.target as HTMLElement;
        if (e.isIntersecting && e.intersectionRatio >= 0.6) visiveis.add(c); else visiveis.delete(c);
      }
      escolhe();
    }, { threshold: [0, 0.6, 1] });
    cartoes.forEach((c) => io!.observe(c));
    let quadro = 0;
    const aoRolar = () => {
      if (quadro) return;
      quadro = requestAnimationFrame(() => { quadro = 0; if (visiveis.size > 1) escolhe(); });
    };
    window.addEventListener("scroll", aoRolar, { passive: true });
    desliga = () => window.removeEventListener("scroll", aoRolar);
  }

  const obs = new MutationObserver(() => {
    if (!document.body.contains(cartoes[0])) {
      io?.disconnect(); obs.disconnect(); desliga();
      cartoes.forEach((c) => c.querySelector("video")?.pause());
    }
  });
  obs.observe(raiz, { childList: true });
}
