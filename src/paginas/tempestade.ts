import "../tempestade.css";
import { t } from "../i18n";
import { selo } from "../ui";

/** Uma dupla de estampas imaginadas. A figura cartográfica de custo fica acima
 * e continua sendo a fonte para qualquer leitura espacial ou quantitativa. */
export function ligaTempestade(alvo: HTMLElement): void {
  const corpo = alvo.querySelector<HTMLElement>(".corpo");
  const mapa = corpo?.querySelector<HTMLElement>("figure.figura");
  if (!corpo || !mapa) return;

  const B = import.meta.env.BASE_URL;
  const fremen = t("Fremen · sob a rocha", "Fremen · behind the rock");
  const imperio = t("Império · na areia aberta", "Empire · on open sand");
  const secao = document.createElement("section");
  secao.className = "tempestade-ensaio";
  secao.setAttribute("aria-labelledby", "tempestade-titulo");
  secao.innerHTML = `
    <div class="tempestade-intro">
      <span class="tempestade-sobretitulo">${t("A mesma tempestade, duas posições", "One storm, two positions")}</span>
      <h2 id="tempestade-titulo">${t("O chão muda o abrigo", "The ground changes the shelter")}</h2>
      <p>${t("A rocha oferece passagem e proteção; a areia aberta deixa a travessia exposta. Arraste o controle para mudar de ponto de vista.",
              "Rock offers passage and cover; open sand leaves the crossing exposed. Move the control to change point of view.")}</p>
    </div>
    <figure class="tempestade-figura">
      <div class="tempestade-cena" style="--imperio:0">
        <img class="tempestade-fremen" src="${B}ilustracoes/tempestade_fremen.webp" width="1536" height="1024"
          alt="${t("Uma pessoa fremen entre rochas escuras observa uma vasta parede de areia se aproximar do deserto ao entardecer.",
                   "A Fremen traveller among dark rocks watches a vast wall of sand advance over the desert at dusk.")}" loading="lazy" />
        <img class="tempestade-imperio" src="${B}ilustracoes/tempestade_imperio.webp" width="1536" height="1024"
          alt="${t("Duas pessoas seguem pela areia aberta diante de uma vasta parede de tempestade, com um pico rochoso distante.",
                   "Two travellers cross open sand before a vast storm wall, with a distant rocky peak.")}" loading="lazy" />
        <span class="tempestade-cena-legenda" aria-hidden="true">${fremen}</span>
      </div>
      <div class="tempestade-controles">
        <button class="tempestade-extremo" type="button" data-pos="0">${fremen}</button>
        <input class="tempestade-range" type="range" min="0" max="100" value="0" step="1"
          aria-label="${t("Comparar as duas perspectivas da tempestade", "Compare the two storm perspectives")}" />
        <button class="tempestade-extremo" type="button" data-pos="100">${imperio}</button>
      </div>
      <figcaption>${selo("ILUSTRACAO_IA", t("Ilustração interpretativa", "Interpretive illustration"))}
        <span>${t("Duas cenas imaginadas, sem escala ou localização exata. A diferença de custo vem dos mapas acima e do modelo de fricção do terreno; estas imagens não foram usadas para medi-la.",
                    "Two imagined scenes, without scale or exact location. The cost difference comes from the maps above and the terrain-friction model; these images were not used to measure it.")}</span></figcaption>
    </figure>
    <figure class="tempestade-retrato">
      <img src="${B}ilustracoes/luciani_fremen_travessia.webp" width="1448" height="1086"
        alt="${t("Uma fremen sentada numa elevação rochosa diante do deserto ao pôr do sol",
                 "A Fremen woman seated on a rocky rise before the desert at sunset")}" loading="lazy" />
      <figcaption><span>${t("O segundo Arrakis", "The second Arrakis")}</span>
        <strong>${t("A areia como caminho", "Sand as a road")}</strong></figcaption>
    </figure>`;
  mapa.insertAdjacentElement("afterend", secao);

  const cena = secao.querySelector<HTMLElement>(".tempestade-cena")!;
  const range = secao.querySelector<HTMLInputElement>(".tempestade-range")!;
  const rotulo = secao.querySelector<HTMLElement>(".tempestade-cena-legenda")!;
  const extremos = [...secao.querySelectorAll<HTMLButtonElement>(".tempestade-extremo")];
  const atualiza = () => {
    const valor = Number(range.value);
    cena.style.setProperty("--imperio", String(valor / 100));
    const imperioAtivo = valor >= 50;
    rotulo.textContent = imperioAtivo ? imperio : fremen;
    range.setAttribute("aria-valuetext", valor === 0 ? fremen : valor === 100 ? imperio
      : t(`${valor}% da vista imperial`, `${valor}% Imperial view`));
    extremos.forEach((botao) => botao.setAttribute("aria-pressed", String(Number(botao.dataset.pos) === valor)));
  };
  range.addEventListener("input", atualiza);
  extremos.forEach((botao) => botao.addEventListener("click", () => {
    range.value = botao.dataset.pos ?? "0";
    atualiza();
    range.focus();
  }));
  atualiza();
}
