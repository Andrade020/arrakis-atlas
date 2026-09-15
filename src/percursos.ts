/** Leitura guiada da carta. Os códigos e nomes são os do gazetteer em
 * dados/distritos.json; os campos e camadas existem no seletor do mapa. */
export interface PassoPercurso {
  cod: string;
  lugarPt: string;
  lugarEn: string;
  raster: string;
  campo: string;
  camadas: string[];
  pt: string;
  en: string;
  prancha: string;
}

export interface Percurso {
  pt: string;
  en: string;
  passos: PassoPercurso[];
}

export const PERCURSOS: Percurso[] = [
  {
    pt: "Por que os assentamentos seguem a rocha?",
    en: "Why do settlements follow the rock?",
    passos: [
      {
        cod: "AR-08", lugarPt: "Sietch Tabr", lugarEn: "Sietch Tabr",
        raster: "relevo", campo: "p_relevo",
        camadas: ["distritos", "rotulos", "assentamentos", "grade"],
        pt: "Os sietches se abrigam na rocha firme: a carta aproxima o assentamento do terreno onde ele pode persistir.",
        en: "Sietches shelter in solid rock: the map places a settlement beside the ground where it can endure.",
        prancha: "padroes",
      },
      {
        cod: "AR-07", lugarPt: "Afloramentos Rochosos", lugarEn: "Rock Outcroppings",
        raster: "densidade", campo: "n_sietch_e",
        camadas: ["distritos", "rotulos", "assentamentos", "regioes"],
        pt: "Aqui a rocha e os sietches aparecem juntos. O mapa desenha só parte dos assentamentos fremen; ausência de glifo não significa ausência de gente.",
        en: "Here rock and sietches appear together. The map draws only some Fremen settlements; an empty map symbol does not mean empty land.",
        prancha: "distritos",
      },
    ],
  },
  {
    pt: "Império versus fremen",
    en: "Empire versus Fremen",
    passos: [
      {
        cod: "AR-06", lugarPt: "Bacia de Tuono", lugarEn: "Tuono Basin",
        raster: "custo_imperial", campo: "cd_arrak",
        camadas: ["distritos", "rotulos", "assentamentos", "poder", "rede_imperial"],
        pt: "A rede imperial mede o acesso por travessia terrestre até Arrakeen. Distância reta e custo de viagem são grandezas diferentes.",
        en: "The imperial network measures overland access to Arrakeen. Straight-line distance and travel cost are different quantities.",
        prancha: "acessibilidade",
      },
      {
        cod: "AR-08", lugarPt: "Sietch Tabr", lugarEn: "Sietch Tabr",
        raster: "custo_fremen", campo: "cd_tabr",
        camadas: ["distritos", "rotulos", "assentamentos", "poder", "rede_fremen"],
        pt: "Troque o ponto de partida e o modo de cruzar o deserto: o custo fremen se organiza em torno de Sietch Tabr e da viagem pelo verme.",
        en: "Change the starting point and the way of crossing the desert: Fremen cost centres on Sietch Tabr and travel by worm.",
        prancha: "acessibilidade",
      },
      {
        cod: "AR-07", lugarPt: "Afloramentos Rochosos", lugarEn: "Rock Outcroppings",
        raster: "", campo: "",
        camadas: ["distritos", "rotulos", "poder", "rede_imperial", "rede_fremen"],
        pt: "As duas redes se sobrepõem ao mapa de controle efetivo. A posse formal do planeta não descreve quem consegue circular e habitar cada lugar.",
        en: "Both networks overlay effective control. Formal ownership of the planet does not tell us who can travel through and inhabit each place.",
        prancha: "poder",
      },
    ],
  },
  {
    pt: "Quem controla a especiaria?",
    en: "Who controls the spice?",
    passos: [
      {
        cod: "AR-44", lugarPt: "Erg Exterior Ocidental", lugarEn: "Western Outer Erg",
        raster: "relevo", campo: "espec_t",
        camadas: ["distritos", "rotulos", "poder"],
        pt: "No modelo, este erg está entre os maiores produtores, mas aparece sem controle efetivo. A distribuição distrital da colheita é simulada.",
        en: "In the model, this erg is among the largest producers, yet it has no effective control. The district split of the harvest is simulated.",
        prancha: "economia",
      },
      {
        cod: "AR-37", lugarPt: "Planície Funerária", lugarEn: "The Funeral Plain",
        raster: "", campo: "",
        camadas: ["distritos", "rotulos", "poder"],
        pt: "Outra grande parcela modelada vem de terra sem controle efetivo. Compare a camada de poder com os números da economia antes de atribuir a riqueza a uma Casa.",
        en: "Another large modelled share comes from land with no effective control. Compare the control layer with the economic figures before assigning the wealth to a House.",
        prancha: "poder",
      },
      {
        cod: "AR-40", lugarPt: "Crista de Habbanya", lugarEn: "Habbanya Ridge",
        raster: "", campo: "espec_t",
        camadas: ["distritos", "rotulos", "poder", "rede_imperial"],
        pt: "Aqui o modelo assinala controle imperial e colheita relevante. A página econômica distingue o preço citado no livro da receita de quem colhe.",
        en: "Here the model assigns imperial control and a substantial harvest. The economic page separates the book's market price from the harvester's income.",
        prancha: "economia",
      },
    ],
  },
];
