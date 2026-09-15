/* Glossário vivo.
 *
 * As definições são paráfrases do "Terminology of the Imperium", o glossário do
 * próprio livro 1 — cada uma com o marcador do verbete. O site marca a primeira
 * ocorrência de cada termo numa página; passar o mouse (ou tocar) mostra a
 * definição. A prancha do glossário lista tudo.
 *
 * `formas` são as grafias que aparecem no texto do site. Termos comuns demais
 * para marcar (especiaria, deserto) ficam sem formas: aparecem só na prancha.
 */

export interface Termo {
  id: string; termo: string; en: string; def: string; marca: string; formas: string[];
}

export const TERMOS: Termo[] = [
  { id: "arrakeen", termo: "Arrakeen", en: "Arrakeen", marca: "[1|terminology|10637]", formas: [],
    def: "O primeiro assentamento de Arrakis e, por muito tempo, a sede do governo do planeta." },
  { id: "asa", termo: "Asa", en: "carryall", marca: "[1|terminology|10709]", formas: [],
    def: "A \"asa\" voadora, burro de carga aéreo de Arrakis: leva as máquinas grandes de caçar, colher e refinar especiaria." },
  { id: "bene-gesserit", termo: "Bene Gesserit", en: "Bene Gesserit", marca: "[1|terminology|10672]", formas: ["Bene Gesserit"],
    def: "Escola antiga de treinamento mental e físico, sobretudo para mulheres, fundada depois que o Jihad Butleriano destruiu as \"máquinas pensantes\"." },
  { id: "bled", termo: "Bled", en: "bled", marca: "[1|terminology|10687]", formas: ["Bled", "Grande Bled"],
    def: "Deserto plano e aberto." },
  { id: "captador", termo: "Captador de vento", en: "windtrap", marca: "[1|terminology|11364]", formas: ["captadores de vento", "captador de vento"],
    def: "Aparelho posto no caminho do vento que tira a umidade do ar preso dentro dele, em geral com uma queda brusca de temperatura." },
  { id: "cavaleiro", termo: "Cavaleiro da areia", en: "sandrider", marca: "[1|terminology|11170]", formas: [],
    def: "Termo fremen para quem sabe capturar e montar um verme." },
  { id: "choam", termo: "CHOAM", en: "CHOAM", marca: "[1|terminology|10723]", formas: ["CHOAM"],
    def: "A corporação universal de desenvolvimento, controlada pelo Imperador e pelas Grandes Casas, com a Guilda e as Bene Gesserit de sócias silenciosas." },
  { id: "cielago", termo: "Cielago", en: "cielago", marca: "[1|terminology|10729]", formas: ["cielago", "cielagos"],
    def: "Morcego modificado de Arrakis, adaptado para levar mensagens gravadas por distrans." },
  { id: "colheitadeira", termo: "Colheitadeira", en: "sandcrawler", marca: "[1|terminology|11166]", formas: ["colheitadeira"],
    def: "Nome geral das máquinas que andam pela superfície de Arrakis caçando e colhendo melange." },
  { id: "coletor", termo: "Coletor de orvalho", en: "dew precipitator", marca: "[1|terminology|10761]", formas: ["coletores de orvalho", "coletor de orvalho"],
    def: "Ovo de cromoplástico de uns quatro centímetros que fica branco no sol e transparente no escuro. Esfria de madrugada e junta o orvalho; os fremen forram com eles as covas de plantio." },
  { id: "dagacristal", termo: "Dagacristal", en: "crysknife", marca: "[1|terminology|10743]", formas: ["dagacristal"],
    def: "A faca sagrada dos fremen, feita de dente de verme morto. A \"não fixada\" se desfaz longe do campo elétrico de um corpo humano." },
  { id: "depressao", termo: "Depressão", en: "sink", marca: "[1|terminology|11231]", formas: [],
    def: "Baixada habitável de Arrakis, cercada de terreno alto que a protege das tempestades." },
  { id: "erg", termo: "Erg", en: "erg", marca: "[1|terminology|10795]", formas: ["erg", "ergs"],
    def: "Grande área de dunas; um mar de areia." },
  { id: "fedaykin", termo: "Fedaykin", en: "Fedaykin", marca: "[1|terminology|10804]", formas: ["Fedaykin"],
    def: "Comandos suicidas fremen. Na origem, um grupo que jurava dar a vida para reparar uma injustiça." },
  { id: "fremen", termo: "Fremen", en: "Fremen", marca: "[1|terminology|10818]", formas: ["fremen"],
    def: "As tribos livres de Arrakis, que vivem no deserto, descendentes dos Andarilhos Zensunni. \"Piratas da areia\", segundo o Dicionário Imperial." },
  { id: "graben", termo: "Graben", en: "graben", marca: "[1|terminology|10850]", formas: ["graben"],
    def: "Vala geológica longa, formada quando o chão afunda por movimento das camadas da crosta." },
  { id: "guilda", termo: "Guilda", en: "Spacing Guild", marca: "[1|terminology|10864]", formas: ["Guilda"],
    def: "A Guilda Espacial, uma das pernas do tripé político que sustenta a Grande Convenção. Tem o monopólio da viagem e do transporte no espaço." },
  { id: "ibad", termo: "Olhos de Ibad", en: "eyes of Ibad", marca: "[1|terminology|10909]", formas: [],
    def: "Efeito de uma dieta rica em melange: o branco e a pupila dos olhos ficam azul-escuros, sinal de vício profundo." },
  { id: "kulon", termo: "Kulon", en: "kulon", marca: "[1|terminology|10968]", formas: ["kulon"],
    def: "O asno selvagem das estepes asiáticas da Terra, adaptado para Arrakis." },
  { id: "literjon", termo: "Literjon", en: "literjon", marca: "[1|terminology|10987]", formas: ["literjon", "literjons"],
    def: "Recipiente de um litro para levar água, de plástico duro e inquebrável, com vedação." },
  { id: "martelador", termo: "Martelador", en: "thumper", marca: "[1|terminology|11292]", formas: ["martelador"],
    def: "Estaca curta com um batedor de mola. Cravada na areia, bate — e chama shai-hulud." },
  { id: "melange", termo: "Melange", en: "melange", marca: "[1|terminology|11009]", formas: ["melange"],
    def: "A \"especiaria das especiarias\", que só Arrakis produz. Conhecida por prolongar a vida; vicia pouco em doses pequenas e muito acima de dois gramas por dia." },
  { id: "mentat", termo: "Mentat", en: "Mentat", marca: "[1|terminology|11015]", formas: ["mentat", "mentats"],
    def: "Cidadão treinado para o máximo da lógica. \"Computador humano.\"" },
  { id: "muaddib", termo: "Muad'Dib", en: "Muad'Dib", marca: "[1|terminology|11033]", formas: [],
    def: "O rato-canguru adaptado de Arrakis, ligado na mitologia fremen a um desenho visível na segunda lua. Os fremen o admiram por sobreviver no deserto aberto." },
  { id: "pyons", termo: "Pyons", en: "pyons", marca: "[1|terminology|11113]", formas: ["pyon", "pyons"],
    def: "Camponeses e trabalhadores presos ao planeta, uma das classes de base do Império. Legalmente, tutelados do planeta." },
  { id: "qanat", termo: "Qanat", en: "qanat", marca: "[1|terminology|11120]", formas: ["qanat", "qanats"],
    def: "Canal a céu aberto que leva água de irrigação pelo deserto, com controle." },
  { id: "sardaukar", termo: "Sardaukar", en: "Sardaukar", marca: "[1|terminology|11185]", formas: ["Sardaukar"],
    def: "Os soldados fanáticos do Imperador, criados num mundo tão feroz que matava seis de cada treze pessoas antes dos onze anos." },
  { id: "shai-hulud", termo: "Shai-hulud", en: "Shai-hulud", marca: "[1|terminology|11206]", formas: ["shai-hulud"],
    def: "O verme de areia de Arrakis — o Velho do Deserto, Velho Pai Eternidade, Avô do Deserto. Com certo tom, ou com maiúsculas, é o nome da divindade da terra dos fremen." },
  { id: "sietch", termo: "Sietch", en: "sietch", marca: "[1|terminology|11227]", formas: ["sietch", "sietches"],
    def: "Em fremen, \"lugar de reunião em tempo de perigo\". Pelo uso, qualquer caverna habitada por uma comunidade tribal." },
  { id: "solari", termo: "Solari", en: "solari", marca: "[1|terminology|11243]", formas: ["solaris", "solari"],
    def: "A moeda oficial do Império. O poder de compra é negociado a cada quatrocentos anos entre a Guilda, o Landsraad e o Imperador." },
  { id: "tempestade", termo: "Tempestade de Coriolis", en: "Coriolis storm", marca: "[1|terminology|10735]", formas: ["tempestade de Coriolis"],
    def: "Grande tempestade de areia em que o giro do próprio planeta amplifica o vento sobre as planícies abertas, até 700 km/h." },
  { id: "tenda", termo: "Tenda destiladora", en: "stilltent", marca: "[1|terminology|11268]", formas: ["tenda destiladora"],
    def: "Abrigo pequeno e vedável, do mesmo tecido do trajestil, que recupera como água potável a umidade da respiração de quem está dentro." },
  { id: "toptero", termo: "Tóptero", en: "ornithopter", marca: "[1|terminology|11062]", formas: ["tóptero", "tópteros"],
    def: "Qualquer aeronave capaz de voo sustentado batendo as asas, como as aves." },
  { id: "trajestil", termo: "Trajestil", en: "stillsuit", marca: "[1|terminology|11266]", formas: ["trajestil"],
    def: "Traje inventado em Arrakis. O tecido em camadas dissipa o calor e filtra os resíduos do corpo; a umidade recuperada volta por um tubo." },
  { id: "usul", termo: "Usul", en: "Usul", marca: "[1|terminology|11325]", formas: [],
    def: "Em fremen, \"a base do pilar\"." },
];

