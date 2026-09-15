// Renderizador do mapa.
//
// DECISAO CENTRAL: nao ha' biblioteca de mapas aqui, e nao e' economia de
// dependencia — e' correcao. As geometrias ja' estao em metros da azimutal
// equidistante centrada no polo norte, que e' a projecao do desenho original.
// Uma biblioteca de slippy map iria reprojetar tudo para Mercator para depois
// desenhar, e Mercator num planeta cartografado a partir do polo destruiria
// justamente a propriedade que o mapa-fonte tem: distancia correta ao longo do
// raio. Entao o que se faz aqui e' o minimo: uma transformacao afim entre
// metros e pixels. O que se ve' na tela e' a mesma projecao do QGIS.

import type { FeatureCollection, Feature, Geometry, Position } from "geojson";
import { CAMPOS, formata } from "./campos";
import type { Assentamento, Distrito, Rotulo, CamadaRaster } from "./dados";

export interface EstadoMapa {
  raster: string;
  coropleto: string;
  camadas: Set<string>;
  selecionado: string | null;
}

export interface Classificacao {
  cortes: number[];
  cores: string[];
  campo: string;
}

/* As duas rampas dizem a procedencia da variavel, e nao so' a sua magnitude:
   azul = medido ou derivado do canone, amarelo = modelo nosso. Quem olha o
   mapa sabe, pela cor, se esta' vendo dado ou simulacao — que e' a tese do
   projeto aplicada a propria legenda. */
export const RAMPA_OBS = ["#DCE6F0", "#B4CBE2", "#84A9CC", "#5382B0", "#2F5C8C", "#173A5E"];
export const RAMPA_SIM = ["#F2E9C2", "#E0D081", "#C9B248", "#A88E1E", "#7E6A12", "#54460B"];

const COR_PODER: Record<string, string> = {
  "Imperio": "#A83A1C",
  "Fremen": "#B08A1E",
  "Contrabandistas": "#5F479C",
  "Sem controle efetivo": "#8B7C66",
};

const COR_REGIAO: Record<string, string> = {
  R1: "#2F6F9E", R2: "#B36A28", R3: "#A8402F", R4: "#6A4E9E",
  R5: "#1E7A57", R6: "#8A6B14", R7: "#5A5545",
};

const TINTA_FORTE = "#1F1608";

interface Poligono { cod: string; caminho: Path2D; }
interface Linha { caminho: Path2D; props: Record<string, any>; }

export class Mapa {
  private ctx: CanvasRenderingContext2D;
  private larg = 0; private alt = 0; private dpr = 1;

  /** metros por pixel de tela; k = pixels por metro */
  private k = 1; private tx = 0; private ty = 0;

  private distritos: Poligono[] = [];
  private regioes: Linha[] = [];
  private poder: Linha[] = [];
  private grade: Linha[] = [];
  private redes: Record<string, Linha[]> = {};
  private limite: Path2D | null = null;

  private tabela = new Map<string, Distrito>();
  private rotulos: Rotulo[] = [];
  private assent: Assentamento[] = [];
  private imagens = new Map<string, HTMLImageElement>();
  private rasters: Record<string, CamadaRaster> = {};

  private hover: string | null = null;
  private classe: Classificacao | null = null;
  private pedido = 0;

  /** Retangulos de tela onde nao se pode rotular: os paineis flutuantes cobrem
      o mapa, e toponimo debaixo de painel e' rotulo perdido. */
  zonasProibidas: (() => [number, number, number, number] | null)[] = [];

  /** Carta de capa: desenha, nao responde. */
  estatica = false;
  /** Desenha escala e projecao DENTRO da prancha, em tinta de mapa. Metadado de
      carta pertence a carta, e nao a uma barra de ferramentas ao lado dela. */
  cartucho = false;
  /** Quanto da esquerda esta' coberto por painel; o cartucho comeca depois. */
  recuoCartucho = 0;
  /** Limites da folha desenhada. Fora dela e' margem de papel, nao vazio. */
  folha: [number, number, number, number] | null = null;
  /** Margem de papel em volta do desenho, em pixels de tela. Uma prancha que
      se anuncia como prancha precisa ter borda e margem; sangrar ate' a beira
      da janela contradiz o proprio nome que ela carrega. */
  margem = 0;
  /** Margem esquerda propria: a coluna de margem impressa cobre esse pedaco da
      tela, e a moldura da prancha tem de comecar depois dela. */
  margemEsq = 0;
  /** Moldura dupla. Numa carta pequena uma linha so' basta; duas viram enfeite. */
  molduraDupla = true;
  /** Distritos a destacar (usado nas cartinhas de regiao). */
  destaque: Set<string> | null = null;
  /** Desenho extra por cima da prancha inteira (a rota da fuga). Recebe a
      funcao que leva metros da projecao a pixels de tela. Nulo = nada muda. */
  sobreposicao: ((ctx: CanvasRenderingContext2D, tela: (x: number, y: number) => [number, number]) => void) | null = null;

