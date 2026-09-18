import "./sociedade.css";
import { t, rota as link } from "../i18n";
import { prancha, secao } from "../pranchas";
import { cabecalho, rodape } from "../ui";

type Retrato = {
  arquivo: string;
  largura: number;
  altura: number;
  titulo: string;
  subtitulo: string;
  texto: string;
  alt: string;
  agua: string;
  poder: string;
};

const retratosImperiais = (): Retrato[] => [
  {
    arquivo: "ordem_imperial.webp", largura: 1086, altura: 1448,
    titulo: t("Ordens do poder", "Orders of power"),
    subtitulo: t("Prestígio, ritual e informação", "Prestige, ritual and information"),
    texto: t("Ao redor das Grandes Casas, autoridade também circula por conselheiros, ordens religiosas, alianças e informação. É um poder que quase nunca toca a areia.",
      "Around the Great Houses, authority also moves through advisers, religious orders, alliances and information. It is power that rarely touches the sand."),
    alt: t("Mulher de véu escuro diante de uma paisagem desértica e de um edifício monumental", "A woman in a dark veil before a desert landscape and a monumental building"),
    agua: t("protegida", "protected"), poder: t("informação", "information"),
  },
  {
    arquivo: "soldado_casa.webp", largura: 1145, altura: 1374,
    titulo: t("Guarnição da Casa", "House garrison"),
    subtitulo: t("A força que transforma decreto em chão", "The force that turns decree into ground"),
    texto: t("Soldados guardam portos, muralhas, armazéns e colheitadeiras. Sua posição depende da Casa: recebem água e equipamento enquanto conseguirem proteger a extração.",
      "Soldiers guard ports, walls, depots and harvesters. Their position depends on the House: they receive water and equipment while they can protect extraction."),
    alt: t("Soldado coberto de poeira diante de uma base fortificada no deserto", "A dust-covered soldier before a fortified desert base"),
    agua: t("fornecida", "supplied"), poder: t("coerção", "coercion"),
  },
  {
    arquivo: "intermediario_urbano.webp", largura: 1069, altura: 1471,
    titulo: t("Cidade intermediária", "The intermediary city"),
    subtitulo: t("Mercado, oficina, transporte", "Market, workshop, transport"),
    texto: t("Entre o palácio e a mina há comerciantes, mecânicos, carregadores, pilotos e contrabandistas. Não governam o planeta, mas fazem circular aquilo que o governo não produz sozinho.",
      "Between palace and mine stand traders, mechanics, porters, pilots and smugglers. They do not govern the planet, but they move what government cannot produce by itself."),
    alt: t("Homem vestido para o deserto em um mercado urbano de Arrakis", "A man dressed for the desert in an urban market on Arrakis"),
    agua: t("comprada", "bought"), poder: t("acesso", "access"),
  },
  {
    arquivo: "trabalhador_especiaria.webp", largura: 1024, altura: 1536,
    titulo: t("Trabalho da especiaria", "Spice labour"),
    subtitulo: t("O corpo mais perto do valor e do risco", "The body closest to value and risk"),
    texto: t("A especiaria sustenta o Império, mas o trabalho que a retira acontece sob calor, poeira, máquinas e ataque de verme. Quanto mais perto da produção, mais longe da decisão.",
      "Spice sustains the Imperium, but extracting it means heat, dust, machines and worm attack. The closer one is to production, the farther one is from decision."),
    alt: t("Trabalhador coberto de poeira em um complexo industrial de especiaria", "A dust-covered worker in an industrial spice complex"),
    agua: t("racionada", "rationed"), poder: t("trabalho", "labour"),
  },
];

const retratosFremen = (): Retrato[] => [
  {
    arquivo: "fremen_guardiao.webp", largura: 1254, altura: 1254,
    titulo: t("Memória e liderança", "Memory and leadership"),
    subtitulo: t("Autoridade conquistada", "Earned authority"),
    texto: t("No sietch, posição depende de confiança, experiência e responsabilidade pelo grupo. A água de cada corpo pertence à comunidade.",
      "In the sietch, standing depends on trust, experience and responsibility for the group. The water of every body belongs to the community."),
    alt: t("Homem fremen diante de um vale rochoso ao pôr do sol", "A Fremen man before a rocky valley at sunset"),
    agua: t("coletiva", "collective"), poder: t("confiança", "trust"),
  },
  {
    arquivo: "fremen_comunidade.webp", largura: 1280, altura: 960,
    titulo: t("Vida de sietch", "Sietch life"),
    subtitulo: t("Disciplina como sobrevivência", "Discipline as survival"),
    texto: t("O que parece pobreza ao visitante pode esconder reservas, tecnologia e planejamento de longo prazo. Desperdício não é luxo: é ameaça coletiva.",
      "What looks like poverty to a visitor may conceal reserves, technology and long-term planning. Waste is not luxury: it is a collective threat."),
    alt: t("Mulher fremen sentada sobre uma rocha com o deserto ao fundo", "A Fremen woman seated on a rock with the desert behind her"),
    agua: t("guardada", "stored"), poder: t("disciplina", "discipline"),
  },
  {
    arquivo: "fremen_batedor.webp", largura: 1086, altura: 1448,
    titulo: t("Mobilidade no deserto", "Desert mobility"),
    subtitulo: t("Conhecimento que vale território", "Knowledge that becomes territory"),
    texto: t("Rotas, abrigo, ritmo de caminhada e leitura da areia dão aos fremen uma liberdade que o equipamento imperial não compra. Esse saber transforma o deserto em proteção.",
      "Routes, shelter, walking rhythm and the reading of sand give the Fremen a freedom Imperial equipment cannot buy. That knowledge turns desert into protection."),
    alt: t("Jovem batedor fremen caminhando entre dunas e formações rochosas", "A young Fremen scout walking among dunes and rock formations"),
    agua: t("carregada", "carried"), poder: t("conhecimento", "knowledge"),
  },
];

