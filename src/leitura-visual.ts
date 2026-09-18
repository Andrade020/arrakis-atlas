import "./leitura-visual.css";

/**
 * Recursos de leitura para material que perde legibilidade em telas pequenas.
 *
 * A funcao e deliberadamente independente do roteador: recebe o <main> que
 * acabou de ser montado, melhora figuras e tabelas presentes (ou inseridas
 * depois) e devolve uma funcao de limpeza para quem quiser encerrar tudo antes
 * de trocar a pagina.
 */

const emIngles = () => document.documentElement.lang.toLowerCase().startsWith("en");

const textos = () => emIngles() ? {
  abrir: "Open figure",
  titulo: "Expanded figure",
  fechar: "Close",
  tamanho: "Actual size",
  ajustar: "Fit to screen",
  tabela: "Scrollable table",
  deslize: "Swipe to see \u2192",
} : {
  abrir: "Ampliar figura",
  titulo: "Figura ampliada",
  fechar: "Fechar",
  tamanho: "Tamanho real",
  ajustar: "Ajustar \u00e0 tela",
  tabela: "Tabela com rolagem horizontal",
  deslize: "Deslize para ver \u2192",
};

function imagemDecorativa(imagem: HTMLImageElement): boolean {
  return !imagem.alt.trim()
    || imagem.getAttribute("role") === "presentation"
    || imagem.getAttribute("aria-hidden") === "true"
    || imagem.hasAttribute("data-sem-ampliacao");
}

