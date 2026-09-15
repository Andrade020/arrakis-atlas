import { prancha, secao } from "../pranchas";
import { cabecalho, esc, ligaSpoilers, rodape } from "../ui";
import { OLHO } from "./vida";

/* A economia da água.
 *
 * A especiaria é a riqueza de Arrakis para fora; a água é a economia de dentro.
 * Os números do livro são poucos e muito bons (litros por dia de uma palmeira,
 * de um homem, a água de um morto contada em anéis, a reserva de um sietch), e
 * as contas feitas com eles aparecem marcadas como contas nossas.
 */

const mc = (m: string) => `<code class="marca">${esc(m)}</code>`;
const num = (n: number, d = 0) => n.toLocaleString("pt-BR", { maximumFractionDigits: d, minimumFractionDigits: d });

// números do livro
const RESERVA_L = 38e6 * 10;              // "more than thirty-eight million decaliters" [1|chapter034|6932]
const JAMIS_L = 33 + (7 + 3 / 32) * 0.003697;   // 33 L + 7 3/32 dracmas (1 dracma fluida ≈ 3,697 mL)
const PALMA_L = 40, HOMEM_L = 8, PALMAS = 20;    // [1|chapter008|1295]-[1296]
const CISTERNA_L = 50000;                         // [1|chapter007|1163]
const FREMEN = 10e6;                              // [1|chapter039|8113]

function barras(): string {
  const X0 = 340, W = 420, L = 40;
  const linhas: [string, string, number | null, string][] = [
    ["Uma palmeira-tâmara", "40 litros", 40, "[1|chapter008|1295]"],
    ["Um homem, na cidade", "8 litros", 8, "[1|chapter008|1296]"],
    ["Um homem sem trajestil, à sombra, no deserto", "5 litros", 5, "[1|chapter022|4120]"],
    ["Um homem de trajestil bem vedado", "um dedal", null, "[1|chapter015|2307]"],
  ];
  const alt = 58;
  return `<div class="diagrama"><svg viewBox="0 0 ${X0 + W + 170} ${30 + linhas.length * alt}" role="img"
    aria-label="Água por dia: palmeira 40 litros, homem na cidade 8, homem sem trajestil 5, com trajestil um dedal">
    ${linhas.map(([rot, val, v, marc], i) => {
      const y = 14 + i * alt, w = v === null ? 3 : (v / L) * W;
      return `<g>
        <text x="${X0 - 14}" y="${y + 17}" class="rot" text-anchor="end">${esc(rot)}</text>
        <text x="${X0 - 14}" y="${y + 32}" class="marc" text-anchor="end">${esc(marc)}</text>
        <rect x="${X0}" y="${y + 6}" width="${w}" height="26" class="${v === null ? "gota" : i === 0 ? "palma" : "agua"}"/>
        <text x="${X0 + w + 10}" y="${y + 25}" class="val">${esc(val)}${v === null ? "" : " por dia"}</text>
      </g>`;
    }).join("")}
  </svg></div>`;
}

