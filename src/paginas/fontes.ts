import { plac, prancha, secao } from "../pranchas";
import { docs, tabelas } from "../dados";
import { blocos, cabecalho, esc, rodape, selo } from "../ui";
import { t as tr, emIngles } from "../i18n";

/* Onde cada estampa aparece, para a tabela de creditos nao listar so' codigo.
   É função porque o nome da prancha depende da língua do momento. */
const onde = (): Record<string, string> => ({
  R1: `${prancha("regioes")} · ${tr("Bacia Polar", "Polar Basin")}`, R2: `${prancha("regioes")} · ${tr("Muralha Escudo", "Shield Wall")}`,
  R3: `${prancha("regioes")} · ${tr("Bacia Imperial", "Imperial Basin")}`, R4: `${prancha("regioes")} · ${tr("Falsas Muralhas", "False Walls")}`,
  R5: `${prancha("regioes")} · ${tr("Planaltos Orientais", "Eastern Highlands")}`, R6: `${prancha("regioes")} · ${tr("Grandes Ergs", "Great Ergs")}`,
  R7: `${prancha("regioes")} · ${tr("Ergs Exteriores", "Outer Ergs")}`,
  c_padroes: tr(`Abertura · cartão da ${prancha("padroes").toLowerCase()}`, `Opening · card for ${prancha("padroes").toLowerCase()}`),
  c_acessibilidade: tr(`Abertura · cartão da ${prancha("acessibilidade").toLowerCase()}`, `Opening · card for ${prancha("acessibilidade").toLowerCase()}`),
  c_poder: tr(`Abertura · cartão da ${prancha("poder").toLowerCase()}`, `Opening · card for ${prancha("poder").toLowerCase()}`),
  papel: tr("Fundo de papel do site inteiro", "Paper background for the whole site"),
});

const INDICADOR_EN: Record<string, string> = {
  "Gini das áreas das unidades": "Gini of unit areas",
  "Razão entre a maior e a menor unidade": "Largest-to-smallest unit ratio",
  "Território cartografado": "Mapped territory",
  "Parcela de um único produto no produto": "Share of a single product in output",
  "Parcela que fica com quem extrai": "Share kept by the producer",
  "Parcela do produto nos 5 maiores distritos": "Share of output in the 5 largest districts",
};
const EXTERNA_EN: Record<string, [string, string]> = {
  "EXT-1": ["Science communication, not a peer-reviewed paper. The authors describe it as a spare-time project to explain climate science.",
            "Comparison only"],
  "JOGO-1": ["Not canon. A licensed adaptation with creative freedom; the game series added things Herbert never wrote.",
             "Modelling ideas only"],
};

