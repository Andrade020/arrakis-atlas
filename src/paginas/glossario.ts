import { TERMOS } from "../glossario";
import { prancha } from "../pranchas";
import { cabecalho, esc, rodape } from "../ui";

/* A prancha do glossário: todos os termos, em ordem alfabética, com a palavra
 * original do livro e o marcador do verbete. */
export function glossario(alvo: HTMLElement) {
  const termos = [...TERMOS].sort((a, b) => a.termo.localeCompare(b.termo, "pt-BR"));
  const letras = new Map<string, typeof termos>();
  for (const t of termos) {
    const l = t.termo.normalize("NFD")[0].toUpperCase();
    letras.set(l, [...(letras.get(l) ?? []), t]);
  }
  alvo.innerHTML = `<article class="folha glossario">
    ${cabecalho(`${prancha("glossario")} · Glossário`,
      "As palavras do deserto",
      "O livro 1 termina com um glossário próprio, a \"Terminologia do Império\". Estas são as entradas que mais aparecem neste atlas, em português, com a palavra original e o lugar do verbete.")}
    <div class="corpo">
      <p class="nota">Pelo site, a primeira vez que um destes termos aparece numa página ele vem
      sublinhado de pontinhos: passe o mouse ou toque para ver a definição.</p>
      ${[...letras].map(([l, ts]) => `<section class="letra">
        <h2 class="letra-l">${l}</h2>
        <dl>${ts.map((t) => `<div class="verbete" id="g-${t.id}">
          <dt>${esc(t.termo)} <span class="en">${esc(t.en)}</span></dt>
          <dd>${esc(t.def)} <code class="marca">${esc(t.marca)}</code></dd>
        </div>`).join("")}</dl>
      </section>`).join("")}
    </div>
    ${rodape()}
  </article>`;
}
