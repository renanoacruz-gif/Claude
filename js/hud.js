const HUD = (() => {
  function draw(ctx, state) {
    const { score, coins, world, time, lives } = state;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CONFIG.W, 36);

    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 14px monospace';
    ctx.textBaseline = 'top';

    // MARIO
    ctx.textAlign = 'left';
    ctx.fillText('MARIO', 20, 6);
    ctx.textAlign = 'center';
    ctx.fillText(String(score).padStart(6,'0'), 52, 18);

    // COINS
    ctx.fillStyle = '#FD0';
    ctx.beginPath(); ctx.arc(135, 22, 7, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#FA0'; ctx.beginPath(); ctx.arc(135, 22, 4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#FFF';
    ctx.textAlign = 'left';
    ctx.fillText(`x${String(coins).padStart(2,'0')}`, 148, 15);

    // WORLD
    ctx.textAlign = 'center';
    ctx.fillText('WORLD', 400, 6);
    ctx.fillText(world, 400, 18);

    // TIME
    ctx.textAlign = 'center';
    ctx.fillText('TIME', 700, 6);
    ctx.fillStyle = time <= 100 ? '#F66' : '#FFF';
    ctx.fillText(String(Math.max(0,Math.floor(time))).padStart(3,'0'), 700, 18);

    // LIVES
    ctx.fillStyle = '#FFF';
    ctx.textAlign = 'right';
    ctx.fillText(`♥ x${lives}`, 780, 15);
  }

  function drawOverlay(ctx, text, sub, color='#FFF') {
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, CONFIG.W, CONFIG.H);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.font = 'bold 52px monospace';
    ctx.fillText(text, CONFIG.W/2, CONFIG.H/2 - 30);
    if(sub){
      ctx.font = 'bold 22px monospace';
      ctx.fillStyle = '#FFF';
      ctx.fillText(sub, CONFIG.W/2, CONFIG.H/2 + 30);
    }
  }

  function drawMenu(ctx, frame) {
    // Sky BG
    ctx.fillStyle='#5C94FC'; ctx.fillRect(0,0,CONFIG.W,CONFIG.H);
    Sprites.cloud(ctx, 80, 60);
    Sprites.cloud(ctx, 320, 40);
    Sprites.cloud(ctx, 560, 70);
    Sprites.hill(ctx, 180, CONFIG.H-100, 70);
    Sprites.hill(ctx, 600, CONFIG.H-100, 50);
    Sprites.bush(ctx, 50, CONFIG.H-100);
    Sprites.bush(ctx, 430, CONFIG.H-100);
    // Ground
    ctx.fillStyle='#E8952A';
    ctx.fillRect(0, CONFIG.H-70, CONFIG.W, 70);
    ctx.fillStyle='#2C0'; ctx.fillRect(0, CONFIG.H-70, CONFIG.W, 7);

    // Title
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle='#000'; ctx.font='bold 58px monospace';
    ctx.fillText('SUPER MARIO BROS', CONFIG.W/2+3, CONFIG.H/2-70+3);
    ctx.fillStyle='#F00'; ctx.font='bold 56px monospace';
    ctx.fillText('SUPER MARIO BROS', CONFIG.W/2, CONFIG.H/2-70);

    // Blink "PRESS ENTER"
    if((frame>>4)&1){
      ctx.fillStyle='#FFF'; ctx.font='bold 22px monospace';
      ctx.fillText('PRESSIONE ENTER PARA JOGAR', CONFIG.W/2, CONFIG.H/2+20);
    }

    ctx.font='14px monospace'; ctx.fillStyle='#CCC';
    ctx.fillText('← → Mover  |  Space/↑ Pular  |  Shift Correr  |  Z Fogo  |  P Pausar', CONFIG.W/2, CONFIG.H-30);
  }

  function drawGameOver(ctx) {
    ctx.fillStyle='#000'; ctx.fillRect(0,0,CONFIG.W,CONFIG.H);
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle='#F00'; ctx.font='bold 64px monospace';
    ctx.fillText('GAME OVER', CONFIG.W/2, CONFIG.H/2-20);
    ctx.fillStyle='#FFF'; ctx.font='bold 20px monospace';
    ctx.fillText('Pressione ENTER para recomeçar', CONFIG.W/2, CONFIG.H/2+40);
  }

  function drawWin(ctx) {
    ctx.fillStyle='#000028'; ctx.fillRect(0,0,CONFIG.W,CONFIG.H);
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle='#FD0'; ctx.font='bold 48px monospace';
    ctx.fillText('VOCÊ VENCEU!', CONFIG.W/2, CONFIG.H/2-60);
    ctx.fillStyle='#FFF'; ctx.font='bold 22px monospace';
    ctx.fillText('Parabéns! O Reino está salvo!', CONFIG.W/2, CONFIG.H/2);
    ctx.fillStyle='#0F0'; ctx.font='bold 18px monospace';
    ctx.fillText('Pressione ENTER para jogar novamente', CONFIG.W/2, CONFIG.H/2+50);
  }

  return { draw, drawOverlay, drawMenu, drawGameOver, drawWin };
})();
