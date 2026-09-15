import { prancha } from "../pranchas";
import { distritos, proveniencia, num } from "../dados";
import { CAMPOS, formata } from "../campos";
import { cabecalho, esc, ligaOrdenacao, rodape, selo } from "../ui";
import { t, emIngles, nomeRegiao, nomePoder } from "../i18n";

const COLUNAS = ["area_km2", "n_assent", "populacao", "espec_t", "dist_arrak",
                 "cd_arrak", "isolam"] as const;

/* Cabecalho curto: a tabela tem onze colunas e o nome longo de cada variavel
   empurraria a ultima para fora da tela. O nome inteiro fica no title. */
const curto = (): Record<string, string> => ({
  area_km2: t("Área km²", "Area km²"), n_assent: t("Assent.", "Settl."), populacao: t("População", "Population"),
  espec_t: t("Especiaria t", "Spice t"), dist_arrak: t("Dist. capital", "Dist. capital"),
  cd_arrak: t("Custo capital", "Cost capital"), isolam: t("Isolam.", "Isolation"),
});

export async function indiceDistritos(alvo: HTMLElement) {
  const [d, prov] = await Promise.all([distritos(), proveniencia()]);

  const CURTO = curto();
  const cabs = COLUNAS.map((c) => {
    const p = prov.campos[c]?.classe ?? "DEDUZIDO";
    return `<th class="num" title="${esc(CAMPOS[c].rot)} — ${esc(prov.campos[c]?.lastro ?? "")}">
      <span class="selo-proc p-${esc(p)}" style="letter-spacing:.08em">${esc(CURTO[c] ?? CAMPOS[c].rot)}</span></th>`;
  }).join("");

  const linhas = d.map((x) => `<tr>
    <td class="nome-dist"><a class="link" href="#/mapa#=${esc(x.cod)}">${esc(emIngles() ? x.nome_en : x.nome)}</a>
      <div class="sub">${esc(x.cod)}${emIngles() ? "" : ` · ${esc(x.nome_en)}`}</div></td>
    <td class="curta">${esc(nomeRegiao(String(x.regiao)))}</td>
    <td class="curta">${esc(x.poder_ef ? nomePoder(String(x.poder_ef)) : "—")}</td>
    ${COLUNAS.map((c) => `<td class="num" data-v="${esc(x[c] ?? "")}">${esc(formata(c, x[c]))}</td>`).join("")}
  </tr>`).join("");

  const area = d.reduce((s, x) => s + Number(x.area_km2 ?? 0), 0);

  alvo.innerHTML = `<article class="folha">
    ${cabecalho(`${prancha("distritos")} · ${t("Índice territorial", "Territorial index")}`,
      t("Os quarenta e quatro distritos", "The forty-four districts"),
      t(`Os distritos cobrem ${num(area / 1e6, 2)} milhões de km², sem buraco e sem sobreposição. Herbert nunca divide o planeta em unidades administrativas, então as fronteiras são nossas. Como foram traçadas está explicado abaixo da tabela.`,
        `The districts cover ${num(area / 1e6, 2)} million km², with no gaps and no overlaps. Herbert never divides the planet into administrative units, so the borders are ours. How they were drawn is explained below the table.`))}
    <div class="corpo" style="max-width:none">
      <p class="nota" style="margin-bottom:18px">${t(`A cor ao lado de cada coluna indica de
      onde vem a variável: do livro, de medida no mapa ou do modelo.`, `The colour beside each column shows where
      the variable comes from: the book, a measurement on the map, or the model.`)}</p>
      <div class="tabela">
        <table id="tab-dist">
          <thead><tr>
            <th>${t("Distrito", "District")}</th><th>${t("Região", "Region")}</th><th>${t("Controle efetivo", "Effective control")}</th>${cabs}
          </tr></thead>
          <tbody>${linhas}</tbody>
        </table>
      </div>

      <h2><span class="g">§</span><span>${t("Como as fronteiras foram traçadas", "How the borders were drawn")}</span></h2>
      <p>${t(`O mapa do livro desenha lugares soltos (uma cadeia de rochas, uma bacia,
      um erg) e deixa espaço vazio entre eles. Para dividir o planeta inteiro, cada
      lugar desenhado cresceu sobre o próprio tipo de terreno, rocha sobre rocha, e
      a areia que sobrou foi para o nome mais próximo.`, `The book's map draws separate places (a chain
      of rocks, a basin, an erg) and leaves empty space between them. To divide the whole
      planet, each drawn place was grown over its own kind of terrain, rock onto rock, and
      the sand left over went to the nearest name.`)}</p>
      <p>${t(`A coluna <code>p_nucleo</code> mostra quanto de cada distrito é o lugar
      que o mapa desenhou e quanto é terreno que atribuímos a ele.`, `The <code>p_nucleo</code> column shows how
      much of each district is the place the map drew, and how much is ground we assigned to it.`)}</p>
      <div style="margin-top:18px">${selo("DEDUZIDO", t("Geometria: deduzida do mapa", "Geometry: derived from the map"))}
        ${selo("SIMULADO", t("Recorte distrital: construção nossa", "District division: our construction"))}</div>
    </div>
    ${rodape()}
  </article>`;

  ligaOrdenacao(alvo.querySelector("#tab-dist") as HTMLTableElement);
}
