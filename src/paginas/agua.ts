import { prancha, secao } from "../pranchas";
import { cabecalho, esc, ligaSpoilers, rodape } from "../ui";
import { t, localidade } from "../i18n";
import { OLHO } from "./vida";

/* A economia da água.
 *
 * A especiaria é a riqueza de Arrakis para fora; a água é a economia de dentro.
 * Os números do livro são poucos e muito bons (litros por dia de uma palmeira,
 * de um homem, a água de um morto contada em anéis, a reserva de um sietch), e
 * as contas feitas com eles aparecem marcadas como contas nossas.
 */

const mc = (m: string) => `<code class="marca">${esc(m)}</code>`;
const num = (n: number, d = 0) => n.toLocaleString(localidade(), { maximumFractionDigits: d, minimumFractionDigits: d });

// números do livro
const RESERVA_L = 38e6 * 10;              // "more than thirty-eight million decaliters" [1|chapter034|6932]
const JAMIS_L = 33 + (7 + 3 / 32) * 0.003697;   // 33 L + 7 3/32 dracmas (1 dracma fluida ≈ 3,697 mL)
const PALMA_L = 40, HOMEM_L = 8, PALMAS = 20;    // [1|chapter008|1295]-[1296]
const CISTERNA_L = 50000;                         // [1|chapter007|1163]
const FREMEN = 10e6;                              // [1|chapter039|8113]

function barras(): string {
  const X0 = 340, W = 420, L = 40;
  const linhas: [string, string, number | null, string][] = [
    [t("Uma palmeira-tâmara", "A date palm"), t("40 litros", "40 litres"), 40, "[1|chapter008|1295]"],
    [t("Um homem, na cidade", "A man, in town"), t("8 litros", "8 litres"), 8, "[1|chapter008|1296]"],
    [t("Um homem sem trajestil, à sombra, no deserto", "A man without a stillsuit, in shade, in the desert"), t("5 litros", "5 litres"), 5, "[1|chapter022|4120]"],
    [t("Um homem de trajestil bem vedado", "A man in a well-sealed stillsuit"), t("um dedal", "a thimbleful"), null, "[1|chapter015|2307]"],
  ];
  const alt = 58;
  return `<div class="diagrama"><svg viewBox="0 0 ${X0 + W + 170} ${30 + linhas.length * alt}" role="img"
    aria-label="${t("Água por dia: palmeira 40 litros, homem na cidade 8, homem sem trajestil 5, com trajestil um dedal",
                    "Water per day: date palm 40 litres, a man in town 8, a man without a stillsuit 5, in a stillsuit a thimbleful")}">
    ${linhas.map(([rot, val, v, marc], i) => {
      const y = 14 + i * alt, w = v === null ? 3 : (v / L) * W;
      return `<g>
        <text x="${X0 - 14}" y="${y + 17}" class="rot" text-anchor="end">${esc(rot)}</text>
        <text x="${X0 - 14}" y="${y + 32}" class="marc" text-anchor="end">${esc(marc)}</text>
        <rect x="${X0}" y="${y + 6}" width="${w}" height="26" class="${v === null ? "gota" : i === 0 ? "palma" : "agua"}"/>
        <text x="${X0 + w + 10}" y="${y + 25}" class="val">${esc(val)}${v === null ? "" : t(" por dia", " a day")}</text>
      </g>`;
    }).join("")}
  </svg></div>`;
}