  /** Enquadramento atual, para animar a camera de fora do mapa. */
  get vista() { return { k: this.k, tx: this.tx, ty: this.ty, larg: this.larg, alt: this.alt }; }
  poeVista(k: number, tx: number, ty: number) {
    this.k = k; this.tx = tx; this.ty = ty; this.pinta();
  }

  aoSelecionar: (cod: string | null) => void = () => {};
  aoMover: (x: number, y: number, cod: string | null) => void = () => {};

  constructor(
    private tela: HTMLCanvasElement,
    private estado: EstadoMapa,
  ) {
    const ctx = tela.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("canvas 2d indisponivel");
    this.ctx = ctx;
    queueMicrotask(() => this.liga());
  }

  // ------------------------------------------------------------- carga ----
  carrega(
    atlas: Record<string, FeatureCollection>,
    distritos: Distrito[],
    rotulos: Rotulo[],
    assent: Assentamento[],
    rasters: Record<string, CamadaRaster>,
  ) {
    for (const d of distritos) this.tabela.set(d.cod, d);
    this.rotulos = rotulos;
    this.assent = assent;
    this.rasters = rasters;

    this.distritos = (atlas.distritos?.features ?? []).map((f) => ({
      cod: (f.properties as any).cod as string,
      caminho: caminhoDe(f),
    }));
    this.regioes = linhas(atlas.regioes);
    this.poder = linhas(atlas.poder);
    this.grade = linhas(atlas.grade);
    this.redes.rede_imperial = linhas(atlas.rede_imperial);
    this.redes.rede_fremen = linhas(atlas.rede_fremen);
    const lim = atlas.limite?.features?.[0];
    this.limite = lim ? caminhoDe(lim) : null;
  }

  /** Carrega a imagem de fundo sob demanda; redesenha quando chegar. */
  private imagem(chave: string): HTMLImageElement | null {
    if (!chave || !this.rasters[chave]) return null;
    let im = this.imagens.get(chave);
    if (!im) {
      im = new Image();
      im.decoding = "async";
      im.src = import.meta.env.BASE_URL + this.rasters[chave].arquivo;
      im.onload = () => this.desenha();
      this.imagens.set(chave, im);
    }
    return im.complete && im.naturalWidth ? im : null;
  }

  // ---------------------------------------------------------- enquadre ----
  /** cobrir = a prancha preenche a tela e sangra pelas bordas, em vez de
      flutuar num vazio preto com margens desiguais. */
  enquadra(b: [number, number, number, number], margem = 0.045, cobrir = false) {
    const lw = b[2] - b[0], lh = b[3] - b[1];
    const m = 1 - margem * 2;
    this.k = cobrir
      ? Math.max((this.larg * m) / lw, (this.alt * m) / lh)
      : Math.min((this.larg * m) / lw, (this.alt * m) / lh);
    this.tx = this.larg / 2 - ((b[0] + b[2]) / 2) * this.k;
    this.ty = this.alt / 2 + ((b[1] + b[3]) / 2) * this.k;
    this.pinta();
  }

  /** Enquadra pondo o POLO no centro da tela, e nao o centro do retangulo da
      folha. Numa azimutal polar o polo e' o centro da projecao: e' dali que a
      escala e' exata e e' em torno dele que a grade se organiza. Centrar pela
      caixa envolvente e' tratar a carta como uma imagem qualquer. */
  enquadraNoPolo(b: [number, number, number, number]) {
    // cobre a tela nos dois eixos, medindo o alcance da folha a partir do polo
    const rx = Math.max(Math.abs(b[0]), Math.abs(b[2]));
    const ry = Math.max(Math.abs(b[1]), Math.abs(b[3]));
    // 4% de sobra: a folha tem de sangrar em todas as bordas, senao aparece
    // faixa preta e a prancha vira um retangulo colado no fundo
    this.k = Math.max(this.larg / (2 * rx), this.alt / (2 * ry)) * 1.04;
    this.tx = this.larg / 2;
    this.ty = this.alt / 2;
    this.pinta();
  }

  private px(x: number) { return x * this.k + this.tx; }
  private py(y: number) { return -y * this.k + this.ty; }
  private mx(px: number) { return (px - this.tx) / this.k; }
  private my(py: number) { return -(py - this.ty) / this.k; }

  redimensiona() {
    const r = this.tela.getBoundingClientRect();
    if (!r.width || !r.height) return;   // ainda sem layout; o observador volta
    // guarda o ponto do mapa que esta' no centro, para que abrir a ficha
    // (que estreita a prancha) nao pareca um salto
    const cx = this.larg ? this.mx(this.larg / 2) : 0;
    const cy = this.alt ? this.my(this.alt / 2) : 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.larg = r.width; this.alt = r.height;
    if (r.width && this.k) {
      this.tx = r.width / 2 - cx * this.k;
      this.ty = r.height / 2 + cy * this.k;
    }
    this.tela.width = Math.round(r.width * this.dpr);
    this.tela.height = Math.round(r.height * this.dpr);
    // Pintura SINCRONA aqui, de proposito: mudar canvas.width limpa o bitmap
    // para preto opaco (o contexto e' alpha:false), e se o primeiro quadro
    // ficar esperando o requestAnimationFrame a tela aparece preta ate' la'.
    this.pinta();
  }

