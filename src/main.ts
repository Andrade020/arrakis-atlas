import "./estilo.css";
import { plac, prancha } from "./pranchas";
import { esc } from "./ui";
import { t, rota as link, lerHash, defineLingua, lingua, emIngles } from "./i18n";
import { inicio } from "./paginas/inicio";
import { paginaMapa } from "./paginas/mapa";
import { indiceDistritos } from "./paginas/distritos";
import { regioes } from "./paginas/regioes";
import { verme } from "./paginas/verme";
import { subsolo } from "./paginas/subsolo";
import { vida } from "./paginas/vida";
import { fuga } from "./paginas/fuga";
import { agua } from "./paginas/agua";
import { glossario } from "./paginas/glossario";
import { ligaGlossario } from "./glossario";
import { paginaDoc } from "./paginas/documento";
import { ligaTempestade } from "./paginas/tempestade";
import { metodo } from "./paginas/metodo";
import { economia } from "./paginas/economia";
import { fontes } from "./paginas/fontes";

export interface Rota {
  id: string;
  plac: string;            // numero de prancha
  titulo: string;
  secao?: string;
  monta: (alvo: HTMLElement) => void | Promise<void>;
  cheia?: boolean;         // ocupa a tela toda (o mapa)
}

export function rotas(): Rota[] {
  return [
  { id: "", plac: plac(""), titulo: t("Abertura", "Opening"), secao: t("O planeta", "The planet"), monta: inicio },
  { id: "mapa", plac: plac("mapa"), titulo: t("O mapa", "The map"), monta: paginaMapa, cheia: true },
  { id: "regioes", plac: plac("regioes"), titulo: t("As sete regiões", "The seven regions"), monta: regioes },
  { id: "distritos", plac: plac("distritos"), titulo: t("Os 44 distritos", "The 44 districts"), monta: indiceDistritos },
  { id: "verme", plac: plac("verme"), titulo: t("Shai-Hulud, o verme", "Shai-Hulud, the worm"), monta: verme },
  { id: "subsolo", plac: plac("subsolo"), titulo: t("Sob a areia", "Beneath the sand"), monta: subsolo },
  { id: "vida", plac: plac("vida"), titulo: t("O que vive no deserto", "What lives in the desert"), monta: vida },
  { id: "fuga", plac: plac("fuga"), titulo: t("A rota da fuga", "The escape route"), monta: fuga },
  {
    id: "padroes", plac: plac("padroes"), titulo: t("Onde as pessoas estão", "Where people live"), secao: t("O argumento", "The argument"),
    monta: (a) => paginaDoc(a, ["PADROES", "ROBUSTEZ"], {
      indice: `${prancha("padroes")} · ${t("Padrões de assentamento", "Settlement patterns")}`,
      titulo: t("O terreno pesa mais que o mercado", "Terrain matters more than the market"),
      linha: t("A ideia clássica é que as pessoas se instalam perto do mercado. Em Arrakis isso não se confirma. O teste foi refeito com dezenove recortes diferentes do território, e o resultado se manteve em todos.",
               "The classic idea is that people settle close to the market. On Arrakis that does not hold. The test was repeated with nineteen different ways of cutting up the territory, and the result held in every one."),
      figura: ["arrakis_padroes.webp", t("Quatro testes sobre onde ficam os assentamentos, todos com dados medidos no mapa: preferência por tipo de terreno, distância ao vizinho mais próximo, agrupamento em várias escalas (função L de Ripley) e uma regressão de Poisson.",
               "Four tests of where settlements are, all using data measured on the map: preference for each terrain type, distance to the nearest neighbour, clustering at several scales (Ripley's L function) and a Poisson regression.")],
    }),
  },
  {
    id: "acessibilidade", plac: plac("acessibilidade"), titulo: t("Dois Arrakis", "Two Arrakises"),
    monta: (a) => paginaDoc(a, ["ACESSIBILIDADE"], {
      indice: `${prancha("acessibilidade")} · ${t("Custo de travessia", "Cost of crossing")}`,
      titulo: t("Duas geografias sobre o mesmo território", "Two geographies on the same ground"),
      linha: t("Medir o planeta pelo esforço de atravessá-lo, e não em quilômetros, já muda o mapa. Muda outra vez quando quem atravessa é um fremen e não uma tropa do Império. Os dois mapas quase não se parecem.",
               "Measuring the planet by the effort of crossing it, rather than in kilometres, already changes the map. It changes again when the traveller is a Fremen and not an Imperial troop. The two maps barely look alike."),
      figura: ["arrakis_dois_arrakis.webp", t("O custo de chegar a cada ponto, para o Império e para os fremen, sobre o mesmo terreno. A única diferença é quanto cada tipo de chão atrasa cada um. Correlação entre os dois mapas: 0,09.",
               "The cost of reaching each point, for the Empire and for the Fremen, over the same terrain. The only difference is how much each kind of ground slows each of them down. Correlation between the two maps: 0.09.")],
    }).then(() => ligaTempestade(a)),
  },
  {
    id: "poder", plac: plac("poder"), titulo: t("Soberania e controle", "Sovereignty and control"),
    monta: (a) => paginaDoc(a, ["PODER"], {
      indice: `${prancha("poder")} · ${t("Geografia política", "Political geography")}`,
      titulo: t("Quem manda no chão", "Who runs the ground"),
      linha: t("Por decreto do Imperador, Arrakis é um feudo só, entregue a uma Casa. Na prática, quatro poderes dividem o território, e mais da metade da especiaria sai de terra que nenhum deles administra.",
               "By the Emperor's decree, Arrakis is a single fief, handed to one House. In practice four powers share the territory, and more than half the spice comes from land none of them governs."),
      spoiler: { desde: t("em cada livro", "in each book"), ate: t("No QGIS", "In QGIS"),
        aviso: t("A próxima seção diz quem governa Arrakis em cada um dos seis livros, até o fim da saga. É spoiler de tudo.",
                 "The next section says who rules Arrakis in each of the six books, up to the end of the saga. It spoils everything.") },
      figura: ["arrakis_soberania_x_controle.webp", t("À esquerda, quem é dono no papel. À direita, quem controla de fato, decidido pelo tipo de assentamento que existe em cada distrito.",
               "Left: who owns it on paper. Right: who actually controls it, decided by the kind of settlements found in each district.")],
    }),
  },
  { id: "economia", plac: plac("economia"), titulo: t("A economia da especiaria", "The spice economy"), monta: economia },
  { id: "agua", plac: plac("agua"), titulo: t("A economia da água", "The water economy"), monta: agua },
  {
    id: "comparacao", plac: plac("comparacao"), titulo: t("Na régua do mundo real", "Against the real world"),
    monta: (a) => paginaDoc(a, ["COMPARACAO"], {
      indice: `${prancha("comparacao")} · ${t("Comparação", "Comparison")}`,
      titulo: t("Arrakis na régua do mundo real", "Arrakis against the real world"),
      linha: t("Seis indicadores de Arrakis ao lado de números reais do IBGE, da UNCTAD e do IISD. Em cada par fica dito se o valor de Arrakis foi medido no mapa ou saiu do modelo.",
               "Six indicators for Arrakis next to real figures from IBGE, UNCTAD and IISD. Each pair says whether the Arrakis value was measured on the map or came from the model."),
      figura: ["arrakis_regua_real.webp", t("Cada barra põe um número de Arrakis ao lado de uma referência real. Quando o de Arrakis vem do modelo, está marcado.",
               "Each bar sets an Arrakis figure next to a real reference. When the Arrakis figure comes from the model, it is marked.")],
    }),
  },
  {
    id: "contradicoes", plac: plac("contradicoes"), titulo: t("Contradições do cânone", "Contradictions in the books"), secao: t("A oficina", "The workshop"),
    monta: (a) => paginaDoc(a, ["CONTRADICOES"], {
      indice: `${prancha("contradicoes")} · ${t("Conflitos na fonte", "Conflicts in the source")}`,
      titulo: t("Oito lugares onde o cânone não fecha", "Eight places where the books don't add up"),
      linha: t("Em oito pontos, os livros dão números que não podem estar certos ao mesmo tempo. Para cada um estão as duas frases, a conta que mostra o choque e a escolha que o atlas fez.",
               "In eight places the books give figures that cannot all be right. For each one you get both passages, the arithmetic that shows the clash, and the choice the atlas made."),
    }),
  },
  { id: "metodo", plac: plac("metodo"), titulo: t("Dado ou modelo", "Data or model"), monta: metodo },
  { id: "glossario", plac: plac("glossario"), titulo: t("Glossário", "Glossary"), monta: glossario },
  { id: "fontes", plac: plac("fontes"), titulo: t("Fontes e créditos", "Sources and credits"), monta: fontes },
  ];
}

