import { prancha, secao } from "../pranchas";
import { distritos, tabelas, num, compacto } from "../dados";
import { cabecalho, esc, rodape, selo } from "../ui";
import { t as tr, emIngles, nomePoder } from "../i18n";

/* Constantes do planeta em inglês: nome, unidade e nota. */
const CONST_EN: Record<string, [string, string, string]> = {
  posicao_astronomica: ["astronomical position", "planet of Canopus", "Canopus is a real star; the rest of its astronomy is not in the books"],
  gravidade: ["gravity", "G", "the only gravity figure in the books"],
  luas: ["moons", "satellites", "the books do NOT name the moons; 'Krelln' and 'Arvon' come from outside the books"],
  oxigenio_atmosferico: ["atmospheric oxygen", "% of the atmosphere", "breathable without terraforming"],
  tempestade_velocidade: ["storm speed", "km/h", "'more than'; narrative ceiling 700-800 km/h"],
  tempestade_pista: ["storm fetch", "km (fetch, 6,000-7,000)", ""],
  temperatura_cinturao: ["belt temperature", "K", "absolute range; plant growth range 284-302 K"],
  datum_altimetrico: ["altitude datum", "m (Great Bled)", "altitude reference given in the Cartographic Notes"],
  deserto_aberto_lat: ["open desert latitude", "latitude", ""],
  palmaries_sul_lat: ["southern palmaries latitude", "degrees of latitude", "Herbert says the feature does NOT appear on the map"],
  salina_great_flat: ["Great Flat salt pan", "km (long axis)", "largest feature in the books with an explicit size"],
  carthag_arrakeen: ["Carthag to Arrakeen", "km (to the northeast)", "the only explicit distance between cities; contradicts the map scale"],
  plano_ecologico_meta: ["ecological plan target", "% cover", ""],
  plano_ecologico_prazo: ["ecological plan timeline", "years (revised)", ""],
};