  // ----------------------------------------------------- classificacao ----
  /** Quantis: a distribuicao dos nossos campos e' torta (uns poucos distritos
      concentram quase tudo), e classe de igual amplitude deixaria 40 dos 44 na
      mesma cor. */
  classifica(campo: string, classeProc: string) {
    if (!campo) { this.classe = null; return; }
    const vs = [...this.tabela.values()]
      .map((d) => Number(d[campo]))
      .filter((v) => Number.isFinite(v))
      .sort((a, b) => a - b);
    if (vs.length < 6) { this.classe = null; return; }
    const cores = classeProc === "SIMULADO" ? RAMPA_SIM : RAMPA_OBS;
    const n = cores.length;
    const cortes: number[] = [vs[0]];
    for (let i = 1; i < n; i++) cortes.push(vs[Math.floor((vs.length * i) / n)]);
    cortes.push(vs[vs.length - 1]);
    this.classe = { cortes, cores, campo };
  }

  legenda(): Classificacao | null { return this.classe; }

  private cor(cod: string): string | null {
    if (!this.classe) return null;
    const v = Number(this.tabela.get(cod)?.[this.classe.campo]);
    if (!Number.isFinite(v)) return "#1A1C24";
    const { cortes, cores } = this.classe;
    for (let i = cores.length - 1; i >= 0; i--) if (v >= cortes[i]) return cores[i];
    return cores[0];
  }

  // ------------------------------------------------------------ desenho ---
  desenha = () => {
    if (this.pedido) return;
    this.pedido = requestAnimationFrame(() => { this.pedido = 0; this.pinta(); });
  };

  private pinta() {
    if (!this.larg || !this.alt) return;
    const { ctx } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const cam = this.estado.camadas;
    const coropleto = !!this.classe;

    /* Uma prancha de atlas e' papel ate' a borda: o desenho ocupa a parte
       central e o resto e' MARGEM, nao vazio. Pintar o que sobra de preto
       transformaria a folha num retangulo colado sobre um fundo, que e'
       exatamente a aparencia que se quer evitar. A margem leva um tom um
       pouco mais fechado, e a linha de contorno marca onde a folha comeca. */
    const papel = !!(this.folha && this.estado.raster);
    ctx.fillStyle = papel ? "#DED2B8" : "#EFE8DA";
    ctx.fillRect(0, 0, this.larg, this.alt);

    const M = this.margem;
    const E = this.margemEsq || M;
    if (M) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(E, M, this.larg - M - E, this.alt - 2 * M);
      ctx.clip();
    }

    // --- 1. prancha raster ------------------------------------------------
    const im = this.imagem(this.estado.raster);
    if (im) {
      const b = this.rasters[this.estado.raster].b;
      ctx.save();
      ctx.globalAlpha = coropleto ? 0.35 : 1;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(im, this.px(b[0]), this.py(b[3]),
                    (b[2] - b[0]) * this.k, (b[3] - b[1]) * this.k);
      ctx.restore();
    }

    /* Cartinha de localizacao: em vez de pintar a regiao por cima, desbota o
       resto da folha e deixa so' ela em tinta cheia. E' o que um atlas faz
       numa vinheta de situacao, e le-se de longe. */
    if (this.destaque && this.destaque.size && im) {
      const b = this.rasters[this.estado.raster].b;
      ctx.fillStyle = "rgba(239, 232, 218, .62)";
      ctx.fillRect(0, 0, this.larg, this.alt);
      ctx.save();
      ctx.beginPath();
      ctx.setTransform(this.dpr * this.k, 0, 0, -this.dpr * this.k,
                       this.dpr * this.tx, this.dpr * this.ty);
      for (const d of this.distritos) {
        if (this.destaque.has(d.cod)) ctx.clip(d.caminho, "evenodd");
      }
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.drawImage(im, this.px(b[0]), this.py(b[3]),
                    (b[2] - b[0]) * this.k, (b[3] - b[1]) * this.k);
      ctx.restore();
    }

    ctx.save();
    ctx.setTransform(this.dpr * this.k, 0, 0, -this.dpr * this.k,
                     this.dpr * this.tx, this.dpr * this.ty);
    const fio = (p: number) => p / this.k;   // espessura em pixels de tela

    // --- 2. coropleto -----------------------------------------------------
    if (coropleto) {
      ctx.globalAlpha = 0.86;
      for (const d of this.distritos) {
        const c = this.cor(d.cod);
        if (!c) continue;
        ctx.fillStyle = c;
        ctx.fill(d.caminho, "evenodd");
      }
      ctx.globalAlpha = 1;
    }

    // --- 3. esferas de poder ---------------------------------------------
    if (cam.has("poder")) {
      ctx.globalAlpha = coropleto ? 0.3 : 0.45;
      for (const l of this.poder) {
        ctx.fillStyle = COR_PODER[l.props.poder_ef] ?? "#444";
        ctx.fill(l.caminho, "evenodd");
      }
      ctx.globalAlpha = 1;
      ctx.lineWidth = fio(1.6); ctx.lineJoin = "round";
      for (const l of this.poder) {
        ctx.strokeStyle = COR_PODER[l.props.poder_ef] ?? "#444";
        ctx.stroke(l.caminho);
      }
    }

