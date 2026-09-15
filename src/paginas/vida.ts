import { prancha, secao } from "../pranchas";
import { cabecalho, esc, rodape, ligaSpoilers } from "../ui";

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
      <figcaption>Ilustração lida do texto</figcaption>
    </figure>` : ""}
    <h3>${esc(s.nome)} <span class="en">${esc(s.en)}</span></h3>
    ${spoiler ? `<div class="ev-cab"><span class="ev-livro">Livro ${s.livro} · <b>spoiler</b></span>
      <button class="olho" type="button" aria-pressed="false" aria-label="Revelar spoiler do livro ${s.livro}">${OLHO}</button></div>` : ""}
    <p class="ev-texto"${spoiler ? ' aria-hidden="true"' : ""}>${s.texto} ${s.marcas.map(mc).join(" ")}</p>
    ${s.rota ? `<a class="link" href="${s.rota}">${s.rota.includes("verme") ? `${prancha("verme")} →` : "Ver no mapa →"}</a>` : ""}
  </div>`;
}

export const OLHO = `<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.5"/><path class="risco" d="M3 21 21 3" stroke="currentColor" stroke-width="1.5"/></svg>`;

const NATIVOS: Ser[] = [
  { nome: "Shai-hulud", en: "sandworm", img: "verme_montaria", rota: "#/verme",
    texto: "O verme. Fabrica a areia, espalha a especiaria e morre se se afogar em água.",
    marcas: ["[1|terminology|11207]"] },
  { nome: "Truta-da-areia", en: "sandtrout · little maker", img: "truta",
    texto: "Meio planta, meio animal. Tranca a água no subsolo e morre aos milhões a cada explosão de especiaria; as sobreviventes viram vermes.",
    marcas: ["[1|terminology|10989]", "[1|appendixI|10410]"] },
  { nome: "Plâncton de areia", en: "sand plankton", img: "plancton",
    texto: "Criaturas microscópicas que comem a especiaria espalhada pelo verme. O verme, por sua vez, come o plâncton.",
    marcas: ["[1|appendixI|10411]"] },
  { nome: "A raiz d'água", en: "native root plant", img: "raiz",
    texto: "Planta nativa rara, só acima de 2.500 metros na zona temperada do norte. Um tubérculo de dois metros rende meio litro de água.",
    marcas: ["[1|appendixI|10402]"] },
];

const TRAZIDOS: Ser[] = [
  { nome: "Muad'Dib", en: "kangaroo mouse", img: "muaddib",
    texto: "O rato-canguru adaptado de Arrakis. Os fremen o admiram por sobreviver no deserto aberto e veem o desenho dele na segunda lua.",
    marcas: ["[1|terminology|11033]"] },
  { nome: "Cielago", en: "cielago", img: "cielago",
    texto: "Morcego modificado. Um aparelho grava a mensagem no sistema nervoso dele, e o grito normal do bicho a carrega até outro aparelho.",
    marcas: ["[1|terminology|10729]", "[1|terminology|10770]"], rota: "#/mapa#=AR-03" },
  { nome: "Kulon", en: "kulon", img: "kulon",
    texto: "O asno selvagem das estepes asiáticas da Terra, adaptado. Alguns contrabandistas usam, mas a água sai cara, mesmo com o bicho vestindo trajestil.",
    marcas: ["[1|terminology|10968]", "[1|appendixI|10400]"] },
  { nome: "Falcão do deserto", en: "desert hawk", img: "falcao",
    texto: "Conta-se de Muad'Dib que viu um filhote de falcão sair do ovo e sussurrou: \"Kull wahad!\"",
    marcas: ["[1|terminology|10966]"] },
];

const DEPOIS: Ser[] = [
  { nome: "Peixe predador", en: "predator fish", img: "peixe", livro: 3,
    texto: "Os fremen passam a soltar peixes predadores na água dos qanats para manter as trutas-da-areia longe dela.",
    marcas: ["[3|Children_of_Dune_split_012|625]"] },
  { nome: "Borboleta-esqueleto", en: "skeleton butterfly", img: "borboleta", livro: 3,
    texto: "Leto II vê uma borboleta de asas quase transparentes voando entre as sombras do penhasco, delicada demais para um lugar como aquele.",
    marcas: ["[3|Children_of_Dune_split_030|2841]"], rota: "#/mapa#=AR-09" },
];

