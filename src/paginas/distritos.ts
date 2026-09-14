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
    ${cabecalho("Prancha 03 · Índice territorial",
      "Os quarenta e quatro distritos",
      `A partição cobre ${num(area / 1e6, 2)} milhões de km² sem deixar vazio nem sobreposição. As fronteiras não são do cânone — Herbert nunca define divisão administrativa. São nossas, e o método está declarado abaixo da tabela.`)}
    <div class="corpo" style="max-width:none">
      <p class="nota" style="margin-bottom:18px">A marca ao lado de cada coluna diz a
      procedência da variável.</p>
      <div class="tabela">
        <table id="tab-dist">
          <thead><tr>
            <th>Distrito</th><th>Região</th><th>Controle efetivo</th>${cabs}
          </tr></thead>
          <tbody>${linhas}</tbody>
        </table>
      </div>

      <h2><span class="g">§</span><span>Como as fronteiras foram traçadas</span></h2>
      <p>O mapa desenha <strong>feições</strong>, não territórios: uma cadeia de
      rochas, uma bacia, um erg. Entre elas há branco — e um atlas não pode ter
      branco.</p>
      <p>Cada feição cresce dentro da sua própria classe de terreno (rocha só
      anexa rocha) e o que sobra de areia vai para o rótulo mais próximo. A
      coluna <code>p_nucleo</code> de cada distrito diz que fração dele é feição
      de verdade, e não território atribuído.</p>
      <div style="margin-top:18px">${selo("DEDUZIDO", "Geometria: deduzida do mapa")}
        ${selo("SIMULADO", "Recorte distrital: construção nossa")}</div>
    </div>
    ${rodape()}
  </article>`;

  ligaOrdenacao(alvo.querySelector("#tab-dist") as HTMLTableElement);
}
