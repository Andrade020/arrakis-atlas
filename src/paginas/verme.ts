import { prancha, secao } from "../pranchas";
import { cabecalho, esc, rodape } from "../ui";
import { t } from "../i18n";

/* Prancha 04 · Shai-Hulud.
 *
 * Tudo aqui é do texto: cada afirmação leva o marcador do trecho. As estampas
 * são leituras desses trechos (scripts/oneshot/2026-09-13_vida_replicate.py),
 * e não cópia do verme de nenhum filme. Os dois diagramas — a régua de tamanho
 * e o ciclo — são desenhados em SVG com os números do próprio livro.
 */

const B = import.meta.env.BASE_URL;
const mc = (m: string) => `<code class="marca">${esc(m)}</code>`;
const estampa = (cod: string, alt: string, legenda = "") => `<figure class="estampa-vida">
  <img src="${B}ilustracoes/vida/${cod}.webp" alt="${esc(alt)}" loading="lazy"
       onerror="this.closest('figure').hidden = true" />
  <figcaption>${t("Ilustração lida do texto", "Illustration read from the text")}${legenda ? " · " + legenda : ""}</figcaption>
</figure>`;

/* Régua: todos os comprimentos são do cânone. A colheitadeira entra porque é a
   única máquina que o livro mede, e dá ao leitor o tamanho de uma coisa feita
   por gente ao lado do bicho. */
function regua(): string {
  const L = 440, X0 = 270, W = 560;            // escala: 440 m cabem em 560 px; 270 px de rótulo
  const px = (m: number) => (m / L) * W;
  const linhas: [string, number, number, string, string][] = [
    [t("Colheitadeira de especiaria", "Spice harvester"), 120, 40, "[1|terminology|10884]", "maq"],
    [t("Verme pequeno, latitudes do norte", "Small worm, northern latitudes"), 110, 22, "[1|chapter005|879]", "verme"],
    [t("Verme médio", "Medium worm"), 200, 30, "[1|appendixI|10430]", "verme"],
    [t("Os maiores já vistos", "Largest ever seen"), 400, 50, "[1|chapter005|879]", "verme grande"],
  ];
  const alt = 64;
  const rows = linhas.map(([rot, comp, esp, marc, cls], i) => {
    const y = 20 + i * alt, h = Math.max(8, (esp / L) * W);
    const w = px(comp);
    const corpo = cls === "maq"
      ? `<rect x="${X0}" y="${y + 24 - h / 2}" width="${w}" height="${h}" class="maq"/>`
      : `<path d="M${X0} ${y + 24} q ${w * 0.02} ${-h / 2} ${w * 0.08} ${-h / 2} L ${X0 + w - h / 2} ${y + 24 - h / 2}
          a ${h / 2} ${h / 2} 0 0 1 0 ${h} L ${X0 + w * 0.08} ${y + 24 + h / 2} q ${-w * 0.06} 0 ${-w * 0.08} ${-h / 2} Z" class="${cls}"/>`
        + Array.from({ length: Math.floor(w / 9) }, (_, k) =>
          `<line x1="${X0 + 10 + k * 9}" x2="${X0 + 10 + k * 9}" y1="${y + 24 - h / 2 + 1}" y2="${y + 24 + h / 2 - 1}" class="anel"/>`).join("");
    return `<g>
      <text x="${X0 - 12}" y="${y + 21}" class="rot" text-anchor="end">${esc(rot)}</text>
      <text x="${X0 - 12}" y="${y + 36}" class="marc" text-anchor="end">${esc(marc)}</text>
      ${corpo}
      <text x="${X0 + w + 10}" y="${y + 28}" class="val">${comp === 400 ? t("mais de 400", "over 400") : comp} m</text>
    </g>`;
  }).join("");
  const ticks = [0, 100, 200, 300, 400].map((m) => `<g>
      <line x1="${X0 + px(m)}" x2="${X0 + px(m)}" y1="10" y2="${20 + linhas.length * alt}" class="grade"/>
      <text x="${X0 + px(m)}" y="${34 + linhas.length * alt}" class="eixo" text-anchor="middle">${m} m</text>
    </g>`).join("");
  return `<div class="diagrama"><svg viewBox="0 0 ${X0 + W + 120} ${50 + linhas.length * alt}" role="img"
    aria-label="${t("Comparação de tamanho: colheitadeira de 120 metros, vermes de 110, 200 e mais de 400 metros",
                    "Size comparison: a 120-metre harvester and worms of 110, 200 and over 400 metres")}">
    ${ticks}${rows}</svg></div>`;
}

