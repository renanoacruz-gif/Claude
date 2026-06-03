const Sprites = (() => {
  const TS = 32;

  // ── Mario ──────────────────────────────────────────────────────────────────
  function mario(ctx, cx, by, dir, animFrame, state, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha ?? 1;
    if (dir < 0) { ctx.translate(cx*2,0); ctx.scale(-1,1); }

    const big = state !== ST.SMALL;
    const fire = state === ST.FIRE;
    const h = big ? 56 : 28;
    const x = cx - 12, y = by - h;

    // colours
    const C = {
      hat:  fire ? '#FFF' : '#D00',
      body: fire ? '#FFF' : '#D00',
      pants:fire ? '#D00' : '#00F',
      skin: '#FCA',
      shoe: '#630',
      hair: '#630',
    };

    if (big) {
      // shoes
      ctx.fillStyle=C.shoe;  ctx.fillRect(x,    y+48,11,8); ctx.fillRect(x+13,y+48,11,8);
      // pants
      ctx.fillStyle=C.pants; ctx.fillRect(x+2,  y+30,20,20);
      // suspenders
      ctx.fillStyle=C.pants; ctx.fillRect(x+4,  y+14,5,18); ctx.fillRect(x+15,y+14,5,18);
      // body
      ctx.fillStyle=C.body;  ctx.fillRect(x+2,  y+14,20,18);
      // neck
      ctx.fillStyle=C.skin;  ctx.fillRect(x+8,  y+10,8,6);
      // face
      ctx.fillStyle=C.skin;  ctx.fillRect(x+4,  y+2, 16,10);
      // hat
      ctx.fillStyle=C.hat;   ctx.fillRect(x+2,  y,   20,4); ctx.fillRect(x+6,y-4,14,6);
      // eye
      ctx.fillStyle='#000';  ctx.fillRect(x+14, y+4, 4,3);
      // mustache
      ctx.fillStyle=C.hair;  ctx.fillRect(x+8,  y+8, 12,4);
    } else {
      // shoes
      ctx.fillStyle=C.shoe;  ctx.fillRect(x,    y+22,11,6); ctx.fillRect(x+13,y+22,11,6);
      // pants
      ctx.fillStyle=C.pants; ctx.fillRect(x+2,  y+14,20,10);
      // body
      ctx.fillStyle=C.body;  ctx.fillRect(x+2,  y+8, 20,8);
      // face
      ctx.fillStyle=C.skin;  ctx.fillRect(x+4,  y+4, 16,6);
      // hat
      ctx.fillStyle=C.hat;   ctx.fillRect(x+2,  y+2, 20,4); ctx.fillRect(x+6,y,14,4);
      // eye
      ctx.fillStyle='#000';  ctx.fillRect(x+14, y+5, 4,3);
      // mustache
      ctx.fillStyle=C.hair;  ctx.fillRect(x+8,  y+9, 12,3);
    }
    ctx.restore();
  }

  // ── Goomba ─────────────────────────────────────────────────────────────────
  function goomba(ctx, cx, by, frame, squished) {
    const h = squished ? 12 : 28;
    const x = cx - 14, y = by - h;
    ctx.fillStyle='#8B4513';
    if (squished) {
      ctx.fillRect(x,y,28,12);
      ctx.fillStyle='#FFF'; ctx.fillRect(x+3,y+2,7,6); ctx.fillRect(x+18,y+2,7,6);
      ctx.fillStyle='#000'; ctx.fillRect(x+7,y+3,3,4); ctx.fillRect(x+21,y+3,3,4);
      return;
    }
    // body
    ctx.beginPath(); ctx.arc(cx,y+14,13,0,Math.PI*2); ctx.fill();
    ctx.fillRect(x+2,y+14,24,14);
    // eyes
    ctx.fillStyle='#FFF'; ctx.fillRect(x+4,y+7,7,7);  ctx.fillRect(x+17,y+7,7,7);
    ctx.fillStyle='#000'; ctx.fillRect(x+8,y+8,4,5);  ctx.fillRect(x+21,y+8,4,5);
    // brows
    ctx.fillStyle='#000';
    ctx.beginPath(); ctx.moveTo(x+3,y+6); ctx.lineTo(x+12,y+8); ctx.lineTo(x+3,y+8); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x+25,y+6); ctx.lineTo(x+16,y+8); ctx.lineTo(x+25,y+8); ctx.fill();
    // feet
    const fw = (frame>>3)&1;
    ctx.fillStyle='#3D1C00';
    ctx.fillRect(x,    y+24-(fw*2), 9, 4+(fw*2));
    ctx.fillRect(x+19, y+24+(fw*2), 9, 4-(fw*2));
  }

  // ── Koopa ──────────────────────────────────────────────────────────────────
  function koopa(ctx, cx, by, frame) {
    const x = cx-14, y = by-38;
    // shell
    ctx.fillStyle='#0A0';
    ctx.beginPath(); ctx.arc(cx,y+24,14,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#FF0'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(cx,y+24,9,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,y+15); ctx.lineTo(cx,y+33); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-9,y+24); ctx.lineTo(cx+9,y+24); ctx.stroke();
    // head
    ctx.fillStyle='#0C0'; ctx.fillRect(x+6,y,16,12);
    // eye
    ctx.fillStyle='#FFF'; ctx.fillRect(x+14,y+2,6,6);
    ctx.fillStyle='#000'; ctx.fillRect(x+16,y+3,3,4);
    // feet
    const fw=(frame>>3)&1;
    ctx.fillStyle='#0A0';
    ctx.fillRect(x,   y+34-(fw*2),9,4+(fw*2));
    ctx.fillRect(x+19,y+34+(fw*2),9,4-(fw*2));
  }

  function shell(ctx, cx, by) {
    const x=cx-14, y=by-22;
    ctx.fillStyle='#0A0';
    ctx.beginPath(); ctx.arc(cx,y+12,13,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#FF0'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(cx,y+12,8,0,Math.PI*2); ctx.stroke();
  }

  // ── Collectibles / Power-ups ────────────────────────────────────────────────
  function coin(ctx, cx, by, frame) {
    const sy = Math.abs(Math.cos(frame*0.15));
    ctx.save(); ctx.translate(cx,by-12); ctx.scale(sy,1);
    ctx.fillStyle='#FD0'; ctx.beginPath(); ctx.arc(0,0,9,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#FA0'; ctx.beginPath(); ctx.arc(0,0,6,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  function mushroom(ctx, cx, by) {
    const x=cx-14, y=by-28;
    ctx.fillStyle='#FCA'; ctx.fillRect(x+6,y+16,16,12);
    ctx.fillStyle='#D00';
    ctx.beginPath(); ctx.arc(cx,y+14,14,Math.PI,0); ctx.fill();
    ctx.fillRect(x,y+10,28,8);
    ctx.fillStyle='#FFF';
    ctx.beginPath(); ctx.arc(cx-5,y+9,4,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx+7,y+7,3,0,Math.PI*2); ctx.fill();
  }

  function fireFlower(ctx, cx, by, frame) {
    const y=by-28;
    ctx.fillStyle='#0A0'; ctx.fillRect(cx-2,y+16,4,12);
    ctx.fillRect(cx-9,y+18,9,5); ctx.fillRect(cx+2,y+22,9,5);
    for(let i=0;i<5;i++){
      const a=(frame*0.07)+(i/5)*Math.PI*2;
      ctx.fillStyle=i%2?'#F60':'#F00';
      ctx.beginPath(); ctx.arc(cx+Math.cos(a)*8,y+10+Math.sin(a)*8,4,0,Math.PI*2); ctx.fill();
    }
    ctx.fillStyle='#FF0';
    ctx.beginPath(); ctx.arc(cx,y+10,5,0,Math.PI*2); ctx.fill();
  }

  function star(ctx, cx, by, frame) {
    ctx.save(); ctx.translate(cx,by-14); ctx.rotate(frame*0.05);
    ctx.fillStyle=(frame>>2)&1?'#FD0':'#F80';
    ctx.beginPath();
    for(let i=0;i<5;i++){
      const a=(i*4*Math.PI/5)-Math.PI/2, ia=a+2*Math.PI/5;
      i===0?ctx.moveTo(Math.cos(a)*12,Math.sin(a)*12):ctx.lineTo(Math.cos(a)*12,Math.sin(a)*12);
      ctx.lineTo(Math.cos(ia)*5,Math.sin(ia)*5);
    }
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function fireball(ctx, cx, cy, frame) {
    ctx.fillStyle=['#F60','#F00','#FF0'][frame%3];
    ctx.beginPath(); ctx.arc(cx,cy,6,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#FFF'; ctx.beginPath(); ctx.arc(cx-1,cy-1,2,0,Math.PI*2); ctx.fill();
  }

  // ── Tiles ──────────────────────────────────────────────────────────────────
  function ground(ctx, tx, ty, grassTop) {
    ctx.fillStyle='#E8952A'; ctx.fillRect(tx,ty,TS,TS);
    ctx.fillStyle='#C47822'; ctx.fillRect(tx,ty,TS,1); ctx.fillRect(tx,ty,1,TS);
    if(grassTop){ ctx.fillStyle='#2C0'; ctx.fillRect(tx,ty,TS,6); ctx.fillStyle='#080'; ctx.fillRect(tx,ty+4,TS,3); }
  }

  function brick(ctx, tx, ty) {
    ctx.fillStyle='#C84C28'; ctx.fillRect(tx,ty,TS,TS);
    ctx.fillStyle='#8B3010';
    ctx.fillRect(tx,ty,TS,2); ctx.fillRect(tx,ty+TS/2-1,TS,2); ctx.fillRect(tx,ty+TS-2,TS,2);
    ctx.fillRect(tx+TS/2-1,ty,2,TS/2); ctx.fillRect(tx+TS-1,ty,2,TS/2);
    ctx.fillRect(tx,ty+TS/2,2,TS/2); ctx.fillRect(tx+TS*3/4-1,ty+TS/2,2,TS/2);
  }

  function qBlock(ctx, tx, ty, used, frame) {
    ctx.fillStyle=used?'#8B6914':'#F80'; ctx.fillRect(tx,ty,TS,TS);
    const bc=used?'#5A4010':'#FA0';
    ctx.fillStyle=bc;
    ctx.fillRect(tx,ty,TS,3); ctx.fillRect(tx,ty+TS-3,TS,3);
    ctx.fillRect(tx,ty,3,TS); ctx.fillRect(tx+TS-3,ty,3,TS);
    if(!used){
      ctx.fillStyle=(frame>>3)&1?'#FF0':'#FFF';
      ctx.font='bold 20px monospace'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('?',tx+TS/2,ty+TS/2);
    }
  }

  function solidBlock(ctx, tx, ty) {
    ctx.fillStyle='#C0A040'; ctx.fillRect(tx,ty,TS,TS);
    ctx.fillStyle='#E0C060'; ctx.fillRect(tx+2,ty+2,TS-4,TS-4);
    ctx.fillStyle='#C0A040'; ctx.fillRect(tx+6,ty+6,TS-12,TS-12);
    ctx.fillStyle='#A08030'; ctx.fillRect(tx,ty,TS,2); ctx.fillRect(tx,ty,2,TS);
  }

  function pipe(ctx, tx, ty, seg) {
    // seg: 'TL','TR','BL','BR'
    const isLeft = seg==='TL'||seg==='BL';
    const isTop  = seg==='TL'||seg==='TR';
    ctx.fillStyle='#0A0'; ctx.fillRect(tx,ty,TS,TS);
    if(isLeft){ ctx.fillStyle='#0C0'; ctx.fillRect(tx+2,ty,TS/2-2,TS); }
    else       { ctx.fillStyle='#060'; ctx.fillRect(tx+TS/2,ty,TS/2-2,TS); }
    if(isTop){
      const rx=isLeft?tx-4:tx, rw=TS+4;
      ctx.fillStyle='#0C0'; ctx.fillRect(rx,ty,rw,8);
      ctx.fillStyle='#080'; ctx.fillRect(rx,ty+5,rw,4);
    }
  }

  // ── Decorations ────────────────────────────────────────────────────────────
  function cloud(ctx, x, y) {
    ctx.fillStyle='rgba(255,255,255,0.92)';
    [[20,12,16],[36,6,20],[56,12,16],[70,16,12],[10,16,12]].forEach(([ox,oy,r])=>{
      ctx.beginPath(); ctx.arc(x+ox,y+oy,r,0,Math.PI*2); ctx.fill();
    });
  }

  function bush(ctx, x, y) {
    ctx.fillStyle='#0A0';
    [[16,10,14],[32,6,18],[50,10,14]].forEach(([ox,oy,r])=>{
      ctx.beginPath(); ctx.arc(x+ox,y+oy,r,0,Math.PI*2); ctx.fill();
    });
  }

  function hill(ctx, x, y, r) {
    ctx.fillStyle='#0A0'; ctx.beginPath(); ctx.arc(x,y,r,Math.PI,0); ctx.fill();
    ctx.fillStyle='#080'; ctx.beginPath(); ctx.arc(x,y,r*.6,Math.PI,0); ctx.fill();
    ctx.fillStyle='#0C0';
    for(let i=0;i<5;i++){ ctx.beginPath(); ctx.arc(x-r*.5+i*r*.25,y-r*.3,4,0,Math.PI*2); ctx.fill(); }
  }

  function flagPole(ctx, px, topY, botY, flagY) {
    // pole
    ctx.fillStyle='#888'; ctx.fillRect(px-2,topY,4,botY-topY);
    // ball
    ctx.fillStyle='#FD0'; ctx.beginPath(); ctx.arc(px,topY,6,0,Math.PI*2); ctx.fill();
    // flag
    ctx.fillStyle='#0C0';
    ctx.beginPath(); ctx.moveTo(px,flagY); ctx.lineTo(px+22,flagY+9); ctx.lineTo(px,flagY+18); ctx.closePath(); ctx.fill();
  }

  function castle(ctx, x, y) {
    const W=96, H=96;
    ctx.fillStyle='#888'; ctx.fillRect(x,y,W,H);
    // battlements
    for(let i=0;i<3;i++) ctx.fillRect(x+i*32,y-24,20,24);
    // door
    ctx.fillStyle='#222'; ctx.fillRect(x+30,y+52,36,44);
    ctx.beginPath(); ctx.arc(x+48,y+52,18,Math.PI,0); ctx.fill();
    // windows
    ctx.fillStyle='#222';
    ctx.fillRect(x+8, y+16,20,20); ctx.fillRect(x+68,y+16,20,20);
    ctx.fillRect(x+8, y+48,20,20); ctx.fillRect(x+68,y+48,20,20);
    // flag on castle
    ctx.fillStyle='#888'; ctx.fillRect(x+46,y-48,4,28);
    ctx.fillStyle='#D00'; ctx.beginPath(); ctx.moveTo(x+50,y-44); ctx.lineTo(x+68,y-36); ctx.lineTo(x+50,y-28); ctx.closePath(); ctx.fill();
  }

  function scorePopup(ctx, text, x, y, alpha) {
    ctx.save(); ctx.globalAlpha=alpha;
    ctx.fillStyle='#FFF'; ctx.font='bold 14px monospace';
    ctx.textAlign='center'; ctx.fillText(text,x,y);
    ctx.restore();
  }

  return { mario, goomba, koopa, shell, coin, mushroom, fireFlower, star, fireball,
           ground, brick, qBlock, solidBlock, pipe, cloud, bush, hill, flagPole, castle, scorePopup };
})();
