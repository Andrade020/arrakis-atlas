import { atlas, distritos, rotulos, assentamentos, rasters, mundo } from "../dados";
import { Mapa } from "../mapa";
import { prancha } from "../pranchas";
import { cabecalho, esc, rodape } from "../ui";
import { t } from "../i18n";
import "./fuga.css";

/* A fuga de Paul e Jessica, de Arrakeen de volta a Arrakeen.
 *
 * Narrativa conduzida pela rolagem: o texto desce à esquerda, a carta fica
 * parada à direita e a câmera vai de uma etapa à outra. A página inteira é
 * enredo do livro 1 (e dos dois filmes), então fica atrás de um aviso.
 *
 * O livro nomeia poucos lugares da fuga. Onde ele nomeia, a etapa tem um ponto
 * no mapa; onde não nomeia (o esconderijo de Idaho, a tempestade, a fenda do
 * verme), a etapa diz isso, e o traço entre os pontos vira tracejado. Inventar
 * um lugar para essas etapas seria o erro que o atlas inteiro evita.
 */

interface Etapa {
  titulo: string;
  texto: string;
  marcas: string[];
  cod: string | null;       // distrito, se o livro nomeia o lugar
  lugar?: string;
}

const etapas = (): Etapa[] => [
  { cod: "AR-19", lugar: "Arrakeen", titulo: t("A noite da traição", "The night of the betrayal"),
    texto: t("Os Atreides foram morar na Residência, a antiga casa do conde Fenring. Numa nave pousada, o Barão Harkonnen assiste à noite de Arrakeen em chamas.",
             "The Atreides have moved into the Residency, once the home of Count Fenring. From a grounded ship, Baron Harkonnen watches Arrakeen burn through the night."),
    marcas: ["[1|chapter002|457]", "[1|chapter021|3742]"] },
  { cod: null, titulo: t("Uma tenda entre as rochas", "A tent among the rocks"),
    texto: t("Um tóptero estranho mergulha da noite sobre Paul e Jessica no deserto. Depois, Idaho os esconde numa tenda destiladora cercada de rochas. Ali, Paul enxerga o que vem pela frente, inclusive o nome que vão lhe dar, Muad'Dib.",
             "A strange 'thopter dives out of the night onto Paul and Jessica in the desert. Later, Idaho hides them in a stilltent ringed by rocks. There Paul sees what lies ahead, including the name he will be given: Muad'Dib."),
    marcas: ["[1|chapter022|4043]", "[1|chapter022|4039]", "[1|chapter022|4347]"] },
  { cod: null, titulo: t("A tempestade", "The storm"),
    texto: t("Acordam com a tenda soterrada. Saem à noite, com a primeira lua avermelhada de poeira. \"Vamos para o sul, pelas rochas. Se nos pegarem em campo aberto…\"",
             "They wake to find the tent buried. They set out at night under a first moon reddened by dust. \"We'll head south and keep to the rocks. If they caught us in the open…\""),
    marcas: ["[1|chapter023|4364]", "[1|chapter023|4441]", "[1|chapter023|4444]"] },
  { cod: null, titulo: t("O verme na fenda", "The worm at the crack"),
    texto: t("Espremidos numa rachadura da rocha, os dois veem a boca subir da areia na direção deles: uns oitenta metros de diâmetro, dentes de cristal brilhando ao luar.",
             "Wedged into a crack in the rock, the two watch the mouth rise out of the sand toward them: some eighty metres across, crystal teeth flashing in the moonlight."),
    marcas: ["[1|chapter029|5776]", "[1|chapter029|5782]"] },
  { cod: "AR-06", lugar: t("Bacia de Tuono", "Tuono Basin"), titulo: t("Os fremen", "The Fremen"),
    texto: t("A tropa de Stilgar os encontra. Numa luta à noite na Bacia de Tuono, Jessica derruba Stilgar; Jamis jura que foi bruxaria.",
             "Stilgar's troop finds them. In a struggle at night in Tuono Basin, Jessica throws Stilgar; Jamis swears it was witchcraft."),
    marcas: ["[1|chapter032|6337]", "[1|chapter033|6482]"] },
  { cod: "AR-08", lugar: "Sietch Tabr", titulo: "Usul",
    texto: t("Paul recebe o nome secreto de tropa, Usul, que só os de Sietch Tabr podem usar. Mãe e filho vivem no sietch até terem de fugir de um pogrom.",
             "Paul is given his secret troop name, Usul, which only the people of Sietch Tabr may use. Mother and son live in the sietch until a pogrom forces them to flee."),
    marcas: ["[1|chapter033|6663]", "[1|chapter041|8433]"] },
  { cod: "AR-27", lugar: t("Passo de Harg", "Harg Pass"), titulo: t("O crânio do Duque", "The Duke's skull"),
    texto: t("Numa incursão a Arrakeen para recuperar a água dos mortos, Paul encontra os restos do pai. Guarda o crânio num túmulo de pedra fremen sobre o Passo de Harg.",
             "On a raid into Arrakeen to recover the water of the dead, Paul finds his father's remains. He enshrines the skull in a Fremen rock mound above Harg Pass."),
    marcas: ["[1|chapter040|8220]", "[1|notes|11400]"] },
  { cod: "AR-39", lugar: t("Erg de Habbanya", "Habbanya Erg"), titulo: t("O primeiro verme", "The first worm"),
    texto: t("Paul monta o fazedor e o conduz pelo erg. \"Sou um fremen nascido hoje, aqui no erg de Habbanya.\"",
             "Paul mounts the maker and rides it across the erg. \"I am a Fremen born this day here in the Habbanya erg.\""),
    marcas: ["[1|chapter042|8680]"] },
  { cod: "AR-40", lugar: t("Crista de Habbanya", "Habbanya Ridge"), titulo: t("A Caverna dos Pássaros", "Cave of Birds"),
    texto: t("A tropa acampa na caverna sob a crista. Ela vira o posto de comando de Paul; ao norte, o Passo do Vento dá numa vila-chave dos Harkonnen.",
             "The troop camps in the cave beneath the ridge. It becomes Paul's command post; to the north, Wind Pass opens onto a key Harkonnen village."),
    marcas: ["[1|chapter042|8717]", "[1|chapter044|9215]"] },
  { cod: "AR-19", lugar: "Arrakeen", titulo: t("De volta, com a tempestade", "Back, with the storm"),
    texto: t("Da borda da Muralha Escudo, Paul espera \"uma bisavó de tempestade\". A Velha Fenda é aberta a explosivos, e na noite da vitória ele é levado à mesma Residência de onde tinha fugido.",
             "From the rim of the Shield Wall, Paul waits for \"a great grandmother of a storm\". Old Gap is blasted open, and on the evening of victory he is brought to the same Residency he once fled."),
    marcas: ["[1|chapter046|9554]", "[1|chapter046|9590]", "[1|notes|11402]", "[1|chapter048|9892]"] },
];
let ETAPAS: Etapa[] = [];

