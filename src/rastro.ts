import type { Proc } from "./dados";
import { CAMPOS } from "./campos";
import { emIngles, t } from "./i18n";
import { esc, selo } from "./ui";

/* As notas são exportadas pelo projeto cartográfico em português. A tradução
 * fica aqui para que a ficha possa explicar cada valor também em inglês sem
 * alterar o dado exportado nem fingir que uma premissa é uma medida. */
const LASTRO_EN: Record<string, string> = {
  "codigo sequencial criado pelo projeto": "sequential code created by the project",
  "toponimo do mapa do apendice; 30 dos 44 tem frase de FH": "place name on the appendix map; 30 of the 44 also have a Frank Herbert passage",
  "as 7 regioes sao agrupamento do projeto": "the seven regions are a grouping created by this project",
  "mapa | derivado (os 4 Ergs Exteriores)": "appendix map | derived (the four Outer Ergs)",
  "classificacao do terreno dominante a partir de p_nucleo": "dominant terrain classified from the district's mapped core",
  "classe de terreno onde a semente foi ancorada": "terrain class where the district seed was anchored",
  "medidos sobre a esfera a partir da malha": "measured on the sphere from the district geometry",
  "do georreferenciamento": "from the georeferencing",
  "6 distritos tem cota nas Notas Cartograficas": "six districts have a stated altitude in the Cartographic Notes",
  "status no gazetteer: canonico_fh | so_no_mapa | contradicao_grafia": "gazetteer status: named in the books | only on the map | variant spelling",
  "grafias divergentes atestadas no texto": "variant spellings attested in the text",
  "medidos no raster de classes do mapa fan": "measured from the terrain-class raster of the redrawn map",
  "geometria: feicao solida x atribuicao": "geometry: mapped feature versus assigned territory",
  "contagem dos simbolos extraidos do mapa fan": "count of settlement symbols extracted from the redrawn map",
  "distancia geodesica com R = 6.371 km": "geodesic distance using a planetary radius of 6,371 km",
  "POP_FREMEN_ALVO / POP_SIETCH_MED distribuido por PESO_AREA": "target Fremen population divided by mean sietch population, allocated by area weight",
  "total 10 milhoes e CANONE_FH; a distribuicao distrital nao": "the total of ten million is from Herbert; the district allocation is not",
  "POP_PYON, CIDADES, DENS_NOMADE - nenhum numero de cidade existe no corpus": "model choices for pyon population, cities and nomad density; the books give no city population",
  "derivados de populacao": "derived from the modelled population",
  "o TOTAL e CANONE_FH (90.000 long tons/semestre); a distribuicao distrital e simulada": "the total harvest is from Herbert (90,000 long tons per half-year); its district allocation is simulated",
  "o corpus nunca precifica nem quantifica captacao de agua por regiao": "the books give no price or regional amount for captured water",
  "PESO_MERCADO e THETA": "market weight and theta are model choices",
  "o TOTAL da renda da especiaria e CANONE_FH (10 bi/330 dias); o resto e modelo": "Herbert gives the total spice income (10 billion per 330 days); the allocation is a model",
  "ESP_FORA / ESP_LOGIST / ESP_LOCAL sao percentuais inventados": "the shares leaving the planet, spent on logistics and retained locally are model choices",
  "o fenomeno e canonico, os indices nao": "the phenomenon is in the books; the indices are modelled",
  "Herbert nao define divisoes administrativas; a particao e do projeto": "Herbert does not define administrative districts; this partition is the project's",
  "a soberania formal e canonica; sua atribuicao a cada distrito e do projeto": "formal sovereignty is in the books; assigning it to each district is this project's",
  "controle atribuido pelo tipo de assentamento desenhado em cada distrito": "control assigned from the kind of settlement drawn in each district",
  "elevacao e declividade produzidas pelo modelo de relevo do projeto": "elevation and slope produced by the project's terrain model",
  "menor custo de travessia em grade de 17,9 km; friccao por terreno definida pelo projeto": "least-cost path on a 17.9 km grid; terrain friction defined by the project",
  "indice calculado a partir do custo de travessia e da distancia geodesica": "index calculated from crossing cost and geodesic distance",
  "contrafactual da passagem aberta na Muralha Escudo, calculado pelo projeto": "project counterfactual for an open passage through the Shield Wall",
};