/* Os anéis de água de Jamis, na ordem em que Chani os mostra a Paul. */
function aneis(): string {
  const itens: [string, number][] = [[t("30 litros", "30 litres"), 46], [t("2 litros", "2 litres"), 30], [t("1 litro", "1 litre"), 24]];
  let x = 60;
  const grandes = itens.map(([rot, r]) => {
    const cx = x + r; x += r * 2 + 34;
    return `<g><circle cx="${cx}" cy="80" r="${r}" class="anel-agua"/><circle cx="${cx}" cy="80" r="${r - 7}" class="anel-agua dentro"/>
      <text x="${cx}" y="${80 + r + 24}" text-anchor="middle" class="val">${rot}</text></g>`;
  }).join("");
  const miudos = Array.from({ length: 8 }, (_, k) => {
    const cx = x + 10 + k * 26;
    return `<circle cx="${cx}" cy="80" r="${k === 7 ? 6 : 9}" class="anel-agua conta"/>`;
  }).join("");
  return `<div class="diagrama"><svg viewBox="0 0 ${x + 8 * 26 + 30} 150" role="img"
    aria-label="${t("Anéis de água: 30, 2 e 1 litro, sete contadores de uma dracma e um de três trinta e dois avos",
                    "Water rings: 30, 2 and 1 litre, seven one-drachm counters and one of three thirty-seconds")}">
    ${grandes}${miudos}
    <text x="${x + 10 + 3.5 * 26}" y="${80 + 46 + 24}" text-anchor="middle" class="val">${t("7 dracmas e 3/32", "7 drachms and 3/32")}</text>
  </svg></div>`;
}