const CHAVE = "arrakis-fuga-aberta";
const mc = (m: string) => `<code class="marca">${esc(m)}</code>`;
const B = import.meta.env.BASE_URL;

export async function fuga(alvo: HTMLElement) {
  ETAPAS = etapas();
  let aberta = false;
  try { aberta = localStorage.getItem(CHAVE) === "1"; } catch { /* sem armazenamento */ }

  alvo.innerHTML = `<article class="folha fuga">
    ${cabecalho(`${prancha("fuga")} · ${t("A rota da fuga", "The escape route")}`,
      t("De Arrakeen a Arrakeen", "From Arrakeen to Arrakeen"),
      t("A noite em que os Harkonnen voltam, a travessia do deserto e o caminho de volta, marcados no mapa nos lugares que o livro nomeia.",
        "The night the Harkonnens return, the crossing of the desert and the road back, marked on the map at the places the book names."))}
    <div class="corpo">
      <div class="aviso-spoiler" ${aberta ? "hidden" : ""}>
        <p>${t(`<strong>Esta prancha conta o enredo de <em>Duna</em></strong>, do livro 1 e dos dois
        filmes. Se ainda não viu nem leu, talvez queira voltar depois.`,
        `<strong>This plate tells the plot of <em>Dune</em></strong>, book 1 and both films.
        If you haven't seen or read it yet, you may want to come back later.`)}</p>
        <button class="btn-spoiler" type="button">${t("Mostrar a rota", "Show the route")}</button>
      </div>
    </div>
    <section class="fuga-palco" ${aberta ? "" : "hidden"}>
      <ol class="fuga-etapas">
        <li class="fuga-prologo">
          <figure>
            <img src="${B}ilustracoes/fuga_abertura.webp" width="1024" height="1536" loading="lazy"
              alt="${t("Duas figuras pequenas atravessam uma passagem rochosa à noite, diante de uma tempestade distante.",
                "Two small figures cross a rocky pass at night, facing a distant dust storm.")}">
            <figcaption>
              <span>00 · ${t("Prólogo visual", "Visual prologue")}</span>
              <strong>${t("A noite, a rocha, a travessia", "Night, rock, crossing")}</strong>
              <small>${t("Cena interpretativa. O percurso e seus lugares são mostrados na carta, conforme as fontes.",
                "Interpretive scene. The route and its places are shown on the map according to the sources.")}</small>
            </figcaption>
          </figure>
        </li>
        ${ETAPAS.map((e, i) => `<li class="etapa" data-i="${i}">
          <div class="etapa-n">${String(i + 1).padStart(2, "0")}${e.lugar
            ? ` · <a class="link" href="#/mapa#=${e.cod}">${esc(e.lugar)}</a>`
            : ` · <span class="sem-lugar">${t("o livro não diz onde", "the book doesn't say where")}</span>`}</div>
          <h2>${esc(e.titulo)}</h2>
          <p>${esc(e.texto)}</p>
          <p class="marcas">${e.marcas.map(mc).join(" ")}</p>
        </li>`).join("")}
      </ol>
      <div class="fuga-carta">
        <canvas aria-label="${t("Mapa com a rota da fuga", "Map of the escape route")}"></canvas>
        <div class="fuga-etapa-atual" role="status" aria-live="polite" aria-atomic="true"></div>
        <div class="fuga-abertura" aria-hidden="true">
          <img src="${B}ilustracoes/fuga_abertura.webp" width="1024" height="1536" alt="">
          <span class="fuga-abertura-titulo">${t("A rota da fuga", "The escape route")}</span>
        </div>
      </div>
    </section>
    ${rodape()}
  </article>`;

  const palco = alvo.querySelector<HTMLElement>(".fuga-palco")!;
  const aviso = alvo.querySelector<HTMLElement>(".aviso-spoiler")!;
  const monta = () => { palco.hidden = false; aviso.hidden = true; ligaCarta(alvo); };
  aviso.querySelector("button")!.addEventListener("click", () => {
    try { localStorage.setItem(CHAVE, "1"); } catch { /* ok */ }
    monta();
    palco.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  });
  if (aberta) ligaCarta(alvo);
}

async function ligaCarta(raiz: HTMLElement) {
  const tela = raiz.querySelector<HTMLCanvasElement>(".fuga-carta canvas")!;
  if (tela.dataset.ligada) return;
  tela.dataset.ligada = "1";
  const [atl, d, rots, ass, ras, mun] = await Promise.all(
    [atlas(), distritos(), rotulos(), assentamentos(), rasters(), mundo()]);
  const pos = new Map(rots.map((r) => [r.cod, [r.x, r.y] as [number, number]]));

  const mapa = new Mapa(tela, {
    raster: "relevo", coropleto: "",
    camadas: new Set(["distritos", "rotulos"]), selecionado: null,
  });
  mapa.carrega(atl, d, rots, ass, ras);
  mapa.estatica = true;
  mapa.folha = mun.fan;

  const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const abertura = raiz.querySelector<HTMLElement>(".fuga-abertura")!;
  const indicador = raiz.querySelector<HTMLElement>(".fuga-etapa-atual")!;
  let temporizadorAbertura = 0;
  let atual = 0;

  /* A rota: cada etapa com lugar é um ponto numerado; entre dois pontos
     seguidos, linha cheia se não há etapa sem lugar no meio, tracejada se há.
     O que ainda não aconteceu fica apagado. */
  mapa.sobreposicao = (ctx, tela) => {
    const pontos = ETAPAS.map((e, i) => ({ i, e, p: e.cod ? pos.get(e.cod) ?? null : null }));
    let ant: typeof pontos[0] | null = null;
    let lacuna = false;
    ctx.lineCap = "round";
    for (const q of pontos) {
      if (!q.p) { lacuna = true; continue; }
      if (ant && ant.p) {
        const [x0, y0] = tela(...ant.p), [x1, y1] = tela(...q.p);
        const feito = q.i <= atual;
        ctx.setLineDash(lacuna ? [7, 7] : []);
        ctx.strokeStyle = feito ? "rgba(138, 75, 20, .95)" : "rgba(60, 44, 24, .22)";
        ctx.lineWidth = feito ? 3 : 1.6;
        // curva leve, para trajetos de ida e volta não se sobreporem
        const mx = (x0 + x1) / 2 - (y1 - y0) * 0.12, my = (y0 + y1) / 2 + (x1 - x0) * 0.12;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(mx, my, x1, y1); ctx.stroke();
      }
      ant = q; lacuna = false;
    }
    ctx.setLineDash([]);
    const vistos = new Set<string>();
    for (const q of pontos) {
      if (!q.p || !q.e.cod) continue;
      const [x, y] = tela(...q.p);
      const ativo = q.i === atual || (ETAPAS[atual].cod === q.e.cod);
      const feito = q.i <= atual;
      const deslocado = vistos.has(q.e.cod) ? 22 : 0;   // Arrakeen aparece duas vezes
      vistos.add(q.e.cod);
      ctx.beginPath();
      ctx.arc(x + deslocado, y - deslocado, ativo ? 15 : 11, 0, Math.PI * 2);
      ctx.fillStyle = ativo ? "#8A4B14" : feito ? "#EFE8DA" : "rgba(239, 232, 218, .7)";
      ctx.fill();
      ctx.lineWidth = 1.6; ctx.strokeStyle = feito ? "#8A4B14" : "rgba(60, 44, 24, .35)"; ctx.stroke();
      ctx.fillStyle = ativo ? "#FFF6E6" : feito ? "#8A4B14" : "rgba(60, 44, 24, .5)";
      ctx.font = `600 ${ativo ? 12 : 10}px Archivo, sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(String(q.i + 1), x + deslocado, y - deslocado + 0.5);
    }
  };

  /* Câmera: enquadra o ponto da etapa atual junto do ponto anterior com lugar,
     com folga. Etapa sem lugar mantém o enquadramento da última com lugar. */
  function alvoDa(i: number): [number, number, number] | null {
    const v = mapa.vista;
    if (!v.larg) return null;
    const idx: number[] = [];
    // na última etapa a câmera abre para a rota inteira
    const todas = i === ETAPAS.length - 1;
    for (let j = i; j >= 0 && (todas || idx.length < 2); j--) if (ETAPAS[j].cod) idx.push(j);
    if (!idx.length) return null;
    const ps = idx.map((j) => pos.get(ETAPAS[j].cod!)!);
    const xs = ps.map((p) => p[0]), ys = ps.map((p) => p[1]);
    let cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const ext = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 1.5e6) * (todas ? 1.35 : 1.8);
    const k = Math.min(v.larg, v.alt) / ext;
    // não deixa a janela passar da borda da folha: fora dela é só margem de papel
    const f = mun.fan, mw = v.larg / k / 2, mh = v.alt / k / 2;
    cx = f[2] - f[0] > 2 * mw ? Math.min(f[2] - mw, Math.max(f[0] + mw, cx)) : (f[0] + f[2]) / 2;
    cy = f[3] - f[1] > 2 * mh ? Math.min(f[3] - mh, Math.max(f[1] + mh, cy)) : (f[1] + f[3]) / 2;
    return [k, v.larg / 2 - cx * k, v.alt / 2 + cy * k];
  }

  let quadro = 0;
  function voa(i: number) {
    const para = alvoDa(i);
    if (!para) { mapa.desenha(); return; }
    cancelAnimationFrame(quadro);
    const de = mapa.vista, t0 = performance.now(), dur = quieto ? 0 : 900;
    const passo = (t: number) => {
      const u = dur ? Math.min(1, (t - t0) / dur) : 1;
      const e = u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
      // interpola a escala em log, senão o zoom parece acelerar no fim
      const k = Math.exp(Math.log(de.k) + (Math.log(para[0]) - Math.log(de.k)) * e);
      // e o centro em metros, para o ponto não "escorregar" durante o zoom
      const c0 = [(de.larg / 2 - de.tx) / de.k, (de.ty - de.alt / 2) / de.k];
      const c1 = [(de.larg / 2 - para[1]) / para[0], (para[2] - de.alt / 2) / para[0]];
      const cx = c0[0] + (c1[0] - c0[0]) * e, cy = c0[1] + (c1[1] - c0[1]) * e;
      mapa.poeVista(k, de.larg / 2 - cx * k, de.alt / 2 + cy * k);
      if (u < 1) quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
  }

  const ajusta = () => { mapa.redimensiona(); const a = alvoDa(atual); if (a) mapa.poeVista(...a); };
  ajusta();
  requestAnimationFrame(ajusta);
  // A imagem abre a cena; a carta já está desenhada antes da revelação.
  temporizadorAbertura = window.setTimeout(() => abertura.classList.add("passou"), quieto ? 0 : 1800);
  const ro = new ResizeObserver(ajusta);
  ro.observe(tela);

  const etapas = [...raiz.querySelectorAll<HTMLElement>(".etapa")];
  const marcaEtapa = (i: number) => {
    atual = i;
    etapas.forEach((el, j) => el.classList.toggle("ativa", j === i));
    const e = ETAPAS[i];
    indicador.innerHTML = `<span class="fuga-indice">${String(i + 1).padStart(2, "0")}</span>
      <span class="fuga-indicador-texto"><strong>${esc(e.titulo)}</strong>
        <small>${e.cod
          ? `${t("Ponto no mapa", "Point on the map")}: ${esc(e.lugar ?? e.cod)}`
          : t("Lugar não indicado no livro · carta no último ponto nomeado",
              "Location not given in the book · map stays at the last named point")}</small></span>`;
  };
  const io = new IntersectionObserver((vistos) => {
    // a etapa ativa é a que cruza a faixa do meio da tela
    for (const v of vistos) {
      if (!v.isIntersecting) continue;
      const i = Number((v.target as HTMLElement).dataset.i);
      if (i === atual) continue;
      marcaEtapa(i);
      voa(i);
    }
  }, { rootMargin: "-45% 0px -45% 0px" });
  etapas.forEach((el) => io.observe(el));
  marcaEtapa(0);

  const obs = new MutationObserver(() => {
    if (!document.body.contains(tela)) {
      io.disconnect(); ro.disconnect(); obs.disconnect(); cancelAnimationFrame(quadro);
      window.clearTimeout(temporizadorAbertura);
    }
  });
  obs.observe(raiz, { childList: true });
}
