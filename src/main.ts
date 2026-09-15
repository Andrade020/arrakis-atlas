import "./estilo.css";
import { plac, prancha } from "./pranchas";
import { esc } from "./ui";
import { inicio } from "./paginas/inicio";
import { paginaMapa } from "./paginas/mapa";
import { indiceDistritos } from "./paginas/distritos";
import { regioes } from "./paginas/regioes";
import { verme } from "./paginas/verme";
import { vida } from "./paginas/vida";
import { fuga } from "./paginas/fuga";
import { agua } from "./paginas/agua";
import { glossario } from "./paginas/glossario";
import { ligaGlossario } from "./glossario";
import { paginaDoc } from "./paginas/documento";
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

export const ROTAS: Rota[] = [
  { id: "", plac: plac(""), titulo: "Abertura", secao: "O planeta", monta: inicio },
  { id: "mapa", plac: plac("mapa"), titulo: "O mapa", monta: paginaMapa, cheia: true },
  { id: "regioes", plac: plac("regioes"), titulo: "As sete regiões", monta: regioes },
  { id: "distritos", plac: plac("distritos"), titulo: "Os 44 distritos", monta: indiceDistritos },
  { id: "verme", plac: plac("verme"), titulo: "Shai-Hulud, o verme", monta: verme },
  { id: "vida", plac: plac("vida"), titulo: "O que vive no deserto", monta: vida },
  { id: "fuga", plac: plac("fuga"), titulo: "A rota da fuga", monta: fuga },
  {
    id: "padroes", plac: plac("padroes"), titulo: "Onde as pessoas estão", secao: "O argumento",
    monta: (a) => paginaDoc(a, ["PADROES", "ROBUSTEZ"], {
      indice: `${prancha("padroes")} · Padrões de assentamento`,
      titulo: "O terreno pesa mais que o mercado",
      linha: "A ideia clássica é que as pessoas se instalam perto do mercado. Em Arrakis isso não se confirma. O teste foi refeito com dezenove recortes diferentes do território, e o resultado se manteve em todos.",
      figura: ["arrakis_padroes.webp", "Quatro testes sobre onde ficam os assentamentos, todos com dados medidos no mapa: preferência por tipo de terreno, distância ao vizinho mais próximo, agrupamento em várias escalas (função L de Ripley) e uma regressão de Poisson."],
    }),
  },
  {
    id: "acessibilidade", plac: plac("acessibilidade"), titulo: "Dois Arrakis",
    monta: (a) => paginaDoc(a, ["ACESSIBILIDADE"], {
      indice: `${prancha("acessibilidade")} · Custo de travessia`,
      titulo: "Duas geografias sobre o mesmo território",
      linha: "Medir o planeta pelo esforço de atravessá-lo, e não em quilômetros, já muda o mapa. Muda outra vez quando quem atravessa é um fremen e não uma tropa do Império. Os dois mapas quase não se parecem.",
      figura: ["arrakis_dois_arrakis.webp", "O custo de chegar a cada ponto, para o Império e para os fremen, sobre o mesmo terreno. A única diferença é quanto cada tipo de chão atrasa cada um. Correlação entre os dois mapas: 0,09."],
    }),
  },
  {
    id: "poder", plac: plac("poder"), titulo: "Soberania e controle",
    monta: (a) => paginaDoc(a, ["PODER"], {
      indice: `${prancha("poder")} · Geografia política`,
      titulo: "Quem manda no chão",
      linha: "Por decreto do Imperador, Arrakis é um feudo só, entregue a uma Casa. Na prática, quatro poderes dividem o território, e mais da metade da especiaria sai de terra que nenhum deles administra.",
      spoiler: { desde: "em cada livro", ate: "No QGIS",
        aviso: "A próxima seção diz quem governa Arrakis em cada um dos seis livros, até o fim da saga. É spoiler de tudo." },
      figura: ["arrakis_soberania_x_controle.webp", "À esquerda, quem é dono no papel. À direita, quem controla de fato, decidido pelo tipo de assentamento que existe em cada distrito."],
    }),
  },
  { id: "economia", plac: plac("economia"), titulo: "A economia da especiaria", monta: economia },
  { id: "agua", plac: plac("agua"), titulo: "A economia da água", monta: agua },
  {
    id: "comparacao", plac: plac("comparacao"), titulo: "Na régua do mundo real",
    monta: (a) => paginaDoc(a, ["COMPARACAO"], {
      indice: `${prancha("comparacao")} · Comparação`,
      titulo: "Arrakis na régua do mundo real",
      linha: "Seis indicadores de Arrakis ao lado de números reais do IBGE, da UNCTAD e do IISD. Em cada par fica dito se o valor de Arrakis foi medido no mapa ou saiu do modelo.",
      figura: ["arrakis_regua_real.webp", "Cada barra põe um número de Arrakis ao lado de uma referência real. Quando o de Arrakis vem do modelo, está marcado."],
    }),
  },
  {
    id: "contradicoes", plac: plac("contradicoes"), titulo: "Contradições do cânone", secao: "A oficina",
    monta: (a) => paginaDoc(a, ["CONTRADICOES"], {
      indice: `${prancha("contradicoes")} · Conflitos na fonte`,
      titulo: "Oito lugares onde o cânone não fecha",
      linha: "Em oito pontos, os livros dão números que não podem estar certos ao mesmo tempo. Para cada um estão as duas frases, a conta que mostra o choque e a escolha que o atlas fez.",
    }),
  },
  { id: "metodo", plac: plac("metodo"), titulo: "Dado ou modelo", monta: metodo },
  { id: "glossario", plac: plac("glossario"), titulo: "Glossário", monta: glossario },
  { id: "fontes", plac: plac("fontes"), titulo: "Fontes e créditos", monta: fontes },
];