export function agua(alvo: HTMLElement) {
  const jamis = RESERVA_L / JAMIS_L;
  const anosPalmas = RESERVA_L / (PALMAS * PALMA_L) / 365.25;
  const diasFremen = RESERVA_L / (FREMEN * HOMEM_L);
  const cisternas = RESERVA_L / CISTERNA_L;

  alvo.innerHTML = `<article class="folha agua">
    ${cabecalho(`${prancha("agua")} · ${t("A economia da água", "The water economy")}`,
      t("Vinte palmeiras valem cem homens", "Twenty palms are worth a hundred men"),
      t("A especiaria é a riqueza que sai de Arrakis. A que fica é a água, contada em litros por dia, carregada em anéis e guardada em cavernas.",
        "Spice is the wealth that leaves Arrakis. The wealth that stays is water, counted in litres a day, carried in rings and stored in caves."))}
    <div class="corpo">

      <section class="vida-sec">
        <h2><span class="g">${secao("agua", 1)}</span><span>${t("Quanto bebe um corpo", "How much a body drinks")}</span></h2>
        <p>${t(`Pela conta que o Dr. Yueh faz para Jessica, uma palmeira-tâmara precisa de quarenta
        litros de água por dia e um homem, de oito`, `By the reckoning Dr. Yueh gives Jessica, a date palm needs forty
        litres of water a day and a man needs eight`)} ${mc("[1|chapter008|1295]")} ${mc("[1|chapter008|1296]")}.
        ${t(`No deserto aberto, sem trajestil, sentado à sombra, são cinco litros só para não perder
        peso`, `In the open desert, without a stillsuit, sitting in the shade, it takes five litres a day
        just to keep from losing weight`)} ${mc("[1|chapter022|4120]")}. ${t(`Com o traje bem vedado, a perda cai para "um dedal por dia"`,
        `With the suit properly sealed, the loss drops to "a thimbleful a day"`)}
        ${mc("[1|chapter015|2307]")}.</p>
        ${barras()}
      </section>

      <section class="vida-sec">
        <h2><span class="g">${secao("agua", 2)}</span><span>${t("O luxo do Duque", "The Duke's luxury")}</span></h2>
        <div class="duas">
          <div>
            <p>${t(`Na frente da Residência, em Arrakeen, crescem vinte palmeiras. Quem passa na rua olha
            para elas com inveja, com ódio, com alguma esperança. Yueh traduz: cada palmeira bebe
            a água de cinco homens, e o povo vê ali <strong>cem pessoas</strong>`,
            `Twenty palm trees grow in front of the Residency in Arrakeen. People passing in the street
            look at them with envy, with hate, with some hope. Yueh explains: each palm drinks the water
            of five men, and the people see <strong>a hundred of themselves</strong> there`)}
            ${mc("[1|chapter008|1293]")} ${mc("[1|chapter008|1296]")}.</p>
            <p>${t(`A cisterna da casa guarda cinquenta mil litros e vive cheia; a governanta nem usa
            trajestil lá dentro`, `The house cistern holds fifty thousand litres and is always kept full;
            the housekeeper doesn't even wear a stillsuit indoors`)} ${mc("[1|chapter007|1163]")}. ${t(`Lá fora passa o aguadeiro gritando
            "Soo-soo Sook!"`, `Outside, the water-seller goes by crying "Soo-soo Sook!"`)} ${mc("[1|chapter007|1159]")}${t(`, e os vendedores de água têm sindicato, com
            consultor financeiro`, `, and the water peddlers have a union, with its own financial
            adviser`)} ${mc("[1|chapter016|2832]")}. ${t(`Quando se soube quanta gente o Duque
            estava trazendo, houve motins pela água, que só pararam com a notícia de novos
            captadores de vento`, `When word got out of how many people the Duke was bringing in,
            there were water riots, which only stopped when people heard about new
            windtraps`)} ${mc("[1|chapter008|1367]")}.</p>
          </div>
          <div class="fato-agua">
            <div class="v">20 <small>${t("palmeiras", "palms")}</small></div>
            <div class="igual">=</div>
            <div class="v">100 <small>${t("homens", "men")}</small></div>
            <p>${t("40 L por palmeira ÷ 8 L por homem = 5 homens cada.", "40 L per palm ÷ 8 L per man = 5 men each.")}</p>
          </div>
        </div>
      </section>

      <section class="vida-sec">
        <h2><span class="g">${secao("agua", 3)}</span><span>${t("A água como dinheiro", "Water as money")}</span></h2>
        <p>${t(`A água de um homem, no fim, pertence ao povo dele, à tribo. Kynes explica isso num jantar
        em Arrakeen: o corpo humano é setenta por cento água, e um homem morto não precisa mais dela`,
        `In the end a man's water belongs to his people, to the tribe. Kynes explains it at a dinner in
        Arrakeen: the human body is seventy per cent water, and a dead man no longer needs it`)} ${mc("[1|chapter016|2847]")}. ${t(`O que se recupera é contado em
        anéis de água, usados à vista, pendurados no pescoço`, `What is recovered is counted in water rings,
        worn openly on a cord around the neck`)} ${mc("[1|chapter040|8232]")}.</p>
        <div class="especime spoiler estreito">
          <div class="ev-cab"><span class="ev-livro">${t("Livro", "Book")} 1 · <b>spoiler</b></span>
            <button class="olho" type="button" aria-pressed="false" aria-label="${t("Revelar spoiler do livro 1", "Reveal spoiler from book 1")}">${OLHO}</button></div>
          <div class="ev-texto" aria-hidden="true">
            <p>${t(`Depois do duelo, Chani entrega a Paul a água de Jamis, anel por anel: trinta litros,
            dois, um, sete contadores de uma dracma e um de três trinta e dois avos. Ao todo,
            trinta e três litros e sete dracmas e três trinta e dois avos`,
            `After the duel, Chani hands Paul the water of Jamis, ring by ring: thirty litres, two,
            one, seven one-drachm counters and one of three thirty-seconds. In all, thirty-three
            litres and seven and three thirty-seconds drachms`)}
            ${mc("[1|chapter034|6879]")} ${mc("[1|chapter034|6880]")}. ${t(`A água de combate é do
            vencedor: ele lutou sem traje e precisa repor o que perdeu`, `Combat water goes to the winner:
            he fought without a suit and needs to replace what he lost`)} ${mc("[1|chapter034|6760]")}.</p>
            ${aneis()}
          </div>
        </div>
      </section>

      <section class="vida-sec">
        <h2><span class="g">${secao("agua", 4)}</span><span>${t("O cofre dos fremen", "The Fremen vault")}</span></h2>
        <p>${t(`Numa caverna do sietch de Stilgar, os fremen despejam a água recolhida num tanque com
        medidor. Stilgar diz quanto há ali: <strong>mais de trinta e oito milhões de decalitros</strong>,
        escondidos e protegidos das trutas-da-areia`, `In a cave of Stilgar's sietch, the Fremen pour the water they
        have gathered into a pool with a meter. Stilgar says how much is there: <strong>more than
        thirty-eight million decalitres</strong>, hidden and walled off from the sandtrout`)} ${mc("[1|chapter034|6932]")}. ${t(`E sabem, com
        margem de um milhão de decalitros, quanto ainda falta para mudar a face de Arrakis`,
        `And they know, to within a million decalitres, how much more they need to change the face of
        Arrakis`)}
        ${mc("[1|chapter034|6938]")}. ${t(`A água vem do ar, por captadores de vento escondidos`,
        `The water comes out of the air, through hidden windtraps`)}
        ${mc("[1|chapter034|6908]")} ${t(`e por coletores de orvalho, ovos de cromoplástico de quatro
        centímetros que esfriam de madrugada e juntam o sereno`, `and dew precipitators, four-centimetre
        chromoplastic eggs that cool at dawn and gather the dew`)} ${mc("[1|terminology|10761]")}.</p>
        <div class="contas">
          <div class="conta"><div class="v">${num(RESERVA_L / 1e6)} <small>${t("milhões de litros", "million litres")}</small></div>
            <p>${t("38 milhões de decalitros; um decalitro são dez litros.", "38 million decalitres; a decalitre is ten litres.")}</p></div>
          <div class="conta"><div class="v">${num(jamis / 1e6, 1)} <small>${t("milhões", "million")}</small></div>
            <p>${t(`de corpos como o de Jamis, se cada um rende ${num(JAMIS_L, 0)} litros. É mais do que os dez milhões de fremen.`,
                   `bodies like Jamis's, if each yields ${num(JAMIS_L, 0)} litres. That's more than the ten million Fremen.`)}</p></div>
          <div class="conta"><div class="v">${num(anosPalmas)} <small>${t("anos", "years")}</small></div>
            <p>${t("para as vinte palmeiras da Residência beberem tudo.", "for the Residency's twenty palms to drink it all.")}</p></div>
          <div class="conta"><div class="v">${num(diasFremen, 1)} <small>${t("dias", "days")}</small></div>
            <p>${t("é o que a reserva inteira duraria dando oito litros por dia a dez milhões de fremen. Não é água para beber: é o fundo do plano.",
                   "is how long the whole reserve would last at eight litres a day for ten million Fremen. It isn't drinking water; it's the fund for the plan.")}</p></div>
          <div class="conta"><div class="v">${num(cisternas)} <small>${t("cisternas", "cisterns")}</small></div>
            <p>${t("da Residência do Duque.", "the size of the Duke's Residency cistern.")}</p></div>
        </div>
        <p class="nota">${t("Contas nossas, só com números do livro: a reserva", "Our own arithmetic, using only figures from the book: the reserve")} ${mc("[1|chapter034|6932]")},
        ${t("a água de Jamis", "Jamis's water")} ${mc("[1|chapter034|6880]")} ${t("(a dracma convertida como dracma fluida, ≈ 3,7 mL)", "(the drachm taken as a fluid dram, ≈ 3.7 mL)")},
        ${t("a palmeira e o homem", "the palm and the man")} ${mc("[1|chapter008|1295]")}, ${t("a cisterna", "the cistern")} ${mc("[1|chapter007|1163]")} ${t("e os dez milhões de fremen", "and the ten million Fremen")} ${mc("[1|chapter039|8113]")}.</p>
      </section>

      <section class="vida-sec">
        <h2><span class="g">${secao("agua", 5)}</span><span>${t("O que ninguém pode ver do céu", "What no one may see from the sky")}</span></h2>
        <p>${t(`A Guilda cobra "um preço proibitivo" por satélites de clima sobre Arrakis`,
        `The Guild asks "a prohibitive price" for weather satellites over Arrakis`)}
        ${mc("[1|chapter022|4134]")}. ${t(`Na tenda, depois da traição, Paul entende por quê: satélite
        vigia o chão, e há coisas no deserto profundo que não aguentam inspeção frequente`,
        `In the tent, after the betrayal, Paul works out why: satellites watch the ground, and there are
        things in the deep desert that will not bear frequent inspection`)}
        ${mc("[1|chapter022|4136]")}.</p>
        <p class="nota">${t(`O livro não diz, ali, que coisas são. Pelo resto da prancha dá para
        adivinhar: plantações, captadores de vento, cofres de água.`, `The book doesn't say, at that point, what
        those things are. The rest of this plate suggests a guess: plantings, windtraps, water vaults.`)}</p>
      </section>
    </div>
    ${rodape()}
  </article>`;
  ligaSpoilers(alvo);
}
