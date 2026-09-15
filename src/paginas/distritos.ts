import { prancha } from "../pranchas";
import { distritos, proveniencia, num } from "../dados";
import { CAMPOS, formata } from "../campos";
import { cabecalho, esc, ligaOrdenacao, rodape, selo } from "../ui";

const COLUNAS = ["area_km2", "n_assent", "populacao", "espec_t", "dist_arrak",
                 "cd_arrak", "isolam"] as const;

/* Cabecalho curto: a tabela tem onze colunas e o nome longo de cada variavel
   empurraria a ultima para fora da tela. O nome inteiro fica no title. */
const CURTO: Record<string, string> = {
  area_km2: "Área km²", n_assent: "Assent.", populacao: "População",
  espec_t: "Especiaria t", dist_arrak: "Dist. capital",
  cd_arrak: "Custo capital", isolam: "Isolam.",
};

export async function indiceDistritos(alvo: HTMLElement) {
  const [d, prov] = await Promise.all([distritos(), proveniencia()]);

  const cabs = COLUNAS.map((c) => {
    const p = prov.campos[c]?.classe ?? "DEDUZIDO";
    return `<th class="num" title="${esc(CAMPOS[c].rot)} — ${esc(prov.campos[c]?.lastro ?? "")}">
      <span class="selo-proc p-${esc(p)}" style="letter-spacing:.08em">${esc(CURTO[c] ?? CAMPOS[c].rot)}</span></th>`;
  }).join("");

  const linhas = d.map((x) => `<tr>
    <td class="nome-dist"><a class="link" href="#/mapa#=${esc(x.cod)}">${esc(x.nome)}</a>
      <div class="sub">${esc(x.cod)} · ${esc(x.nome_en)}</div></td>
    <td class="curta">${esc(x.regiao)}</td>
    <td class="curta">${esc(x.poder_ef ?? "—")}</td>
    ${COLUNAS.map((c) => `<td class="num" data-v="${esc(x[c] ?? "")}">${esc(formata(c, x[c]))}</td>`).join("")}
  </tr>`).join("");

  const area = d.reduce((s, x) => s + Number(x.area_km2 ?? 0), 0);

  alvo.innerHTML = `<article class="folha">
    ${cabecalho(`${prancha("distritos")} · Índice territorial`,
      "Os quarenta e quatro distritos",
      `Os distritos cobrem ${num(area / 1e6, 2)} milhões de km², sem buraco e sem sobreposição. Herbert nunca divide o planeta em unidades administrativas, então as fronteiras são nossas. Como foram traçadas está explicado abaixo da tabela.`)}
    <div class="corpo" style="max-width:none">
      <p class="nota" style="margin-bottom:18px">A cor ao lado de cada coluna indica de
      onde vem a variável: do livro, de medida no mapa ou do modelo.</p>
      <div class="tabela">
        <table id="tab-dist">
          <thead><tr>
            <th>Distrito</th><th>Região</th><th>Controle efetivo</th>${cabs}
          </tr></thead>
          <tbody>${linhas}</tbody>
        </table>
      </div>

      <h2><span class="g">§</span><span>Como as fronteiras foram traçadas</span></h2>
      <p>O mapa do livro desenha lugares soltos (uma cadeia de rochas, uma bacia,
      um erg) e deixa espaço vazio entre eles. Para dividir o planeta inteiro, cada
      lugar desenhado cresceu sobre o próprio tipo de terreno, rocha sobre rocha, e
      a areia que sobrou foi para o nome mais próximo.</p>
      <p>A coluna <code>p_nucleo</code> mostra quanto de cada distrito é o lugar
      que o mapa desenhou e quanto é terreno que atribuímos a ele.</p>
      <div style="margin-top:18px">${selo("DEDUZIDO", "Geometria: deduzida do mapa")}
        ${selo("SIMULADO", "Recorte distrital: construção nossa")}</div>
    </div>
    ${rodape()}
  </article>`;

  ligaOrdenacao(alvo.querySelector("#tab-dist") as HTMLTableElement);
}