    // --- 4. grade: primeiro os paralelos, depois a linha do verme ---------
    if (cam.has("grade")) {
      // Num atlas a grade e' a linha mais fraca da prancha: ela orienta, nao
      // divide. Desenha-la com o mesmo peso das fronteiras e' o que torna um
      // mapa ilegivel justamente onde ele precisa ser lido.
      // Segunda tinta. Atlas impresso nunca e' monocromatico: a grade sai
      // num azul-acinzentado que a separa da tinta preta das fronteiras.
      ctx.strokeStyle = "rgba(58,92,130,.20)";
      ctx.lineWidth = fio(0.5);
      ctx.setLineDash([fio(7), fio(6)]);   // grade tracejada: orienta sem dividir
      for (const g of this.grade) ctx.stroke(g.caminho);
      ctx.setLineDash([]);
    }

    // --- 5. limites --------------------------------------------------------
    if (cam.has("distritos")) {
      ctx.strokeStyle = coropleto ? "rgba(34,26,16,.85)" : "rgba(38, 27, 14, .5)";
      ctx.lineWidth = fio(coropleto ? 1.05 : 0.85);
      ctx.lineJoin = "round";
      for (const d of this.distritos) ctx.stroke(d.caminho);
    }
    if (cam.has("regioes")) {
      ctx.lineWidth = fio(2.4); ctx.lineJoin = "round";
      for (const l of this.regioes) {
        ctx.strokeStyle = COR_REGIAO[l.props.cod_reg] ?? "#888";
        ctx.stroke(l.caminho);
      }
    }

    // --- 6. redes ----------------------------------------------------------
    if (cam.has("rede_imperial")) this.rede("rede_imperial", "#275C8C", fio);
    if (cam.has("rede_fremen")) this.rede("rede_fremen", "#A8641C", fio);

    // --- 6b. destaque de conjunto (a regiao, nas cartinhas) ---------------
    if (this.destaque && this.destaque.size) {
      ctx.save();
      ctx.globalAlpha = 0.14;
      ctx.fillStyle = "#8A4B14";
      for (const d of this.distritos) {
        if (this.destaque.has(d.cod)) ctx.fill(d.caminho, "evenodd");
      }
      ctx.restore();
      ctx.strokeStyle = "rgba(74, 38, 8, .95)";
      ctx.lineWidth = fio(2); ctx.lineJoin = "round";
      for (const d of this.distritos) {
        if (this.destaque.has(d.cod)) ctx.stroke(d.caminho);
      }
    }

    // --- 7. selecao e hover ------------------------------------------------
    const destaque = (cod: string | null, largura: number, cor: string) => {
      if (!cod) return;
      const d = this.distritos.find((p) => p.cod === cod);
      if (!d) return;
      ctx.strokeStyle = cor; ctx.lineWidth = fio(largura); ctx.lineJoin = "round";
      ctx.stroke(d.caminho);
    };
    destaque(this.hover, 1.8, TINTA_FORTE);
    if (this.estado.selecionado) {
      const d = this.distritos.find((p) => p.cod === this.estado.selecionado);
      if (d) {
        ctx.save();
        ctx.globalAlpha = 0.2; ctx.fillStyle = "#8A4B14";
        ctx.fill(d.caminho, "evenodd");
        ctx.restore();
        destaque(this.estado.selecionado, 2.6, "#8A4B14");
      }
    }

    if (this.limite) {
      ctx.strokeStyle = "rgba(52,38,20,.55)"; ctx.lineWidth = fio(1.8);
      ctx.stroke(this.limite);
    }
    // linha de contorno da folha
    if (papel && this.folha) {
      const f = this.folha;
      ctx.strokeStyle = "rgba(58,43,23,.5)";
      ctx.lineWidth = fio(1.2);
      ctx.strokeRect(f[0], f[1], f[2] - f[0], f[3] - f[1]);
    }
    ctx.restore();

    // --- 8. simbolos e rotulos (tamanho fixo em tela) ----------------------
    if (cam.has("assentamentos")) this.simbolos();
    if (cam.has("rotulos")) this.nomes();
    if (this.cartucho && im) {
      this.desenhaCartucho(this.rasters[this.estado.raster].b);
    }

    // --- 9. moldura da prancha: linha dupla, como numa folha impressa ------
    if (M) {
      ctx.restore();
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.strokeStyle = "rgba(40, 29, 15, .78)";
      ctx.lineWidth = 1.4;
      ctx.strokeRect(E + 0.7, M + 0.7, this.larg - M - E - 1.4, this.alt - 2 * M - 1.4);
      if (this.molduraDupla) {
        ctx.strokeStyle = "rgba(40, 29, 15, .34)";
        ctx.lineWidth = 0.8;
        const d = 5.5;
        ctx.strokeRect(E - d, M - d, this.larg - M - E + 2 * d, this.alt - 2 * M + 2 * d);
        this.desenhaTicks();
      }
    }

