import "./atalhos-internos.css";
import { rota, t } from "./i18n";

type PaginaComAtalhos = "contradicoes" | "fontes" | "glossario";

const codigoContradicao = /^C([1-8])$/i;

function textoSemMarcador(titulo: HTMLElement): string {
  const copia = titulo.cloneNode(true) as HTMLElement;
  copia.querySelector(".g")?.remove();
  return copia.textContent?.trim() ?? "";
}

function preparaAlvo(elemento: HTMLElement, id: string) {
  elemento.id = id;
  elemento.classList.add("alvo-interno");
  elemento.tabIndex = -1;
}

function vaiPara(main: HTMLElement, pagina: PaginaComAtalhos, id: string, suave = true) {
  const alvo = document.getElementById(id);
  if (!alvo || !main.contains(alvo)) return;

  const endereco = rota(`${pagina}#=${encodeURIComponent(id)}`);
  history.replaceState(history.state, "", endereco);
  alvo.focus({ preventScroll: true });
  alvo.scrollIntoView({
    block: "start",
    behavior: suave && !matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "auto",
  });
}

function ligaLink(
  link: HTMLAnchorElement,
  main: HTMLElement,
  pagina: PaginaComAtalhos,
  id: string,
) {
  link.href = rota(`${pagina}#=${encodeURIComponent(id)}`);
  link.dataset.alvoInterno = id;
  link.addEventListener("click", (evento) => {
    if (evento.button !== 0 || evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey) return;
    evento.preventDefault();
    vaiPara(main, pagina, id);
  });
}

function linkComTexto(texto: string, classe = ""): HTMLAnchorElement {
  const link = document.createElement("a");
  link.className = classe;
  link.textContent = texto;
  return link;
}

function montaContradicoes(main: HTMLElement) {
  const corpo = main.querySelector<HTMLElement>(".corpo");
  if (!corpo) return;

  const alvos = new Map<string, string>();
  corpo.querySelectorAll<HTMLElement>(":scope > h2").forEach((titulo) => {
    const codigo = titulo.querySelector<HTMLElement>(".g")?.textContent?.trim().toUpperCase() ?? "";
    if (!codigoContradicao.test(codigo)) return;
    const id = `contradicao-${codigo.toLowerCase()}`;
    preparaAlvo(titulo, id);
    alvos.set(codigo, id);
  });

  const tabelas = [...corpo.querySelectorAll<HTMLTableElement>("table")];
  const resumo = tabelas.find((tabela) => {
    const codigos = [...tabela.tBodies[0]?.rows ?? []]
      .map((linha) => linha.cells[0]?.textContent?.trim().toUpperCase() ?? "")
      .filter((codigo) => codigoContradicao.test(codigo));
    return codigos.length === 8;
  });
  if (!resumo) return;

  const moldura = resumo.closest<HTMLElement>(".tabela");
  moldura?.classList.add("tabela-indice-contradicoes");
  resumo.setAttribute("aria-label", t("Índice das oito contradições", "Index of the eight contradictions"));

  [...resumo.tBodies[0].rows].forEach((linha) => {
    const codigo = linha.cells[0]?.textContent?.trim().toUpperCase() ?? "";
    const id = alvos.get(codigo);
    if (!id) return;

    linha.dataset.alvoInterno = id;
    const celulaCodigo = linha.cells[0];
    const celulaTitulo = linha.cells[1];
    const linkCodigo = linkComTexto(codigo, "atalho-contradicao-codigo");
    ligaLink(linkCodigo, main, "contradicoes", id);
    celulaCodigo.replaceChildren(linkCodigo);

    if (celulaTitulo) {
      const linkTitulo = linkComTexto(celulaTitulo.textContent?.trim() ?? "", "atalho-contradicao-titulo");
      ligaLink(linkTitulo, main, "contradicoes", id);
      celulaTitulo.replaceChildren(linkTitulo);
    }

    linha.addEventListener("click", (evento) => {
      if ((evento.target as HTMLElement).closest("a")) return;
      vaiPara(main, "contradicoes", id);
    });
  });
}