/* O ciclo, na ordem em que o apêndice o descreve [1|appendixI|10411]. */
function ciclo(): string {
  const n = [
    { x: 300, y: 50, t: t("Plâncton de areia", "Sand plankton"), s: t("come a especiaria", "eats the spice") },
    { x: 530, y: 190, t: t("Pequeno fazedor", "Little maker"), s: t("a truta-da-areia", "the sandtrout") },
    { x: 300, y: 330, t: t("Massa pré-especiaria", "Pre-spice mass"), s: t("explode para a superfície", "bursts to the surface") },
    { x: 70, y: 190, t: t("Especiaria", "Spice"), s: t("exposta ao sol e ao ar", "exposed to sun and air") },
  ];
  const seta = (a: typeof n[0], b: typeof n[0], rot: string, lado = 1) => {
    const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.22 * lado, my = (a.y + b.y) / 2 - (b.x - a.x) * 0.22 * lado;
    return `<path d="M${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}" class="seta" marker-end="url(#ponta)"/>
      <text x="${mx}" y="${my}" class="seta-rot" text-anchor="middle">${rot}</text>`;
  };
  const centro = { x: 300, y: 190, t: "Shai-hulud", s: "" };
  return `<div class="diagrama"><svg viewBox="0 0 600 380" role="img" aria-label="${t("Ciclo da especiaria", "The spice cycle")}">
    <defs><marker id="ponta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0 L10 5 L0 10 z" class="ponta"/></marker></defs>
    ${seta(n[0], n[1], t("cresce e se enterra", "grows and burrows"))}
    ${seta(n[1], n[2], t("excreção + água", "excretion + water"))}
    ${seta(n[2], n[3], t("a explosão", "the blow"))}
    ${seta(n[3], n[0], t("alimenta", "feeds"))}
    <path d="M${n[1].x - 70} ${n[1].y} L ${centro.x + 70} ${centro.y}" class="seta fina" marker-end="url(#ponta)"/>
    <text x="${(n[1].x + centro.x) / 2 + 10}" y="${centro.y - 10}" class="seta-rot" text-anchor="middle">${t("poucos sobrevivem", "a few survive")}</text>
    <path d="M${centro.x - 70} ${centro.y} L ${n[3].x + 62} ${n[3].y}" class="seta fina" marker-end="url(#ponta)"/>
    <text x="${(centro.x + n[3].x) / 2 - 4}" y="${centro.y - 10}" class="seta-rot" text-anchor="middle">${t("espalha", "scatters")}</text>
    ${[...n, centro].map((k) => `<g class="no${k === centro ? " centro" : ""}">
      <text x="${k.x}" y="${k.y + 5}" text-anchor="middle" class="no-t">${k.t}</text>
      ${k.s ? `<text x="${k.x}" y="${k.y + 24}" text-anchor="middle" class="no-s">${k.s}</text>` : ""}
    </g>`).join("")}
  </svg></div>`;
}