    if (this.sobreposicao) {
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.sobreposicao(ctx, (x, y) => [this.px(x), this.py(y)]);
    }
  }

  private rede(chave: string, cor: string, fio: (p: number) => number) {
    const { ctx } = this;
    ctx.strokeStyle = cor; ctx.lineWidth = fio(1.5);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.globalAlpha = 0.85;
    for (const l of this.redes[chave] ?? []) ctx.stroke(l.caminho);
    ctx.globalAlpha = 1;
  }

  /* Simbolos cartograficos, um para cada tipo, desenhados a mao: o mapa-fonte
     distingue sietch, vila pyon e estacao botanica por glifo, e reduzir tudo a
     bolinha colorida jogaria fora informacao que o desenho original carrega. */
  private simbolos() {
    const { ctx } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const tinta = TINTA_FORTE;
    ctx.lineWidth = 1.1;
    for (const a of this.assent) {
      const x = this.px(a.x), y = this.py(a.y);
      if (x < -20 || y < -20 || x > this.larg + 20 || y > this.alt + 20) continue;
      // knockout de papel sob o simbolo: sem ele o ponto se dissolve no terreno
      ctx.beginPath();
      ctx.arc(x, y, a.t === "capital" ? 11 : 5.4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(244,236,220,.88)";
      ctx.fill();
      ctx.strokeStyle = tinta; ctx.fillStyle = tinta;
      switch (a.t) {
        case "capital": {
          // Estrela dentro de circulo: a convencao de capital em carta, e um
          // glifo que nao se confunde nem com o losango do sietch nem com a
          // marca de escolha do painel.
          ctx.beginPath(); ctx.arc(x, y, 8.4, 0, Math.PI * 2);
          ctx.lineWidth = 1.3; ctx.stroke(); ctx.lineWidth = 1.1;
          ctx.beginPath();
          for (let i = 0; i < 10; i++) {
            const r = i % 2 === 0 ? 5.6 : 2.4;
            const a = -Math.PI / 2 + (i * Math.PI) / 5;
            const px_ = x + Math.cos(a) * r, py_ = y + Math.sin(a) * r;
            i === 0 ? ctx.moveTo(px_, py_) : ctx.lineTo(px_, py_);
          }
          ctx.closePath(); ctx.fill();
          break;
        }
        case "sietch": {                    // losango cheio
          ctx.beginPath();
          ctx.moveTo(x, y - 3.0); ctx.lineTo(x + 3.0, y);
          ctx.lineTo(x, y + 3.0); ctx.lineTo(x - 3.0, y);
          ctx.closePath(); ctx.fill();
          break;
        }
        case "pyon": {                      // quadrado vazado
          ctx.strokeRect(x - 2.6, y - 2.6, 5.2, 5.2);
          break;
        }
        default: {                          // estacao botanica: circulo + haste
          ctx.beginPath(); ctx.arc(x, y, 2.8, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x, y - 2.8); ctx.lineTo(x, y - 6); ctx.stroke();
        }
      }
    }
  }

  /* Rotulagem com as convencoes de carta, e nao "todo nome no mesmo corpo":
     tres degraus de tamanho por ordem de grandeza da feicao, italico para as
     feicoes de areia (o mesmo que um atlas faz com feicao hidrografica), halo
     para separar da trama do terreno, e nada de rotulo cruzando simbolo. */
  private nomes() {
    const { ctx } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const ocupado: number[][] = [];
    for (const z of this.zonasProibidas) {
      const r = z();
      if (r) ocupado.push([r[0] - 8, r[1] - 8, r[2] + 8, r[3] + 8]);
    }
    if (this.estado.camadas.has("assentamentos")) {
      for (const a of this.assent) {
        const x = this.px(a.x), y = this.py(a.y);
        ocupado.push([x - 6, y - 6, x + 6, y + 6]);
      }
    }
    for (const r of [...this.rotulos].sort((a, b) => b.area - a.area)) {
      const x = this.px(r.x), y = this.py(r.y);
      const ap = r.area * 1e6 * this.k * this.k;   // area aparente, em px2
      if (ap < 5200) continue;
      /* Quatro postos, como numa carta de verdade: o tamanho diz a ordem de
         grandeza da feicao e o ESTILO diz a classe dela. Italico para as
         feicoes de areia (o mesmo papel que a italica cumpre na hidrografia
         de um atlas terrestre), versalete mais espacejado para as bacias,
         romano fechado para rocha e crista. Rotular tudo no mesmo corpo e no
         mesmo estilo joga fora a informacao que o proprio nome carrega. */
      const grau = r.area > 3.2e6 ? 0 : r.area > 1.2e6 ? 1 : r.area > 4e5 ? 2 : 3;
      const corpo = [13, 11.5, 10, 8.8][grau];
      const d = this.tabela.get(r.cod);
      const classe = String(d?.terreno ?? "");
      const areia = String(d?.tipo_terr ?? "") === "Erg" || classe === "erg";
      const bacia = classe === "bacia";
      const peso = grau === 0 ? 600 : grau === 3 ? 400 : 500;
      const txt = r.nome.toUpperCase();
      ctx.font = `${areia ? "italic " : ""}${peso} ${corpo}px 'Archivo', sans-serif`;
      ctx.letterSpacing = bacia ? ["0.2em", "0.16em", "0.12em", "0.09em"][grau]
                                : ["0.15em", "0.11em", "0.08em", "0.06em"][grau];
      const l = ctx.measureText(txt).width + 10;
      const h = corpo * 0.75 + 6;
      const mg = this.margem + 8;
      const me = (this.margemEsq || this.margem) + 8;
      if (x - l / 2 < me || y - h < mg || x + l / 2 > this.larg - mg || y + h > this.alt - mg) {
        ctx.letterSpacing = "0px";
        continue;
      }
      const cx = [x - l / 2, y - h, x + l / 2, y + h];
      if (ocupado.some((o) => !(cx[2] < o[0] || cx[0] > o[2] || cx[3] < o[1] || cx[1] > o[3]))) {
        ctx.letterSpacing = "0px";
        continue;
      }
      ocupado.push(cx);
      ctx.lineWidth = [4.5, 4, 3.5, 3][grau];
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(244,236,220,1)";
      ctx.fillStyle = ["#241A0E", "#33240F", "#43331B", "#584428"][grau];
      // As feicoes maiores sao rotuladas ao longo do paralelo que passa por
      // elas. Numa azimutal polar o paralelo e' um circulo concentrico ao polo,
      // entao o arco nao e' enfeite: e' a direcao que a propria projecao dita.
      if (grau <= 1 && this.arco(txt, x, y, l)) {
        ctx.letterSpacing = "0px";
        continue;
      }
      ctx.strokeText(txt, x, y);
      ctx.fillText(txt, x, y);
      ctx.letterSpacing = "0px";
    }
  }

  /** Escreve o texto curvado sobre o paralelo que passa pelo ponto. Devolve
      false quando o raio e' curto demais para a curva valer a pena (perto do
      polo o arco fecharia sobre si mesmo). */
  private arco(txt: string, x: number, y: number, larguraPx: number): boolean {
    const { ctx } = this;
    const cx = this.px(0), cy = this.py(0);      // o polo, centro da projecao
    const raio = Math.hypot(x - cx, y - cy);
    if (raio < larguraPx * 1.6) return false;
    const meio = Math.atan2(y - cy, x - cx);
    const total = larguraPx / raio;              // angulo ocupado pelo texto
    // no hemisferio de baixo a curva inverteria o texto; le-se de dentro
    const paraCima = Math.sin(meio) < 0;
    const passo = paraCima ? 1 : -1;
    let ang = meio - (passo * total) / 2;
    for (const ch of txt) {
      const w = ctx.measureText(ch).width;
      const dA = w / raio;
      const a = ang + (passo * dA) / 2;
      ctx.save();
      ctx.translate(cx + Math.cos(a) * raio, cy + Math.sin(a) * raio);
      ctx.rotate(a + (paraCima ? Math.PI / 2 : -Math.PI / 2));
      ctx.strokeText(ch, 0, 0);
      ctx.fillText(ch, 0, 0);
      ctx.restore();
      ang += passo * dA;
    }
    return true;
  }

  /** Marcas de meridiano na calha da moldura. Numa prancha, a calha entre as
      duas linhas do neatline carrega as marcas de coordenada — e' ela que
      prova a projecao que o cartucho declara. Sem isso a moldura dupla e'
      so' enfeite citando uma projecao que o desenho nunca demonstra. */
  private desenhaTicks() {
    const { ctx } = this;
    const M = this.margem, E = this.margemEsq || this.margem;
    if (!M || !this.molduraDupla) return;
    const x0 = E, y0 = M, x1 = this.larg - M, y1 = this.alt - M;
    const cx = this.px(0), cy = this.py(0);
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.strokeStyle = "rgba(58,92,130,.6)";
    ctx.fillStyle = "rgba(52,38,20,.62)";
    ctx.lineWidth = 1;
    ctx.font = "400 8.5px 'IBM Plex Mono', monospace";
    ctx.letterSpacing = "0.08em";
    for (let lon = 0; lon < 360; lon += 30) {
      const d = (lon - 180) * Math.PI / 180;
      const dx = Math.sin(d), dy = Math.cos(d);   // py inverte o eixo y
      // primeiro cruzamento do raio com o retangulo da moldura
      let t = Infinity;
      if (dx > 1e-9) t = Math.min(t, (x1 - cx) / dx);
      if (dx < -1e-9) t = Math.min(t, (x0 - cx) / dx);
      if (dy > 1e-9) t = Math.min(t, (y1 - cy) / dy);
      if (dy < -1e-9) t = Math.min(t, (y0 - cy) / dy);
      if (!isFinite(t) || t <= 0) continue;
      const bx = cx + dx * t, by = cy + dy * t;
      if (bx < x0 - 1 || bx > x1 + 1 || by < y0 - 1 || by > y1 + 1) continue;
      const fora = 5.2;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + dx * fora, by + dy * fora);
      ctx.stroke();
      const rot = `${lon}°`;
      const w = ctx.measureText(rot).width;
      // o rotulo fica SEMPRE na calha entre as duas linhas da moldura
      const meio = M / 2 + 1;
      let lx = bx, ly = by;
      if (Math.abs(by - y0) < 1.5) ly = y0 - meio + 3;
      else if (Math.abs(by - y1) < 1.5) ly = y1 + meio + 3;
      else ly = by + 3;
      if (Math.abs(bx - x0) < 1.5) lx = x0 - meio;
      else if (Math.abs(bx - x1) < 1.5) lx = x1 + meio;
      lx = Math.min(Math.max(lx, w / 2 + 6), this.larg - w / 2 - 6);
      ly = Math.min(Math.max(ly, 11), this.alt - 5);
      ctx.fillText(rot, lx - w / 2, ly);
    }
    ctx.letterSpacing = "0px";
  }

  /* Cartucho: escala grafica e projecao desenhadas na prancha, na tinta da
     prancha. Um atlas poe isso dentro da folha; so' software poe numa barra
     de ferramentas ao lado dela. */
  private desenhaCartucho(b: [number, number, number, number]) {
    const { ctx } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    // ancorado no canto inferior esquerdo da area visivel, mas so' se esse
    // canto estiver de fato sobre a folha - tinta de mapa fora do papel some
    const x0 = Math.max(this.px(b[0]) + 30, this.recuoCartucho + this.margem + 26);
    const base = Math.min(this.py(b[1]) - 28, this.alt - this.margem - 26);
    if (base < 90 || x0 > this.larg - 380) return;
    if (this.mx(x0) < b[0] || this.my(base) < b[1]) return;

    const mpp = 1 / this.k;
    const bruto = mpp * 190;
    const exp = Math.pow(10, Math.floor(Math.log10(bruto)));
    const passo = [1, 2, 5, 10].map((f) => f * exp).find((v) => v >= bruto / 2) ?? exp;
    const largura = passo / mpp;

    // reserva de papel sob o cartucho: sem ela a legenda cruza a grade e as
    // fronteiras, que e' o detalhe que nenhuma carta impressa deixa passar
    const larguraCart = this.larg > 760 ? 344 : 236;
    ctx.fillStyle = "rgba(233, 219, 193, .82)";
    ctx.fillRect(x0 - 8, base - 40, larguraCart, 58);

    ctx.strokeStyle = "rgba(52,38,20,.8)";
    ctx.fillStyle = "rgba(52,38,20,.8)";
    ctx.lineWidth = 1;
    ctx.textBaseline = "alphabetic";

    // legenda da projecao, acima da barra
    ctx.textAlign = "left";
    ctx.font = "400 9.5px 'IBM Plex Mono', monospace";
    ctx.letterSpacing = "0.14em";
    ctx.fillText(this.larg < 620
      ? "AEQD · POLO NORTE · R = 6.371 KM"
      : "AZIMUTAL EQUIDISTANTE · POLO NORTE · R = 6.371 KM", x0, base - 30);
    if (this.larg > 760) {      // numa carta pequena a nota nao cabe sem colidir
      ctx.globalAlpha = 0.72;
      ctx.fillText("ESCALA EXATA AO LONGO DO RAIO", x0, base - 17);
      ctx.globalAlpha = 1;
    }

    // barra alternada em quatro trechos, com traco de divisao
    const n = 4, t = largura / n;
    for (let i = 0; i < n; i++) {
      if (i % 2 === 0) ctx.fillRect(x0 + i * t, base - 9, t, 5);
      else ctx.strokeRect(x0 + i * t + 0.5, base - 8.5, t - 1, 4);
    }
    ctx.strokeRect(x0 + 0.5, base - 8.5, largura - 1, 4);
    // risquinhos de divisao, que e' o que faz a barra parecer de carta
    for (let i = 0; i <= n; i++) {
      const tx = x0 + i * t;
      ctx.beginPath();
      ctx.moveTo(tx + 0.5, base - 9);
      ctx.lineTo(tx + 0.5, base - (i % 2 === 0 ? 14 : 11.5));
      ctx.stroke();
    }

    ctx.font = "500 10px 'IBM Plex Mono', monospace";
    ctx.letterSpacing = "0.06em";
    ctx.fillText("0", x0, base + 11);
    if (largura > 150) {          // so' rotula o meio quando ha' espaco para ele
      ctx.textAlign = "center";
      ctx.fillText((passo / 2000).toLocaleString("pt-BR"), x0 + largura / 2, base + 11);
    }
    ctx.textAlign = "right";
    ctx.fillText(`${(passo / 1000).toLocaleString("pt-BR")} km`, x0 + largura, base + 11);
    ctx.letterSpacing = "0px";
    ctx.textAlign = "left";
  }

  // --------------------------------------------------------- interacao ----
  private achou(px: number, py: number): string | null {
    const { ctx } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const x = this.mx(px), y = this.my(py);
    for (const d of this.distritos) {
      if (ctx.isPointInPath(d.caminho, x, y, "evenodd")) return d.cod;
    }
    return null;
  }

  private liga() {
    const t = this.tela;
    if (this.estatica) return;
    let arrastando = false, movido = false, ax = 0, ay = 0;

    t.addEventListener("pointerdown", (e) => {
      arrastando = true; movido = false; ax = e.offsetX; ay = e.offsetY;
      t.setPointerCapture(e.pointerId); t.classList.add("arrastando");
    });

    t.addEventListener("pointermove", (e) => {
      if (arrastando) {
        const dx = e.offsetX - ax, dy = e.offsetY - ay;
        if (Math.abs(dx) + Math.abs(dy) > 3) movido = true;
        this.tx += dx; this.ty += dy; ax = e.offsetX; ay = e.offsetY;
        this.desenha();
        return;
      }
      const cod = this.achou(e.offsetX, e.offsetY);
      if (cod !== this.hover) { this.hover = cod; this.desenha(); }
      this.aoMover(e.offsetX, e.offsetY, cod);
    });

    const solta = (e: PointerEvent) => {
      if (arrastando && !movido) {
        const cod = this.achou(e.offsetX, e.offsetY);
        this.estado.selecionado = cod;
        this.aoSelecionar(cod);
        this.desenha();
      }
      arrastando = false; t.classList.remove("arrastando");
    };
    t.addEventListener("pointerup", solta);
    t.addEventListener("pointercancel", () => { arrastando = false; t.classList.remove("arrastando"); });
    t.addEventListener("pointerleave", () => {
      if (this.hover) { this.hover = null; this.desenha(); }
      this.aoMover(-1, -1, null);
    });

    t.addEventListener("wheel", (e) => {
      e.preventDefault();
      const f = Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0016));
      this.zoom(f, e.offsetX, e.offsetY);
    }, { passive: false });

    // pinca em telas de toque
    let d0 = 0;
    t.addEventListener("touchmove", (e) => {
      if (e.touches.length !== 2) return;
      e.preventDefault();
      const [a, b] = [e.touches[0], e.touches[1]];
      const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      if (d0) {
        const r = t.getBoundingClientRect();
        this.zoom(d / d0, (a.clientX + b.clientX) / 2 - r.left,
                  (a.clientY + b.clientY) / 2 - r.top);
      }
      d0 = d;
    }, { passive: false });
    t.addEventListener("touchend", () => { d0 = 0; });
  }

  zoom(fator: number, cx = this.larg / 2, cy = this.alt / 2) {
    const kn = Math.max(this.k * 0.25, Math.min(this.k * 900, this.k * fator));
    if (kn === this.k) return;
    this.tx = cx - (cx - this.tx) * (kn / this.k);
    this.ty = cy - (cy - this.ty) * (kn / this.k);
    this.k = kn;
    this.desenha();
  }

  /** Metros por pixel — alimenta a barra de escala. */
  escala(): number { return 1 / this.k; }

  coordenada(px: number, py: number): [number, number] {
    return [this.mx(px), this.my(py)];
  }

  vaiPara(cod: string) {
    const r = this.rotulos.find((x) => x.cod === cod);
    if (!r) return;
    const alvo = Math.sqrt(2.2e10 / (r.area * 1e6));
    this.k = Math.min(alvo, this.k * 6);
    this.tx = this.larg / 2 - r.x * this.k;
    this.ty = this.alt / 2 + r.y * this.k;
    this.estado.selecionado = cod;
    this.desenha();
  }
}

