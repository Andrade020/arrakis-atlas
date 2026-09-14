import {
  atlas, distritos, rotulos, assentamentos, rasters, mundo, proveniencia, tabelas,
  type Distrito, type Proc, type CamadaRaster,
} from "../dados";
import { Mapa, type EstadoMapa } from "../mapa";
import { CAMPOS, COROPLETOS, GRUPOS, formata } from "../campos";
import { esc, selo } from "../ui";

const CAMADAS: [string, string][] = [
  ["distritos", "Limites distritais"],
  ["rotulos", "Topônimos"],
  ["assentamentos", "Assentamentos"],
  ["grade", "Grade de coordenadas"],
  ["regioes", "Regiões"],
  ["poder", "Esferas de controle"],
  ["rede_imperial", "Rede imperial"],
  ["rede_fremen", "Rede fremen"],
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
const CURTA: Record<string, string> = {
  CANONE_FH: "Cânone de Frank Herbert",
  DEDUZIDO: "Deduzido do mapa",
  MODELO_DERIVADO: "Modelo derivado",
  SIMULADO: "Simulado por nós",
  EXTERNO_NAO_CANONE: "Fora do cânone",
  DADO_REAL: "Dado do mundo real",
};

const SUPERFICIES: [string, string][] = [
  ["relevo", "Terreno"],
  ["elevacao", "Elevação"],
  ["custo_imperial", "Custo de travessia · Império"],
  ["custo_fremen", "Custo de travessia · fremen"],
  ["densidade", "Densidade de assentamento"],
  ["", "Sem superfície"],
];

export async function paginaMapa(alvo: HTMLElement) {
  alvo.innerHTML = `<div class="mapa-tela" id="palco">
    <div class="ctrl" id="ctrl"></div>
    <canvas aria-label="Mapa de Arrakis"></canvas>
    <div class="inspetor" id="inspetor" hidden></div>
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

  /* ------------------------------------------------------------ controles */
  const ctrl = alvo.querySelector("#ctrl") as HTMLElement;

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
      <div class="simbolo">${GLIFOS.pyon}<span>Vila pyon</span></div>
      <div class="simbolo">${GLIFOS.botanica}<span>Estação botânica</span></div>
    </div>`;
  }

  function legendaHTML(): string {
    const cl = mapa.legenda();
    if (cl) {
      const c = CAMPOS[cl.campo];
      const p = prov.campos[cl.campo];
      return `<div class="cab">Legenda</div>
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
    return `<div class="cab">Legenda · Prancha 01</div>
      <div>
      <div class="leg-tit">${esc(r.titulo)}${r.unidade ? ` <span>${esc(r.unidade)}</span>` : ""}</div>
      ${categorica
        ? barras(r.chaves, r.chaves.map((k) => k.rot))
        : `<div class="rampa">${r.chaves.map((k) => `<i style="background:${k.cor}"></i>`).join("")}</div>
           <div class="rampa-rot">
             <span>${Math.round(r.p1 ?? r.min ?? 0).toLocaleString("pt-BR")}</span>
             <span>${Math.round(r.p99 ?? r.max ?? 0).toLocaleString("pt-BR")}</span>
           </div>`}
      ${simbolosHTML()}
      <div class="leg-nota">${selo(r.classe, CURTA[r.classe])}</div>
    </div>`;
  }

  function pintaControles() {
    const superf = SUPERFICIES.filter(([k]) => k === "" || ras[k]);
    ctrl.innerHTML = `
      <a class="volta" href="#/">Voltar ao atlas</a>
      <div class="ctrl-topo">
        <div class="ctrl-titulo">Prancha 01</div>
        <div class="titulo-prancha">O mapa</div>
        <div class="ctrl-coord" id="coord"></div>
      </div>
      <div class="grupo">
        <div class="rot">Superfície</div>
        <div class="opcoes unica" id="op-raster" role="radiogroup">
          ${superf.map(([k, r]) => `<button data-k="${k}" role="radio"
            aria-checked="${estado.raster === k}"><span>${esc(r)}</span></button>`).join("")}
        </div>
      </div>
      <div class="grupo">
        <div class="rot">Variável por distrito</div>
        <div class="caixa-sel">
          <select class="campo" id="sel-campo" aria-label="Variável por distrito">
            <option value="">Sem variável</option>
            ${COROPLETOS.map((g) => `<optgroup label="${esc(g.grupo)}">
              ${g.campos.filter((c) => CAMPOS[c]).map((c) =>
                `<option value="${c}"${estado.coropleto === c ? " selected" : ""}>${esc(CAMPOS[c].rot)}</option>`).join("")}
            </optgroup>`).join("")}
          </select>
        </div>
      </div>
      <div class="grupo">
        <div class="rot">Camadas</div>
        <div class="opcoes" id="op-camadas">
          ${CAMADAS.map(([k, r]) => `<button data-k="${k}"
            aria-pressed="${estado.camadas.has(k)}"><span>${esc(r)}</span></button>`).join("")}
        </div>
      </div>
      <div class="legenda-prancha">${legendaHTML()}</div>
      <div class="colofao">Base: <b>NiptonIceTea</b>, segundo de Fontaine (1965)</div>`;

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
        const cl = prov.campos[estado.coropleto]?.classe ?? "DEDUZIDO";
        mapa.classifica(estado.coropleto, cl);
        pintaControles(); mapa.desenha();
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
  mapa.zonasProibidas = [zona(ctrl)];
  mapa.desenha();

  function fichaHTML(d: Distrito): string {
    const proc = (campo: string): Proc =>
      prov.campos[campo] ?? { classe: "DEDUZIDO", lastro: "", marcador: "" };

    const grupos = GRUPOS.map((g) => {
      const linhas = g.campos
        .filter((c) => d[c] !== null && d[c] !== undefined && d[c] !== "")
        .map((c) => {
          const p = proc(c);
          const u = CAMPOS[c].un;
          const sim = p.classe === "SIMULADO";
          const txt = esc(formata(c, d[c]));
          // Valor de texto longo nao cabe na coluna da direita sem espremer o
          // rotulo; nesses casos ele desce para a linha de baixo.
          const longo = CAMPOS[c].fmt === "txt" && txt.length > 16;
          return `<div class="linha-dado${longo ? " empilhada" : ""}" title="${esc(p.lastro)}">
            <span class="rotulo"><i class="pip p-${esc(p.classe)}"></i>${esc(CAMPOS[c].rot)}</span>
            <span class="valor">${txt}${sim ? '<sup class="dag">†</sup>' : ""}${u ? `<span class="un">${esc(u)}</span>` : ""}</span>
          </div>`;
        });
      if (!linhas.length) return "";
      return `<div class="bloco"><div class="rot">${esc(g.rot)}</div>${linhas.join("")}</div>`;
    }).join("");

    const epocas = (tabs.cronologia ?? []) as any[];
    const tempo = epocas.length ? `<div class="bloco">
      <div class="rot">Ao longo dos seis livros</div>
      <div class="tempo">
        ${epocas.map((e, i) => {
          const v = String(d[`ep${i + 1}`] ?? "sem_informacao");
          const cls = v === "sem_informacao" ? "vazio"
            : v === "destruido" ? "destruido"
            : v === "transformado" ? "transformado" : "retratado";
          return `<div class="ep ${cls}" title="${esc(e.titulo)} — ${esc(v.replace(/_/g, " "))}">
            <b>${i + 1}</b></div>`;
        }).join("")}
      </div>
      <p class="leg-p">${epocas.map((e, i) => `${i + 1} ${esc(e.titulo)}`).join(" · ")}</p>
    </div>` : "";

    /* A frase do Herbert vem ANTES da tabela. Abrir uma ficha com trinta
       numeros e nenhuma linha sobre que lugar e' aquele foi a critica mais
       justa que o atlas recebeu. */
    const c = (citas as Record<string, any>)[d.cod];
    const lede = c ? `<figure class="citacao lede">
        <blockquote>${esc(c.texto)}</blockquote>
        <figcaption class="fonte">${esc(c.autor)}, <em>${esc(c.volume)}</em>
          (${c.ano})${c.local ? " · " + esc(c.local) : ""}</figcaption>
      </figure>` : "";

    /* O que acontece aqui. A citacao acima diz o que o lugar E'; os eventos
       dizem por que alguem se lembra dele. Cada um traz o marcador do trecho
       que o sustenta (scripts/oneshot/2026-09-13_eventos_distritos.py confere
       todos). Enredo vem borrado: quem ainda nao leu decide se quer ver. */
    const evs = ((eventos as Record<string, any[]>)[d.cod] ?? []);
    const OLHO = `<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.5"/><path class="risco" d="M3 21 21 3" stroke="currentColor" stroke-width="1.5"/></svg>`;
    const acontece = evs.length ? `<div class="bloco eventos">
      <div class="rot">O que acontece aqui</div>
      ${evs.map((e) => `<div class="evento${e.spoiler ? " spoiler" : ""}">
        <div class="ev-cab">
          <span class="ev-livro">Livro ${e.livro} · <em>${esc(e.volume)}</em>${e.spoiler ? ' · <b>spoiler</b>' : ""}</span>
          ${e.spoiler ? `<button class="olho" type="button" aria-pressed="false"
            aria-label="Revelar spoiler do livro ${e.livro}" title="Revelar">${OLHO}</button>` : ""}
        </div>
        <p class="ev-texto"${e.spoiler ? ' aria-hidden="true"' : ""}>${esc(e.resumo)}</p>
        <span class="marcador"${e.spoiler ? "" : ` title="${esc(e.trecho)}"`}>${esc(e.marcador)}</span>
      </div>`).join("")}
    </div>` : "";

    /* Quando a citacao ja' abre a ficha, este bloco repetiria a mesma fonte
       com outras palavras. So' aparece para os distritos sem frase no corpus. */
    const canon = (d.canon_ref && !c) ? `<div class="bloco">
      <div class="rot">Lastro no corpus</div>
      <p class="canon-p">
        ${d.canon_st === "canonico_fh" ? "Topônimo com frase de Frank Herbert no corpus."
          : d.canon_st === "so_no_mapa" ? "Aparece no mapa do apêndice, mas nenhuma frase do corpus o nomeia."
          : "O corpus usa grafia divergente da do mapa."}
      </p>
      <span class="marcador">${esc(String(d.canon_ref))}</span>
      ${d.alias ? `<p class="leg-p">${esc(String(d.alias))}</p>` : ""}
    </div>` : "";

    return `<div class="topo">
        <button class="fechar" aria-label="Fechar">×</button>
        <div class="cod">${esc(d.cod)}</div>
        <h2>${esc(d.nome)}</h2>
        <div class="en">${esc(d.nome_en)}</div>
      </div>
      <div class="ficha">${lede}${acontece}${grupos}${tempo}${canon}
        <div class="bloco nota-dag" style="border-bottom:0"><b>†</b>
          <span>valor construído pelo modelo; não existe no cânone</span></div>
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
    inspetor.querySelectorAll<HTMLElement>(".evento.spoiler").forEach((ev) => {
      const botao = ev.querySelector<HTMLButtonElement>(".olho")!;
      const texto = ev.querySelector<HTMLElement>(".ev-texto")!;
      const alterna = () => {
        const aberto = ev.classList.toggle("revelado");
        botao.setAttribute("aria-pressed", String(aberto));
        botao.setAttribute("aria-label", (aberto ? "Esconder" : "Revelar") + " spoiler");
        botao.title = aberto ? "Esconder" : "Revelar";
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

  // distrito vindo de outra pagina: #/mapa#=AR-27
  const alvoInicial = location.hash.match(/#=([A-Z]{2}-\d{2})/);
  if (alvoInicial) { mapa.vaiPara(alvoInicial[1]); mostra(alvoInicial[1]); }

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