export function vida(alvo: HTMLElement) {
  alvo.innerHTML = `<article class="folha vida">
    ${cabecalho(`${prancha("vida")} · O que vive no deserto`,
      "Quase tudo aqui veio de fora",
      "Em Arrakis quase ninguém tem bicho de estimação, e animal de criação é raro. Tudo o que vive no deserto ou nasceu em torno do verme ou veio de fora.")}
    <div class="corpo">
      <p class="nota">Sobre os animais, ver o apêndice ${mc("[1|appendixI|10400]")}. Para o Dr. Yueh, "o planeta parece ter aberto os
      braços a certas formas de vida terrestres, e não está claro como" ${mc("[1|chapter005|860]")}.</p>

      <section class="vida-sec">
        <h2><span class="g">${secao("vida", 1)}</span><span>Nascidos aqui</span></h2>
        <div class="grade-vida">${NATIVOS.map(cartao).join("")}</div>
      </section>

      <section class="vida-sec">
        <h2><span class="g">${secao("vida", 2)}</span><span>Trazidos e adaptados</span></h2>
        <p>Muito antes da especiaria, o Império manteve em Arrakis uma estação botânica de
        testes. O filme-livro dela, que Yueh mostra a Paul, já listava saguaro, palmeira-tâmara,
        verbena-da-areia, arbusto-de-creosoto… raposa-do-deserto, falcão, rato-canguru
        ${mc("[1|chapter009|1427]")} ${mc("[1|chapter009|1428]")}.</p>
        <div class="grade-vida">${TRAZIDOS.map(cartao).join("")}</div>
      </section>

      <section class="vida-sec">
        <h2><span class="g">${secao("vida", 3)}</span><span>O jardim de Kynes</span></h2>
        <div class="duas">
          <div>
            <p>O plano começa pelo capim. Os fremen plantam gramíneas de pobreza mutantes na
            face de sotavento de dunas escolhidas, que ficam atravessadas no caminho dos
            ventos de oeste: com esse lado preso, o outro cresce, e a duna vira barreira
            ${mc("[1|appendixI|10414]")} ${mc("[1|appendixI|10415]")}. Depois, capim-espada no
            barlavento ${mc("[1|appendixI|10416]")}.</p>
            <p>Depois vêm as plantas de raiz mais funda, como efêmeras, arbustos, saguaro e
            cacto-barril ${mc("[1|appendixI|10417]")} ${mc("[1|appendixI|10418]")}. Os bichos
            chegam por último, na ordem em que o solo precisa deles. Primeiro os que cavam e
            arejam a terra (raposa, rato-canguru, lebre, tartaruga-da-areia), depois os
            predadores que os controlam (falcão, corujas, águia), os insetos para o que sobra
            e o morcego do deserto para vigiá-los ${mc("[1|appendixI|10419]")}.
            Mais de duzentas plantas de comida foram testadas ${mc("[1|appendixI|10420]")}.</p>
            <p>A conta de Kynes: se três por cento das plantas verdes do planeta entrarem na
            fixação de carbono, o ciclo se sustenta sozinho ${mc("[1|appendixI|10433]")}.</p>
          </div>
          <figure class="estampa-vida">
            <img src="${B}ilustracoes/vida/capim.webp" alt="Fileiras de capim plantadas na face de uma duna" loading="lazy"
                 onerror="this.closest('figure').hidden = true" />
            <figcaption>Ilustração lida do texto · capim prendendo a duna</figcaption>
          </figure>
        </div>
        <figure class="estampa-vida larga">
          <img src="${B}ilustracoes/vida/palmeiral.webp" alt="Palmeiral escondido numa bacia de rocha" loading="lazy"
               onerror="this.closest('figure').hidden = true" />
          <figcaption>Ilustração lida do texto · um palmeiral do sul</figcaption>
        </figure>
        <p class="nota">Na borda das plantações o plâncton de areia se envenenava: as proteínas não
        combinavam, e formava-se uma água que a vida de Arrakis não tocava. Nem shai-hulud
        entrava naquela faixa sem vida ${mc("[1|appendixI|10425]")}.</p>
      </section>

      <section class="vida-sec">
        <h2><span class="g">${secao("vida", 4)}</span><span>Nos livros seguintes</span></h2>
        <div class="grade-vida">${DEPOIS.map(cartao).join("")}</div>
      </section>
    </div>
    ${rodape()}
  </article>`;
  ligaSpoilers(alvo);
}