const app = document.getElementById("app")!;


/* O índice deixou de ser coluna. Uma coluna fixa de 248 px com doze entradas
 * pedia ao leitor que decidisse para onde ir antes de ver qualquer coisa; o
 * cabeçalho oferece só as portas que quase todo mundo quer (o mapa, as
 * regiões, o verme, a vida no deserto) e guarda o sumário inteiro atrás de "Índice".
 *
 * A faixa do cabeçalho é uma crista de duna ao entardecer (ilustração gerada,
 * creditada na prancha 13). Na abertura ele fica transparente, por cima do
 * espaço escuro onde o planeta gira. */
const atalhos = (): [string, string][] => [["mapa", t("Mapa", "Map")], ["regioes", t("Regiões", "Regions")],
  ["verme", t("O verme", "The worm")], ["vida", t("Vida", "Life")]];

function cabecalhoHTML(idAtual: string): string {
  let secao = "";
  const grupos: { secao: string; rotas: Rota[] }[] = [];
  for (const r of rotas()) {
    if (r.secao && r.secao !== secao) { secao = r.secao; grupos.push({ secao, rotas: [] }); }
    grupos[grupos.length - 1].rotas.push(r);
  }
  return `<header class="cabecalho-site">
    <a class="marca-topo" href="${link("")}"><span class="nome">${t("Atlas de Arrakis", "Atlas of Arrakis")}</span></a>
    <nav class="atalhos" aria-label="${t("Principal", "Main")}">
      ${atalhos().map(([id, nome]) => `<a href="${link(id)}">${nome}</a>`).join("")}
    </nav>
    <a class="troca-lingua" href="${emIngles() ? `#/${idAtual}` : `#/en/${idAtual}`}"
       lang="${emIngles() ? "pt-BR" : "en"}" hreflang="${emIngles() ? "pt-BR" : "en"}"
       aria-label="${emIngles() ? "Ler em português" : "Read in English"}">${emIngles() ? "PT" : "EN"}</a>
    <button class="abre-indice" type="button" aria-expanded="false" aria-controls="sumario">
      <span>${t("Índice", "Contents")}</span><i aria-hidden="true"></i>
    </button>
  </header>
  <div class="sumario" id="sumario" role="dialog" aria-modal="true" aria-label="${t("Índice de pranchas", "Contents")}" hidden>
    <div class="sumario-topo">
      <span class="nome">${t("Atlas de Arrakis", "Atlas of Arrakis")}</span>
      <button class="fecha-sumario" type="button">${t("Fechar", "Close")}</button>
    </div>
    <nav class="sumario-grupos">
      ${grupos.map((g) => `<section>
        <h2>${esc(g.secao)}</h2>
        <ol>${g.rotas.map((r) => `<li><a href="${link(r.id)}">
          <span class="n">${r.plac}</span><span class="t">${esc(r.titulo)}</span></a></li>`).join("")}</ol>
      </section>`).join("")}
    </nav>
  </div>`;
}

function ligaIndice() {
  const painel = app.querySelector<HTMLElement>(".sumario")!;
  const botao = app.querySelector<HTMLButtonElement>(".abre-indice")!;
  const abre = () => {
    painel.hidden = false;
    botao.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("travado");
    painel.querySelector<HTMLElement>("a[aria-current], a")?.focus();
  };
  const fecha = (devolveFoco = true) => {
    if (painel.hidden) return;
    painel.hidden = true;
    botao.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("travado");
    if (devolveFoco) botao.focus();
  };
  botao.addEventListener("click", abre);
  painel.querySelector(".fecha-sumario")!.addEventListener("click", () => fecha());
  painel.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("a")) fecha(false);
  });
  fechaIndice = fecha;
  if (!ouvintesIndice) {
    // no documento, uma vez só: a casca é refeita quando a língua muda
    ouvintesIndice = true;
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") fechaIndice(); });
    window.addEventListener("hashchange", () => fechaIndice(false));
  }
}
let fechaIndice: (devolveFoco?: boolean) => void = () => {};
let ouvintesIndice = false;

function marcaAtual(id: string) {
  app.querySelectorAll<HTMLAnchorElement>(".cabecalho-site a, .sumario a").forEach((a) => {
    if (a.getAttribute("href") === link(id)) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

let atualId: string | null = null;
let atualLingua: string | null = null;

async function navega() {
  // "#/en/mapa#=AR-20" -> inglês, "mapa"; o sufixo #= e' o distrito a abrir na prancha
  const [lg, resto] = lerHash(location.hash);
  defineLingua(lg);
  const id = (resto.split(/[?#]/)[0] || "").trim();
  const lista = rotas();
  const rota = lista.find((r) => r.id === id) ?? lista[0];
  // a casca (cabeçalho e índice) é refeita quando muda a língua, e o link de
  // troca de língua precisa apontar para a página atual
  const recarregaCasca = atualId === null || atualLingua !== lg;
  atualId = rota.id;
  atualLingua = lg;

  if (recarregaCasca) {
    app.innerHTML = `${cabecalhoHTML(rota.id)}<main id="conteudo"></main>`;
    ligaIndice();
  }
  const troca = app.querySelector<HTMLAnchorElement>(".troca-lingua");
  if (troca) troca.href = lg === "en" ? `#/${resto}` : `#/en/${resto}`;
  marcaAtual(rota.id);

  // Na prancha o cabeçalho sai de cena: a folha tem UMA margem, e nela cabem
  // título, controles e legenda.
  app.className = rota.cheia ? "casca cheia" : rota.id === "" ? "casca na-orbita" : "casca";

  const main = app.querySelector("main") as HTMLElement;
  main.innerHTML = "";
  main.dataset.pagina = rota.id || "abertura";
  document.title = rota.id
    ? `${rota.titulo} — ${t("Atlas de Arrakis", "Atlas of Arrakis")}`
    : t("Atlas de Arrakis — geografia econômica de um planeta inventado", "Atlas of Arrakis — the economic geography of an invented planet");
  await rota.monta(main);
  // termos do glossário: não na prancha do mapa, nem na abertura, nem no próprio glossário
  if (!rota.cheia && rota.id !== "" && rota.id !== "glossario") ligaGlossario(main);
  if (!location.hash.includes("#=")) window.scrollTo(0, 0);
}