const LASTRO_PT: Record<string, string> = {
  "codigo sequencial criado pelo projeto": "Código sequencial criado pelo projeto.",
  "toponimo do mapa do apendice; 30 dos 44 tem frase de FH": "Topônimo do mapa do apêndice; 30 dos 44 também têm uma frase de Frank Herbert.",
  "as 7 regioes sao agrupamento do projeto": "As sete regiões são um agrupamento criado pelo projeto.",
  "mapa | derivado (os 4 Ergs Exteriores)": "Mapa do apêndice; os quatro Ergs Exteriores foram derivados dele.",
  "classificacao do terreno dominante a partir de p_nucleo": "Terreno dominante classificado a partir do núcleo desenhado do distrito.",
  "classe de terreno onde a semente foi ancorada": "Classe de terreno onde a semente do distrito foi ancorada.",
  "medidos sobre a esfera a partir da malha": "Medido sobre a esfera a partir da geometria distrital.",
  "do georreferenciamento": "Obtido pelo georreferenciamento do mapa.",
  "6 distritos tem cota nas Notas Cartograficas": "Seis distritos têm cotas declaradas nas Notas Cartográficas.",
  "status no gazetteer: canonico_fh | so_no_mapa | contradicao_grafia": "Gazetteer: nomeado no texto, presente só no mapa ou com grafia divergente.",
  "grafias divergentes atestadas no texto": "Grafias divergentes atestadas no texto.",
  "medidos no raster de classes do mapa fan": "Medido no raster de classes de terreno do mapa redesenhado.",
  "geometria: feicao solida x atribuicao": "Geometria: feição desenhada no mapa versus território atribuído.",
  "contagem dos simbolos extraidos do mapa fan": "Contagem dos símbolos de assentamento extraídos do mapa redesenhado.",
  "distancia geodesica com R = 6.371 km": "Distância geodésica com raio planetário de 6.371 km.",
  "POP_FREMEN_ALVO / POP_SIETCH_MED distribuido por PESO_AREA": "População fremen alvo dividida pela população média de um sietch, distribuída por peso de área.",
  "total 10 milhoes e CANONE_FH; a distribuicao distrital nao": "O total de dez milhões vem de Herbert; a distribuição distrital foi construída.",
  "POP_PYON, CIDADES, DENS_NOMADE - nenhum numero de cidade existe no corpus": "População pyon, cidades e densidade nômade são escolhas do modelo; os livros não dão população das cidades.",
  "derivados de populacao": "Derivado da população modelada.",
  "o TOTAL e CANONE_FH (90.000 long tons/semestre); a distribuicao distrital e simulada": "A colheita total vem de Herbert (90 mil toneladas longas por semestre); sua distribuição distrital é simulada.",
  "o corpus nunca precifica nem quantifica captacao de agua por regiao": "Os livros não dão preço nem volume regional para a água captada.",
  "PESO_MERCADO e THETA": "Peso de mercado e theta são escolhas do modelo.",
  "o TOTAL da renda da especiaria e CANONE_FH (10 bi/330 dias); o resto e modelo": "Herbert dá a renda total da especiaria (10 bilhões por 330 dias); a distribuição foi modelada.",
  "ESP_FORA / ESP_LOGIST / ESP_LOCAL sao percentuais inventados": "As parcelas que saem do planeta, pagam a logística e ficam localmente são escolhas do modelo.",
  "o fenomeno e canonico, os indices nao": "O fenômeno está nos livros; os índices foram modelados.",
  "Herbert nao define divisoes administrativas; a particao e do projeto": "Herbert não define distritos administrativos; esta divisão é do projeto.",
  "a soberania formal e canonica; sua atribuicao a cada distrito e do projeto": "A soberania formal está nos livros; sua atribuição por distrito foi construída pelo projeto.",
  "controle atribuido pelo tipo de assentamento desenhado em cada distrito": "Controle atribuído pelo tipo de assentamento desenhado em cada distrito.",
  "elevacao e declividade produzidas pelo modelo de relevo do projeto": "Elevação e declividade produzidas pelo modelo de relevo do projeto.",
  "menor custo de travessia em grade de 17,9 km; friccao por terreno definida pelo projeto": "Menor custo de travessia numa grade de 17,9 km; a fricção de cada terreno foi definida pelo projeto.",
  "indice calculado a partir do custo de travessia e da distancia geodesica": "Índice calculado a partir do custo de travessia e da distância geodésica.",
  "contrafactual da passagem aberta na Muralha Escudo, calculado pelo projeto": "Contrafactual de uma passagem aberta na Muralha Escudo, calculado pelo projeto.",
};

