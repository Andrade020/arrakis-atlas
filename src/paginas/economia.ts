import { prancha, secao } from "../pranchas";
import { distritos, tabelas, num, compacto } from "../dados";
import { cabecalho, esc, rodape, selo } from "../ui";

export async function economia(alvo: HTMLElement) {
  const [d, t] = await Promise.all([distritos(), tabelas()]);

  const massa = d.reduce((s, x) => s + Number(x.espec_t ?? 0), 0);
  const pib = d.reduce((s, x) => s + Number(x.pib_Msol ?? 0), 0);
  const top = [...d].sort((a, b) => Number(b.espec_t) - Number(a.espec_t)).slice(0, 10);
  const maxEsp = Number(top[0].espec_t);

  // Concentracao: quanto os dez maiores respondem do total colhido.
  const dezMaiores = top.reduce((s, x) => s + Number(x.espec_t), 0);

  const planeta = (t.planeta ?? {}) as Record<string, any>;

  alvo.innerHTML = `<article class="folha">
    ${cabecalho(`${prancha("economia")} · Economia da especiaria`,
      "Três números que não podem ser verdade ao mesmo tempo",
      "Os livros dão um preço, uma receita e uma quantidade colhida. Com quaisquer dois se calcula o terceiro, e o terceiro sempre sai errado, por um fator de um milhão. Aqui está a conta e a escolha que o modelo fez.")}
    <div class="corpo">

      <h2><span class="g">${secao("economia", 1)}</span><span>As três âncoras</span></h2>
      <p class="nota" style="margin-bottom:4px">As três primeiras linhas vêm do livro. A quarta é uma conta nossa.</p>
      <div class="tabela"><table>
        <thead><tr><th>Âncora</th><th>Valor no texto</th><th class="num">Implicação</th><th>Decisão</th></tr></thead>
        <tbody>
          <tr>
            <td>Preço de mercado</td>
            <td>620 000 solaris o decagrama<div style="margin-top:5px"><span class="marcador">[1|terminology|11013]</span></div></td>
            <td class="num">62 bi <span class="un">solaris/t</span></td>
            <td>Anotado, mas <strong>não usado</strong>. O glossário diz que o preço "chegou a" esse valor. É o pico no mercado aberto, e não o que recebe quem colhe.</td>
          </tr>
          <tr>
            <td>Receita Harkonnen</td>
            <td>10 bilhões de solaris a cada 330 dias-padrão<div style="margin-top:5px"><span class="marcador">[1|chapter012|1821]</span></div></td>
            <td class="num">—</td>
            <td><strong>Usada</strong> como referência de dinheiro.</td>
          </tr>
          <tr>
            <td>Massa colhida</td>
            <td>90 000 long tons por semestre<div style="margin-top:5px"><span class="marcador">[5|38_Chapter_32|5171]</span></div></td>
            <td class="num">182 888 <span class="un">t/ano</span></td>
            <td><strong>Usada</strong> como referência de quantidade. O número é de 1.500 anos depois; entra no lugar porque não há outro da época.</td>
          </tr>
          <tr>
            <td>Preço de produtor<div style="margin-top:6px">${selo("DEDUZIDO", "não está no livro")}</div></td>
            <td>—</td>
            <td class="num">54 678 <span class="un">solaris/t</span></td>
            <td>Receita dividida pela quantidade. <strong>Não está no livro.</strong></td>
          </tr>
        </tbody>
      </table></div>

      <div class="aviso">
        <div class="rot">Por que a incompatibilidade é tão grande</div>
        <p>Se o preço do glossário fosse o que recebe quem colhe, as 182 mil toneladas
        de um ano valeriam cerca de <strong>11 quatrilhões</strong> de solaris, um milhão
        de vezes a receita que o livro dá aos Harkonnen. Os três números só convivem se o
        preço citado for o da ponta final de um monopólio. A diferença entre ele e o que
        se paga no deserto fica com a Guilda e a CHOAM.</p>
      </div>

      <h2><span class="g">${secao("economia", 2)}</span><span>Onde a especiaria sai</span></h2>
      <p>O total vem do livro; a <strong>divisão</strong> entre distritos é do modelo.
      Ela acompanha a área de erg ao sul da Linha do Verme, e cresce quanto mais longe do
      polo, porque a especiaria nasce na areia funda por onde o verme anda.</p>
      <div class="tabela"><table>
        <thead><tr><th>Distrito</th><th>Controle efetivo</th><th class="num">t/ano</th><th style="width:34%">Participação</th></tr></thead>
        <tbody>
          ${top.map((x) => {
            const v = Number(x.espec_t);
            return `<tr>
              <td><a class="link" href="#/mapa#=${esc(x.cod)}">${esc(x.nome)}</a></td>
              <td>${esc(x.poder_ef ?? "—")}</td>
              <td class="num">${num(v, 0)}<sup class="dag">†</sup></td>
              <td><div style="height:7px;background:var(--fio)">
                <div style="height:7px;width:${((v / maxEsp) * 100).toFixed(1)}%;background:var(--simulado);opacity:.85"></div>
              </div></td>
            </tr>`;
          }).join("")}
        </tbody>
      </table></div>
      <p class="nota-dag" style="margin:10px 0 16px"><b>†</b>
      <span>divisão feita pelo modelo; só o total de 182 888 t/ano vem do livro</span></p>
      <p class="nota">Os dez maiores respondem por ${num((dezMaiores / massa) * 100, 1)}% da colheita
      dos ${num(massa, 0)} t/ano do território cartografado. ${selo("SIMULADO", "distribuição simulada")}</p>

      <h2><span class="g">${secao("economia", 3)}</span><span>Para onde vai o dinheiro</span></h2>
      <p>O modelo divide a renda da especiaria em três partes, e as três porcentagens
      <strong>são nossas</strong>, porque o livro não dá nenhuma. 70% sai do planeta
      (Guilda, CHOAM e imposto imperial), 20% paga o transporte e as bases na superfície
      e 10% fica com quem colhe.</p>
      <p>Esses números foram escolhidos antes de olhar qualquer dado real. Só depois
      apareceu uma comparação: no cacau, a cadeia real mais parecida, quem produz fica
      com uns 6%. Estar na mesma faixa não prova que o modelo acerta, mas é bom saber.</p>
      <div class="tabela"><table>
        <thead><tr><th>Agregado</th><th class="num">Valor</th><th>Classe</th></tr></thead>
        <tbody>
          <tr><td>Massa colhida no território cartografado</td><td class="num">${num(massa, 0)} t/ano</td><td>${selo("CANONE_FH", "total canônico")}</td></tr>
          <tr><td>Produto do planeta</td><td class="num">${compacto(pib * 1e6, 2)}<sup class="dag">†</sup> <span class="un">solaris</span></td><td>${selo("SIMULADO")}</td></tr>
          <tr><td>Participação da especiaria no produto</td><td class="num">${num(d.reduce((s, x) => s + Number(x.p_esp_pib ?? 0) * Number(x.pib_Msol ?? 0), 0) / pib, 1)}%</td><td>${selo("SIMULADO")}</td></tr>
          <tr><td>Preço de produtor derivado</td><td class="num">54 678 <span class="un">solaris/t</span></td><td>${selo("DEDUZIDO")}</td></tr>
        </tbody>
      </table></div>

      <h2><span class="g">${secao("economia", 4)}</span><span>Constantes planetárias do cânone</span></h2>
      <p>Estas medidas o próprio Herbert dá, e o modelo não pode contrariá-las.</p>
      <div class="tabela"><table>
        <thead><tr><th>Constante</th><th>Valor</th><th>Marcador</th></tr></thead>
        <tbody>
          ${((planeta.constantes ?? []) as any[])
            .filter((c) => c.classe === "CANONE_FH")
            .map((c) => `<tr>
              <td>${esc(String(c.chave).replace(/_/g, " "))}
                ${c.nota ? `<div style="margin-top:4px;font-size:11.5px;color:var(--tinta-3)">${esc(c.nota)}</div>` : ""}</td>
              <td class="num">${esc(String(c.valor))}${c.unidade ? ` <span style="color:var(--tinta-3)">${esc(c.unidade)}</span>` : ""}</td>
              <td><span class="marcador">${esc(c.marcador ?? "—")}</span></td>
            </tr>`).join("")}
        </tbody>
      </table></div>
    </div>
    ${rodape()}
  </article>`;
}
