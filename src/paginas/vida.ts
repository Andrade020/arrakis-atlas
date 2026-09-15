import { prancha, secao } from "../pranchas";
import { cabecalho, esc, rodape, ligaSpoilers } from "../ui";
import { t, emIngles } from "../i18n";

/* Prancha 05 · O que vive no deserto.
 *
 * A pergunta que organiza a página é a que o próprio livro faz: o que nasceu
 * aqui e o que veio de fora. Quase tudo o que respira em Arrakis foi trazido —
 * por uma estação botânica imperial anterior à especiaria, e depois pelo plano
 * de Kynes. Nativos mesmo são poucos, e todos giram em torno do verme.
 *
 * Mesma regra das outras pranchas: marcador em cada afirmação; estampas lidas
 * do texto; o que só acontece nos livros seguintes vem borrado.
 */

const B = import.meta.env.BASE_URL;
const mc = (m: string) => `<code class="marca">${esc(m)}</code>`;

interface Ser {
  img?: string; nome: string; en: string; texto: string; marcas: string[];
  livro?: number; rota?: string;
}

function cartao(s: Ser): string {
  const spoiler = !!s.livro && s.livro > 1;
  return `<div class="especime${spoiler ? " spoiler" : ""}">
    ${s.img ? `<figure class="estampa-vida">
      <img src="${B}ilustracoes/vida/${s.img}.webp" alt="${esc(s.nome)}" loading="lazy"
           onerror="this.closest('figure').hidden = true" />
      <figcaption>${t("Ilustração lida do texto", "Illustration read from the text")}</figcaption>
    </figure>` : ""}
    <h3>${esc(s.nome)}${emIngles() ? "" : ` <span class="en">${esc(s.en)}</span>`}</h3>
    ${spoiler ? `<div class="ev-cab"><span class="ev-livro">${t("Livro", "Book")} ${s.livro} · <b>spoiler</b></span>
      <button class="olho" type="button" aria-pressed="false" aria-label="${t("Revelar spoiler do livro", "Reveal spoiler from book")} ${s.livro}">${OLHO}</button></div>` : ""}
    <p class="ev-texto"${spoiler ? ' aria-hidden="true"' : ""}>${s.texto} ${s.marcas.map(mc).join(" ")}</p>
    ${s.rota ? `<a class="link" href="${s.rota}">${s.rota.includes("verme") ? `${prancha("verme")} →` : t("Ver no mapa →", "See on the map →")}</a>` : ""}
  </div>`;
}

export const OLHO = `<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.5"/><path class="risco" d="M3 21 21 3" stroke="currentColor" stroke-width="1.5"/></svg>`;

const nativos = (): Ser[] => [
  { nome: "Shai-hulud", en: "sandworm", img: "verme_montaria", rota: "#/verme",
    texto: t("O verme. Fabrica a areia, espalha a especiaria e morre se se afogar em água.",
             "The worm. It makes the sand, scatters the spice, and dies if it drowns in water."),
    marcas: ["[1|terminology|11207]"] },
  { nome: t("Truta-da-areia", "Sandtrout"), en: "sandtrout · little maker", img: "truta",
    texto: t("Meio planta, meio animal. Tranca a água no subsolo e morre aos milhões a cada explosão de especiaria; as sobreviventes viram vermes.",
             "Half plant, half animal. It locks water away underground and dies by the million in every spice blow; the survivors become worms."),
    marcas: ["[1|terminology|10989]", "[1|appendixI|10410]"] },
  { nome: t("Plâncton de areia", "Sand plankton"), en: "sand plankton", img: "plancton",
    texto: t("Criaturas microscópicas que comem a especiaria espalhada pelo verme. O verme, por sua vez, come o plâncton.",
             "Microscopic creatures that feed on the spice the worm scatters. The worm, in turn, feeds on the plankton."),
    marcas: ["[1|appendixI|10411]"] },
  { nome: t("A raiz d'água", "The water root"), en: "native root plant", img: "raiz",
    texto: t("Planta nativa rara, só acima de 2.500 metros na zona temperada do norte. Um tubérculo de dois metros rende meio litro de água.",
             "A rare native plant, found only above 2,500 metres in the northern temperate zone. A tuber two metres long yields half a litre of water."),
    marcas: ["[1|appendixI|10402]"] },
];