const app = document.getElementById("app")!;


/* O índice deixou de ser coluna. Uma coluna fixa de 248 px com doze entradas
 * pedia ao leitor que decidisse para onde ir antes de ver qualquer coisa; o
 * cabeçalho oferece só as portas que quase todo mundo quer (o mapa, as
 * regiões, o verme, a vida no deserto) e guarda o sumário inteiro atrás de "Índice".
 *
 * A faixa do cabeçalho é uma crista de duna ao entardecer (ilustração gerada,
 * creditada na prancha 13). Na abertura ele fica transparente, por cima do
 * espaço escuro onde o planeta gira. */
const ATALHOS: [string, string][] = [["mapa", "Mapa"], ["regioes", "Regiões"], ["verme", "O verme"], ["vida", "Vida"]];

function cabecalhoHTML(): string {
  let secao = "";
  const grupos: { secao: string; rotas: Rota[] }[] = [];
  for (const r of ROTAS) {
    if (r.secao && r.secao !== secao) { secao = r.secao; grupos.push({ secao, rotas: [] }); }
    grupos[grupos.length - 1].rotas.push(r);
  }
  return `<header class="cabecalho-site">
    <a class="marca-topo" href="#/"><span class="nome">Atlas de Arrakis</span></a>
    <nav class="atalhos" aria-label="Principal">
      ${ATALHOS.map(([id, t]) => `<a href="#/${id}">${t}</a>`).join("")}
    </nav>
    <button class="abre-indice" type="button" aria-expanded="false" aria-controls="sumario">
      <span>Índice</span><i aria-hidden="true"></i>
    </button>
  </header>
  <div class="sumario" id="sumario" role="dialog" aria-modal="true" aria-label="Índice de pranchas" hidden>
    <div class="sumario-topo">
      <span class="nome">Atlas de Arrakis</span>
      <button class="fecha-sumario" type="button">Fechar</button>
    </div>
    <nav class="sumario-grupos">
      ${grupos.map((g) => `<section>
        <h2>${esc(g.secao)}</h2>
        <ol>${g.rotas.map((r) => `<li><a href="#/${r.id}">
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
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecha(); });
  window.addEventListener("hashchange", () => fecha(false));
}

function marcaAtual(id: string) {
  app.querySelectorAll<HTMLAnchorElement>(".cabecalho-site a, .sumario a").forEach((a) => {
    if (a.getAttribute("href") === `#/${id}`) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

let atualId: string | null = null;

async function navega() {
  // "#/mapa#=AR-20" -> "mapa": o sufixo #= e' o distrito a abrir na prancha
  const id = (location.hash.replace(/^#\/?/, "").split(/[?#]/)[0] || "").trim();
  const rota = ROTAS.find((r) => r.id === id) ?? ROTAS[0];
  const recarregaCasca = atualId === null;
  atualId = rota.id;

  if (recarregaCasca) {
    app.innerHTML = `${cabecalhoHTML()}<main id="conteudo"></main>`;
    ligaIndice();
  }
  marcaAtual(rota.id);

  // Na prancha o cabeçalho sai de cena: a folha tem UMA margem, e nela cabem
  // título, controles e legenda.
  app.className = rota.cheia ? "casca cheia" : rota.id === "" ? "casca na-orbita" : "casca";

  const main = app.querySelector("main") as HTMLElement;
  main.innerHTML = "";
  main.dataset.pagina = rota.id || "abertura";
  document.title = rota.id
    ? `${rota.titulo} — Atlas de Arrakis`
    : "Atlas de Arrakis — geografia econômica de um planeta inventado";
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

window.addEventListener("hashchange", navega);
fontesProntas.then(navega);
