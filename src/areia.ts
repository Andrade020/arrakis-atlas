/* Areia soprada pelo vento, desenhada em canvas por cima das dunas.
 *
 * Duas camadas:
 *  - véus: manchas largas e muito tênues que atravessam a cena rente ao chão,
 *    como a areia que o vento levanta das cristas. São o que dá a sensação de
 *    vento; sozinhos quase não se veem.
 *  - grãos: pontos com um rastro curto. A primeira versão usava traços longos
 *    e claros espalhados pela tela inteira e parecia CHUVA — logo embaixo de
 *    "um deserto onde nunca choveu". Agora os grãos só existem abaixo do
 *    horizonte e seguem a perspectiva: perto do horizonte são pequenos e
 *    lentos, na frente são maiores e rápidos.
 *
 * Uma rajada lenta sobe e desce a velocidade de tudo junto, para a cena
 * respirar em vez de parecer esteira. Para quando sai da tela ou a aba fica
 * oculta, e não roda com prefers-reduced-motion.
 */

interface Grao { x: number; p: number; dy: number; v: number; a: number; fase: number; }
interface Veu { x: number; p: number; w: number; h: number; v: number; a: number; }

const HORIZONTE = 0.30;   // fração da altura onde a areia começa (a foto tem céu acima)

export function areia(tela: HTMLCanvasElement): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const ctx = tela.getContext("2d");
  if (!ctx) return () => {};

  let larg = 0, alt = 0, dpr = 1;
  let graos: Grao[] = [];
  let veus: Veu[] = [];
  let vivo = true, visivel = true, ultimo = 0, quadro = 0;

  // p = profundidade: 0 no horizonte, 1 na frente. Mais grãos perto do chão.
  const yDe = (p: number) => alt * (HORIZONTE + (1 - HORIZONTE) * p);
  const novoGrao = (x?: number): Grao => {
    const p = Math.pow(Math.random(), 0.7);
    return {
      x: x ?? Math.random() * larg, p, dy: 0,
      v: (25 + Math.random() * 45) * (0.25 + 1.6 * p),
      a: (0.08 + Math.random() * 0.22) * (0.5 + 0.6 * p),
      fase: Math.random() * Math.PI * 2,
    };
  };
  const novoVeu = (x?: number): Veu => {
    const p = 0.25 + Math.random() * 0.75;
    const w = (220 + Math.random() * 380) * (0.5 + p);
    return {
      x: x ?? Math.random() * larg, p, w,
      h: (18 + Math.random() * 30) * (0.5 + p),
      v: (30 + Math.random() * 40) * (0.4 + p),
      a: 0.05 + Math.random() * 0.06,
    };
  };

  function mede() {
    const r = tela.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    larg = r.width; alt = r.height;
    tela.width = Math.round(larg * dpr);
    tela.height = Math.round(alt * dpr);
    graos = Array.from({ length: Math.min(700, Math.round((larg * alt) / 2600)) }, () => novoGrao());
    veus = Array.from({ length: Math.max(4, Math.round(larg / 260)) }, () => novoVeu());
  }

  function passo(t: number) {
    if (!vivo) return;
    quadro = requestAnimationFrame(passo);
    if (!visivel) { ultimo = t; return; }
    const dt = Math.min(0.05, ultimo ? (t - ultimo) / 1000 : 0.016);
    ultimo = t;
    const rajada = 0.9 + 0.45 * Math.sin(t / 1700) * Math.sin(t / 3900 + 1.3);
    const c = ctx!;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, larg, alt);

    for (const v of veus) {
      v.x += v.v * rajada * dt;
      if (v.x - v.w > larg) Object.assign(v, novoVeu(-v.w));
      const y = yDe(v.p);
      c.save();
      c.translate(v.x, y);
      c.scale(v.w / v.h, 1);
      const g = c.createRadialGradient(0, 0, 0, 0, 0, v.h);
      g.addColorStop(0, `rgba(236, 184, 120, ${v.a * (0.7 + 0.5 * rajada)})`);
      g.addColorStop(1, "rgba(236, 184, 120, 0)");
      c.fillStyle = g;
      c.fillRect(-v.h, -v.h, v.h * 2, v.h * 2);
      c.restore();
    }

    c.lineCap = "round";
    for (const g of graos) {
      const vx = g.v * rajada;
      const x0 = g.x;
      g.x += vx * dt;
      g.dy = Math.sin(t / 600 + g.fase) * 3 * (0.3 + g.p);
      if (g.x > larg + 10) { Object.assign(g, novoGrao(-5 - Math.random() * 30)); continue; }
      const y = yDe(g.p) + g.dy;
      const cauda = Math.min(7, vx * 0.035);
      c.strokeStyle = `rgba(240, 196, 138, ${g.a})`;
      c.lineWidth = 0.5 + 1.1 * g.p;
      c.beginPath();
      c.moveTo(x0 - cauda, y);
      c.lineTo(g.x, y);
      c.stroke();
    }
  }

  mede();
  const ro = new ResizeObserver(mede);
  ro.observe(tela);
  const io = new IntersectionObserver(([e]) => { visivel = e.isIntersecting; });
  io.observe(tela);
  const aba = () => { visivel = !document.hidden; };
  document.addEventListener("visibilitychange", aba);
  quadro = requestAnimationFrame(passo);

  return () => {
    vivo = false;
    cancelAnimationFrame(quadro);
    ro.disconnect(); io.disconnect();
    document.removeEventListener("visibilitychange", aba);
  };
}