/* ---------------------------------------------------------- utilidades --- */

function caminhoDe(f: Feature<Geometry, any>): Path2D {
  const p = new Path2D();
  const g = f.geometry;
  const anel = (a: Position[]) => {
    p.moveTo(a[0][0], a[0][1]);
    for (let i = 1; i < a.length; i++) p.lineTo(a[i][0], a[i][1]);
    p.closePath();
  };
  if (g.type === "Polygon") g.coordinates.forEach(anel);
  else if (g.type === "MultiPolygon") g.coordinates.forEach((q) => q.forEach(anel));
  else if (g.type === "LineString") {
    const a = g.coordinates;
    p.moveTo(a[0][0], a[0][1]);
    for (let i = 1; i < a.length; i++) p.lineTo(a[i][0], a[i][1]);
  } else if (g.type === "MultiLineString") {
    for (const a of g.coordinates) {
      p.moveTo(a[0][0], a[0][1]);
      for (let i = 1; i < a.length; i++) p.lineTo(a[i][0], a[i][1]);
    }
  }
  return p;
}

function linhas(fc?: FeatureCollection): Linha[] {
  return (fc?.features ?? []).map((f) => ({
    caminho: caminhoDe(f as Feature<Geometry, any>),
    props: (f.properties ?? {}) as Record<string, any>,
  }));
}

export function rotuloDeCampo(campo: string): string {
  return CAMPOS[campo]?.rot ?? campo;
}

export function valorFormatado(campo: string, v: unknown): string {
  const u = CAMPOS[campo]?.un;
  return formata(campo, v) + (u ? " " + u : "");
}

export { COR_PODER, COR_REGIAO };
