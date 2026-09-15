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
      "O cânone dá um preço, uma receita e uma massa colhida. Qualquer dois deles determinam o terceiro — e o terceiro sempre sai errado, por seis ordens de grandeza. Esta prancha mostra a conta e declara qual âncora o modelo adota.")}
    <div class="corpo">

      <h2><span class="g">${secao("economia", 1)}</span><span>As três âncoras</span></h2>
      <p class="nota" style="margin-bottom:4px">As três primeiras são frases do livro. A quarta é conta nossa.</p>
      <div class="tabela"><table>
        <thead><tr><th>Âncora</th><th>Valor no texto</th><th class="num">Implicação</th><th>Decisão</th></tr></thead>
        <tbody>
          <tr>
            <td>Preço de mercado</td>
            <td>620 000 solaris o decagrama<div style="margin-top:5px"><span class="marcador">[1|terminology|11013]</span></div></td>
            <td class="num">62 bi <span class="un">solaris/t</span></td>
            <td>Registrado, <strong>não usado</strong>. O glossário diz que o preço "chegou a atingir" esse valor: é pico de mercado aberto, não preço de produtor.</td>
          </tr>
          <tr>
            <td>Receita Harkonnen</td>
            <td>10 bilhões de solaris a cada 330 dias-padrão<div style="margin-top:5px"><span class="marcador">[1|chapter012|1821]</span></div></td>
            <td class="num">—</td>
            <td><strong>Adotada</strong> como âncora monetária.</td>
          </tr>
          <tr>
            <td>Massa colhida</td>
            <td>90 000 long tons por semestre<div style="margin-top:5px"><span class="marcador">[5|38_Chapter_32|5171]</span></div></td>
            <td class="num">182 888 <span class="un">t/ano</span></td>
            <td><strong>Adotada</strong> como âncora física. Vem de 1.500 anos depois — usada como proxy por não existir número da época.</td>
          </tr>
          <tr>
            <td>Preço de produtor<div style="margin-top:6px">${selo("DEDUZIDO", "não está no livro")}</div></td>
            <td>—</td>
            <td class="num">54 678 <span class="un">solaris/t</span></td>
            <td>Derivado: receita dividida por massa. <strong>Não é um número do livro.</strong></td>
          </tr>
        </tbody>
      </table></div>

      <div class="aviso">
        <div class="rot">Por que a incompatibilidade é tão grande</div>
        <p>Se o preço do glossário fosse o preço recebido na origem, as 182 mil toneladas
        anuais valeriam cerca de <strong>11 quatrilhões</strong> de solaris — um milhão de
        vezes a receita que o próprio livro atribui aos Harkonnen. A leitura que salva os
        três números é econômica, não aritmética: o preço citado é a ponta de um monopólio
        de distribuição, e a distância entre ele e o preço de produtor é a renda
        da Guilda e da CHOAM.</p>
      </div>

      <h2><span class="g">${secao("economia", 2)}</span><span>Onde a especiaria sai</span></h2>
      <p>A massa total é cânone; a <strong>distribuição</strong> entre distritos é nossa.
      Ela segue a área de erg aberto ponderada pelo risco, porque é isso que o cânone
      descreve — a especiaria aflora na areia profunda, onde o verme circula.</p>
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
      <span>distribuição construída pelo modelo; só o total de 182 888 t/ano é cânone</span></p>
      <p class="nota">Os dez maiores respondem por ${num((dezMaiores / massa) * 100, 1)}% da colheita
      dos ${num(massa, 0)} t/ano do território cartografado. ${selo("SIMULADO", "distribuição simulada")}</p>

      <h2><span class="g">${secao("economia", 3)}</span><span>Uma economia de enclave, por construção</span></h2>
      <p>O modelo reparte a renda da especiaria em três destinos, e os três percentuais
      <strong>foram inventados por nós</strong>: 70% sai do planeta (Guilda, CHOAM,
      imposto imperial), 20% custeia a logística de superfície, 10% fica com quem extrai.
      Não há número no corpus para nenhum dos três.</p>
      <p>O parâmetro inventado foi fixado antes de qualquer consulta a dado real.
      Depois se descobriu que a parcela do produtor no cacau — a cadeia real mais
      parecida em estrutura — fica em torno de 6%. Cair na mesma ordem de grandeza não
      valida o modelo, mas é o tipo de coincidência que vale registrar em vez de
      esconder.</p>
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
      <p>Nem tudo é invenção. Estas são medidas que Herbert dá explicitamente, e que o
      modelo usa como restrição:</p>
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
