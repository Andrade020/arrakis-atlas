import { TERMOS } from "../glossario";
import { prancha } from "../pranchas";
import { cabecalho, esc, rodape } from "../ui";
import { emIngles, localidade, t as tr } from "../i18n";

/* A prancha do glossário: todos os termos, em ordem alfabética, com a palavra
 * original do livro e o marcador do verbete. */
export function glossario(alvo: HTMLElement) {
  const nome = (x: typeof TERMOS[0]) => (emIngles() ? (x.termo_en ?? x.en) : x.termo);
  const termos = [...TERMOS].sort((a, b) => nome(a).localeCompare(nome(b), localidade()));
  const letras = new Map<string, typeof termos>();
  for (const t of termos) {
    const l = nome(t).replace(/^'/, "").normalize("NFD")[0].toUpperCase();
    letras.set(l, [...(letras.get(l) ?? []), t]);
  }
  alvo.innerHTML = `<article class="folha glossario">
    ${cabecalho(`${prancha("glossario")} · ${tr("Glossário", "Glossary")}`,
      tr("As palavras do deserto", "Words of the desert"),
      tr("O livro 1 termina com um glossário próprio, a \"Terminologia do Império\". Estas são as entradas que mais aparecem neste atlas, em português, com a palavra original e o lugar do verbete.",
         "Book 1 ends with its own glossary, the \"Terminology of the Imperium\". These are the entries that turn up most in this atlas, in our own words, with the place of each entry in the book."))}
    <div class="corpo">
      <p class="nota">${tr(`Pelo site, a primeira vez que um destes termos aparece numa página ele vem
      sublinhado de pontinhos: passe o mouse ou toque para ver a definição.`,
      `Across the site, the first time one of these words appears on a page it has a dotted
      underline. Hover or tap it to see the definition.`)}</p>
      ${[...letras].map(([l, ts]) => `<section class="letra">
        <h2 class="letra-l">${l}</h2>
        <dl>${ts.map((t) => `<div class="verbete" id="g-${t.id}">
          <dt>${esc(nome(t))}${emIngles() ? "" : ` <span class="en">${esc(t.en)}</span>`}</dt>
          <dd>${esc(emIngles() ? (t.def_en ?? t.def) : t.def)} <code class="marca">${esc(t.marca)}</code></dd>
        </div>`).join("")}</dl>
      </section>`).join("")}
    </div>
    ${rodape()}
  </article>`;
}
