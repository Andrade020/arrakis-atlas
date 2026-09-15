import { prancha } from "../pranchas";
import { t } from "../i18n";
import { cabecalho, esc, rodape, selo } from "../ui";
import "../subsolo-motion.css";

/* Uma estampa interpretativa, sem escala. Os pontos clicáveis e as fontes são
 * HTML: podem ser traduzidos, selecionados, lidos por tecnologia assistiva e
 * corrigidos sem pedir ao gerador que desenhe letras na imagem. */
const partes = () => [
  {
    id: "agua", x: 16, y: 45,
    nome: t("A água presa", "Water sealed away"),
    texto: t("As trutas-da-areia isolam a água em bolsões da rocha porosa. O corte mostra essa relação; o tamanho e a posição do bolsão foram imaginados para a estampa.",
             "Sandtrout seal water in pockets of porous rock. The cutaway shows that relationship; the pocket's size and position were imagined for the plate."),
    marca: "[1|terminology|10989]",
  },
  {
    id: "massa", x: 43, y: 69,
    nome: t("A massa pré-especiaria", "The pre-spice mass"),
    texto: t("A excreção dos pequenos fazedores se acumula no subsolo. Quando água a alcança, a massa entra em reação e pode romper a superfície numa explosão de especiaria.",
             "The little makers' excretions gather underground. When water reaches the mass, it reacts and can break through the surface in a spice blow."),
    marca: "[1|appendixI|10410]",
  },
  {
    id: "verme", x: 81, y: 47,
    nome: t("O verme na areia seca", "The worm in dry sand"),
    texto: t("Poucas trutas sobrevivem à explosão e amadurecem em vermes. A água é veneno para eles; aqui o verme aparece separado do bolsão úmido para tornar essa diferença visível.",
             "A few sandtrout survive the spice blow and mature into worms. Water is poisonous to them; the worm is shown apart from the wet pocket to make that difference visible."),
    marca: "[1|appendixI|10410] · [1|terminology|11207]",
  },
];

export function subsolo(alvo: HTMLElement): void {
  const B = import.meta.env.BASE_URL;
  const itens = partes();
  alvo.innerHTML = `<article class="folha subsolo">
    ${cabecalho(`${prancha("subsolo")} · ${t("Sob a areia", "Beneath the sand")}`,
      t("A água que não se vê", "The water you cannot see"),
      t("A especiaria começa debaixo do chão. Uma criatura prende a água, a massa reage e, entre as sobreviventes, algumas se tornam vermes.",
        "Spice begins below the ground. One creature seals away water, a mass reacts and, among the survivors, some become worms."))}
    <div class="corpo">
      <figure class="corte-figura">
        <div class="corte-imagem">
          <img src="${B}ilustracoes/corte_subsolo_arrakis.webp" width="1536" height="1024"
            alt="${t("Corte imaginado do solo de Arrakis: trutas-da-areia em torno de um pequeno bolsão de água à esquerda, massa pré-especiaria ao centro e um verme na areia seca à direita.",
                      "Imagined cutaway of Arrakis: sandtrout around a small water pocket on the left, pre-spice mass at the centre and a worm in dry sand on the right.")}" />
          <svg class="ciclo-camada" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path class="ciclo-fluxo" pathLength="100" d="M 17 45 C 25 45, 29 58, 43 69" />
            <circle class="ciclo-reacao" cx="43" cy="69" r="7" />
            <path class="ciclo-erupcao" pathLength="100" d="M 43 69 C 47 56, 46 44, 48 23" />
          </svg>
          ${itens.map((p, i) => `<button class="corte-ponto" type="button" data-id="${p.id}"
            style="left:${p.x}%;top:${p.y}%" aria-controls="corte-nota"
            aria-pressed="${i === 0}" aria-label="${esc(p.nome)}">${String(i + 1).padStart(2, "0")}</button>`).join("")}
        </div>
        <figcaption>${selo("ILUSTRACAO_IA", t("Ilustração interpretativa", "Interpretive illustration"))}
          <span>${t("Corte imaginado, sem escala: formas, dimensões e disposição não são dados do cânone.",
                      "Imagined cutaway, not to scale: shapes, sizes and arrangement are not canon data.")}</span></figcaption>
      </figure>
      <div class="ciclo-controle">
        <button class="ciclo-botao" type="button" aria-pressed="false">${t("Ver o ciclo em movimento", "Watch the cycle in motion")}</button>
        <ol class="ciclo-etapas" aria-label="${t("Etapas ilustradas", "Illustrated stages")}">
          <li>${t("Água chega à massa", "Water reaches the mass")}</li>
          <li>${t("A reação cresce", "The reaction grows")}</li>
          <li>${t("A areia se rompe", "The sand breaks open")}</li>
        </ol>
      </div>
      <nav class="corte-indice" aria-label="${t("Partes do corte", "Parts of the cutaway")}">
        ${itens.map((p, i) => `<button type="button" data-id="${p.id}" aria-pressed="${i === 0}">
          <span>${String(i + 1).padStart(2, "0")}</span>${esc(p.nome)}</button>`).join("")}
      </nav>
      <section class="corte-nota" id="corte-nota" aria-live="polite"></section>
      <p class="nota">${t("A relação entre água, truta, massa e verme vem do texto; esta vista do subsolo é uma leitura visual dele. Os números e o ciclo completo estão nas páginas do verme e da água.",
                         "The relationship between water, sandtrout, mass and worm comes from the books; this underground view is a visual reading of it. The figures and full cycle are on the worm and water pages.")}</p>
      <p class="corte-links"><a class="link" href="#/verme">${t("O ciclo do verme →", "The worm's cycle →")}</a>
        <a class="link" href="#/agua">${t("A economia da água →", "The water economy →")}</a></p>
    </div>
    ${rodape()}
  </article>`;

  const nota = alvo.querySelector<HTMLElement>("#corte-nota")!;
  const seleciona = (id: string) => {
    const p = itens.find((item) => item.id === id);
    if (!p) return;
    alvo.querySelectorAll<HTMLButtonElement>("[data-id]").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.id === id)));
    nota.innerHTML = `<h2>${esc(p.nome)}</h2><p>${esc(p.texto)}</p><code>${esc(p.marca)}</code>`;
  };
  alvo.querySelectorAll<HTMLButtonElement>("[data-id]").forEach((b) =>
    b.addEventListener("click", () => seleciona(b.dataset.id!)));
  seleciona(itens[0].id);

  const figura = alvo.querySelector<HTMLElement>(".corte-imagem")!;
  const controle = alvo.querySelector<HTMLElement>(".ciclo-controle")!;
  const botao = alvo.querySelector<HTMLButtonElement>(".ciclo-botao")!;
  let fim: number | undefined;
  const para = () => {
    window.clearTimeout(fim);
    figura.classList.remove("em-ciclo");
    controle.classList.remove("em-ciclo");
    botao.setAttribute("aria-pressed", "false");
    botao.textContent = t("Ver o ciclo em movimento", "Watch the cycle in motion");
  };
  botao.addEventListener("click", () => {
    if (figura.classList.contains("em-ciclo")) { para(); return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    figura.classList.add("em-ciclo");
    controle.classList.add("em-ciclo");
    botao.setAttribute("aria-pressed", "true");
    botao.textContent = t("Parar movimento", "Stop motion");
    fim = window.setTimeout(para, 7800);
  });
}