/* O índice lateral antigo, por existir na tela, fazia o navegador baixar estas
 * faces logo na entrada. O desenho do mapa em canvas contava com isso sem
 * saber: sem elas, a primeira pintura da prancha 01 saía com rótulos em fonte
 * de reserva (a comparação pixel a pixel com o backup pegou). O cabeçalho some
 * na prancha, então as faces são pedidas aqui, explicitamente. */
const FACES = ["400 27px Newsreader", "500 10px 'IBM Plex Mono'", "400 10px 'IBM Plex Mono'",
               "400 14px Archivo", "500 14px Archivo", "600 14px Archivo",
               "italic 400 14px Archivo", "italic 500 14px Archivo", "italic 600 14px Archivo"];
// pedir não basta: a prancha pinta os rótulos assim que os dados chegam, e se a
// face ainda estiver a caminho o canvas usa a reserva. Espera as faces (no
// máximo 1,5 s, para rede ruim não segurar a página) antes da primeira rota.
const fontesProntas = document.fonts
  ? Promise.race([
      Promise.all(FACES.map((f) => document.fonts.load(f).catch(() => []))),
      new Promise((r) => setTimeout(r, 1500)),
    ])
  : Promise.resolve();

/* Em inglês, os links internos escritos como "#/pagina" nas páginas e nos
 * dados ganham o prefixo "#/en/" na hora do clique. Assim nenhum texto
 * precisa saber em que língua está para montar um link. */
document.addEventListener("click", (e) => {
  if (lingua() !== "en" || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
  const a = (e.target as HTMLElement).closest?.("a");
  const href = a?.getAttribute("href") ?? "";
  if (!a || !href.startsWith("#/") || href.startsWith("#/en") || a.classList.contains("troca-lingua")) return;
  e.preventDefault();
  location.hash = "#/en/" + href.slice(2);
});

window.addEventListener("hashchange", navega);
fontesProntas.then(navega);
