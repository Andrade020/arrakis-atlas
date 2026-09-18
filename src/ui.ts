import { emIngles, localidade, t } from "./i18n";
// Pecas de interface compartilhadas e o desenhista dos blocos que
// scripts/30_exportar_web.py extraiu dos documentos do projeto.

import type { Bloco } from "./dados";

export function esc(s: unknown): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}

/** Enfase de markdown -> html. Nao e' um parser: e' a lista curta do que os
    nossos geradores realmente usam. */
export function linha(s: string): string {
  return esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*]+)\*/g, "$1<em>$2</em>")
    // link entre documentos do projeto (CONTRADICOES.md#c1...) vira a prancha
    .replace(/\[([^\]]+)\]\(CONTRADICOES\.md[^)]*\)/g, '<a class="link" href="#/contradicoes">$1</a>')
    .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g,
             '<a class="link" href="$2" target="_blank" rel="noopener">$1</a>');
}

const NUMERICO = /^[-+]?[\d.,]+(\s?(%|×|x|km|m|t|ha|°))?$/;

export function blocos(bs: Bloco[], opc: { pularAte?: number } = {}): string {
  const out: string[] = [];
  let i = 0;
  // Os documentos comecam com titulo, linha de geracao e um paragrafo de
  // abertura que a pagina ja' reescreveu no seu proprio cabecalho. `pularAte`
  // diz quantos blocos do inicio a pagina assume para si.
  if (opc.pularAte) i = Math.min(opc.pularAte, bs.length);
  for (; i < bs.length; i++) {
    const b = bs[i];
    switch (b.t) {
      case "h": {
        const n = Math.min(Math.max(b.n, 2), 4);
        const m = b.x.match(/^(C\d+|§?\d+(\.\d+)?)\s*[—-]\s*(.*)$/);
        if (n === 2 && m) {
          out.push(`<h2 id="${esc(slug(b.x))}"><span class="g">${esc(m[1])}</span>` +
                   `<span>${linha(m[3])}</span></h2>`);
        } else {
          out.push(`<h${n} id="${esc(slug(b.x))}">${linha(b.x)}</h${n}>`);
        }
        break;
      }
      case "p": {
        // paragrafo que e' so' uma imagem de markdown: a figura ja' e' montada
        // pela propria pagina, com legenda desenhada.
        if (/^!\[[^\]]*\]\([^)]+\)$/.test(b.x)) break;
        out.push(`<p>${linha(b.x)}</p>`);
        break;
      }
      case "hr": break;   // a regra do markdown vira o fio do proprio <h2>
      case "ul": out.push("<ul>" + b.itens.map((x) => `<li>${linha(x)}</li>`).join("") + "</ul>"); break;
      case "cit": {
        const f = linha(b.fonte);
        out.push(`<figure class="citacao"><blockquote>${linha(b.x)}</blockquote>` +
                 (b.fonte ? `<figcaption class="fonte">${f}</figcaption>` : "") +
                 `</figure>`);
        break;
      }
      case "tab": {
        const cab = b.cab.map((c, j) => {
          const num = b.lin.some((l) => NUMERICO.test((l[j] ?? "").replace(/\*/g, "")));
          return `<th class="${num ? "num" : ""}">${linha(c)}</th>`;
        }).join("");
        const corpo = b.lin.map((l) =>
          "<tr>" + l.map((c) => {
            const num = NUMERICO.test(c.replace(/\*/g, ""));
            return `<td class="${num ? "num" : ""}">${linha(c)}</td>`;
          }).join("") + "</tr>").join("");
        out.push(`<div class="tabela"><table><thead><tr>${cab}</tr></thead><tbody>${corpo}</tbody></table></div>`);
        break;
      }
    }
  }
  return out.join("\n");
}

export function slug(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);
}

