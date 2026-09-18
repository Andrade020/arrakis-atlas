import { rota, t } from "./i18n";
import { plac, type IdPrancha } from "./pranchas";

import "./navegacao-final.css";

interface Destino {
  id: IdPrancha;
  tituloPt: string;
  tituloEn: string;
}

/* A sequência editorial começa depois do mapa. Os títulos ficam aqui, em vez
 * de depender do roteador, para este módulo poder ser ligado ao fim da
 * montagem sem criar uma importação circular com main.ts. */
const SEQUENCIA: readonly Destino[] = [
  { id: "regioes", tituloPt: "As sete regiões", tituloEn: "The seven regions" },
  { id: "distritos", tituloPt: "Os 44 distritos", tituloEn: "The 44 districts" },
  { id: "verme", tituloPt: "Shai-Hulud, o verme", tituloEn: "Shai-Hulud, the worm" },
  { id: "subsolo", tituloPt: "Sob a areia", tituloEn: "Beneath the sand" },
  { id: "vida", tituloPt: "O que vive no deserto", tituloEn: "What lives in the desert" },
  { id: "fuga", tituloPt: "A rota da fuga", tituloEn: "The escape route" },
  { id: "padroes", tituloPt: "Onde as pessoas estão", tituloEn: "Where people live" },
  { id: "acessibilidade", tituloPt: "Dois Arrakis", tituloEn: "Two Arrakises" },
  { id: "poder", tituloPt: "Soberania e controle", tituloEn: "Sovereignty and control" },
  { id: "economia", tituloPt: "A economia da especiaria", tituloEn: "The spice economy" },
  { id: "agua", tituloPt: "A economia da água", tituloEn: "The water economy" },
  { id: "sociedade", tituloPt: "A sociedade da água", tituloEn: "The society of water" },
  { id: "comparacao", tituloPt: "Na régua do mundo real", tituloEn: "Against the real world" },
  { id: "contradicoes", tituloPt: "Contradições do cânone", tituloEn: "Contradictions in the books" },
  { id: "metodo", tituloPt: "Dado ou modelo", tituloEn: "Data or model" },
  { id: "glossario", tituloPt: "Glossário", tituloEn: "Glossary" },
  { id: "fontes", tituloPt: "Fontes e créditos", tituloEn: "Sources and credits" },
] as const;

const MAPA: Destino = { id: "mapa", tituloPt: "O mapa", tituloEn: "The map" };
const ABERTURA: Destino = { id: "", tituloPt: "Abertura", tituloEn: "Opening" };

function criaLink(destino: Destino, lado: "anterior" | "proxima", voltaAoInicio = false): HTMLAnchorElement {
  const titulo = t(destino.tituloPt, destino.tituloEn);
  const direcao = voltaAoInicio
    ? t("Voltar ao início", "Back to the beginning")
    : lado === "anterior"
      ? t("Página anterior", "Previous page")
      : t("Próxima página", "Next page");

  const link = document.createElement("a");
  link.className = `navegacao-final__link navegacao-final__link--${lado}`;
  link.href = rota(destino.id);
  link.setAttribute("aria-label", `${direcao}: ${titulo}`);

  const rotulo = document.createElement("span");
  rotulo.className = "navegacao-final__direcao";
  rotulo.textContent = direcao;

  const seta = document.createElement("span");
  seta.className = "navegacao-final__seta";
  seta.setAttribute("aria-hidden", "true");
  seta.textContent = lado === "anterior" ? "←" : "→";

  const destinoLinha = document.createElement("span");
  destinoLinha.className = "navegacao-final__destino";

  const numero = document.createElement("span");
  numero.className = "navegacao-final__numero";
  numero.textContent = plac(destino.id);

  const nome = document.createElement("span");
  nome.className = "navegacao-final__titulo";
  nome.textContent = titulo;

  destinoLinha.append(numero, nome);
  if (lado === "anterior") link.append(rotulo, destinoLinha, seta);
  else link.append(rotulo, destinoLinha, seta);
  return link;
}

/** Acrescenta anterior/próxima imediatamente antes do crédito final da página. */
export function adicionaNavegacaoFinal(main: HTMLElement, idAtual: string): void {
  const indice = SEQUENCIA.findIndex((pagina) => pagina.id === idAtual);
  const rodape = main.querySelector<HTMLElement>(".rodape-fino");
  if (indice < 0 || !rodape) return;

  main.querySelector(".navegacao-final")?.remove();

  const anterior = indice === 0 ? MAPA : SEQUENCIA[indice - 1];
  const fim = indice === SEQUENCIA.length - 1;
  const proxima = fim ? ABERTURA : SEQUENCIA[indice + 1];

  const navegacao = document.createElement("nav");
  navegacao.className = "navegacao-final";
  navegacao.setAttribute("aria-label", t("Navegação entre páginas", "Page navigation"));
  navegacao.append(
    criaLink(anterior, "anterior"),
    criaLink(proxima, "proxima", fim),
  );
  rodape.before(navegacao);
}
