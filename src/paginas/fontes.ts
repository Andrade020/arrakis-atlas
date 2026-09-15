import { plac, prancha, secao } from "../pranchas";
import { docs, tabelas } from "../dados";
import { blocos, cabecalho, esc, rodape, selo } from "../ui";

/* Onde cada estampa aparece, para a tabela de creditos nao listar so' codigo. */
const ONDE: Record<string, string> = {
  R1: `${prancha("regioes")} · Bacia Polar`, R2: `${prancha("regioes")} · Muralha Escudo`,
  R3: `${prancha("regioes")} · Bacia Imperial`, R4: `${prancha("regioes")} · Falsas Muralhas`,
  R5: `${prancha("regioes")} · Planaltos Orientais`, R6: `${prancha("regioes")} · Grandes Ergs`,
  R7: `${prancha("regioes")} · Ergs Exteriores`,
  c_padroes: `Abertura · cartão da ${prancha("padroes").toLowerCase()}`,
  c_acessibilidade: `Abertura · cartão da ${prancha("acessibilidade").toLowerCase()}`,
  c_poder: `Abertura · cartão da ${prancha("poder").toLowerCase()}`,
  papel: "Fundo de papel do site inteiro",
};

export async function fontes(alvo: HTMLElement) {
  const [d, t, ilus] = await Promise.all([
    docs(), tabelas(),
    fetch(import.meta.env.BASE_URL + "ilustracoes/ilustracoes.json")
      .then((r) => r.json()).catch(() => ({})),
  ]);
  const vidaIl = await fetch(import.meta.env.BASE_URL + "ilustracoes/vida.json")
    .then((r) => r.json()).catch(() => ({}));

  const comp = (t.comparacao ?? []) as any[];
  const reais = [...new Map(comp.map((c) => [c.fonte, c])).values()];
  const ext = (t.externas ?? {}) as any;
  const listaExt: any[] = Array.isArray(ext) ? ext
    : Array.isArray(ext.fontes) ? ext.fontes
    : Object.values(ext).filter((v: any) => v && typeof v === "object" && v.titulo);

  alvo.innerHTML = `<article class="folha">
    ${cabecalho(`${prancha("fontes")} · Fontes e créditos`,
      "De onde vem cada coisa",
      "Os livros de Frank Herbert, um mapa redesenhado por um fã, três bases de dados reais e uma simulação de clima que discorda do livro. Quando as fontes discordam, vale essa ordem.")}
    <div class="corpo">

      <h2><span class="g">${secao("fontes", 1)}</span><span>O mapa</span></h2>
      <div style="border-left:2px solid var(--canone);padding:4px 0 4px 22px;margin:20px 0 26px;max-width:64ch">
        <div style="font:500 9.5px/1 var(--f-mono);letter-spacing:.16em;text-transform:uppercase;color:var(--canone)">Crédito principal</div>
        <p style="margin:12px 0 0;font:300 21px/1.4 var(--f-text)">
          A base cartográfica deste atlas é o redesenho do mapa de Arrakis feito por
          <strong>NiptonIceTea</strong>.
        </p>
        <p style="margin:12px 0 0;font:300 16px/1.6 var(--f-text);color:var(--tinta-2)">
          O mapa impresso no apêndice de Duna (atribuído a de Fontaine, 1965) chega
          cortado nas quatro bordas, e o pedaço que falta inclui distritos inteiros.
          NiptonIceTea redesenhou a folha completa. Sem esse trabalho não daria para medir
          áreas, acertar a escala pelo círculo dos 60° nem dividir o planeta sem deixar
          buracos.
        </p>
        <p style="margin:12px 0 0;font:400 12.5px/1.6 var(--f-disp);color:var(--tinta-3)">
          O mapa impresso original foi usado como <strong>controle</strong>. Os dois
          foram posicionados na projeção separadamente, e três pontos coincidem com
          diferença de 7 a 127 km, num território de 11 307 km de ponta a ponta. O
          redesenho não distorceu a geometria.
        </p>
      </div>

      <h2><span class="g">${secao("fontes", 2)}</span><span>Hierarquia de autoridade</span></h2>
      ${d.FONTES ? blocos(d.FONTES, { pularAte: 2 }) : ""}

      <h2><span class="g">${secao("fontes", 3)}</span><span>Dados do mundo real</span></h2>
      <p>Aparecem só na prancha de comparação. Em cada par fica dito se o número de
      Arrakis foi medido ou simulado.</p>
      <div class="tabela"><table>
        <thead><tr><th>Fonte</th><th>Ano</th><th>Usada em</th></tr></thead>
        <tbody>${reais.map((r) => `<tr>
          <td>${r.fonte_url ? `<a class="link" href="${esc(r.fonte_url)}" target="_blank" rel="noopener">${esc(r.fonte)}</a>` : esc(r.fonte)}</td>
          <td class="num">${esc(r.fonte_ano ?? "—")}</td>
          <td>${esc(comp.filter((c) => c.fonte === r.fonte).map((c) => c.indicador).join(" · "))}</td>
        </tr>`).join("")}</tbody>
      </table></div>

      <h2><span class="g">${secao("fontes", 4)}</span><span>Fora do cânone</span></h2>
      <p>Material usado <strong>só para comparar</strong>. Nada daqui muda um número
      dos distritos.</p>
      ${listaExt.length ? `<div class="tabela"><table>
        <thead><tr><th>Item</th><th>O que é</th><th>Uso permitido</th></tr></thead>
        <tbody>${listaExt.map((f: any) => `<tr>
          <td>${f.url ? `<a class="link" href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.titulo ?? f.nome)}</a>` : esc(f.titulo ?? f.nome)}
            ${f.autores ? `<div style="margin-top:4px;font-size:11.5px;color:var(--tinta-3)">${esc(f.autores)}${f.ano ? ", " + esc(f.ano) : ""}</div>` : ""}</td>
          <td>${esc(f.natureza ?? f.tipo ?? "—")}<div style="margin-top:5px">${selo(f.classe ?? "EXTERNO_NAO_CANONE")}</div></td>
          <td>${esc(f.uso ?? f.nota ?? "—")}</td>
        </tr>`).join("")}</tbody>
      </table></div>` : ""}

      <p class="nota">Jogos ambientados em Duna ajudaram a imaginar que tipo de
      instalação faz sentido num distrito e em que escala. Nenhum número de jogo entrou
      nos dados.</p>

      <h2><span class="g">${secao("fontes", 5)}</span><span>As ilustrações</span></h2>
      <p>As imagens da prancha das regiões e dos cartões da abertura foram
      <strong>geradas por modelos de imagem</strong> e depois tingidas em sépia para
      combinar com o papel. Não são dados nem vêm do livro, e não entram em nenhuma
      medida. Estão aí porque um atlas impresso teria gravuras. Abaixo está o pedido
      feito para cada uma.</p>
      <p class="nota">Todas usam o mesmo pedido de estilo (<em>fotografia
      monocromática de expedição em grande formato, fotogravura colada numa monografia
      científica, luz rasante, sem texto e sem moldura</em>) mais a cena de cada uma. O
      modelo é
      <code>black-forest-labs/flux-1.1-pro</code>, exceto a fibra de papel,
      em <code>flux-dev</code>.</p>
      <div class="tabela"><table>
        <thead><tr><th>Onde aparece</th><th>Cena pedida</th></tr></thead>
        <tbody>${Object.entries(ilus as Record<string, any>).map(([k, v]) => `<tr>
          <td>${esc(ONDE[k] ?? k)}</td>
          <td style="color:var(--tinta-3)">${esc(String(v.prompt).split(". large-format")[0].split(". extreme")[0])}</td>
        </tr>`).join("")}</tbody>
      </table></div>

      <p>As imagens das pranchas ${plac("verme")} e ${plac("vida")} (o verme, os bichos
      e as plantas) foram pedidas de outro jeito. Nenhuma partiu de cena de filme ou de
      fan-art, porque descrever uma imagem protegida para gerar outra parecida ainda é
      copiar. Cada cena foi escrita <strong>a partir do trecho do Herbert</strong> que a
      descreve, indicado ao lado. Quando o livro nomeia um bicho real, como o
      rato-canguru, o falcão ou o asno selvagem, ele serviu de referência.</p>
      <div class="tabela"><table>
        <thead><tr><th>Estampa</th><th>Trecho que a sustenta</th><th>Cena pedida</th></tr></thead>
        <tbody>${Object.entries(vidaIl as Record<string, any>).map(([k, v]) => `<tr>
          <td>${esc(k.replace(/_/g, " "))}</td>
          <td>${(v.texto as string[]).map((m) => `<span class="marcador">${esc(m)}</span>`).join(" ")}</td>
          <td style="color:var(--tinta-3)">${esc(String(v.prompt))}</td>
        </tr>`).join("")}</tbody>
      </table></div>

      <p class="nota">O movimento dos três cartões da abertura veio de
      <code>bytedance/seedance-1-lite</code>, animando as próprias estampas com a
      câmera travada. As dunas da abertura, do cabeçalho e do índice são
      <code>black-forest-labs/flux-1.1-pro-ultra</code>, com o céu escurecido depois.
      O planeta que gira na abertura não saiu de modelo de imagem nem do mapa: é uma
      esfera desenhada quadro a quadro por programa, com relevo inventado. Mostra como
      Arrakis poderia parecer de longe, e não onde fica cada coisa.</p>

      <h2><span class="g">${secao("fontes", 6)}</span><span>Reprodutibilidade</span></h2>
      <p>Todo o atlas sai de scripts, da imagem do mapa até o site, nesta ordem:
      georreferenciar, extrair símbolos, classificar terreno, dividir em distritos,
      vetorizar, calcular variáveis, estilos, projeto QGIS, análises e exportação. No fim,
      <code>scripts/10_conferir.py</code> faz <strong>133 conferências</strong> de
      geometria, totais, origem dos dados e fidelidade ao livro, e nada é publicado com
      alguma delas falhando.</p>
      <p class="nota">O site lê os mesmos arquivos que o QGIS abre, com a mesma projeção
      e os mesmos números.</p>

      <h2><span class="g">${secao("fontes", 7)}</span><span>Aviso</span></h2>
      <p>Duna e Arrakis são criação de Frank Herbert, e os direitos pertencem a seus
      detentores. Este é um trabalho de estudo em geografia econômica, sem fim comercial
      e sem vínculo com eles. A base cartográfica é usada com crédito ao autor. Os números
      simulados não fazem parte da obra; foram criados aqui para análise e estão marcados
      em todo lugar onde aparecem.</p>
    </div>
    ${rodape()}
  </article>`;
}