/* Estes campos ainda não aparecem no arquivo de proveniência exportado. As
 * regras complementares abaixo vêm das definições em campos.ts e das pranchas
 * de método, relevo e acessibilidade; são declaradas separadamente para não
 * parecerem parte do dado cartográfico original. */
const COMPLEMENTAR: Record<string, Proc> = {
  sober_nom: { classe: "MODELO_DERIVADO", lastro: "a soberania formal e canonica; sua atribuicao a cada distrito e do projeto", marcador: "" },
  poder_ef: { classe: "SIMULADO", lastro: "controle atribuido pelo tipo de assentamento desenhado em cada distrito", marcador: "" },
  alt_mod: { classe: "SIMULADO", lastro: "elevacao e declividade produzidas pelo modelo de relevo do projeto", marcador: "" },
  alt_min: { classe: "SIMULADO", lastro: "elevacao e declividade produzidas pelo modelo de relevo do projeto", marcador: "" },
  alt_max: { classe: "SIMULADO", lastro: "elevacao e declividade produzidas pelo modelo de relevo do projeto", marcador: "" },
  declive: { classe: "SIMULADO", lastro: "elevacao e declividade produzidas pelo modelo de relevo do projeto", marcador: "" },
  cd_arrak: { classe: "MODELO_DERIVADO", lastro: "menor custo de travessia em grade de 17,9 km; friccao por terreno definida pelo projeto", marcador: "" },
  cd_tabr: { classe: "MODELO_DERIVADO", lastro: "menor custo de travessia em grade de 17,9 km; friccao por terreno definida pelo projeto", marcador: "" },
  isolam: { classe: "MODELO_DERIVADO", lastro: "indice calculado a partir do custo de travessia e da distancia geodesica", marcador: "" },
  acesso_cd: { classe: "MODELO_DERIVADO", lastro: "indice calculado a partir do custo de travessia e da distancia geodesica", marcador: "" },
  ganho_gap: { classe: "SIMULADO", lastro: "contrafactual da passagem aberta na Muralha Escudo, calculado pelo projeto", marcador: "[1|notes|11402]" },
};

export function procParaCampo(campo: string, campos: Record<string, Proc>): Proc | undefined {
  return campos[campo] ?? COMPLEMENTAR[campo];
}

function nota(s: string): string {
  return emIngles() ? (LASTRO_EN[s] ?? s) : (LASTRO_PT[s] ?? s);
}

export function rastroBotaoHTML(campo: string): string {
  const rotulo = CAMPOS[campo]?.rot ?? campo;
  const nome = t("Ver origem", "See source");
  return `<button class="abre-rastro" type="button" aria-expanded="false"
    aria-controls="rastro-${esc(campo)}" aria-label="${esc(nome + ": " + rotulo)}"
    title="${esc(nome + ": " + rotulo)}">↗</button>`;
}

export function rastroHTML(campo: string, proc: Proc | undefined): string {
  const corpo = proc
    ? `<div class="rastro-classe">${selo(proc.classe)}</div>
       <p>${esc(nota(proc.lastro))}</p>
       ${proc.marcador ? `<code>${esc(proc.marcador)}</code>` : ""}
       ${CAMPOS[campo]?.ajuda ? `<p class="rastro-ajuda">${esc(CAMPOS[campo].ajuda)}</p>` : ""}`
    : `<p>${t("Esta variável ainda não tem uma nota de proveniência na exportação dos dados.",
                 "This variable does not yet have a provenance note in the data export.")}</p>`;
  return `<div class="rastro-detalhe" id="rastro-${esc(campo)}" hidden>
    ${corpo}
    <a href="#/metodo">${t("Como o atlas distingue dado e modelo →", "How the atlas separates data from models →")}</a>
  </div>`;
}

export function ligaRastros(raiz: HTMLElement): void {
  raiz.querySelectorAll<HTMLElement>(".linha-dado-wrap").forEach((bloco) => {
    const botao = bloco.querySelector<HTMLButtonElement>(".abre-rastro")!;
    const detalhe = bloco.querySelector<HTMLElement>(".rastro-detalhe")!;
    const fecha = () => { detalhe.hidden = true; botao.setAttribute("aria-expanded", "false"); };
    botao.addEventListener("click", () => {
      detalhe.hidden = !detalhe.hidden;
      botao.setAttribute("aria-expanded", String(!detalhe.hidden));
    });
    bloco.addEventListener("keydown", (e) => { if (e.key === "Escape") { fecha(); botao.focus(); } });
  });
}