function criaIndice(main: HTMLElement, titulos: HTMLElement[], pagina: "fontes"): HTMLElement {
  const nav = document.createElement("nav");
  nav.className = "atalhos-internos atalhos-internos--secoes";
  nav.setAttribute("aria-label", t("Nesta página", "On this page"));

  const rotulo = document.createElement("div");
  rotulo.className = "atalhos-internos__rotulo";
  rotulo.textContent = t("Nesta página", "On this page");
  nav.append(rotulo);

  const lista = document.createElement("ol");
  lista.className = "atalhos-internos__lista";
  titulos.forEach((titulo, indice) => {
    const numero = titulo.querySelector<HTMLElement>(".g")?.textContent?.trim() || String(indice + 1).padStart(2, "0");
    const item = document.createElement("li");
    const link = document.createElement("a");
    const marcador = document.createElement("span");
    marcador.textContent = numero;
    const nome = document.createElement("b");
    nome.textContent = textoSemMarcador(titulo);
    link.append(marcador, nome);
    ligaLink(link, main, pagina, titulo.id);
    item.append(link);
    lista.append(item);
  });
  nav.append(lista);
  return nav;
}

function montaFontes(main: HTMLElement) {
  const corpo = main.querySelector<HTMLElement>(".corpo");
  if (!corpo) return;
  // Os documentos incorporados nesta página também trazem alguns h2. O
  // marcador `.g` distingue as sete seções editoriais principais desses
  // subtítulos internos.
  const titulos = [...corpo.querySelectorAll<HTMLElement>(":scope > h2")]
    .filter((titulo) => titulo.querySelector(".g"));
  if (!titulos.length) return;

  titulos.forEach((titulo, indice) => preparaAlvo(titulo, `fontes-${indice + 1}`));
  const indice = criaIndice(main, titulos, "fontes");

  // A introdução está no cabeçalho editorial; o índice abre o corpo antes da
  // primeira seção, sem retirar ou recolher nenhum trecho da página.
  corpo.prepend(indice);
}

function montaGlossario(main: HTMLElement) {
  const corpo = main.querySelector<HTMLElement>(".corpo");
  if (!corpo) return;
  const secoes = [...corpo.querySelectorAll<HTMLElement>(":scope > .letra")];
  if (!secoes.length) return;

  const nav = document.createElement("nav");
  nav.className = "atalhos-internos atalhos-internos--letras";
  nav.setAttribute("aria-label", t("Índice alfabético", "Alphabetical index"));
  const rotulo = document.createElement("div");
  rotulo.className = "atalhos-internos__rotulo";
  rotulo.textContent = t("Ir para a letra", "Go to letter");
  const lista = document.createElement("div");
  lista.className = "atalhos-internos__lista";

  secoes.forEach((secao) => {
    const letra = secao.querySelector<HTMLElement>(".letra-l")?.textContent?.trim() ?? "";
    if (!letra) return;
    const normalizada = letra.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const id = `glossario-${normalizada}`;
    preparaAlvo(secao, id);
    const link = linkComTexto(letra);
    link.setAttribute("aria-label", t(`Ir para a letra ${letra}`, `Go to letter ${letra}`));
    ligaLink(link, main, "glossario", id);
    lista.append(link);
  });

  nav.append(rotulo, lista);
  const nota = corpo.querySelector(":scope > .nota");
  nota?.insertAdjacentElement("afterend", nav);
  if (!nota) corpo.prepend(nav);
}

function restauraAlvoDaUrl(main: HTMLElement) {
  const marcador = location.hash.match(/#=([^&]+)/)?.[1];
  if (!marcador) return;
  let id = marcador;
  try { id = decodeURIComponent(marcador); } catch { /* mantém o valor literal */ }
  requestAnimationFrame(() => vaiPara(main, main.dataset.pagina as PaginaComAtalhos, id, false));
}

/** Acrescenta navegação local às três leituras mais longas do atlas. */
export function ligaAtalhosInternos(main: HTMLElement, idAtual: string) {
  if (main.dataset.atalhosInternos === idAtual) return;
  if (idAtual === "contradicoes") montaContradicoes(main);
  else if (idAtual === "fontes") montaFontes(main);
  else if (idAtual === "glossario") montaGlossario(main);
  else return;

  main.dataset.atalhosInternos = idAtual;
  restauraAlvoDaUrl(main);
}