/* ------------------------------------------------------------ marcação --- */

const PROIBIDO = "a, code, button, h1, h2, h3, svg, figcaption, .termo, .sumario, .cabecalho-site, .marca, .marcador, .etapa-n, script, style";

export function ligaGlossario(raiz: HTMLElement) {
  const achados = new Set<string>();
  const ordem = TERMOS.flatMap((t) => t.formas.map((f) => ({ t, f })))
    .sort((a, b) => b.f.length - a.f.length);        // "captadores de vento" antes de "vento"
  const walker = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement?.closest(PROIBIDO) || !n.nodeValue?.trim())
      ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  const nos: Text[] = [];
  while (walker.nextNode()) nos.push(walker.currentNode as Text);

  while (nos.length) {
    const no = nos.shift()!;
    for (const { t, f } of ordem) {
      if (achados.has(t.id)) continue;
      const re = new RegExp(`(?<![\\p{L}\\p{N}-])${f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{N}-])`, "iu");
      const texto = no.nodeValue ?? "";
      const m = re.exec(texto);
      if (!m) continue;
      achados.add(t.id);
      const depois = no.splitText(m.index);
      const resto = depois.splitText(m[0].length);
      nos.unshift(no, resto);                         // o que veio antes e depois do termo ainda pode ter outros
      const el = document.createElement("span");
      el.className = "termo"; el.tabIndex = 0; el.dataset.t = t.id;
      el.setAttribute("role", "button");
      el.setAttribute("aria-describedby", "dica-termo");
      el.textContent = depois.nodeValue;
      depois.replaceWith(el);
      break;
    }
  }
  ligaDica(raiz);
}