const trazidos = (): Ser[] => [
  { nome: "Muad'Dib", en: "kangaroo mouse", img: "muaddib",
    texto: t("O rato-canguru adaptado de Arrakis. Os fremen o admiram por sobreviver no deserto aberto e veem o desenho dele na segunda lua.",
             "The adapted kangaroo mouse of Arrakis. The Fremen admire it for surviving in the open desert and see its shape on the second moon."),
    marcas: ["[1|terminology|11033]"] },
  { nome: "Cielago", en: "cielago", img: "cielago",
    texto: t("Morcego modificado. Um aparelho grava a mensagem no sistema nervoso dele, e o grito normal do bicho a carrega até outro aparelho.",
             "A modified bat. A device imprints a message on its nervous system, and the animal's ordinary cry carries it to another device."),
    marcas: ["[1|terminology|10729]", "[1|terminology|10770]"], rota: "#/mapa#=AR-03" },
  { nome: "Kulon", en: "kulon", img: "kulon",
    texto: t("O asno selvagem das estepes asiáticas da Terra, adaptado. Alguns contrabandistas usam, mas a água sai cara, mesmo com o bicho vestindo trajestil.",
             "The wild ass of Earth's Asian steppes, adapted. Some smugglers use it, but the water bill is high even with the animal wearing a stillsuit."),
    marcas: ["[1|terminology|10968]", "[1|appendixI|10400]"] },
  { nome: t("Falcão do deserto", "Desert hawk"), en: "desert hawk", img: "falcao",
    texto: t("Conta-se de Muad'Dib que viu um filhote de falcão sair do ovo e sussurrou: \"Kull wahad!\"",
             "It is said that Muad'Dib once watched a desert hawk chick break out of its shell and whispered: \"Kull wahad!\""),
    marcas: ["[1|terminology|10966]"] },
];

const depois = (): Ser[] => [
  { nome: t("Peixe predador", "Predator fish"), en: "predator fish", img: "peixe", livro: 3,
    texto: t("Os fremen passam a soltar peixes predadores na água dos qanats para manter as trutas-da-areia longe dela.",
             "The Fremen start putting predator fish into the water of the qanats to keep the sandtrout out."),
    marcas: ["[3|Children_of_Dune_split_012|625]"] },
  { nome: t("Borboleta-esqueleto", "Skeleton butterfly"), en: "skeleton butterfly", img: "borboleta", livro: 3,
    texto: t("Leto II vê uma borboleta de asas quase transparentes voando entre as sombras do penhasco, delicada demais para um lugar como aquele.",
             "Leto II watches a butterfly with almost transparent wings flit through the cliff's shadows, far too delicate for a place like that."),
    marcas: ["[3|Children_of_Dune_split_030|2841]"], rota: "#/mapa#=AR-09" },
];