function card(r: Retrato): string {
  const B = import.meta.env.BASE_URL;
  return `<article class="classe-card revela">
    <figure class="classe-imagem">
      <img src="${B}ilustracoes/sociedade/${r.arquivo}" width="${r.largura}" height="${r.altura}"
        alt="${r.alt}" loading="lazy" decoding="async" />
    </figure>
    <div class="classe-texto">
      <span class="classe-sobretitulo">${r.subtitulo}</span>
      <h3>${r.titulo}</h3>
      <p>${r.texto}</p>
      <dl><div><dt>${t("Água", "Water")}</dt><dd>${r.agua}</dd></div>
          <div><dt>${t("Poder", "Power")}</dt><dd>${r.poder}</dd></div></dl>
    </div>
  </article>`;
}

export function sociedade(alvo: HTMLElement) {
  const B = import.meta.env.BASE_URL;
  const imperiais = retratosImperiais();
  const fremen = retratosFremen();

  alvo.innerHTML = `<article class="folha sociedade">
    ${cabecalho(`${prancha("sociedade")} · ${t("Estrutura social", "Social structure")}`,
      t("A sociedade da água", "The society of water"),
      t("Em Arrakis, classe não é apenas riqueza: é quem pode beber sem contar, quem manda outros atravessarem a areia e quem conhece o deserto o bastante para não pedir licença.",
        "On Arrakis, class is more than wealth: it is who can drink without counting, who sends others across the sand, and who knows the desert well enough not to ask permission."))}

    <div class="corpo">
      <section class="sociedade-abertura revela">
        <div>
          <h2><span class="g">${secao("sociedade", 1)}</span><span>${t("Duas hierarquias no mesmo planeta", "Two hierarchies on one planet")}</span></h2>
          <p>${t(`O Império organiza Arrakis de cima para baixo: a Casa recebe o feudo, a guarnição protege a infraestrutura e trabalhadores mantêm a especiaria em movimento. Os fremen vivem sob outra ordem. Têm pouca riqueza visível, mas controlam água escondida, rotas e técnicas que o palácio não domina.`,
            `The Imperium organises Arrakis from the top down: the House receives the fief, the garrison protects infrastructure, and workers keep spice moving. The Fremen live under another order. They possess little visible wealth, yet control hidden water, routes and techniques the palace does not master.`)}</p>
        </div>
        <aside class="sociedade-nota">
          <span>${t("Como ler os retratos", "How to read the portraits")}</span>
          <p>${t("Estas pessoas representam posições sociais, não personagens específicas do romance. A classificação é uma leitura editorial do atlas, não um censo canônico.",
            "These people represent social positions, not specific characters from the novel. The classification is an editorial reading by the atlas, not a canonical census.")}</p>
        </aside>
      </section>

      <section class="imperio-bloco" aria-labelledby="imperio-titulo">
        <div class="sociedade-cab revela">
          <span>${t("A escada imperial", "The Imperial ladder")}</span>
          <h2 id="imperio-titulo"><span class="g">${secao("sociedade", 2)}</span><span>${t("Quanto mais alto, mais distante da areia", "The higher the rank, the farther from the sand")}</span></h2>
        </div>

        <figure class="sociedade-palacio revela">
          <img src="${B}ilustracoes/sociedade/nobreza_palacio.webp" width="1280" height="815"
            alt="${t("Mulher da nobreza diante de uma janela monumental voltada para uma cidade no deserto", "A noblewoman before a monumental window overlooking a desert city")}" loading="lazy" decoding="async" />
          <figcaption><span>${t("Nobreza planetária", "Planetary nobility")}</span>
            <strong>${t("O poder que vê o deserto pela janela", "Power that sees the desert through a window")}</strong>
            <p>${t("No palácio, água, sombra e vegetação podem virar espetáculo. A distância física do deserto é também distância do risco que sustenta a renda da Casa.",
              "In the palace, water, shade and vegetation can become spectacle. Physical distance from the desert is also distance from the risk that sustains the House's income.")}</p>
          </figcaption>
        </figure>

        <div class="imperio-grade">
          ${imperiais.map(card).join("")}
        </div>
      </section>

      <section class="fremen-bloco" aria-labelledby="fremen-titulo">
        <div class="fremen-cab revela">
          <span>${t("Fora da pirâmide", "Outside the pyramid")}</span>
          <h2 id="fremen-titulo"><span class="g">${secao("sociedade", 3)}</span><span>${t("Pouco luxo visível, muito controle real", "Little visible luxury, extensive real control")}</span></h2>
          <p>${t("Tratar os fremen como a base pobre da sociedade imperial erra o ponto. Eles não ocupam o último degrau: constroem uma hierarquia paralela, fundada na água coletiva, na obrigação mútua e no domínio do terreno.",
            "Treating the Fremen as the poor base of Imperial society misses the point. They do not occupy its lowest rung: they build a parallel hierarchy founded on collective water, mutual obligation and command of terrain.")}</p>
        </div>
        <div class="fremen-grade">${fremen.map(card).join("")}</div>
      </section>

      <section class="sociedade-quadro revela">
        <h2><span class="g">${secao("sociedade", 4)}</span><span>${t("A mesma palavra muda de sentido", "The same word changes meaning")}</span></h2>
        <div class="tabela sociedade-tabela"><table>
          <thead><tr><th>${t("Recurso", "Resource")}</th><th>${t("Palácio", "Palace")}</th><th>${t("Cidade e extração", "City and extraction")}</th><th>${t("Sietch", "Sietch")}</th></tr></thead>
          <tbody>
            <tr><td>${t("Água", "Water")}</td><td>${t("conforto privado", "private comfort")}</td><td>${t("mercadoria e ração", "commodity and ration")}</td><td>${t("patrimônio coletivo", "collective wealth")}</td></tr>
            <tr><td>${t("Território", "Territory")}</td><td>${t("título e mapa", "title and map")}</td><td>${t("corredor e infraestrutura", "corridor and infrastructure")}</td><td>${t("rota, abrigo e memória", "route, shelter and memory")}</td></tr>
            <tr><td>${t("Risco", "Risk")}</td><td>${t("delegado", "delegated")}</td><td>${t("cotidiano", "everyday")}</td><td>${t("absorvido e administrado", "absorbed and managed")}</td></tr>
            <tr><td>${t("Poder", "Power")}</td><td>${t("nomear e ordenar", "appoint and command")}</td><td>${t("fazer circular", "keep things moving")}</td><td>${t("sobreviver sem permissão", "survive without permission")}</td></tr>
          </tbody>
        </table></div>
      </section>

      <section class="sociedade-fecho revela">
        <div><span>${t("No palácio", "In the palace")}</span><h3>${t("Água vira privilégio", "Water becomes privilege")}</h3>
          <p>${t("A ordem imperial concentra decisão e afasta seus dirigentes do custo ecológico daquilo que governam.",
            "Imperial order concentrates decision-making and shields its rulers from the ecological cost of what they govern.")}</p></div>
        <div><span>${t("No sietch", "In the sietch")}</span><h3>${t("Água vira vínculo", "Water becomes obligation")}</h3>
          <p>${t("A ordem fremen transforma escassez em contabilidade coletiva e conhecimento do território em autonomia política.",
            "Fremen order turns scarcity into collective accounting and territorial knowledge into political autonomy.")}</p></div>
      </section>
      <nav class="sociedade-links" aria-label="${t("Continuar o argumento", "Continue the argument")}">
        <a href="${link("agua")}">${t("A economia da água", "The water economy")} <span>→</span></a>
        <a href="${link("economia")}">${t("A economia da especiaria", "The spice economy")} <span>→</span></a>
        <a href="${link("poder")}">${t("Soberania e controle", "Sovereignty and control")} <span>→</span></a>
      </nav>
    </div>
    ${rodape()}
  </article>`;

  ligaRevelacao(alvo);
}

function ligaRevelacao(raiz: HTMLElement) {
  const itens = [...raiz.querySelectorAll<HTMLElement>(".revela")];
  const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || quieto) {
    itens.forEach((item) => item.classList.add("vista"));
    return;
  }
  raiz.querySelector(".sociedade")?.classList.add("sociedade-animada");
  const observa = new IntersectionObserver((entradas) => {
    for (const entrada of entradas) {
      if (!entrada.isIntersecting) continue;
      (entrada.target as HTMLElement).classList.add("vista");
      observa.unobserve(entrada.target);
    }
  }, { threshold: .12, rootMargin: "0px 0px -7%" });
  itens.forEach((item) => observa.observe(item));
}