let dica: HTMLElement | null = null;
function ligaDica(raiz: HTMLElement) {
  if (!dica) {
    dica = document.createElement("div");
    dica.id = "dica-termo"; dica.className = "dica-termo"; dica.setAttribute("role", "tooltip"); dica.hidden = true;
    document.body.appendChild(dica);
  }
  const mostra = (el: HTMLElement) => {
    const t = TERMOS.find((x) => x.id === el.dataset.t);
    if (!t || !dica) return;
    dica.innerHTML = `<b>${t.termo}</b> <i>${t.en}</i><p>${t.def}</p><code>${t.marca}</code>`;
    dica.hidden = false;
    const r = el.getBoundingClientRect(), w = Math.min(340, window.innerWidth - 24);
    dica.style.width = w + "px";
    const x = Math.max(12, Math.min(window.innerWidth - w - 12, r.left + r.width / 2 - w / 2));
    const h = dica.offsetHeight;
    const y = r.top - h - 10 > 8 ? r.top - h - 10 : r.bottom + 10;
    dica.style.left = x + "px"; dica.style.top = y + "px";
  };
  const esconde = () => { if (dica) dica.hidden = true; };
  raiz.querySelectorAll<HTMLElement>(".termo").forEach((el) => {
    el.addEventListener("mouseenter", () => mostra(el));
    el.addEventListener("mouseleave", esconde);
    el.addEventListener("focus", () => mostra(el));
    el.addEventListener("blur", esconde);
    el.addEventListener("click", (e) => { e.stopPropagation(); dica?.hidden ? mostra(el) : esconde(); });
  });
  window.addEventListener("scroll", esconde, { passive: true });
  document.addEventListener("click", esconde);
}