const CLASSES_PROC_PT: Record<string, string> = {
  CANONE_FH: "Cânone (Frank Herbert)",
  CANONE_BHKJA: "Cânone estendido (Brian Herbert & K. J. Anderson)",
  DEDUZIDO: "Deduzido do mapa ou do cânone",
  MODELO_DERIVADO: "Modelo derivado",
  SIMULADO: "Simulado por nós",
  EXTERNO_NAO_CANONE: "Externo, não canônico",
  DADO_REAL: "Dado do mundo real",
  ILUSTRACAO_IA: "Ilustração gerada por IA",
};
const CLASSES_PROC_EN: Record<string, string> = {
  CANONE_FH: "Canon (Frank Herbert)",
  CANONE_BHKJA: "Extended canon (Brian Herbert & K. J. Anderson)",
  DEDUZIDO: "Derived from the map or the books",
  MODELO_DERIVADO: "Derived model",
  SIMULADO: "Simulated by us",
  EXTERNO_NAO_CANONE: "External, not canon",
  DADO_REAL: "Real-world data",
  ILUSTRACAO_IA: "AI-generated illustration",
};
export const CLASSES_PROC = new Proxy({} as Record<string, string>, {
  get: (_, k: string) => (emIngles() ? CLASSES_PROC_EN : CLASSES_PROC_PT)[k],
});

export function selo(classe: string, texto?: string): string {
  return `<span class="selo-proc p-${esc(classe)}">${esc(texto ?? CLASSES_PROC[classe] ?? classe)}</span>`;
}

export function cabecalho(indice: string, titulo: string, linhaFina: string): string {
  return `<header class="cabecalho-folha">
    <div class="indice">${esc(indice)}</div>
    <h1>${titulo}</h1>
    <p class="linha-fina">${linhaFina}</p>
  </header>`;
}

/* Uma linha, em todas as páginas. O rodapé de quatro colunas repetia crédito,
 * fonte, método e aviso — tudo isso tem página própria em Fontes e créditos. */
export function rodape(): string {
  return `<footer class="rodape-fino">${t(
    `Base cartográfica: <strong>NiptonIceTea</strong>, segundo de Fontaine (1965).
    Fonte: HERBERT, Frank. <em>Dune</em>, 1965–1985. Projeto de estudo, sem vínculo
    com os detentores dos direitos. <a href="#/fontes">Fontes e método →</a>`,
    `Base map: <strong>NiptonIceTea</strong>, after de Fontaine (1965).
    Source: HERBERT, Frank. <em>Dune</em>, 1965–1985. A study project with no link
    to the rights holders. <a href="#/fontes">Sources and method →</a>`)}
  </footer>`;
}

/** Tabela ordenavel, usada no indice de distritos. */
export function ligaOrdenacao(tabela: HTMLTableElement) {
  const corpo = tabela.tBodies[0];
  let ultima = -1, asc = false;
  tabela.querySelectorAll("th").forEach((th, i) => {
    th.style.cursor = "pointer";
    th.addEventListener("click", () => {
      asc = ultima === i ? !asc : (th.classList.contains("num") ? false : true);
      ultima = i;
      const linhas = [...corpo.rows];
      linhas.sort((a, b) => {
        const x = a.cells[i]?.dataset.v ?? a.cells[i]?.textContent ?? "";
        const y = b.cells[i]?.dataset.v ?? b.cells[i]?.textContent ?? "";
        const nx = parseFloat(x), ny = parseFloat(y);
        const cmp = (!Number.isNaN(nx) && !Number.isNaN(ny))
          ? nx - ny : x.localeCompare(y, localidade());
        return asc ? cmp : -cmp;
      });
      linhas.forEach((l) => corpo.appendChild(l));
      tabela.querySelectorAll("th").forEach((o) => o.removeAttribute("aria-sort"));
      th.setAttribute("aria-sort", asc ? "ascending" : "descending");
    });
  });
}


/** Liga os spoilers de uma página: `.spoiler` com `.olho` e `.ev-texto`.
 *  O texto fica borrado (CSS) e escondido de leitor de tela até o clique. */
export function ligaSpoilers(raiz: HTMLElement) {
  raiz.querySelectorAll<HTMLElement>(".spoiler").forEach((ev) => {
    const botao = ev.querySelector<HTMLButtonElement>(".olho");
    const texto = ev.querySelector<HTMLElement>(".ev-texto");
    if (!botao || !texto) return;
    const alterna = () => {
      const aberto = ev.classList.toggle("revelado");
      botao.setAttribute("aria-pressed", String(aberto));
      botao.setAttribute("aria-label", (aberto ? "Esconder" : "Revelar") + " spoiler");
      texto.setAttribute("aria-hidden", String(!aberto));
    };
    botao.addEventListener("click", alterna);
    texto.addEventListener("click", () => { if (!ev.classList.contains("revelado")) alterna(); });
  });
}