export async function fontes(alvo: HTMLElement) {
  const [d, t, ilus] = await Promise.all([
    docs(), tabelas(),
    fetch(import.meta.env.BASE_URL + "ilustracoes/ilustracoes.json")
      .then((r) => r.json()).catch(() => ({})),
  ]);
  const vidaIl = await fetch(import.meta.env.BASE_URL + "ilustracoes/vida.json")
    .then((r) => r.json()).catch(() => ({}));

  const en = emIngles();
  const ONDE = onde();
  const comp = (t.comparacao ?? []) as any[];
  const reais = [...new Map(comp.map((c) => [c.fonte, c])).values()];
  const ext = (t.externas ?? {}) as any;
  const listaExt: any[] = Array.isArray(ext) ? ext
    : Array.isArray(ext.fontes) ? ext.fontes
    : Object.values(ext).filter((v: any) => v && typeof v === "object" && v.titulo);
  const fontesDoc = en ? (d.FONTES_EN ?? d.FONTES) : d.FONTES;
  const nomeFonte = (f: string) => (en && f.startsWith("Cadeia do cacau") ? "Cocoa supply chain — producer share of the final price" : f);

  alvo.innerHTML = `<article class="folha">
    ${cabecalho(`${prancha("fontes")} · ${tr("Fontes e créditos", "Sources and credits")}`,
      tr("De onde vem cada coisa", "Where everything comes from"),
      tr("Os livros de Frank Herbert, um mapa redesenhado por um fã, três bases de dados reais e uma simulação de clima que discorda do livro. Quando as fontes discordam, vale essa ordem.",
         "Frank Herbert's books, a map redrawn by a fan, three real-world datasets and a climate simulation that disagrees with the book. When sources disagree, that is the order that wins."))}
    <div class="corpo">

      <h2><span class="g">${secao("fontes", 1)}</span><span>${tr("O mapa", "The map")}</span></h2>
      <div style="border-left:2px solid var(--canone);padding:4px 0 4px 22px;margin:20px 0 26px;max-width:64ch">
        <div style="font:500 9.5px/1 var(--f-mono);letter-spacing:.16em;text-transform:uppercase;color:var(--canone)">${tr("Crédito principal", "Main credit")}</div>
        <p style="margin:12px 0 0;font:300 21px/1.4 var(--f-text)">
          ${tr(`A base cartográfica deste atlas é o redesenho do mapa de Arrakis feito por
          <strong>NiptonIceTea</strong>.`, `The base map of this atlas is the redrawing of the map of Arrakis by
          <strong>NiptonIceTea</strong>.`)}
        </p>
        <p style="margin:12px 0 0;font:300 16px/1.6 var(--f-text);color:var(--tinta-2)">
          ${tr(`O mapa impresso no apêndice de Duna (atribuído a de Fontaine, 1965) chega
          cortado nas quatro bordas, e o pedaço que falta inclui distritos inteiros.
          NiptonIceTea redesenhou a folha completa. Sem esse trabalho não daria para medir
          áreas, acertar a escala pelo círculo dos 60° nem dividir o planeta sem deixar
          buracos.`, `The map printed in the appendix of Dune (credited to de Fontaine, 1965) comes cropped
          on all four sides, and the missing part includes whole districts. NiptonIceTea redrew
          the complete sheet. Without that work there would be no way to measure areas, set the
          scale by the 60° circle, or divide the planet without leaving gaps.`)}
        </p>
        <p style="margin:12px 0 0;font:400 12.5px/1.6 var(--f-disp);color:var(--tinta-3)">
          ${tr(`O mapa impresso original foi usado como <strong>controle</strong>. Os dois
          foram posicionados na projeção separadamente, e três pontos coincidem com
          diferença de 7 a 127 km, num território de 11 307 km de ponta a ponta. O
          redesenho não distorceu a geometria.`, `The original printed map was used as a
          <strong>check</strong>. The two were placed on the projection separately, and three points
          match to within 7 to 127 km across a territory 11,307 km from end to end. The redrawing
          did not distort the geometry.`)}
        </p>
      </div>

      <h2><span class="g">${secao("fontes", 2)}</span><span>${tr("Hierarquia de autoridade", "Order of authority")}</span></h2>
      ${fontesDoc ? blocos(fontesDoc, { pularAte: 2 }) : ""}

      <h2><span class="g">${secao("fontes", 3)}</span><span>${tr("Dados do mundo real", "Real-world data")}</span></h2>
      <p>${tr(`Aparecem só na prancha de comparação. Em cada par fica dito se o número de
      Arrakis foi medido ou simulado.`, `These appear only on the comparison plate. Each pair says whether the
      Arrakis figure was measured or simulated.`)}</p>
      <div class="tabela"><table>
        <thead><tr><th>${tr("Fonte", "Source")}</th><th>${tr("Ano", "Year")}</th><th>${tr("Usada em", "Used for")}</th></tr></thead>
        <tbody>${reais.map((r) => `<tr>
          <td>${r.fonte_url ? `<a class="link" href="${esc(r.fonte_url)}" target="_blank" rel="noopener">${esc(nomeFonte(r.fonte))}</a>` : esc(nomeFonte(r.fonte))}</td>
          <td class="num">${esc(r.fonte_ano ?? "—")}</td>
          <td>${esc(comp.filter((c) => c.fonte === r.fonte).map((c) => en ? (INDICADOR_EN[c.indicador] ?? c.indicador) : c.indicador).join(" · "))}</td>
        </tr>`).join("")}</tbody>
      </table></div>

      <h2><span class="g">${secao("fontes", 4)}</span><span>${tr("Fora do cânone", "Outside the canon")}</span></h2>
      <p>${tr(`Material usado <strong>só para comparar</strong>. Nada daqui muda um número
      dos distritos.`, `Material used <strong>only for comparison</strong>. Nothing here changes a
      district figure.`)}</p>
      ${listaExt.length ? `<div class="tabela"><table>
        <thead><tr><th>${tr("Item", "Item")}</th><th>${tr("O que é", "What it is")}</th><th>${tr("Uso permitido", "Allowed use")}</th></tr></thead>
        <tbody>${listaExt.map((f: any) => {
          const e = en ? EXTERNA_EN[f.id] : undefined;
          return `<tr>
          <td>${f.url ? `<a class="link" href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.titulo ?? f.nome)}</a>` : esc(f.titulo ?? f.nome)}
            ${f.autores ? `<div style="margin-top:4px;font-size:11.5px;color:var(--tinta-3)">${esc(f.autores)}${f.ano ? ", " + esc(f.ano) : ""}</div>` : ""}</td>
          <td>${esc(e ? e[0] : (f.natureza ?? f.tipo ?? "—"))}<div style="margin-top:5px">${selo(f.classe ?? "EXTERNO_NAO_CANONE")}</div></td>
          <td>${esc(e ? e[1] : (f.uso ?? f.nota ?? "—"))}</td>
        </tr>`;
        }).join("")}</tbody>
      </table></div>` : ""}

      <p class="nota">${tr(`Jogos ambientados em Duna ajudaram a imaginar que tipo de
      instalação faz sentido num distrito e em que escala. Nenhum número de jogo entrou
      nos dados.`, `Games set in the Dune universe helped us imagine what kind of installation makes
      sense in a district, and at what scale. No number from a game went into the data.`)}</p>

      <h2><span class="g">${secao("fontes", 5)}</span><span>${tr("As ilustrações", "The illustrations")}</span></h2>
      <p>${tr(`As imagens da prancha das regiões e dos cartões da abertura foram
      <strong>geradas por modelos de imagem</strong> e depois tingidas em sépia para
      combinar com o papel. Não são dados nem vêm do livro, e não entram em nenhuma
      medida. Estão aí porque um atlas impresso teria gravuras. Abaixo está o pedido
      feito para cada uma.`, `The pictures on the regions plate and the opening cards were
      <strong>generated by image models</strong> and then toned sepia to match the paper. They
      are not data, they don't come from the book, and they don't enter any measurement. They are
      there because a printed atlas would have plates. Below is the request made for each one.`)}</p>
      <p class="nota">${tr(`Todas usam o mesmo pedido de estilo (<em>fotografia
      monocromática de expedição em grande formato, fotogravura colada numa monografia
      científica, luz rasante, sem texto e sem moldura</em>) mais a cena de cada uma. O
      modelo é`, `All of them use the same style request (<em>large-format monochrome expedition
      photograph, photogravure plate tipped into a scientific monograph, raking light, no text and
      no border</em>) plus the scene for each. The model is`)}
      <code>black-forest-labs/flux-1.1-pro</code>, ${tr("exceto a fibra de papel, em", "except the paper texture, made with")} <code>flux-dev</code>.</p>
      <div class="tabela"><table>
        <thead><tr><th>${tr("Onde aparece", "Where it appears")}</th><th>${tr("Cena pedida", "Scene requested")}</th></tr></thead>
        <tbody>${Object.entries(ilus as Record<string, any>).map(([k, v]) => `<tr>
          <td>${esc(ONDE[k] ?? k)}</td>
          <td style="color:var(--tinta-3)">${esc(String(v.prompt).split(". large-format")[0].split(". extreme")[0])}</td>
        </tr>`).join("")}</tbody>
      </table></div>

      <p>${tr(`As imagens das pranchas ${plac("verme")} e ${plac("vida")} (o verme, os bichos
      e as plantas) foram pedidas de outro jeito. Nenhuma partiu de cena de filme ou de
      fan-art, porque descrever uma imagem protegida para gerar outra parecida ainda é
      copiar. Cada cena foi escrita <strong>a partir do trecho do Herbert</strong> que a
      descreve, indicado ao lado. Quando o livro nomeia um bicho real, como o
      rato-canguru, o falcão ou o asno selvagem, ele serviu de referência.`,
      `The pictures on plates ${plac("verme")} and ${plac("vida")} (the worm, the animals and the plants)
      were requested differently. None started from a film still or fan art, because describing a
      protected image to generate a similar one is still copying. Each scene was written
      <strong>from the Herbert passage</strong> that describes it, listed alongside. When the book
      names a real animal, like the kangaroo mouse, the hawk or the wild ass, that animal served as
      a reference.`)}</p>
      <div class="tabela"><table>
        <thead><tr><th>${tr("Estampa", "Plate")}</th><th>${tr("Trecho que a sustenta", "Supporting passage")}</th><th>${tr("Cena pedida", "Scene requested")}</th></tr></thead>
        <tbody>${Object.entries(vidaIl as Record<string, any>).map(([k, v]) => `<tr>
          <td>${esc(k.replace(/_/g, " "))}</td>
          <td>${(v.texto as string[]).map((m) => `<span class="marcador">${esc(m)}</span>`).join(" ")}</td>
          <td style="color:var(--tinta-3)">${esc(String(v.prompt))}</td>
        </tr>`).join("")}</tbody>
      </table></div>

      <p class="nota">${tr(`O movimento dos três cartões da abertura veio de
      <code>bytedance/seedance-1-lite</code>, animando as próprias estampas com a
      câmera travada. As dunas da abertura, do cabeçalho e do índice são
      <code>black-forest-labs/flux-1.1-pro-ultra</code>, com o céu escurecido depois.
      O planeta que gira na abertura não saiu de modelo de imagem nem do mapa: é uma
      esfera desenhada quadro a quadro por programa, com relevo inventado. Mostra como
      Arrakis poderia parecer de longe, e não onde fica cada coisa.`,
      `The motion in the three opening cards came from <code>bytedance/seedance-1-lite</code>,
      animating the plates themselves with a locked camera. The dunes on the opening page, the
      header and the contents are <code>black-forest-labs/flux-1.1-pro-ultra</code>, with the sky
      darkened afterwards. The spinning planet on the opening page didn't come from an image model
      or from the map: it is a sphere drawn frame by frame by a program, with invented relief. It
      shows how Arrakis might look from far away, not where anything is.`)}</p>

      <h2><span class="g">${secao("fontes", 6)}</span><span>${tr("Reprodutibilidade", "Reproducibility")}</span></h2>
      <p>${tr(`Todo o atlas sai de scripts, da imagem do mapa até o site, nesta ordem:
      georreferenciar, extrair símbolos, classificar terreno, dividir em distritos,
      vetorizar, calcular variáveis, estilos, projeto QGIS, análises e exportação. No fim,
      <code>scripts/10_conferir.py</code> faz <strong>133 conferências</strong> de
      geometria, totais, origem dos dados e fidelidade ao livro, e nada é publicado com
      alguma delas falhando.`, `The whole atlas is produced by scripts, from the map image to the site,
      in this order: georeferencing, symbol extraction, terrain classification, districting,
      vectorising, variables, styles, QGIS project, analyses and export. At the end,
      <code>scripts/10_conferir.py</code> runs <strong>133 checks</strong> on geometry, totals, data
      origin and faithfulness to the book, and nothing is published while any of them fails.`)}</p>
      <p class="nota">${tr(`O site lê os mesmos arquivos que o QGIS abre, com a mesma projeção
      e os mesmos números.`, `The site reads the same files QGIS opens, with the same projection and the
      same numbers.`)}</p>

      <h2><span class="g">${secao("fontes", 7)}</span><span>${tr("Aviso", "Notice")}</span></h2>
      <p>${tr(`Duna e Arrakis são criação de Frank Herbert, e os direitos pertencem a seus
      detentores. Este é um trabalho de estudo em geografia econômica, sem fim comercial
      e sem vínculo com eles. A base cartográfica é usada com crédito ao autor. Os números
      simulados não fazem parte da obra; foram criados aqui para análise e estão marcados
      em todo lugar onde aparecem.`, `Dune and Arrakis are Frank Herbert's creation, and the rights belong
      to their holders. This is a study project in economic geography, non-commercial and with no
      link to them. The base map is used with credit to its author. The simulated numbers are not
      part of the work; they were created here for analysis and are marked wherever they appear.`)}</p>
    </div>
    ${rodape()}
  </article>`;
}
