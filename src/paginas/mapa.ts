import {
  atlas, distritos, rotulos, assentamentos, rasters, mundo, proveniencia, tabelas,
  type Distrito, type Proc, type CamadaRaster,
} from "../dados";
import { Mapa, type EstadoMapa } from "../mapa";
import { CAMPOS, coropletos, grupos as gruposCampos, formata } from "../campos";
import { esc, selo } from "../ui";
import { ligaRastros, procParaCampo, rastroBotaoHTML, rastroHTML } from "../rastro";
import { t, emIngles, localidade, nomeLivro, localCitacao } from "../i18n";
import { PERCURSOS, type PassoPercurso } from "../percursos";

const camadas = (): [string, string][] => [
  ["distritos", t("Limites distritais", "District borders")],
  ["rotulos", t("Topônimos", "Place names")],
  ["assentamentos", t("Assentamentos", "Settlements")],
  ["grade", t("Grade de coordenadas", "Coordinate grid")],
  ["regioes", t("Regiões", "Regions")],
  ["poder", t("Esferas de controle", "Spheres of control")],
  ["rede_imperial", t("Rede imperial", "Imperial network")],
  ["rede_fremen", t("Rede fremen", "Fremen network")],
];

/* Os quatro glifos que o mapa desenha, repetidos em SVG para a legenda. Um
   mapa que distingue quatro tipos de assentamento e nao os legenda esta'
   escondendo a parte mais densa da sua propria informacao. */
const T = "#3A2B18";
const GLIFOS: Record<string, string> = {
  capital: `<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.4" fill="none" stroke="${T}" stroke-width="1.3"/><circle cx="8" cy="8" r="2.6" fill="${T}"/></svg>`,
  sietch: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 4.4 11.6 8 8 11.6 4.4 8Z" fill="${T}"/></svg>`,
  pyon: `<svg width="16" height="16" viewBox="0 0 16 16"><rect x="5.2" y="5.2" width="5.6" height="5.6" fill="none" stroke="${T}" stroke-width="1.1"/></svg>`,
  botanica: `<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="9" r="2.8" fill="none" stroke="${T}" stroke-width="1.1"/><path d="M8 6.2V2.8" stroke="${T}" stroke-width="1.1"/></svg>`,
};

/* Rotulo curto da classe de procedencia, para caber na legenda da prancha. */
const curta = (): Record<string, string> => ({
  CANONE_FH: t("Cânone de Frank Herbert", "Frank Herbert canon"),
  DEDUZIDO: t("Deduzido do mapa", "Derived from the map"),
  MODELO_DERIVADO: t("Modelo derivado", "Derived model"),
  SIMULADO: t("Simulado por nós", "Simulated by us"),
  EXTERNO_NAO_CANONE: t("Fora do cânone", "Outside the canon"),
  DADO_REAL: t("Dado do mundo real", "Real-world data"),
});

const superficies = (): [string, string][] => [
  ["relevo", t("Terreno", "Terrain")],
  ["elevacao", t("Elevação", "Elevation")],
  ["custo_imperial", t("Custo de travessia · Império", "Crossing cost · Empire")],
  ["custo_fremen", t("Custo de travessia · fremen", "Crossing cost · Fremen")],
  ["densidade", t("Densidade de assentamento", "Settlement density")],
  ["", t("Sem superfície", "No surface")],
];

/* Títulos e classes das superfícies, que vêm dos dados em português. */
const RASTER_EN: Record<string, string> = {
  "Classes de terreno": "Terrain classes", "Bacia / chapada clara": "Basin / light flat",
  "Erg aberto": "Open erg", "Terreno rochoso": "Rocky ground", "Rocha elevada": "High rock",
  "Crista / pico": "Ridge / peak", "Elevação modelada": "Modelled elevation",
  "Custo de travessia — Império": "Crossing cost — Empire", "Custo de travessia — fremen": "Crossing cost — Fremen",
  "Densidade de assentamento": "Settlement density",
};
const rasterTxt = (s: string) => (emIngles() ? (RASTER_EN[s] ?? s) : s);

const estadoEpoca = (v: string) => emIngles()
  ? ({ retratado: "as depicted", transformado: "transformed", destruido: "destroyed", renomeado: "renamed",
       sem_informacao: "no information" } as Record<string, string>)[v] ?? v.replace(/_/g, " ")
  : v.replace(/_/g, " ");