export function vida(alvo: HTMLElement) {
  alvo.innerHTML = `<article class="folha vida">
    ${cabecalho(`${prancha("vida")} · ${t("O que vive no deserto", "What lives in the desert")}`,
      t("Quase tudo aqui veio de fora", "Almost everything here came from elsewhere"),
      t("Em Arrakis quase ninguém tem bicho de estimação, e animal de criação é raro. Tudo o que vive no deserto ou nasceu em torno do verme ou veio de fora.",
        "Almost nobody on Arrakis keeps a pet, and livestock is rare. Whatever lives in the desert either grew up around the worm or was brought in."))}
    <div class="corpo">
      <p class="nota">${t("Sobre os animais, ver o apêndice", "On animals, see the appendix")} ${mc("[1|appendixI|10400]")}. ${t(
        `Para o Dr. Yueh, "o planeta parece ter aberto os braços a certas formas de vida terrestres, e não está claro como"`,
        `As Dr. Yueh puts it, "the planet seems to have opened its arms to certain terranic life forms. It's not clear how"`)} ${mc("[1|chapter005|860]")}.</p>

      <section class="vida-sec">
        <h2><span class="g">${secao("vida", 1)}</span><span>${t("Nascidos aqui", "Born here")}</span></h2>
        <div class="grade-vida">${nativos().map(cartao).join("")}</div>
      </section>

      <section class="vida-sec">
        <h2><span class="g">${secao("vida", 2)}</span><span>${t("Trazidos e adaptados", "Brought in and adapted")}</span></h2>
        <p>${t(`Muito antes da especiaria, o Império manteve em Arrakis uma estação botânica de
        testes. O filme-livro dela, que Yueh mostra a Paul, já listava saguaro, palmeira-tâmara,
        verbena-da-areia, arbusto-de-creosoto… raposa-do-deserto, falcão, rato-canguru`,
        `Long before the spice, the Empire ran a botanical testing station on Arrakis. Its
        filmbook, which Yueh shows Paul, already listed saguaro, date palm, sand verbena,
        creosote bush… kit fox, desert hawk, kangaroo mouse`)}
        ${mc("[1|chapter009|1427]")} ${mc("[1|chapter009|1428]")}.</p>
        <div class="grade-vida">${trazidos().map(cartao).join("")}</div>
      </section>

      <section class="vida-sec">
        <h2><span class="g">${secao("vida", 3)}</span><span>${t("O jardim de Kynes", "Kynes's garden")}</span></h2>
        <div class="duas">
          <div>
            <p>${t(`O plano começa pelo capim. Os fremen plantam gramíneas de pobreza mutantes na
            face de sotavento de dunas escolhidas, que ficam atravessadas no caminho dos
            ventos de oeste: com esse lado preso, o outro cresce, e a duna vira barreira`,
            `The plan starts with grass. The Fremen plant mutated poverty grass on the downwind
            face of chosen dunes that lie across the path of the westerlies. With that side
            anchored, the other side grows, and the dune becomes a barrier`)}
            ${mc("[1|appendixI|10414]")} ${mc("[1|appendixI|10415]")}. ${t("Depois, capim-espada no barlavento", "Then sword grass on the windward side")} ${mc("[1|appendixI|10416]")}.</p>
            <p>${t(`Depois vêm as plantas de raiz mais funda, como efêmeras, arbustos, saguaro e
            cacto-barril`, `Next come deeper-rooted plants: ephemerals, shrubs, saguaro and
            barrel cactus`)} ${mc("[1|appendixI|10417]")} ${mc("[1|appendixI|10418]")}. ${t(`Os bichos
            chegam por último, na ordem em que o solo precisa deles. Primeiro os que cavam e
            arejam a terra (raposa, rato-canguru, lebre, tartaruga-da-areia), depois os
            predadores que os controlam (falcão, corujas, águia), os insetos para o que sobra
            e o morcego do deserto para vigiá-los`, `Animals arrive last, in the order the soil needs them.
            First the burrowers that open and aerate the ground (kit fox, kangaroo mouse, desert
            hare, sand terrapin), then the predators that keep them in check (hawk, owls, eagle),
            insects for the niches left over, and the desert bat to keep watch on them`)} ${mc("[1|appendixI|10419]")}.
            ${t("Mais de duzentas plantas de comida foram testadas", "More than two hundred food plants were tested")} ${mc("[1|appendixI|10420]")}.</p>
            <p>${t(`A conta de Kynes: se três por cento das plantas verdes do planeta entrarem na
            fixação de carbono, o ciclo se sustenta sozinho`, `Kynes's figure: if three per cent of the planet's
            green plants are taking part in fixing carbon, the cycle keeps itself going`)} ${mc("[1|appendixI|10433]")}.</p>
          </div>
          <figure class="estampa-vida">
            <img src="${B}ilustracoes/vida/capim.webp" alt="${t("Fileiras de capim plantadas na face de uma duna", "Rows of grass planted on the face of a dune")}" loading="lazy"
                 onerror="this.closest('figure').hidden = true" />
            <figcaption>${t("Ilustração lida do texto · capim prendendo a duna", "Illustration read from the text · grass holding the dune")}</figcaption>
          </figure>
        </div>
        <figure class="estampa-vida larga">
          <img src="${B}ilustracoes/vida/palmeiral.webp" alt="${t("Palmeiral escondido numa bacia de rocha", "A palmary hidden in a rock basin")}" loading="lazy"
               onerror="this.closest('figure').hidden = true" />
          <figcaption>${t("Ilustração lida do texto · um palmeiral do sul", "Illustration read from the text · a palmary of the south")}</figcaption>
        </figure>
        <p class="nota">${t(`Na borda das plantações o plâncton de areia se envenenava: as proteínas não
        combinavam, e formava-se uma água que a vida de Arrakis não tocava. Nem shai-hulud
        entrava naquela faixa sem vida`, `At the edge of the plantings the sand plankton was being poisoned:
        the proteins didn't match, and a water formed that Arrakis life would not touch. Not even
        shai-hulud would enter that barren strip`)} ${mc("[1|appendixI|10425]")}.</p>
      </section>

      <section class="vida-sec">
        <h2><span class="g">${secao("vida", 4)}</span><span>${t("Nos livros seguintes", "In the later books")}</span></h2>
        <div class="grade-vida">${depois().map(cartao).join("")}</div>
      </section>
    </div>
    ${rodape()}
  </article>`;
  ligaSpoilers(alvo);
}
