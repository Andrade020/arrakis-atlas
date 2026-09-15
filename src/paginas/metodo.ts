import { prancha, secao } from "../pranchas";
import { docs, distritos, proveniencia } from "../dados";
import { CAMPOS } from "../campos";
import { blocos, cabecalho, esc, rodape, selo } from "../ui";
import { t, emIngles } from "../i18n";

const ORDEM = ["CANONE_FH", "DEDUZIDO", "SIMULADO", "EXTERNO_NAO_CANONE", "DADO_REAL"];

export async function metodo(alvo: HTMLElement) {
  const [d, prov, dd] = await Promise.all([docs(), proveniencia(), distritos()]);

  // Conta quantos campos da malha caem em cada classe. E' o "quanto deste
  // atlas e' invencao" respondido com o proprio indice de procedencia, e nao
  // com uma impressao.
  const campos = Object.keys(CAMPOS);
  const contagem: Record<string, string[]> = {};
  for (const c of campos) {
    const k = prov.campos[c]?.classe ?? "DEDUZIDO";
    (contagem[k] ??= []).push(c);
  }
  const total = campos.length;

  const barras = ORDEM.filter((k) => contagem[k]?.length).map((k) => {
    const n = contagem[k].length;
    const p = (n / total) * 100;
    return `<div style="margin-bottom:20px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:7px">
        ${selo(k)}
        <span class="mono" style="color:var(--tinta-2)">${n} ${t("de", "of")} ${total} ${t("campos", "fields")} · ${p.toFixed(0)}%</span>
      </div>
      <div class="selo-proc p-${esc(k)}" style="display:block;height:6px;background:var(--fio);width:100%">
        <div style="height:6px;width:${p.toFixed(1)}%;background:var(--cor)"></div>
      </div>
      <p style="margin:9px 0 0;font:300 14.5px/1.5 var(--f-text);color:var(--tinta-2);max-width:64ch">
        ${esc(contagem[k].map((c) => CAMPOS[c].rot).slice(0, 9).join(" · "))}${contagem[k].length > 9 ? " …" : ""}
      </p>
    </div>`;
  }).join("");

  const semCota = dd.filter((x) => x.alt_m === null || x.alt_m === undefined).length;

  const premissas = emIngles() ? (d.PREMISSAS_EN ?? d.PREMISSAS) : d.PREMISSAS;
  alvo.innerHTML = `<article class="folha">
    ${cabecalho(`${prancha("metodo")} · ${t("Proveniência", "Provenance")}`,
      t("O que é dado e o que é modelo", "What is data and what is model"),
      t("Num planeta inventado, parte dos números simplesmente não existe, e para fazer o atlas alguém teve de criá-los. Esta página mostra quais são e de onde vem cada tipo de dado.",
        "On an invented planet, some numbers simply don't exist, and to make the atlas someone had to create them. This page shows which ones they are and where each kind of data comes from."))}
    <div class="corpo">
      <h2><span class="g">${secao("metodo", 1)}</span><span>${t("As cinco classes", "The five classes")}</span></h2>
      <p>${t(`Cada variável dos distritos pertence a uma destas classes. A lista fica em
      <code>dados/proveniencia_campos.csv</code>, e o site lê daquele arquivo.`,
      `Every district variable belongs to one of these classes. The list lives in
      <code>dados/proveniencia_campos.csv</code>, and the site reads it from there.`)}</p>

      <div class="tabela"><table>
        <thead><tr><th>${t("Classe", "Class")}</th><th>${t("O que significa", "What it means")}</th><th>${t("Pode sustentar uma conclusão?", "Can it support a conclusion?")}</th></tr></thead>
        <tbody>
          <tr><td>${selo("CANONE_FH")}</td><td>${t("Frase de Frank Herbert, com o lugar no livro indicado pelo marcador <code>[livro|seção|parágrafo]</code>.", "A passage by Frank Herbert, located in the book by the marker <code>[book|section|paragraph]</code>.")}</td><td>${t("Sim. É a fonte.", "Yes. It is the source.")}</td></tr>
          <tr><td>${selo("DEDUZIDO")}</td><td>${t("Medida feita sobre o mapa ou tirada de uma frase do livro, como áreas, distâncias, custos de travessia e tipos de terreno.", "A measurement made on the map or taken from a passage in the book, such as areas, distances, crossing costs and terrain types.")}</td><td>${t("Sim, dizendo como foi medido.", "Yes, as long as you say how it was measured.")}</td></tr>
          <tr><td>${selo("SIMULADO")}</td><td>${t("Saída do nosso modelo, com parâmetros escolhidos por nós, como população por distrito, produto, renda e água.", "Output of our model, with parameters we chose, such as population by district, output, income and water.")}</td><td>${t("<strong>Não.</strong> Serve para ilustrar.", "<strong>No.</strong> It is there to illustrate.")}</td></tr>
          <tr><td>${selo("EXTERNO_NAO_CANONE")}</td><td>${t("Material de fora dos livros, como uma simulação de clima publicada e jogos. Aparece só para comparar.", "Material from outside the books, such as a published climate simulation and games. Used only for comparison.")}</td><td>${t("Não.", "No.")}</td></tr>
          <tr><td>${selo("DADO_REAL")}</td><td>${t("Dado do mundo real, com fonte e ano, usado nas comparações.", "Real-world data, with source and year, used in the comparisons.")}</td><td>${t("Sim, para o lado real da comparação.", "Yes, for the real side of the comparison.")}</td></tr>
        </tbody>
      </table></div>

      <h2><span class="g">${secao("metodo", 2)}</span><span>${t("Quanto deste atlas é invenção", "How much of this atlas is invented")}</span></h2>
      <p>${t(`Contando as ${total} variáveis que a ficha de distrito exibe:`, `Counting the ${total} variables shown on the district card:`)}</p>
      ${barras}
      <div class="aviso">
        <div class="rot">${t("A consequência prática", "What this means in practice")}</div>
        <p>${t(`As três análises principais não usam nenhum número simulado. A regressão usa a
        contagem de assentamentos do mapa e distâncias medidas; os custos de travessia
        usam o tipo de terreno e a Linha do Verme do livro. Apagando tudo o que é simulado,
        as conclusões continuam as mesmas.`, `The three main analyses use no simulated numbers at all. The
        regression uses the count of settlements on the map and measured distances; the crossing
        costs use terrain type and the book's Worm Line. Delete everything simulated and the
        conclusions stay the same.`)}</p>
      </div>

      <h2><span class="g">${secao("metodo", 3)}</span><span>${t("O que os livros não dizem", "What the books don't say")}</span></h2>
      <p>${t(`Com os oito livros inteiros pesquisáveis, dá para saber o que eles dizem e
      também o que <strong>não</strong> dizem. Não há população de nenhuma cidade. Só um
      par de cidades tem distância informada. Não há divisão administrativa nem dado de
      água por região. E ${semCota} dos ${dd.length} distritos não têm altitude em lugar
      nenhum, por isso a elevação do mapa é modelada.`, `With all eight books searchable, you can tell what they
      say and also what they <strong>don't</strong>. No city has a population. Only one pair of
      cities has a stated distance. There are no administrative divisions and no water figures by
      region. And ${semCota} of the ${dd.length} districts have no altitude anywhere, which is why the
      map's elevation is modelled.`)}</p>
      <p class="nota">${t(`No mundo real, "não achei" não quer dizer "não existe". Aqui quer,
      porque a fonte é fechada: são só aqueles livros.`, `In the real world, "I didn't find it" doesn't mean
      "it doesn't exist". Here it does, because the source is closed: it is just those books.`)}</p>

      <h2><span class="g">${secao("metodo", 4)}</span><span>${t("As doze escolhas do modelo", "The model's twelve choices")}</span></h2>
      <p>${t(`Onde os livros se contradizem, o modelo teve de escolher um lado. Estas são
      todas as escolhas, e qualquer uma pode ser trocada.`, `Where the books contradict each other, the model
      had to pick a side. These are all the choices, and any of them can be changed.`)}</p>
      ${premissas ? blocos(premissas, { pularAte: 3 }) : ""}
    </div>
    ${rodape()}
  </article>`;
}
