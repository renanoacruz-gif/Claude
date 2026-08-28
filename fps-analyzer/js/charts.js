/* FPS Analyzer — gráfico radar em canvas puro */
window.Radar = (function(){

  function hexToRgba(hex,a){
    const h = hex.replace('#','');
    const n = parseInt(h.length===3 ? h.split('').map(c=>c+c).join('') : h, 16);
    return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
  }

  function draw(canvas, games, criterios){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = canvas.clientWidth || 620;
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,size,size);

    const cx = size/2, cy = size/2;
    const R  = size/2 - Math.max(58, size*0.11);
    const N  = criterios.length;
    const step = (Math.PI*2)/N;
    const start = -Math.PI/2;

    const pt = (i, r) => [cx + Math.cos(start + i*step)*r, cy + Math.sin(start + i*step)*r];

    /* anéis */
    ctx.lineWidth = 1;
    for(let ring=2; ring<=10; ring+=2){
      const r = R*(ring/10);
      ctx.beginPath();
      for(let i=0;i<N;i++){ const [x,y]=pt(i,r); i?ctx.lineTo(x,y):ctx.moveTo(x,y); }
      ctx.closePath();
      ctx.strokeStyle = ring===10 ? '#3a4657' : '#232e3c';
      ctx.stroke();
    }

    /* eixos + rótulos */
    ctx.font = '600 11.5px system-ui, sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    for(let i=0;i<N;i++){
      const [x,y] = pt(i,R);
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(x,y);
      ctx.strokeStyle = '#232e3c'; ctx.stroke();
      const [lx,ly] = pt(i, R + Math.max(26, size*0.05));
      ctx.fillStyle = '#9fb0c3';
      ctx.fillText(criterios[i].n, lx, ly);
    }

    /* polígonos dos jogos */
    games.forEach(g=>{
      ctx.beginPath();
      criterios.forEach((c,i)=>{
        const v = g.scores[c.k] || 0;
        const [x,y] = pt(i, R*(v/10));
        i?ctx.lineTo(x,y):ctx.moveTo(x,y);
      });
      ctx.closePath();
      ctx.fillStyle = hexToRgba(g.cor, .16);
      ctx.fill();
      ctx.strokeStyle = g.cor;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      criterios.forEach((c,i)=>{
        const v = g.scores[c.k] || 0;
        const [x,y] = pt(i, R*(v/10));
        ctx.beginPath(); ctx.arc(x,y,3.2,0,Math.PI*2);
        ctx.fillStyle = g.cor; ctx.fill();
      });
    });
  }

  return { draw, hexToRgba };
})();
