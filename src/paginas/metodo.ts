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
    ${cabecalho("Prancha 12 · Proveniência",
      "O que é dado e o que é modelo",
      "Um atlas de um planeta inventado tem um problema que um atlas real não tem: parte dos números não existe em lugar nenhum, e alguém precisou criá-los. A resposta deste projeto não foi evitar isso, foi declarar tudo.")}
    <div class="corpo">
      <h2><span class="g">12.1</span><span>As cinco classes</span></h2>
      <p>Cada variável da malha tem uma e apenas uma classe, gravada em
      <code>dados/proveniencia_campos.csv</code> pelo pipeline — não por esta página.
      O site lê aquele arquivo; se a classificação mudar lá, muda aqui.</p>

      <div class="tabela"><table>
        <thead><tr><th>Classe</th><th>O que significa</th><th>Pode sustentar uma conclusão?</th></tr></thead>
        <tbody>
          <tr><td>${selo("CANONE_FH")}</td><td>Frase de Frank Herbert, localizada no corpus pelo marcador <code>[livro|seção|parágrafo]</code>.</td><td>Sim — é a fonte.</td></tr>
          <tr><td>${selo("DEDUZIDO")}</td><td>Medição ou inferência técnica sobre o mapa ou sobre uma frase do cânone: áreas, distâncias, custos, classes de terreno.</td><td>Sim, com o método declarado.</td></tr>
          <tr><td>${selo("SIMULADO")}</td><td>Modelo nosso, com parâmetro escolhido por nós e semente fixa. População distrital, produto, renda, água.</td><td><strong>Não.</strong> Só ilustra.</td></tr>
          <tr><td>${selo("EXTERNO_NAO_CANONE")}</td><td>Material de fora dos livros: simulação climática publicada, jogos. Entra como camada de comparação.</td><td>Não lastreia nada.</td></tr>
          <tr><td>${selo("DADO_REAL")}</td><td>Dado do mundo real, com fonte e ano, usado nas comparações.</td><td>Sim, para o lado real da comparação.</td></tr>
        </tbody>
      </table></div>

      <h2><span class="g">12.2</span><span>Quanto deste atlas é invenção</span></h2>
      <p>Contando as ${total} variáveis que a ficha de distrito exibe:</p>
      ${barras}
      <div class="aviso">
        <div class="rot">A consequência prática</div>
        <p>As três análises centrais do trabalho não tocam em nada amarelo. A regressão
        de Poisson usa contagem de símbolos do mapa e distância medida; as superfícies
        de custo usam classe de terreno e uma âncora canônica. Se toda a coluna
        simulada fosse apagada, as conclusões continuariam de pé.</p>
      </div>

      <h2><span class="g">12.3</span><span>Onde o cânone simplesmente cala</span></h2>
      <p>A extração completa dos oito volumes serviu tanto para achar o que existe
      quanto para provar o que <strong>não</strong> existe. Nenhuma população de cidade.
      Nenhum segundo par de cidades com distância declarada. Nenhuma divisão
      administrativa. Nenhum dado de captação de água por região. E
      ${semCota} dos ${dd.length} distritos não têm cota altimétrica em lugar
      nenhum — por isso existe uma superfície de elevação modelada, declarada como
      modelo.</p>
      <p class="nota">Poder afirmar a ausência é a vantagem metodológica de trabalhar com
      um corpus fechado. Com dado do mundo real, "não encontrei" e "não existe" não são
      a mesma coisa; aqui são.</p>

      <h2><span class="g">12.4</span><span>As doze premissas fechadas</span></h2>
      <p>Onde o cânone se contradiz, o modelo teve de escolher. Esta é a lista completa
      das escolhas — cada uma reversível, todas explícitas.</p>
      ${d.PREMISSAS ? blocos(d.PREMISSAS, { pularAte: 4 }) : ""}
    </div>
    ${rodape()}
  </article>`;
}