/** Melhora figuras analiticas e tabelas largas contidas em `main`. */
export function ligaLeituraVisual(main: HTMLElement): () => void {
  const controlador = new AbortController();
  const { signal } = controlador;
  const tabelas = new Set<HTMLElement>();
  let devolveFoco: HTMLElement | null = null;

  const dialogo = document.createElement("dialog");
  dialogo.className = "leitura-visual-dialogo";
  dialogo.setAttribute("aria-labelledby", "leitura-visual-titulo");
  dialogo.innerHTML = `
    <div class="leitura-visual-painel">
      <header class="leitura-visual-topo">
        <h2 id="leitura-visual-titulo"></h2>
        <div class="leitura-visual-acoes">
          <button class="leitura-visual-tamanho" type="button" aria-pressed="false"></button>
          <button class="leitura-visual-fechar" type="button"></button>
        </div>
      </header>
      <div class="leitura-visual-janela">
        <img class="leitura-visual-imagem" alt="" />
      </div>
      <p class="leitura-visual-legenda"></p>
    </div>`;

  const titulo = dialogo.querySelector<HTMLElement>("#leitura-visual-titulo")!;
  const botaoTamanho = dialogo.querySelector<HTMLButtonElement>(".leitura-visual-tamanho")!;
  const botaoFechar = dialogo.querySelector<HTMLButtonElement>(".leitura-visual-fechar")!;
  const janela = dialogo.querySelector<HTMLElement>(".leitura-visual-janela")!;
  const imagemAmpliada = dialogo.querySelector<HTMLImageElement>(".leitura-visual-imagem")!;
  const legenda = dialogo.querySelector<HTMLElement>(".leitura-visual-legenda")!;

  const traduzDialogo = () => {
    const tx = textos();
    titulo.textContent = tx.titulo;
    botaoFechar.textContent = tx.fechar;
    botaoTamanho.textContent = dialogo.classList.contains("em-tamanho-real") ? tx.ajustar : tx.tamanho;
  };

  const ajustaControleTamanho = () => {
    const excede = imagemAmpliada.naturalWidth > janela.clientWidth + 1
      || imagemAmpliada.naturalHeight > janela.clientHeight + 1;
    botaoTamanho.hidden = !excede;
    if (!excede) {
      dialogo.classList.remove("em-tamanho-real");
      botaoTamanho.setAttribute("aria-pressed", "false");
      janela.scrollTo(0, 0);
    }
    traduzDialogo();
  };

  const fecha = () => {
    if (dialogo.open) dialogo.close();
  };

  const abre = (origem: HTMLButtonElement, imagem: HTMLImageElement) => {
    const tx = textos();
    const descricao = imagem.alt.trim();
    const figcaption = imagem.closest("figure")?.querySelector("figcaption")?.textContent?.trim();
    const textoLegenda = figcaption || descricao;

    devolveFoco = origem;
    dialogo.classList.remove("em-tamanho-real");
    botaoTamanho.setAttribute("aria-pressed", "false");
    botaoTamanho.hidden = false;
    janela.scrollTo(0, 0);
    imagemAmpliada.src = imagem.currentSrc || imagem.src;
    imagemAmpliada.alt = textoLegenda === descricao ? "" : descricao;
    legenda.textContent = textoLegenda;
    legenda.hidden = !textoLegenda;
    titulo.textContent = tx.titulo;
    botaoFechar.textContent = tx.fechar;
    botaoTamanho.textContent = tx.tamanho;
    document.documentElement.classList.add("leitura-visual-ativa");
    dialogo.showModal();
    botaoFechar.focus();
    requestAnimationFrame(ajustaControleTamanho);
  };

  botaoFechar.addEventListener("click", fecha, { signal });
  botaoTamanho.addEventListener("click", () => {
    const ativo = dialogo.classList.toggle("em-tamanho-real");
    botaoTamanho.setAttribute("aria-pressed", String(ativo));
    janela.scrollTo(0, 0);
    traduzDialogo();
  }, { signal });
  imagemAmpliada.addEventListener("load", ajustaControleTamanho, { signal });
  imagemAmpliada.addEventListener("dblclick", () => botaoTamanho.click(), { signal });
  dialogo.addEventListener("click", (evento) => {
    if (evento.target === dialogo) fecha();
  }, { signal });
  dialogo.addEventListener("close", () => {
    document.documentElement.classList.remove("leitura-visual-ativa");
    imagemAmpliada.removeAttribute("src");
    dialogo.classList.remove("em-tamanho-real");
    if (devolveFoco?.isConnected) devolveFoco.focus();
    devolveFoco = null;
  }, { signal });
  dialogo.addEventListener("cancel", () => {
    // O navegador fecha o dialogo ao receber Escape; o evento `close` faz o
    // restante da limpeza e devolve o foco ao controle que o abriu.
  }, { signal });

  const melhoraFigura = (figura: HTMLElement) => {
    if (figura.dataset.leituraVisual === "pronta") return;
    const imagem = figura.querySelector<HTMLImageElement>(":scope > img");
    if (!imagem || imagemDecorativa(imagem) || imagem.closest("button, a")) return;

    figura.dataset.leituraVisual = "pronta";
    const botao = document.createElement("button");
    botao.className = "leitura-visual-abrir";
    botao.type = "button";
    botao.setAttribute("aria-haspopup", "dialog");
    const instrucao = document.createElement("span");
    instrucao.className = "leitura-visual-sr";
    instrucao.textContent = ` \u2014 ${textos().abrir}`;
    imagem.replaceWith(botao);
    botao.append(imagem, instrucao);
    botao.addEventListener("click", () => abre(botao, imagem), { signal });
  };

  const medeTabela = (tabela: HTMLElement) => {
    const moldura = tabela.parentElement;
    if (!moldura?.classList.contains("tabela-moldura")) return;
    const estreita = matchMedia("(max-width: 720px)").matches;
    const temRolagem = estreita && tabela.scrollWidth > tabela.clientWidth + 2;
    moldura.classList.toggle("tem-rolagem", temRolagem);
    if (temRolagem) {
      tabela.tabIndex = 0;
      tabela.setAttribute("role", "region");
      tabela.setAttribute("aria-label", textos().tabela);
    } else {
      tabela.removeAttribute("tabindex");
      tabela.removeAttribute("role");
      tabela.removeAttribute("aria-label");
    }
  };

  const observadorTamanho = new ResizeObserver((entradas) => {
    for (const entrada of entradas) medeTabela(entrada.target as HTMLElement);
  });

  const melhoraTabela = (tabela: HTMLElement) => {
    if (tabela.dataset.leituraVisual === "pronta") return;
    tabela.dataset.leituraVisual = "pronta";
    const moldura = document.createElement("div");
    moldura.className = "tabela-moldura";
    const dica = document.createElement("span");
    dica.className = "tabela-deslize";
    dica.setAttribute("aria-hidden", "true");
    dica.textContent = textos().deslize;
    tabela.before(moldura);
    moldura.append(tabela, dica);
    tabelas.add(tabela);
    observadorTamanho.observe(tabela);
    tabela.addEventListener("scroll", () => {
      if (Math.abs(tabela.scrollLeft) > 6) moldura.classList.add("rolada");
    }, { passive: true, signal });
    requestAnimationFrame(() => medeTabela(tabela));
  };

  const melhora = (raiz: ParentNode) => {
    if (raiz instanceof HTMLElement && raiz.matches("figure.figura")) melhoraFigura(raiz);
    if (raiz instanceof HTMLElement && raiz.matches(".tabela")) melhoraTabela(raiz);
    raiz.querySelectorAll<HTMLElement>("figure.figura").forEach(melhoraFigura);
    raiz.querySelectorAll<HTMLElement>(".tabela").forEach(melhoraTabela);
  };

  main.append(dialogo);
  melhora(main);

  const observador = new MutationObserver((mutacoes) => {
    for (const mutacao of mutacoes) {
      for (const no of mutacao.addedNodes) {
        if (no instanceof HTMLElement) melhora(no);
      }
    }
  });
  observador.observe(main, { childList: true, subtree: true });

  const aoRedimensionar = () => {
    for (const tabela of tabelas) medeTabela(tabela);
    if (dialogo.open) ajustaControleTamanho();
  };
  window.addEventListener("resize", aoRedimensionar, { passive: true, signal });

  const limpa = () => {
    observador.disconnect();
    observadorTamanho.disconnect();
    controlador.abort();
    if (dialogo.open) dialogo.close();
    dialogo.remove();
    document.documentElement.classList.remove("leitura-visual-ativa");
  };
  return limpa;
}