export async function paginaMapa(alvo: HTMLElement) {
  alvo.innerHTML = `<div class="mapa-tela" id="palco">
    <div class="ctrl" id="ctrl"></div>
    <canvas aria-label="${t("Mapa de Arrakis", "Map of Arrakis")}"></canvas>
    <div class="inspetor" id="inspetor" hidden></div>
    <section class="percurso-painel" id="percurso-painel" hidden aria-label="${t("Percurso guiado", "Guided tour")}"></section>
    <div class="dica" id="dica" hidden></div>
  </div>`;

  const [atl, dist, rots, ass, ras, mun, prov, tabs, citas, eventos] = await Promise.all([
    atlas(), distritos(), rotulos(), assentamentos(), rasters(), mundo(),
    proveniencia(), tabelas(),
    fetch(import.meta.env.BASE_URL + "dados/citacoes.json").then((r) => r.json()),
    fetch(import.meta.env.BASE_URL + "dados/eventos.json").then((r) => r.json()).catch(() => ({})),
  ]);

  const tela = alvo.querySelector("canvas") as HTMLCanvasElement;
  const estado: EstadoMapa = {
    raster: "relevo",
    coropleto: "",
    camadas: new Set(["distritos", "rotulos", "assentamentos", "grade"]),
    selecionado: null,
  };

  const mapa = new Mapa(tela, estado);
  mapa.carrega(atl, dist, rots, ass, ras);
  mapa.cartucho = true;
  mapa.folha = mun.fan;
  // A margem impressa muda com a largura: coluna a esquerda no desktop, faixa
  // no topo no celular — e a moldura da prancha tem de acompanhar.
  function margens() {
    const estreito = tela.getBoundingClientRect().width < 760;
    mapa.margem = estreito ? 12 : 30;
    mapa.margemEsq = estreito ? 12 : 278;
    mapa.recuoCartucho = estreito ? 0 : 248;
  }
  margens();
  mapa.redimensiona();
  mapa.enquadraNoPolo(mun.fan);

  // A primeira medida do canvas acontece antes de a fonte e o painel
  // assentarem; o primeiro aviso do observador e' que traz o tamanho real, e
  // so' nele vale reenquadrar. Depois disso reenquadrar seria desfazer o
  // zoom de quem esta' usando o mapa.
  let primeira = true;
  const ro = new ResizeObserver(() => {
    margens();
    mapa.redimensiona();
    if (primeira) { primeira = false; mapa.enquadraNoPolo(mun.fan); }
  });
  ro.observe(tela);

  const porCod = new Map(dist.map((d) => [d.cod, d]));

  /* A vista compartilhada fica inteiramente no hash: assim ela continua sendo
     uma rota do atlas estatico e nao depende de configuracao no servidor.
     Valores desconhecidos sao descartados antes de chegarem ao renderizador;
     um link antigo, ou escrito a mao, nunca pode deixar a prancha num estado
     que os dados nao sabem desenhar. */
  const camadasValidas = new Set(camadas().map(([k]) => k));
  const rastersValidos = new Set([...superficies().map(([k]) => k), ...Object.keys(ras)]);
  const camposValidos = new Set(coropletos().flatMap((g) => g.campos).filter((c) => Boolean(CAMPOS[c])));
  const camadasPadrao = ["distritos", "rotulos", "assentamentos", "grade"];

  function leVistaDoEndereco() {
    const hash = location.hash;
    const inicio = hash.indexOf("?");
    const fim = hash.indexOf("#=", inicio < 0 ? 0 : inicio);
    const busca = inicio < 0 ? new URLSearchParams() : new URLSearchParams(hash.slice(inicio + 1, fim < 0 ? undefined : fim));
    const raster = busca.get("superficie");
    if (raster === "nenhuma") estado.raster = "";
    else if (raster && rastersValidos.has(raster) && (raster === "" || ras[raster])) estado.raster = raster;

    const campo = busca.get("variavel");
    if (campo && camposValidos.has(campo)) estado.coropleto = campo;

    const listaCamadas = busca.get("camadas");
    if (listaCamadas !== null) {
      const escolhidas = listaCamadas.split(",").filter((c) => camadasValidas.has(c));
      // Uma lista vazia e' uma escolha valida: ela permite compartilhar a
      // carta sem sobreposicoes. Repeticoes nao alteram o resultado.
      estado.camadas = new Set(escolhidas);
    }

    const distrito = hash.match(/#=([^&#]+)/)?.[1];
    if (distrito && porCod.has(distrito)) estado.selecionado = distrito;
  }

  function linkDaVista(): string {
    const busca = new URLSearchParams();
    if (estado.raster === "") busca.set("superficie", "nenhuma");
    else if (estado.raster !== "relevo") busca.set("superficie", estado.raster);
    if (estado.coropleto) busca.set("variavel", estado.coropleto);
    const ativas = camadas().map(([k]) => k).filter((k) => estado.camadas.has(k));
    if (ativas.join(",") !== camadasPadrao.join(",")) busca.set("camadas", ativas.join(","));
    const rotaMapa = `#/${emIngles() ? "en/" : ""}mapa`;
    const sufixo = busca.toString() ? `?${busca}` : "";
    const distrito = estado.selecionado && porCod.has(estado.selecionado) ? `#=${estado.selecionado}` : "";
    return new URL(`${rotaMapa}${sufixo}${distrito}`, location.href).href;
  }

  async function copiaVista() {
    const texto = linkDaVista();
    let copiado = false;
    try {
      await navigator.clipboard.writeText(texto);
      copiado = true;
    } catch {
      const campo = document.createElement("textarea");
      campo.value = texto;
      campo.setAttribute("readonly", "");
      campo.style.position = "fixed";
      campo.style.opacity = "0";
      document.body.append(campo);
      campo.select();
      copiado = document.execCommand("copy");
      campo.remove();
    }
    const retorno = ctrl.querySelector("#link-vista-feedback");
    if (retorno) retorno.textContent = copiado
      ? t("Link copiado.", "Link copied.")
      : t(`Copia indisponível. Link: ${texto}`, `Copy unavailable. Link: ${texto}`);
  }

  leVistaDoEndereco();
  if (estado.coropleto) mapa.classifica(estado.coropleto, procParaCampo(estado.coropleto, prov.campos)?.classe ?? "DEDUZIDO");

  /* ------------------------------------------------------------ controles */
  const ctrl = alvo.querySelector("#ctrl") as HTMLElement;
  let controlesAbertos = false;
  type Camera = typeof mapa.vista;
  let anteriorAoPercurso: { raster: string; coropleto: string; camadas: Set<string>; selecionado: string | null; camera: Camera } | null = null;
  let percursoAtivo: number | null = null;
  let passoAtivo = 0;
  let percursoRecolhido = false;

  function aplicaPasso(p: PassoPercurso) {
    if (!porCod.has(p.cod)) return;
    estado.raster = p.raster;
    estado.coropleto = p.campo;
    estado.camadas = new Set(p.camadas);
    mapa.classifica(p.campo, procParaCampo(p.campo, prov.campos)?.classe ?? "DEDUZIDO");
    // A ficha no celular cobre a carta; o percurso apresenta o lugar em seu
    // painel compacto, enquanto a selecao continua no estado compartilhavel.
    inspetor.hidden = true;
    palco.classList.remove("com-ficha");
    mapa.redimensiona();
    // Cada passo parte do enquadramento da folha. Distritos extensos ganham
    // mais contexto, e centrar outro lugar nao multiplica o zoom anterior.
    mapa.centralizaEm(p.cod, mapa.escalaDeContexto(p.cod, mun.fan), mun.fan);
    pintaControles();
    pintaPercurso();
  }

  function iniciaPercurso(i: number) {
    if (!PERCURSOS[i]) return;
    if (percursoAtivo === null) anteriorAoPercurso = {
      raster: estado.raster, coropleto: estado.coropleto,
      camadas: new Set(estado.camadas), selecionado: estado.selecionado,
      camera: mapa.vista,
    };
    percursoAtivo = i;
    passoAtivo = 0;
    percursoRecolhido = false;
    controlesAbertos = false;
    aplicaPasso(PERCURSOS[i].passos[0]);
    palco.querySelector<HTMLButtonElement>("#percurso-proximo")?.focus();
  }

  function saiPercurso() {
    const salvo = anteriorAoPercurso;
    const ultimoPercurso = percursoAtivo;
    percursoAtivo = null;
    anteriorAoPercurso = null;
    if (salvo) {
      estado.raster = salvo.raster;
      estado.coropleto = salvo.coropleto;
      estado.camadas = new Set(salvo.camadas);
      estado.selecionado = salvo.selecionado;
      mapa.classifica(salvo.coropleto, procParaCampo(salvo.coropleto, prov.campos)?.classe ?? "DEDUZIDO");
      mostra(salvo.selecionado);
      // Reabrir a ficha altera a largura do canvas. Atualizar seu tamanho
      // antes de repor a camera evita que o ResizeObserver desloque a vista.
      mapa.redimensiona();
      const atual = mapa.vista;
      mapa.poeVista(salvo.camera.k,
        salvo.camera.tx + (atual.larg - salvo.camera.larg) / 2,
        salvo.camera.ty + (atual.alt - salvo.camera.alt) / 2);
    }
    pintaControles();
    pintaPercurso();
    const foco = window.matchMedia("(max-width: 760px)").matches
      ? "#abre-percursos" : `[data-percurso="${ultimoPercurso}"]`;
    ctrl.querySelector<HTMLButtonElement>(foco)?.focus();
  }

  function pintaPercurso() {
    const painel = alvo.querySelector<HTMLElement>("#percurso-painel")!;
    if (percursoAtivo === null) { painel.hidden = true; painel.innerHTML = ""; mapa.desenha(); return; }
    const guia = PERCURSOS[percursoAtivo];
    const passo = guia.passos[passoAtivo];
    const nome = emIngles() ? guia.en : guia.pt;
    painel.hidden = false;
    painel.classList.toggle("recolhido", percursoRecolhido);
    painel.innerHTML = `<div class="percurso-etiqueta">${t("Percurso guiado", "Guided tour")}</div>
      <button type="button" id="percurso-recolher" aria-controls="percurso-conteudo" aria-expanded="${!percursoRecolhido}">${percursoRecolhido ? t("Abrir", "Open") : t("Recolher", "Collapse")}</button>
      <div ${percursoRecolhido ? "hidden" : ""} id="percurso-conteudo"><h2>${esc(nome)}</h2>
      <p class="percurso-progresso" role="status" aria-live="polite">${t("Passo", "Step")} ${passoAtivo + 1} ${t("de", "of")} ${guia.passos.length} · ${esc(emIngles() ? passo.lugarEn : passo.lugarPt)}</p>
      <p class="percurso-texto">${esc(emIngles() ? passo.en : passo.pt)}</p>
      <a class="link" href="#/${emIngles() ? "en/" : ""}${passo.prancha}">${t("Ler a prancha completa →", "Read the full plate →")}</a>
      <div class="percurso-acoes">
        <button type="button" id="percurso-anterior" ${passoAtivo === 0 ? "disabled" : ""}>${t("Anterior", "Previous")}</button>
        <button type="button" id="percurso-proximo" ${passoAtivo === guia.passos.length - 1 ? "disabled" : ""}>${t("Próximo", "Next")}</button>
        <button type="button" id="percurso-sair">${t("Sair", "Exit")}</button>
      </div></div>${percursoRecolhido ? `<button type="button" id="percurso-sair-recolhido">${t("Sair", "Exit")}</button>` : ""}`;
    painel.querySelector<HTMLButtonElement>("#percurso-recolher")?.addEventListener("click", () => { percursoRecolhido = !percursoRecolhido; pintaPercurso(); painel.querySelector<HTMLButtonElement>("#percurso-recolher")?.focus(); });
    painel.querySelector<HTMLButtonElement>("#percurso-anterior")?.addEventListener("click", () => { passoAtivo--; aplicaPasso(guia.passos[passoAtivo]); (painel.querySelector<HTMLButtonElement>(passoAtivo === 0 ? "#percurso-proximo" : "#percurso-anterior"))?.focus(); });
    painel.querySelector<HTMLButtonElement>("#percurso-proximo")?.addEventListener("click", () => { passoAtivo++; aplicaPasso(guia.passos[passoAtivo]); (painel.querySelector<HTMLButtonElement>(passoAtivo === guia.passos.length - 1 ? "#percurso-sair" : "#percurso-proximo"))?.focus(); });
    painel.querySelectorAll<HTMLButtonElement>("#percurso-sair, #percurso-sair-recolhido").forEach((b) => b.addEventListener("click", saiPercurso));
    mapa.desenha();
  }

  function achaDistrito(texto: string): Distrito | undefined {
    const chave = texto.trim().toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (!chave) return undefined;
    return dist.find((d) => [d.cod, d.nome, d.nome_en].some((v) =>
      String(v).toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === chave));
  }

  function barras(chaves: { cor: string; rot: string }[], rotulos: string[]) {
    return `<div class="chaves">${chaves.map((k, i) => `<div class="chave">
      <i style="background:${k.cor}"></i><span>${esc(rotulos[i] ?? k.rot)}</span>
    </div>`).join("")}</div>`;
  }

  function simbolosHTML(): string {
    if (!estado.camadas.has("assentamentos")) return "";
    return `<div class="simbolos">
      <div class="simbolo">${GLIFOS.capital}<span>Capital</span></div>
      <div class="simbolo">${GLIFOS.sietch}<span>Sietch</span></div>
      <div class="simbolo">${GLIFOS.pyon}<span>${t("Vila pyon", "Pyon village")}</span></div>
      <div class="simbolo">${GLIFOS.botanica}<span>${t("Estação botânica", "Botanical station")}</span></div>
    </div>`;
  }

  function legendaHTML(): string {
    const cl = mapa.legenda();
    if (cl) {
      const c = CAMPOS[cl.campo];
      const p = procParaCampo(cl.campo, prov.campos);
      const CURTA = curta();
      return `<div class="cab">${t("Legenda", "Legend")}</div>
      <div>
        <div class="leg-tit">${esc(c?.rot ?? cl.campo)}${c?.un ? ` <span>${esc(c.un)}</span>` : ""}</div>
        <div class="rampa">${cl.cores.map((k) => `<i style="background:${k}"></i>`).join("")}</div>
        <div class="rampa-rot"><span>${esc(formata(cl.campo, cl.cortes[0]))}</span>
          <span>${esc(formata(cl.campo, cl.cortes[cl.cortes.length - 1]))}</span></div>
        ${simbolosHTML()}
        <div class="leg-nota">${selo(p?.classe ?? "DEDUZIDO", CURTA[p?.classe ?? "DEDUZIDO"])}</div>
        ${c?.ajuda ? `<p class="leg-p">${esc(c.ajuda)}</p>` : ""}
      </div>`;
    }
    const r: CamadaRaster | undefined = ras[estado.raster];
    if (!r) return "";
    const categorica = r.chaves.some((k) => k.rot && Number.isNaN(Number(k.rot)));
    const CURTA = curta();
    return `<div class="cab">${t("Legenda · Prancha 01", "Legend · Plate 01")}</div>
      <div>
      <div class="leg-tit">${esc(rasterTxt(r.titulo))}${r.unidade ? ` <span>${esc(r.unidade)}</span>` : ""}</div>
      ${categorica
        ? barras(r.chaves, r.chaves.map((k) => rasterTxt(k.rot)))
        : `<div class="rampa">${r.chaves.map((k) => `<i style="background:${k.cor}"></i>`).join("")}</div>
           <div class="rampa-rot">
             <span>${Math.round(r.p1 ?? r.min ?? 0).toLocaleString(localidade())}</span>
             <span>${Math.round(r.p99 ?? r.max ?? 0).toLocaleString(localidade())}</span>
           </div>`}
      ${simbolosHTML()}
      <div class="leg-nota">${selo(r.classe, CURTA[r.classe])}</div>
    </div>`;
  }

  function pintaControles() {
    const superf = superficies().filter(([k]) => k === "" || ras[k]);
    ctrl.innerHTML = `
      <div class="ctrl-mobile">
        <a class="ctrl-mobile-volta" href="#/" aria-label="${t("Voltar ao atlas", "Back to the atlas")}">←</a>
        <select id="superficie-mobile" aria-label="${t("Superfície do mapa", "Map surface")}">
          ${superf.map(([k, r]) => `<option value="${k}"${estado.raster === k ? " selected" : ""}>${esc(r)}</option>`).join("")}
        </select>
        <button id="zoom-mais" type="button" aria-label="${t("Aproximar mapa", "Zoom in")}">+</button>
        <button id="zoom-menos" type="button" aria-label="${t("Afastar mapa", "Zoom out")}">−</button>
        <button id="abre-percursos" type="button" aria-label="${t("Abrir percursos guiados", "Open guided tours")}">${t("Guias", "Tours")}</button>
        <button id="abre-controles" type="button" aria-expanded="${controlesAbertos}">${controlesAbertos ? t("Fechar", "Close") : t("Opções", "Options")}</button>
      </div>
      <a class="volta" href="#/">${t("Voltar ao atlas", "Back to the atlas")}</a>
      <div class="ctrl-topo">
        <div class="ctrl-titulo">${t("Prancha 01", "Plate 01")}</div>
        <div class="titulo-prancha">${t("O mapa", "The map")}</div>
        <div class="ctrl-coord" id="coord"></div>
      </div>
      <div class="grupo">
        <div class="rot">${t("Superfície", "Surface")}</div>
        <div class="opcoes unica" id="op-raster" role="radiogroup">
          ${superf.map(([k, r]) => `<button data-k="${k}" role="radio"
            aria-checked="${estado.raster === k}"><span>${esc(r)}</span></button>`).join("")}
        </div>
      </div>
      <div class="grupo">
        <div class="rot">${t("Variável por distrito", "District variable")}</div>
        <div class="caixa-sel">
          <select class="campo" id="sel-campo" aria-label="${t("Variável por distrito", "District variable")}">
            <option value="">${t("Sem variável", "No variable")}</option>
            ${coropletos().map((g) => `<optgroup label="${esc(g.grupo)}">
              ${g.campos.filter((c) => CAMPOS[c]).map((c) =>
                `<option value="${c}"${estado.coropleto === c ? " selected" : ""}>${esc(CAMPOS[c].rot)}</option>`).join("")}
            </optgroup>`).join("")}
          </select>
        </div>
      </div>
      <div class="grupo">
        <div class="rot">${t("Camadas", "Layers")}</div>
        <div class="opcoes" id="op-camadas">
          ${camadas().map(([k, r]) => `<button data-k="${k}"
            aria-pressed="${estado.camadas.has(k)}"><span>${esc(r)}</span></button>`).join("")}
        </div>
      </div>
      <form class="busca-distrito" id="busca-distrito">
        <label for="nome-distrito">${t("Ir a um distrito", "Go to a district")}</label>
        <div><input id="nome-distrito" type="search" list="lista-distritos"
          placeholder="${t("Nome ou código", "Name or code")}" autocomplete="off" />
          <button type="submit">${t("Ir", "Go")}</button></div>
        <datalist id="lista-distritos">${dist.map((d) => `<option value="${esc(d.cod)}">${esc(emIngles() ? d.nome_en : d.nome)}</option>`).join("")}</datalist>
        <span id="busca-feedback" role="status" aria-live="polite"></span>
      </form>
      <div class="grupo percurso-lista">
        <div class="rot">${t("Percursos guiados", "Guided tours")}</div>
        <div class="opcoes">${PERCURSOS.map((g, i) => `<button type="button" data-percurso="${i}">${esc(emIngles() ? g.en : g.pt)}</button>`).join("")}</div>
      </div>
      <div class="legenda-prancha">${legendaHTML()}</div>
      <div style="margin-top:18px">
        <button type="button" id="copiar-vista" style="background:none;border:0;border-bottom:1px solid currentColor;padding:0;color:var(--tinta-2);font:400 12px/1.4 var(--f-disp);cursor:pointer">${t("Copiar link desta vista", "Copy link to this view")}</button>
        <span id="link-vista-feedback" role="status" aria-live="polite" style="display:block;min-height:1.4em;margin-top:4px;color:var(--tinta-3);font:400 11px/1.4 var(--f-disp)"></span>
      </div>
      <div class="colofao">${t("Base: <b>NiptonIceTea</b>, segundo de Fontaine (1965)", "Base: <b>NiptonIceTea</b>, after de Fontaine (1965)")}</div>`;
    ctrl.classList.toggle("aberto", controlesAbertos);

    ctrl.querySelectorAll("#op-raster button").forEach((b) =>
      b.addEventListener("click", () => {
        estado.raster = (b as HTMLElement).dataset.k!;
        pintaControles(); mapa.desenha();
      }));

    ctrl.querySelectorAll("#op-camadas button").forEach((b) =>
      b.addEventListener("click", () => {
        const k = (b as HTMLElement).dataset.k!;
        if (estado.camadas.has(k)) estado.camadas.delete(k);
        else estado.camadas.add(k);
        pintaControles(); mapa.desenha();
      }));

    (ctrl.querySelector("#sel-campo") as HTMLSelectElement)
      .addEventListener("change", (e) => {
        estado.coropleto = (e.target as HTMLSelectElement).value;
        const cl = procParaCampo(estado.coropleto, prov.campos)?.classe ?? "DEDUZIDO";
        mapa.classifica(estado.coropleto, cl);
        pintaControles(); mapa.desenha();
      });

    ctrl.querySelector("#copiar-vista")?.addEventListener("click", () => { void copiaVista(); });
    ctrl.querySelectorAll<HTMLButtonElement>("[data-percurso]").forEach((b) => b.addEventListener("click", () => iniciaPercurso(Number(b.dataset.percurso))));

    ctrl.querySelector<HTMLSelectElement>("#superficie-mobile")?.addEventListener("change", (e) => {
      estado.raster = (e.target as HTMLSelectElement).value;
      pintaControles(); mapa.desenha();
    });
    ctrl.querySelector("#zoom-mais")?.addEventListener("click", () => mapa.zoom(1.35));
    ctrl.querySelector("#zoom-menos")?.addEventListener("click", () => mapa.zoom(1 / 1.35));
    ctrl.querySelector("#abre-percursos")?.addEventListener("click", () => {
      controlesAbertos = true;
      pintaControles();
      ctrl.querySelector<HTMLButtonElement>("[data-percurso]")?.focus();
    });
    ctrl.querySelector("#abre-controles")?.addEventListener("click", () => {
      controlesAbertos = !controlesAbertos;
      pintaControles(); mapa.desenha();
      ctrl.querySelector<HTMLElement>("#abre-controles")?.focus();
    });
    ctrl.querySelector<HTMLFormElement>("#busca-distrito")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const campo = ctrl.querySelector<HTMLInputElement>("#nome-distrito")!;
      const distrito = achaDistrito(campo.value);
      if (!distrito) {
        ctrl.querySelector<HTMLElement>("#busca-feedback")!.textContent =
          t("Distrito não encontrado.", "District not found.");
        return;
      }
      mapa.vaiPara(distrito.cod);
      mostra(distrito.cod);
      controlesAbertos = false;
      pintaControles(); mapa.desenha();
      inspetor.querySelector<HTMLElement>(".fechar")?.focus();
    });
  }
  pintaControles();

  /* ------------------------------------------------------------- inspetor */
  const inspetor = alvo.querySelector("#inspetor") as HTMLElement;

  const palco = alvo.querySelector("#palco") as HTMLElement;

  // O painel flutua sobre a prancha; toponimo debaixo de painel e' rotulo
  // perdido, entao a rotulagem recebe a area ocupada e desvia.
  const zona = (el: HTMLElement) => () => {
    if (el.hidden || !el.offsetParent) return null;
    const c = tela.getBoundingClientRect(), r = el.getBoundingClientRect();
    return [r.left - c.left, r.top - c.top,
            r.right - c.left, r.bottom - c.top] as [number, number, number, number];
  };
  mapa.zonasProibidas = [zona(ctrl), zona(alvo.querySelector<HTMLElement>("#percurso-painel")!)];
  mapa.desenha();

  function fichaHTML(d: Distrito): string {
    const proc = (campo: string): Proc | undefined => procParaCampo(campo, prov.campos);

    const grupos = gruposCampos().map((g) => {
      const linhas = g.campos
        .filter((c) => d[c] !== null && d[c] !== undefined && d[c] !== "")
        .map((c) => {
          const p = proc(c);
          const u = CAMPOS[c].un;
          const sim = p?.classe === "SIMULADO";
          const txt = esc(formata(c, d[c]));
          // Valor de texto longo nao cabe na coluna da direita sem espremer o
          // rotulo; nesses casos ele desce para a linha de baixo.
          const longo = CAMPOS[c].fmt === "txt" && txt.length > 16;
          return `<div class="linha-dado-wrap"><div class="linha-dado${longo ? " empilhada" : ""}">
            <span class="rotulo"><i class="pip p-${esc(p?.classe ?? "SEM_NOTA")}"></i>${esc(CAMPOS[c].rot)}${rastroBotaoHTML(c)}</span>
            <span class="valor">${txt}${sim ? '<sup class="dag">†</sup>' : ""}${u ? `<span class="un">${esc(u)}</span>` : ""}</span>
          </div>${rastroHTML(c, p)}</div>`;
        });
      if (!linhas.length) return "";
      return `<div class="bloco"><div class="rot">${esc(g.rot)}</div>${linhas.join("")}</div>`;
    }).join("");

    const epocas = (tabs.cronologia ?? []) as any[];
    const tempo = epocas.length ? `<div class="bloco">
      <div class="rot">${t("Ao longo dos seis livros", "Across the six books")}</div>
      <div class="tempo">
        ${epocas.map((e, i) => {
          const v = String(d[`ep${i + 1}`] ?? "sem_informacao");
          const cls = v === "sem_informacao" ? "vazio"
            : v === "destruido" ? "destruido"
            : v === "transformado" ? "transformado" : "retratado";
          return `<div class="ep ${cls}" title="${esc(nomeLivro(e.titulo))} — ${esc(estadoEpoca(v))}">
            <b>${i + 1}</b></div>`;
        }).join("")}
      </div>
      <p class="leg-p">${epocas.map((e, i) => `${i + 1} ${esc(nomeLivro(e.titulo))}`).join(" · ")}</p>
    </div>` : "";

    /* A frase do Herbert vem ANTES da tabela. Abrir uma ficha com trinta
       numeros e nenhuma linha sobre que lugar e' aquele foi a critica mais
       justa que o atlas recebeu. */
    const c = (citas as Record<string, any>)[d.cod];
    const lede = c ? `<figure class="citacao lede">
        <blockquote>${esc(c.texto)}</blockquote>
        <figcaption class="fonte">${esc(c.autor)}, <em>${esc(nomeLivro(c.volume))}</em>
          (${c.ano})${c.local ? " · " + esc(localCitacao(c.local)) : ""}</figcaption>
      </figure>` : "";

    /* O que acontece aqui. A citacao acima diz o que o lugar E'; os eventos
       dizem por que alguem se lembra dele. Cada um traz o marcador do trecho
       que o sustenta (scripts/oneshot/2026-09-13_eventos_distritos.py confere
       todos). Enredo vem borrado: quem ainda nao leu decide se quer ver. */
    const evs = ((eventos as Record<string, any[]>)[d.cod] ?? []);
    const OLHO = `<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.5"/><path class="risco" d="M3 21 21 3" stroke="currentColor" stroke-width="1.5"/></svg>`;
    const acontece = evs.length ? `<div class="bloco eventos">
      <div class="rot">${t("O que acontece aqui", "What happens here")}</div>
      ${evs.map((e) => `<div class="evento${e.spoiler ? " spoiler" : ""}">
        <div class="ev-cab">
          <span class="ev-livro">${t("Livro", "Book")} ${e.livro} · <em>${esc(nomeLivro(e.volume))}</em>${e.spoiler ? ' · <b>spoiler</b>' : ""}</span>
          ${e.spoiler ? `<button class="olho" type="button" aria-pressed="false"
            aria-label="${t("Revelar spoiler do livro", "Reveal spoiler from book")} ${e.livro}" title="${t("Revelar", "Reveal")}">${OLHO}</button>` : ""}
        </div>
        <p class="ev-texto"${e.spoiler ? ' aria-hidden="true"' : ""}>${esc(emIngles() ? (e.resumo_en ?? e.resumo) : e.resumo)}</p>
        <span class="marcador"${e.spoiler ? "" : ` title="${esc(e.trecho)}"`}>${esc(e.marcador)}</span>
      </div>`).join("")}
    </div>` : "";

    /* Quando a citacao ja' abre a ficha, este bloco repetiria a mesma fonte
       com outras palavras. So' aparece para os distritos sem frase no corpus. */
    const canon = (d.canon_ref && !c) ? `<div class="bloco">
      <div class="rot">${t("Lastro no corpus", "Basis in the books")}</div>
      <p class="canon-p">
        ${d.canon_st === "canonico_fh" ? t("Topônimo com frase de Frank Herbert no corpus.", "A place name with a Frank Herbert passage in the books.")
          : d.canon_st === "so_no_mapa" ? t("Aparece no mapa do apêndice, mas nenhuma frase do corpus o nomeia.", "It appears on the appendix map, but no passage in the books names it.")
          : t("O corpus usa grafia divergente da do mapa.", "The books spell it differently from the map.")}
      </p>
      <span class="marcador">${esc(String(d.canon_ref))}</span>
      ${d.alias ? `<p class="leg-p">${esc(String(d.alias))}</p>` : ""}
    </div>` : "";

    return `<div class="topo">
        <button class="fechar" aria-label="${t("Fechar", "Close")}">×</button>
        <div class="cod">${esc(d.cod)}</div>
        <h2>${esc(emIngles() ? d.nome_en : d.nome)}</h2>
        ${emIngles() ? "" : `<div class="en">${esc(d.nome_en)}</div>`}
      </div>
      <div class="ficha">${lede}${acontece}${grupos}${tempo}${canon}
        <div class="bloco nota-dag" style="border-bottom:0"><b>†</b>
          <span>${t("valor construído pelo modelo; não existe no cânone", "value built by the model; not in the books")}</span></div>
      </div>`;
  }

  function mostra(cod: string | null) {
    if (!cod) {
      inspetor.hidden = true; palco.classList.remove("com-ficha");
      mapa.desenha(); return;
    }
    const d = porCod.get(cod);
    if (!d) { inspetor.hidden = true; palco.classList.remove("com-ficha"); return; }
    inspetor.hidden = false;
    palco.classList.add("com-ficha");
    inspetor.innerHTML = fichaHTML(d);
    inspetor.scrollTop = 0;
    ligaRastros(inspetor);
    inspetor.querySelectorAll<HTMLElement>(".evento.spoiler").forEach((ev) => {
      const botao = ev.querySelector<HTMLButtonElement>(".olho")!;
      const texto = ev.querySelector<HTMLElement>(".ev-texto")!;
      const alterna = () => {
        const aberto = ev.classList.toggle("revelado");
        botao.setAttribute("aria-pressed", String(aberto));
        botao.setAttribute("aria-label", (aberto ? t("Esconder", "Hide") : t("Revelar", "Reveal")) + " spoiler");
        botao.title = aberto ? t("Esconder", "Hide") : t("Revelar", "Reveal");
        texto.setAttribute("aria-hidden", String(!aberto));
      };
      botao.addEventListener("click", alterna);
      texto.addEventListener("click", () => { if (!ev.classList.contains("revelado")) alterna(); });
    });
    (inspetor.querySelector(".fechar") as HTMLElement).addEventListener("click", () => {
      estado.selecionado = null; inspetor.hidden = true;
      palco.classList.remove("com-ficha"); mapa.desenha();
    });
    mapa.desenha();
  }
  mapa.aoSelecionar = mostra;

  // Distrito vindo de outra pagina ou de uma vista compartilhada.
  if (estado.selecionado) { mapa.vaiPara(estado.selecionado); mostra(estado.selecionado); }

  /* -------------------------------------------------------- dica e coord */
  const dica = alvo.querySelector("#dica") as HTMLElement;

  mapa.aoMover = (px, py, cod) => {
    const coord = ctrl.querySelector("#coord") as HTMLElement | null;
    if (px < 0) {
      dica.hidden = true;
      if (coord) coord.textContent = "";
      return;
    }
    const [x, y] = mapa.coordenada(px, py);
    const rho = Math.hypot(x, y);
    const lat = 90 - (rho / mun.raio_m) * 180 / Math.PI;
    const lon = ((180 + Math.atan2(x, -y) * 180 / Math.PI) % 360 + 360) % 360;
    if (coord) coord.textContent = `${lat.toFixed(2)}°N  ${lon.toFixed(2)}°E`;

    if (cod) {
      const d = porCod.get(cod);
      dica.hidden = false;
      dica.style.left = (px + tela.offsetLeft) + "px";
      dica.style.top = (py + tela.offsetTop) + "px";
      const campo = estado.coropleto;
      dica.textContent = campo && d
        ? `${d.nome} · ${formata(campo, d[campo])}${CAMPOS[campo]?.un ? " " + CAMPOS[campo].un : ""}`
        : (d?.nome ?? cod);
    } else {
      dica.hidden = true;
    }
  };

  const tecla = (e: KeyboardEvent) => {
    const alvoTecla = e.target as HTMLElement;
    if (alvoTecla.closest("input, textarea, select, [contenteditable]")) return;
    if (e.key === "Escape") {
      estado.selecionado = null; inspetor.hidden = true;
      palco.classList.remove("com-ficha"); mapa.desenha();
    }
    if (e.key === "+" || e.key === "=") mapa.zoom(1.35);
    if (e.key === "-") mapa.zoom(1 / 1.35);
    if (e.key === "0") mapa.enquadraNoPolo(mun.fan);
  };
  window.addEventListener("keydown", tecla);

  const observador = new MutationObserver(() => {
    if (!document.body.contains(tela)) {
      ro.disconnect();
      window.removeEventListener("keydown", tecla);
      observador.disconnect();
    }
  });
  observador.observe(alvo, { childList: true });
}
