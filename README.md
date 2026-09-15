# Atlas de Arrakis

Um atlas navegável da geografia e da economia de Arrakis, o planeta de *Duna*.
O mapa do apêndice do livro foi georreferenciado, dividido em 44 distritos e
cruzado com o que os livros dizem sobre cada lugar — e cada número do site
declara de onde veio: frase de Frank Herbert, medida sobre o mapa, ou modelo.

## O que tem aqui

- **O mapa** — prancha interativa em canvas, na mesma projeção do desenho
  original (azimutal equidistante polar). Clique num distrito para ver a frase
  do livro sobre ele, o que acontece ali (com spoilers borrados) e os dados.
- **Regiões, distritos, o verme, a vida no deserto** — pranchas sobre o planeta.
- **A rota da fuga** — o caminho de Paul e Jessica sobre o mapa, etapa por etapa, atrás de um aviso de spoiler.
- **O argumento** — padrões de assentamento, custo de travessia, soberania e
  controle, a economia da especiaria, a economia da água, comparação com dados reais.
- **A oficina** — as contradições do cânone, o que é dado e o que é modelo, o glossário, as fontes.

Pelo site, termos do universo (sietch, trajestil, martelador…) mostram a definição ao passar o mouse.

## Rodar

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # produção em dist/
npm run preview   # serve o build em http://localhost:4173
```

É um site estático (Vite + TypeScript, sem framework e sem biblioteca de mapa).
Os dados em `public/dados/` foram exportados de um projeto QGIS mantido à parte;
aqui eles já vêm prontos.

## Estrutura

```
src/
  main.ts        roteador, cabeçalho e sumário
  pranchas.ts    ordem das pranchas; os números saem daqui
  glossario.ts   termos, definições e a marcação automática no texto
  mapa.ts        renderizador do mapa (canvas)
  areia.ts       areia soprada sobre as dunas da abertura
  dados.ts       carregamento e formatação
  campos.ts      dicionário das variáveis dos distritos
  ui.ts          blocos de texto, selos de proveniência, tabelas, spoilers
  estilo.css     sistema visual
  paginas/       uma por prancha
public/
  dados/         geometrias (TopoJSON), tabelas, citações e eventos
  ilustracoes/   estampas
  videos/, capa/ vídeos da abertura
scripts/         capturas e verificações com Chrome headless
```

## Créditos

- **Base cartográfica:** redesenho do mapa de Arrakis por **NiptonIceTea**, a
  partir do mapa do apêndice de *Duna* (atribuído a de Fontaine, 1965).
- **Fonte primária:** Frank Herbert, *Duna* e continuações (1965–1985). As
  citações são trechos curtos, sempre com a localização no livro.
- **Ilustrações:** as estampas, as dunas e os vídeos dos cartões são imagens
  geradas por modelos de imagem e vídeo (Black Forest Labs FLUX, ByteDance
  Seedance), tratadas em sépia. As estampas do verme e da fauna foram descritas
  a partir do texto do livro, não de imagens de filmes ou de fan-arts. O planeta
  da abertura é um render próprio a partir de ruído. Nenhuma delas é dado; a
  prancha de fontes lista cada uma com o que foi pedido.

## Aviso

*Duna*, Arrakis e todos os nomes do universo são criação de Frank Herbert; os
direitos pertencem a seus detentores. Este é um projeto de estudo, sem fim
comercial e sem vínculo com eles. Os valores marcados com † foram construídos
para análise e não fazem parte da obra.