export function verme(alvo: HTMLElement) {
  alvo.innerHTML = `<article class="folha vida">
    ${cabecalho(`${prancha("verme")} · Shai-Hulud`,
      t("O Velho do Deserto", "The Old Man of the Desert"),
      t("Os fremen o chamam de Velho do Deserto, Velho Pai Eternidade e Avô do Deserto. Ele fabrica a areia, guarda a especiaria e morre se tocar em água.",
        "The Fremen call it Old Man of the Desert, Old Father Eternity and Grandfather of the Desert. It makes the sand, keeps the spice, and dies if it touches water."))}
    <div class="corpo">
      ${estampa("verme_boca", t("Um verme de areia erguendo-se da duna à noite, com a boca aberta cheia de dentes cristalinos",
                                "A sandworm rising from a dune at night, its open mouth full of crystal teeth"),
        t("a boca com uns oitenta metros de diâmetro, dentes cristalinos em forma de faca",
          "a mouth about eighty metres across, with crystal teeth shaped like knives"))}

      <section class="vida-sec">
        <h2><span class="g">${secao("verme", 1)}</span><span>${t("Mais de quatrocentos metros", "Over four hundred metres")}</span></h2>
        <p>${t(`O Dr. Yueh tem, para as aulas de Paul, o filme de um espécime pequeno: cento e dez metros de comprimento e
        vinte e dois de diâmetro, das latitudes do norte. Testemunhas confiáveis viram
        vermes com <strong>mais de quatrocentos metros</strong>, e há motivo para achar
        que existam maiores.`, `For Paul's lessons, Dr. Yueh has a film of a small specimen: a hundred and ten
        metres long and twenty-two across, from the northern latitudes. Reliable witnesses have
        seen worms <strong>over four hundred metres</strong> long, and there is reason to think
        larger ones exist.`)} ${mc("[1|chapter005|879]")}</p>
        ${regua()}
        <p class="nota">${t(`A boca que Paul vê de perto tem uns oitenta metros de diâmetro, com
        dentes de cristal curvos como facas`, `The mouth Paul sees up close is about eighty metres across, with
        crystal teeth curved like knives`)} ${mc("[1|chapter029|5782]")}${t(`; quando se abre,
        os dentes se espalham "como uma flor enorme"`, `; when it opens, the teeth spread
        "like some enormous flower"`)} ${mc("[1|chapter042|8634]")}.</p>
      </section>

      <section class="vida-sec">
        <h2><span class="g">${secao("verme", 2)}</span><span>${t("O verme fabrica a especiaria", "The worm makes the spice")}</span></h2>
        <p>${t(`A pista principal da equipe de Kynes foram retalhos de couro achados junto da
        massa de especiaria depois de uma explosão. Nas histórias dos fremen, eram restos de
        uma "truta-da-areia" de lenda`, `The main clue for Kynes's team was scraps of leathery matter found
        with the spice mass after a blow. In Fremen stories they came from a legendary
        "sandtrout"`)} ${mc("[1|appendixI|10409]")}${t(`, e ela existia. O ciclo
        funciona assim`, `, and it turned out to be real. The cycle works like
        this`)} ${mc("[1|appendixI|10411]")}:</p>
        ${ciclo()}
        <div class="duas">
          <div>
            <p>${t(`A truta-da-areia, ou <em>pequeno fazedor</em>, é meio planta e meio animal.
            Ela prende a água em bolsões dentro da rocha porosa do subsolo, e o que ela excreta vira a
            massa de pré-especiaria`, `The sandtrout, or <em>little maker</em>, is half plant and half animal.
            It seals water into pockets in the porous rock underground, and what it excretes becomes
            the pre-spice mass`)} ${mc("[1|terminology|10989]")}${t(`. Morre aos milhões em cada
            explosão; uma variação de cinco graus a mata. As poucas que sobrevivem se
            encistam e, seis anos depois, saem como vermes de uns três metros`, `. It dies by the million in
            every blow, and a five-degree change in temperature kills it. The few survivors
            form cysts and, six years later, come out as worms about three metres long`)}
            ${mc("[1|appendixI|10410]")}.</p>
          </div>
          ${estampa("truta", t("Uma truta-da-areia: criatura achatada e coriácea presa à areia úmida",
                               "A sandtrout: a flat, leathery creature clinging to damp sand"))}
        </div>
        ${estampa("explosao", t("Explosão de especiaria no deserto aberto, com uma coluna de areia",
                                "A spice blow in the open desert, with a column of sand"),
          t("a explosão de especiaria", "the spice blow"))}
      </section>

      <section class="vida-sec">
        <h2><span class="g">${secao("verme", 3)}</span><span>${t("Água é veneno", "Water is poison")}</span></h2>
        <p>${t(`Os vermes vivem até idade enorme, a não ser que outro os mate ou que se afoguem
        em água, que é veneno para eles. Quase toda a areia de Arrakis é obra deles`,
        `Worms live to a great age unless another worm kills them or they drown in water,
        which poisons them. Most of the sand on Arrakis is their work`)}
        ${mc("[1|terminology|11207]")}${t(`. E respiram para o planeta: um verme médio, de
        duzentos metros, lança na atmosfera tanto oxigênio quanto dez quilômetros
        quadrados de plantas verdes`, `. They also breathe for the planet: a medium worm, two
        hundred metres long, puts as much oxygen into the air as ten square kilometres
        of green plants`)} ${mc("[1|appendixI|10430]")}.</p>
        <p>${t(`É por isso que ele não passa da Linha do Verme, no norte: o que o detém é a
        umidade, não o frio`, `That is why it never crosses the Worm Line in the north: what stops it is
        moisture, not cold`)} ${mc("[1|notes|11412]")}.
        <a class="link" href="#/mapa#=AR-04">${t("Ver a linha no mapa →", "See the line on the map →")}</a></p>
      </section>

      <section class="vida-sec">
        <h2><span class="g">${secao("verme", 4)}</span><span>${t("Chamar, montar, matar", "Calling, riding, killing")}</span></h2>
        <div class="grade-vida">
          <div class="especime">
            ${estampa("martelo", t("Um martelador cravado na crista de uma duna", "A thumper driven into a dune crest"))}
            <h3>${t("O martelador", "The thumper")}</h3>
            <p>${t(`Uma estaca curta com um batedor de mola. Cravada na areia, ela bate sem parar e chama
            shai-hulud`, `A short stake with a spring-driven clapper. Driven into the sand, it keeps beating and
            calls shai-hulud`)} ${mc("[1|terminology|11292]")}.</p>
          </div>
          <div class="especime">
            ${estampa("verme_montaria", t("Cavaleiros fremen de pé sobre um verme em movimento", "Fremen riders standing on a moving worm"))}
            <h3>${t("Os ganchos", "The hooks")}</h3>
            <p>${t(`Com um gancho mantendo aberta a borda de um anel, a areia entra na parte
            sensível do corpo, e o verme não mergulha: rola o corpo inteiro para
            afastar da areia o anel aberto, e assim fica na superfície com quem vai nas costas`,
            `With a hook holding open the edge of a ring segment, sand gets into the tender
            inside, and the worm won't dive. It rolls its whole body to lift the opened segment
            away from the sand, and stays on the surface with its riders on its back`)} ${mc("[1|chapter040|8411]")}.</p>
          </div>
          <div class="especime">
            ${estampa("cristal", t("Uma faca curva feita de um dente leitoso", "A curved knife made from a milky tooth"))}
            <h3>${t("O dente", "The tooth")}</h3>
            <p>${t(`A dagacristal, faca sagrada dos fremen, é feita dos dentes de vermes mortos.
            Tem uns vinte centímetros. A "não fixada" se desfaz longe do campo elétrico de
            um corpo humano`, `The crysknife, the sacred knife of the Fremen, is made from the teeth of dead worms.
            It is about twenty centimetres long. An "unfixed" one falls apart away from the electrical
            field of a human body`)} ${mc("[1|terminology|10743]")} ${mc("[1|terminology|10744]")}.</p>
          </div>
        </div>
        <p>${t(`Matar e preservar um verme inteiro só com choque de alta voltagem aplicado a
        cada anel separadamente: cada segmento tem vida própria. Explosivos o atordoam e
        despedaçam; sem atômicas, Kynes não conhece nenhum que o destrua`,
        `The only way to kill and keep a whole worm is a high-voltage shock applied to each
        ring segment separately, because each segment has a life of its own. Explosives stun
        it and break it up; short of atomics, Kynes knows of nothing that destroys it`)}
        ${mc("[1|chapter015|2411]")}.</p>
      </section>
    </div>
    ${rodape()}
  </article>`;
}
