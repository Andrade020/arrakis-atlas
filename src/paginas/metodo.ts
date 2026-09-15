import { prancha, secao } from "../pranchas";
import { docs, distritos, proveniencia } from "../dados";
import { CAMPOS } from "../campos";
import { blocos, cabecalho, esc, rodape, selo } from "../ui";

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
        <span class="mono" style="color:var(--tinta-2)">${n} de ${total} campos · ${p.toFixed(0)}%</span>
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

  alvo.innerHTML = `<article class="folha">
    ${cabecalho(`${prancha("metodo")} · Proveniência`,
      "O que é dado e o que é modelo",
      "Num planeta inventado, parte dos números simplesmente não existe, e para fazer o atlas alguém teve de criá-los. Esta prancha mostra quais são e de onde vem cada tipo de dado.")}
    <div class="corpo">
      <h2><span class="g">${secao("metodo", 1)}</span><span>As cinco classes</span></h2>
      <p>Cada variável dos distritos pertence a uma destas classes. A lista fica em
      <code>dados/proveniencia_campos.csv</code>, e o site lê daquele arquivo.</p>

      <div class="tabela"><table>
        <thead><tr><th>Classe</th><th>O que significa</th><th>Pode sustentar uma conclusão?</th></tr></thead>
        <tbody>
          <tr><td>${selo("CANONE_FH")}</td><td>Frase de Frank Herbert, com o lugar no livro indicado pelo marcador <code>[livro|seção|parágrafo]</code>.</td><td>Sim. É a fonte.</td></tr>
          <tr><td>${selo("DEDUZIDO")}</td><td>Medida feita sobre o mapa ou tirada de uma frase do livro, como áreas, distâncias, custos de travessia e tipos de terreno.</td><td>Sim, dizendo como foi medido.</td></tr>
          <tr><td>${selo("SIMULADO")}</td><td>Saída do nosso modelo, com parâmetros escolhidos por nós, como população por distrito, produto, renda e água.</td><td><strong>Não.</strong> Serve para ilustrar.</td></tr>
          <tr><td>${selo("EXTERNO_NAO_CANONE")}</td><td>Material de fora dos livros, como uma simulação de clima publicada e jogos. Aparece só para comparar.</td><td>Não.</td></tr>
          <tr><td>${selo("DADO_REAL")}</td><td>Dado do mundo real, com fonte e ano, usado nas comparações.</td><td>Sim, para o lado real da comparação.</td></tr>
        </tbody>
      </table></div>

      <h2><span class="g">${secao("metodo", 2)}</span><span>Quanto deste atlas é invenção</span></h2>
      <p>Contando as ${total} variáveis que a ficha de distrito exibe:</p>
      ${barras}
      <div class="aviso">
        <div class="rot">A consequência prática</div>
        <p>As três análises principais não usam nenhum número simulado. A regressão usa a
        contagem de assentamentos do mapa e distâncias medidas; os custos de travessia
        usam o tipo de terreno e a Linha do Verme do livro. Apagando tudo o que é simulado,
        as conclusões continuam as mesmas.</p>
      </div>

      <h2><span class="g">${secao("metodo", 3)}</span><span>O que os livros não dizem</span></h2>
      <p>Com os oito livros inteiros pesquisáveis, dá para saber o que eles dizem e
      também o que <strong>não</strong> dizem. Não há população de nenhuma cidade. Só um
      par de cidades tem distância informada. Não há divisão administrativa nem dado de
      água por região. E ${semCota} dos ${dd.length} distritos não têm altitude em lugar
      nenhum, por isso a elevação do mapa é modelada.</p>
      <p class="nota">No mundo real, "não achei" não quer dizer "não existe". Aqui quer,
      porque a fonte é fechada: são só aqueles livros.</p>

      <h2><span class="g">${secao("metodo", 4)}</span><span>As doze escolhas do modelo</span></h2>
      <p>Onde os livros se contradizem, o modelo teve de escolher um lado. Estas são
      todas as escolhas, e qualquer uma pode ser trocada.</p>
      ${d.PREMISSAS ? blocos(d.PREMISSAS, { pularAte: 4 }) : ""}
    </div>
    ${rodape()}
  </article>`;
}