export async function economia(alvo: HTMLElement) {
  const [d, t] = await Promise.all([distritos(), tabelas()]);

  const massa = d.reduce((s, x) => s + Number(x.espec_t ?? 0), 0);
  const pib = d.reduce((s, x) => s + Number(x.pib_Msol ?? 0), 0);
  const top = [...d].sort((a, b) => Number(b.espec_t) - Number(a.espec_t)).slice(0, 10);
  const maxEsp = Number(top[0].espec_t);

  // Concentracao: quanto os dez maiores respondem do total colhido.
  const dezMaiores = top.reduce((s, x) => s + Number(x.espec_t), 0);

  const planeta = (t.planeta ?? {}) as Record<string, any>;
  const en = emIngles();

  alvo.innerHTML = `<article class="folha">
    ${cabecalho(`${prancha("economia")} · ${tr("Economia da especiaria", "The spice economy")}`,
      tr("Três números que não podem ser verdade ao mesmo tempo", "Three numbers that can't all be true"),
      tr("Os livros dão um preço, uma receita e uma quantidade colhida. Com quaisquer dois se calcula o terceiro, e o terceiro sempre sai errado, por um fator de um milhão. Aqui está a conta e a escolha que o modelo fez.",
         "The books give a price, an income and a harvest. Any two of them let you work out the third, and the third always comes out wrong, by a factor of a million. Here is the arithmetic and the choice the model made."))}
    <div class="corpo">

      <h2><span class="g">${secao("economia", 1)}</span><span>${tr("As três âncoras", "The three anchors")}</span></h2>
      <p class="nota" style="margin-bottom:4px">${tr("As três primeiras linhas vêm do livro. A quarta é uma conta nossa.", "The first three rows come from the books. The fourth is our own arithmetic.")}</p>
      <div class="tabela"><table>
        <thead><tr><th>${tr("Âncora", "Anchor")}</th><th>${tr("Valor no texto", "Value in the text")}</th><th class="num">${tr("Implicação", "Implies")}</th><th>${tr("Decisão", "Decision")}</th></tr></thead>
        <tbody>
          <tr>
            <td>${tr("Preço de mercado", "Market price")}</td>
            <td>${tr("620 000 solaris o decagrama", "620,000 solaris a decagram")}<div style="margin-top:5px"><span class="marcador">[1|terminology|11013]</span></div></td>
            <td class="num">${tr("62 bi", "62 bn")} <span class="un">solaris/t</span></td>
            <td>${tr(`Anotado, mas <strong>não usado</strong>. O glossário diz que o preço "chegou a" esse valor. É o pico no mercado aberto, e não o que recebe quem colhe.`,
                     `Recorded, but <strong>not used</strong>. The glossary says the price "has reached" that figure. It is the open-market peak, not what the harvester is paid.`)}</td>
          </tr>
          <tr>
            <td>${tr("Receita Harkonnen", "Harkonnen income")}</td>
            <td>${tr("10 bilhões de solaris a cada 330 dias-padrão", "10 billion solaris every 330 standard days")}<div style="margin-top:5px"><span class="marcador">[1|chapter012|1821]</span></div></td>
            <td class="num">—</td>
            <td>${tr("<strong>Usada</strong> como referência de dinheiro.", "<strong>Used</strong> as the money anchor.")}</td>
          </tr>
          <tr>
            <td>${tr("Massa colhida", "Harvest")}</td>
            <td>${tr("90 000 long tons por semestre", "90,000 long tons per half-year")}<div style="margin-top:5px"><span class="marcador">[5|38_Chapter_32|5171]</span></div></td>
            <td class="num">${tr("182 888", "182,888")} <span class="un">${tr("t/ano", "t/year")}</span></td>
            <td>${tr("<strong>Usada</strong> como referência de quantidade. O número é de 1.500 anos depois; entra no lugar porque não há outro da época.",
                     "<strong>Used</strong> as the quantity anchor. The figure is from 1,500 years later; it stands in because there is none from the period.")}</td>
          </tr>
          <tr>
            <td>${tr("Preço de produtor", "Producer price")}<div style="margin-top:6px">${selo("DEDUZIDO", tr("não está no livro", "not in the book"))}</div></td>
            <td>—</td>
            <td class="num">${tr("54 678", "54,678")} <span class="un">solaris/t</span></td>
            <td>${tr("Receita dividida pela quantidade. <strong>Não está no livro.</strong>", "Income divided by harvest. <strong>Not in the book.</strong>")}</td>
          </tr>
        </tbody>
      </table></div>

      <div class="aviso">
        <div class="rot">${tr("Por que a incompatibilidade é tão grande", "Why the mismatch is so large")}</div>
        <p>${tr(`Se o preço do glossário fosse o que recebe quem colhe, as 182 mil toneladas
        de um ano valeriam cerca de <strong>11 quatrilhões</strong> de solaris, um milhão
        de vezes a receita que o livro dá aos Harkonnen. Os três números só convivem se o
        preço citado for o da ponta final de um monopólio. A diferença entre ele e o que
        se paga no deserto fica com a Guilda e a CHOAM.`,
        `If the glossary price were what the harvester gets, a year's 182 thousand tonnes would
        be worth about <strong>11 quadrillion</strong> solaris, a million times the income the
        book gives the Harkonnens. The three numbers only fit together if the quoted price is the
        far end of a monopoly. The gap between it and what is paid in the desert goes to the
        Guild and CHOAM.`)}</p>
      </div>

      <h2><span class="g">${secao("economia", 2)}</span><span>${tr("Onde a especiaria sai", "Where the spice comes from")}</span></h2>
      <p>${tr(`O total vem do livro; a <strong>divisão</strong> entre distritos é do modelo.
      Ela acompanha a área de erg ao sul da Linha do Verme, e cresce quanto mais longe do
      polo, porque a especiaria nasce na areia funda por onde o verme anda.`,
      `The total comes from the book; the <strong>split</strong> between districts is the model's.
      It follows the area of erg south of the Worm Line and grows with distance from the pole,
      because spice forms in the deep sand where the worm travels.`)}</p>
      <div class="tabela"><table>
        <thead><tr><th>${tr("Distrito", "District")}</th><th>${tr("Controle efetivo", "Effective control")}</th><th class="num">${tr("t/ano", "t/year")}</th><th style="width:34%">${tr("Participação", "Share")}</th></tr></thead>
        <tbody>
          ${top.map((x) => {
            const v = Number(x.espec_t);
            return `<tr>
              <td><a class="link" href="#/mapa#=${esc(x.cod)}">${esc(en ? x.nome_en : x.nome)}</a></td>
              <td>${esc(x.poder_ef ? nomePoder(String(x.poder_ef)) : "—")}</td>
              <td class="num">${num(v, 0)}<sup class="dag">†</sup></td>
              <td><div style="height:7px;background:var(--fio)">
                <div style="height:7px;width:${((v / maxEsp) * 100).toFixed(1)}%;background:var(--simulado);opacity:.85"></div>
              </div></td>
            </tr>`;
          }).join("")}
        </tbody>
      </table></div>
      <p class="nota-dag" style="margin:10px 0 16px"><b>†</b>
      <span>${tr("divisão feita pelo modelo; só o total de 182 888 t/ano vem do livro", "split made by the model; only the total of 182,888 t/year comes from the book")}</span></p>
      <p class="nota">${tr(`Os dez maiores respondem por ${num((dezMaiores / massa) * 100, 1)}% da colheita
      dos ${num(massa, 0)} t/ano do território cartografado.`, `The ten largest account for ${num((dezMaiores / massa) * 100, 1)}% of the
      ${num(massa, 0)} t/year harvested across the mapped territory.`)} ${selo("SIMULADO", tr("distribuição simulada", "simulated distribution"))}</p>

      <h2><span class="g">${secao("economia", 3)}</span><span>${tr("Para onde vai o dinheiro", "Where the money goes")}</span></h2>
      <p>${tr(`O modelo divide a renda da especiaria em três partes, e as três porcentagens
      <strong>são nossas</strong>, porque o livro não dá nenhuma. 70% sai do planeta
      (Guilda, CHOAM e imposto imperial), 20% paga o transporte e as bases na superfície
      e 10% fica com quem colhe.`, `The model splits spice income three ways, and all three percentages
      <strong>are ours</strong>, because the book gives none. 70% leaves the planet (Guild, CHOAM
      and Imperial tax), 20% pays for transport and bases on the surface, and 10% stays with
      those who harvest.`)}</p>
      <p>${tr(`Esses números foram escolhidos antes de olhar qualquer dado real. Só depois
      apareceu uma comparação: no cacau, a cadeia real mais parecida, quem produz fica
      com uns 6%. Estar na mesma faixa não prova que o modelo acerta, mas é bom saber.`,
      `Those numbers were picked before looking at any real data. Only later did a comparison
      turn up: in cocoa, the most similar real supply chain, producers keep about 6%. Being in the
      same range doesn't prove the model right, but it's worth knowing.`)}</p>
      <div class="tabela"><table>
        <thead><tr><th>${tr("Agregado", "Aggregate")}</th><th class="num">${tr("Valor", "Value")}</th><th>${tr("Classe", "Class")}</th></tr></thead>
        <tbody>
          <tr><td>${tr("Massa colhida no território cartografado", "Harvest in the mapped territory")}</td><td class="num">${num(massa, 0)} ${tr("t/ano", "t/year")}</td><td>${selo("CANONE_FH", tr("total canônico", "canon total"))}</td></tr>
          <tr><td>${tr("Produto do planeta", "Planetary output")}</td><td class="num">${compacto(pib * 1e6, 2)}<sup class="dag">†</sup> <span class="un">solaris</span></td><td>${selo("SIMULADO")}</td></tr>
          <tr><td>${tr("Participação da especiaria no produto", "Spice share of output")}</td><td class="num">${num(d.reduce((s, x) => s + Number(x.p_esp_pib ?? 0) * Number(x.pib_Msol ?? 0), 0) / pib, 1)}%</td><td>${selo("SIMULADO")}</td></tr>
          <tr><td>${tr("Preço de produtor derivado", "Derived producer price")}</td><td class="num">${tr("54 678", "54,678")} <span class="un">solaris/t</span></td><td>${selo("DEDUZIDO")}</td></tr>
        </tbody>
      </table></div>

      <h2><span class="g">${secao("economia", 4)}</span><span>${tr("Constantes planetárias do cânone", "Planetary constants from the books")}</span></h2>
      <p>${tr("Estas medidas o próprio Herbert dá, e o modelo não pode contrariá-las.", "Herbert gives these measurements himself, and the model may not contradict them.")}</p>
      <div class="tabela"><table>
        <thead><tr><th>${tr("Constante", "Constant")}</th><th>${tr("Valor", "Value")}</th><th>${tr("Marcador", "Marker")}</th></tr></thead>
        <tbody>
          ${((planeta.constantes ?? []) as any[])
            .filter((c) => c.classe === "CANONE_FH")
            .map((c) => {
              const e = en ? CONST_EN[c.chave] : undefined;
              const nome = e ? e[0] : String(c.chave).replace(/_/g, " ");
              const unidade = e ? e[1] : c.unidade;
              const nota = e ? e[2] : c.nota;
              return `<tr>
              <td>${esc(nome)}
                ${nota ? `<div style="margin-top:4px;font-size:11.5px;color:var(--tinta-3)">${esc(nota)}</div>` : ""}</td>
              <td class="num">${esc(String(c.valor))}${unidade ? ` <span style="color:var(--tinta-3)">${esc(unidade)}</span>` : ""}</td>
              <td><span class="marcador">${esc(c.marcador ?? "—")}</span></td>
            </tr>`;
            }).join("")}
        </tbody>
      </table></div>
    </div>
    ${rodape()}
  </article>`;
}