/* Os anéis de água de Jamis, na ordem em que Chani os mostra a Paul. */
function aneis(): string {
  const itens: [string, number][] = [["30 litros", 46], ["2 litros", 30], ["1 litro", 24]];
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
    aria-label="Anéis de água: 30, 2 e 1 litro, sete contadores de uma dracma e um de três trinta e dois avos">
    ${grandes}${miudos}
    <text x="${x + 10 + 3.5 * 26}" y="${80 + 46 + 24}" text-anchor="middle" class="val">7 dracmas e 3/32</text>
  </svg></div>`;
}

export function agua(alvo: HTMLElement) {
  const jamis = RESERVA_L / JAMIS_L;
  const anosPalmas = RESERVA_L / (PALMAS * PALMA_L) / 365.25;
  const diasFremen = RESERVA_L / (FREMEN * HOMEM_L);
  const cisternas = RESERVA_L / CISTERNA_L;

  alvo.innerHTML = `<article class="folha agua">
    ${cabecalho(`${prancha("agua")} · A economia da água`,
      "Vinte palmeiras valem cem homens",
      "A especiaria é a riqueza que sai de Arrakis. A que fica é a água, contada em litros por dia, carregada em anéis e guardada em cavernas.")}
    <div class="corpo">

      <section class="vida-sec">
        <h2><span class="g">${secao("agua", 1)}</span><span>Quanto bebe um corpo</span></h2>
        <p>Pela conta que o Dr. Yueh faz para Jessica, uma palmeira-tâmara precisa de quarenta
        litros de água por dia e um homem, de oito ${mc("[1|chapter008|1295]")} ${mc("[1|chapter008|1296]")}.
        No deserto aberto, sem trajestil, sentado à sombra, são cinco litros só para não perder
        peso ${mc("[1|chapter022|4120]")}. Com o traje bem vedado, a perda cai para "um dedal por dia"
        ${mc("[1|chapter015|2307]")}.</p>
        ${barras()}
      </section>

      <section class="vida-sec">
        <h2><span class="g">${secao("agua", 2)}</span><span>O luxo do Duque</span></h2>
        <div class="duas">
          <div>
            <p>Na frente da Residência, em Arrakeen, crescem vinte palmeiras. Quem passa na rua olha
            para elas com inveja, com ódio, com alguma esperança. Yueh traduz: cada palmeira bebe
            a água de cinco homens, e o povo vê ali <strong>cem pessoas</strong>
            ${mc("[1|chapter008|1293]")} ${mc("[1|chapter008|1296]")}.</p>
            <p>A cisterna da casa guarda cinquenta mil litros e vive cheia; a governanta nem usa
            trajestil lá dentro ${mc("[1|chapter007|1163]")}. Lá fora passa o aguadeiro gritando
            "Soo-soo Sook!" ${mc("[1|chapter007|1159]")}, e os vendedores de água têm sindicato, com
            consultor financeiro ${mc("[1|chapter016|2832]")}. Quando se soube quanta gente o Duque
            estava trazendo, houve motins pela água, que só pararam com a notícia de novos
            captadores de vento ${mc("[1|chapter008|1367]")}.</p>
          </div>
          <div class="fato-agua">
            <div class="v">20 <small>palmeiras</small></div>
            <div class="igual">=</div>
            <div class="v">100 <small>homens</small></div>
            <p>40 L por palmeira ÷ 8 L por homem = 5 homens cada.</p>
          </div>
        </div>
      </section>

      <section class="vida-sec">
        <h2><span class="g">${secao("agua", 3)}</span><span>A água como dinheiro</span></h2>
        <p>A água de um homem, no fim, pertence ao povo dele, à tribo. Kynes explica isso num jantar
        em Arrakeen: o corpo humano é setenta por cento água, e um homem morto não precisa mais dela ${mc("[1|chapter016|2847]")}. O que se recupera é contado em
        anéis de água, usados à vista, pendurados no pescoço ${mc("[1|chapter040|8232]")}.</p>
        <div class="especime spoiler estreito">
          <div class="ev-cab"><span class="ev-livro">Livro 1 · <b>spoiler</b></span>
            <button class="olho" type="button" aria-pressed="false" aria-label="Revelar spoiler do livro 1">${OLHO}</button></div>
          <div class="ev-texto" aria-hidden="true">
            <p>Depois do duelo, Chani entrega a Paul a água de Jamis, anel por anel: trinta litros,
            dois, um, sete contadores de uma dracma e um de três trinta e dois avos. Ao todo,
            trinta e três litros e sete dracmas e três trinta e dois avos
            ${mc("[1|chapter034|6879]")} ${mc("[1|chapter034|6880]")}. A água de combate é do
            vencedor: ele lutou sem traje e precisa repor o que perdeu ${mc("[1|chapter034|6760]")}.</p>
            ${aneis()}
          </div>
        </div>
      </section>

      <section class="vida-sec">
        <h2><span class="g">${secao("agua", 4)}</span><span>O cofre dos fremen</span></h2>
        <p>Numa caverna do sietch de Stilgar, os fremen despejam a água recolhida num tanque com
        medidor. Stilgar diz quanto há ali: <strong>mais de trinta e oito milhões de decalitros</strong>,
        escondidos e protegidos das trutas-da-areia ${mc("[1|chapter034|6932]")}. E sabem, com
        margem de um milhão de decalitros, quanto ainda falta para mudar a face de Arrakis
        ${mc("[1|chapter034|6938]")}. A água vem do ar, por captadores de vento escondidos
        ${mc("[1|chapter034|6908]")} e por coletores de orvalho, ovos de cromoplástico de quatro
        centímetros que esfriam de madrugada e juntam o sereno ${mc("[1|terminology|10761]")}.</p>
        <div class="contas">
          <div class="conta"><div class="v">${num(RESERVA_L / 1e6)} <small>milhões de litros</small></div>
            <p>38 milhões de decalitros; um decalitro são dez litros.</p></div>
          <div class="conta"><div class="v">${num(jamis / 1e6, 1)} <small>milhões</small></div>
            <p>de corpos como o de Jamis, se cada um rende ${num(JAMIS_L, 0)} litros. É mais do que os dez milhões de fremen.</p></div>
          <div class="conta"><div class="v">${num(anosPalmas)} <small>anos</small></div>
            <p>para as vinte palmeiras da Residência beberem tudo.</p></div>
          <div class="conta"><div class="v">${num(diasFremen, 1)} <small>dias</small></div>
            <p>é o que a reserva inteira duraria dando oito litros por dia a dez milhões de fremen. Não é água para beber: é o fundo do plano.</p></div>
          <div class="conta"><div class="v">${num(cisternas)} <small>cisternas</small></div>
            <p>da Residência do Duque.</p></div>
        </div>
        <p class="nota">Contas nossas, só com números do livro: a reserva ${mc("[1|chapter034|6932]")},
        a água de Jamis ${mc("[1|chapter034|6880]")} (a dracma convertida como dracma fluida, ≈ 3,7 mL),
        a palmeira e o homem ${mc("[1|chapter008|1295]")}, a cisterna ${mc("[1|chapter007|1163]")} e os
        dez milhões de fremen ${mc("[1|chapter039|8113]")}.</p>
      </section>

      <section class="vida-sec">
        <h2><span class="g">${secao("agua", 5)}</span><span>O que ninguém pode ver do céu</span></h2>
        <p>A Guilda cobra "um preço proibitivo" por satélites de clima sobre Arrakis
        ${mc("[1|chapter022|4134]")}. Na tenda, depois da traição, Paul entende por quê: satélite
        vigia o chão, e há coisas no deserto profundo que não aguentam inspeção frequente
        ${mc("[1|chapter022|4136]")}.</p>
        <p class="nota">O livro não diz, ali, que coisas são. Pelo resto da prancha dá para
        adivinhar: plantações, captadores de vento, cofres de água.</p>
      </section>
    </div>
    ${rodape()}
  </article>`;
  ligaSpoilers(alvo);
}
