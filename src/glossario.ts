import { emIngles } from "./i18n";
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
  termo_en?: string; formas_en?: string[]; def_en?: string;
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
    def: "Estaca curta com um batedor de mola. Cravada na areia, bate sem parar e chama shai-hulud." },
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
    def: "O verme de areia de Arrakis, também chamado Velho do Deserto, Velho Pai Eternidade e Avô do Deserto. Com certo tom, ou com maiúsculas, é o nome da divindade da terra dos fremen." },
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


const EN: Record<string, [string, string[], string]> = {
  "arrakeen": ["Arrakeen", [], "The first settlement on Arrakis and, for a long time, the seat of the planet's government."],
  "asa": ["Carryall", ["carryall", "carryalls"], "The flying 'wing', the aerial workhorse of Arrakis, used to lift the big machines that hunt, harvest and refine spice."],
  "bene-gesserit": ["Bene Gesserit", ["Bene Gesserit"], "An old school of mental and physical training, mostly for women, founded after the Butlerian Jihad destroyed the 'thinking machines'."],
  "bled": ["Bled", ["Bled", "Great Bled"], "Flat, open desert."],
  "captador": ["Windtrap", ["windtraps", "windtrap"], "A device set in the path of the wind that pulls moisture out of the air it catches, usually with a sudden drop in temperature."],
  "cavaleiro": ["Sandrider", ["sandrider", "sandriders"], "Fremen word for someone who can catch and ride a sandworm."],
  "choam": ["CHOAM", ["CHOAM"], "The universal development corporation, run by the Emperor and the Great Houses, with the Guild and the Bene Gesserit as silent partners."],
  "cielago": ["Cielago", ["cielago", "cielagos"], "A modified bat of Arrakis, adapted to carry messages recorded with a distrans."],
  "colheitadeira": ["Sandcrawler", ["sandcrawler", "harvester"], "General name for the machines that move across the surface of Arrakis hunting and gathering melange."],
  "coletor": ["Dew precipitator", ["dew precipitators", "dew collectors", "dew precipitator"], "An egg of chromoplastic about four centimetres long that turns white in sunlight and clear in the dark. It cools at dawn and gathers the dew; the Fremen line their planting pits with them."],
  "dagacristal": ["Crysknife", ["crysknife", "crysknives"], "The sacred knife of the Fremen, made from the tooth of a dead worm. An 'unfixed' one falls apart away from the electrical field of a human body."],
  "depressao": ["Sink", [], "A habitable lowland on Arrakis, ringed by high ground that shelters it from storms."],
  "erg": ["Erg", ["erg", "ergs"], "A large area of dunes; a sea of sand."],
  "fedaykin": ["Fedaykin", ["Fedaykin"], "Fremen death commandos. Originally, a group sworn to give their lives to right a wrong."],
  "fremen": ["Fremen", ["Fremen"], "The free tribes of Arrakis who live in the desert, descended from the Zensunni Wanderers. 'Sand pirates', according to the Imperial Dictionary."],
  "graben": ["Graben", ["graben"], "A long geological trench, formed when the ground sinks as the crust shifts below it."],
  "guilda": ["Guild", ["Spacing Guild", "Guild"], "The Spacing Guild, one leg of the political tripod that holds up the Great Convention. It has the monopoly on travel and transport through space."],
  "ibad": ["Eyes of Ibad", [], "What a diet heavy in melange does: the whites and pupils of the eyes turn deep blue, a sign of deep addiction."],
  "kulon": ["Kulon", ["kulon"], "The wild ass of Earth's Asian steppes, adapted for Arrakis."],
  "literjon": ["Literjon", ["literjon", "literjons"], "A one-litre container for carrying water, made of hard, unbreakable plastic with a tight seal."],
  "martelador": ["Thumper", ["thumper", "thumpers"], "A short stake with a spring-driven clapper. Driven into the sand, it keeps beating and calls shai-hulud."],
  "melange": ["Melange", ["melange"], "The 'spice of spices', produced only on Arrakis. Known for extending life; mildly addictive in small doses and severely so above two grams a day."],
  "mentat": ["Mentat", ["Mentat", "Mentats"], "A citizen trained to the highest pitch of logic. A 'human computer'."],
  "muaddib": ["Muad'Dib", [], "The adapted kangaroo mouse of Arrakis, tied in Fremen myth to a shape seen on the second moon. The Fremen admire it for surviving in the open desert."],
  "pyons": ["Pyons", ["pyon", "pyons"], "Peasants and labourers bound to the planet, one of the base classes of the Empire. Legally, wards of the planet."],
  "qanat": ["Qanat", ["qanat", "qanats"], "An open canal that carries irrigation water across the desert under control."],
  "sardaukar": ["Sardaukar", ["Sardaukar"], "The Emperor's fanatical soldiers, raised on a world so harsh it killed six of every thirteen people before the age of eleven."],
  "shai-hulud": ["Shai-hulud", ["shai-hulud"], "The sandworm of Arrakis, also called Old Man of the Desert, Old Father Eternity and Grandfather of the Desert. Said in a certain tone, or capitalised, it names the Fremen earth god."],
  "sietch": ["Sietch", ["sietch", "sietches"], "In Fremen, 'place of assembly in time of danger'. By common use, any cave warren where a tribal community lives."],
  "solari": ["Solari", ["solaris", "solari"], "The official currency of the Empire. Its buying power is set every four hundred years between the Guild, the Landsraad and the Emperor."],
  "tempestade": ["Coriolis storm", ["Coriolis storm", "Coriolis storms"], "A great sandstorm in which the planet's own spin drives the wind over the open flats up to 700 km/h."],
  "tenda": ["Stilltent", ["stilltent"], "A small sealable shelter, made of the same fabric as a stillsuit, that turns the moisture of its occupants' breath back into drinkable water."],
  "toptero": ["Ornithopter", ["ornithopter", "ornithopters", "'thopter", "'thopters"], "Any aircraft that flies by beating its wings, the way birds do."],
  "trajestil": ["Stillsuit", ["stillsuit", "stillsuits"], "A suit invented on Arrakis. Its layered fabric sheds heat and filters the body's waste; the recovered moisture comes back through a tube."],
  "usul": ["Usul", [], "Fremen for 'the base of the pillar'."],
};
for (const termo of TERMOS) {
  const e = EN[termo.id];
  if (e) { termo.termo_en = e[0]; termo.formas_en = e[1]; termo.def_en = e[2]; }
}

/* ------------------------------------------------------------ marcação --- */

const PROIBIDO = "a, code, button, h1, h2, h3, svg, figcaption, .termo, .sumario, .cabecalho-site, .marca, .marcador, .etapa-n, script, style";

export function ligaGlossario(raiz: HTMLElement) {
  const achados = new Set<string>();
  const ordem = TERMOS.flatMap((t) => (emIngles() ? (t.formas_en ?? []) : t.formas).map((f) => ({ t, f })))
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
    dica.innerHTML = emIngles()
      ? `<b>${t.termo_en ?? t.en}</b><p>${t.def_en ?? t.def}</p><code>${t.marca}</code>`
      : `<b>${t.termo}</b> <i>${t.en}</i><p>${t.def}</p><code>${t.marca}</code>`;
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
