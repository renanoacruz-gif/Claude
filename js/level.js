class Level {
  constructor(data) {
    this.data = data;
    this.TS = CONFIG.TS;
    this.camX = 0;
    this.tiles = this._parse(data.map);
    this.rows = this.tiles.length;
    this.cols = this.tiles[0].length;
    this.width = this.cols * this.TS;
    this.entities = [];
    this.powerups  = [];
    this.bounceCoins = [];
    this.popups    = [];
    this._spawnEntities();
    // Block state (for hit/broken blocks): map "col,row" -> true if used
    this.usedBlocks = new Set();
    this.frame = 0;
  }

  _parse(rows) {
    return rows.map(row => {
      const arr = [];
      for(let c=0; c<100; c++) arr.push(CHAR_MAP[row[c] ?? ' '] ?? 0);
      return arr;
    });
  }

  _spawnEntities() {
    this.data.entities.forEach(e => {
      const x = (e.col + 0.5) * this.TS;
      const y = (e.row + 1) * this.TS;
      if(e.type === 'goomba') this.entities.push(new Goomba(x, y));
      else if(e.type === 'koopa') this.entities.push(new Koopa(x, y));
      else if(e.type === 'coin') this.entities.push(new CoinEntity(x, y));
    });
  }

  tileAt(col, row) {
    if(row < 0 || row >= this.rows || col < 0 || col >= this.cols) return TILE.AIR;
    const t = this.tiles[row][col];
    const key = `${col},${row}`;
    if(this.usedBlocks.has(key)) return TILE.USED;
    return t;
  }

  isSolid(col, row) { return SOLID_TILES.has(this.tileAt(col, row)); }

  solidAt(wx, wy) {
    return this.isSolid(Math.floor(wx / this.TS), Math.floor(wy / this.TS));
  }

  // Full AABB tile collision for player
  moveEntity(e) {
    const TS = this.TS;
    e.onGround = false;

    // ── Horizontal ──
    e.x += e.vx;
    const cols1 = [Math.floor(e.left/TS), Math.floor((e.right-1)/TS)];
    const rows1 = [Math.floor((e.top+4)/TS), Math.floor((e.bottom-2)/TS)];
    for(const c of cols1) for(const r of rows1){
      if(!this.isSolid(c,r)) continue;
      const tl = c*TS, tr = tl+TS;
      if(e.right > tl && e.left < tr){
        if(e.vx > 0) { e.x = tl - e.w/2; }
        else         { e.x = tr + e.w/2; }
        e.vx = 0;
      }
    }

    // ── Vertical ──
    e.y += e.vy;
    const cols2 = [Math.floor((e.left+2)/TS), Math.floor((e.right-3)/TS)];
    const rows2 = [Math.floor((e.top)/TS), Math.floor((e.bottom-1)/TS)];
    for(const c of cols2) for(const r of rows2){
      if(!this.isSolid(c,r)) continue;
      const tt = r*TS, tb = tt+TS;
      if(e.bottom > tt && e.top < tb){
        if(e.vy >= 0){ // landing
          e.y = tt; e.vy = 0; e.onGround = true;
        } else { // hitting ceiling
          e.y = tb + e.h; e.vy = 0;
          this._hitBlock(c, r, e);
        }
      }
    }

    // World bounds
    if(e.x - e.w/2 < 0) { e.x = e.w/2; e.vx = 0; }
  }

  // Simplified version for enemies (no block interactions)
  moveEntitySimple(e) {
    const TS = this.TS;
    e.onGround = false;

    e.x += e.vx;
    const cols1 = [Math.floor(e.left/TS), Math.floor((e.right-1)/TS)];
    const rows1 = [Math.floor((e.top+4)/TS), Math.floor((e.bottom-2)/TS)];
    for(const c of cols1) for(const r of rows1){
      if(!this.isSolid(c,r)) continue;
      const tl = c*TS, tr = tl+TS;
      if(e.right > tl && e.left < tr){
        if(e.vx > 0) { e.x = tl - e.w/2; e.vx = -Math.abs(e.vx); }
        else         { e.x = tr + e.w/2; e.vx =  Math.abs(e.vx); }
      }
    }

    e.y += e.vy;
    const cols2 = [Math.floor((e.left+2)/TS), Math.floor((e.right-3)/TS)];
    const rows2 = [Math.floor(e.top/TS), Math.floor((e.bottom-1)/TS)];
    for(const c of cols2) for(const r of rows2){
      if(!this.isSolid(c,r)) continue;
      const tt = r*TS, tb = tt+TS;
      if(e.bottom > tt && e.top < tb){
        if(e.vy >= 0){ e.y = tt; e.vy = 0; e.onGround = true; }
        else          { e.y = tb + e.h; e.vy = 0; }
      }
    }
  }

  _hitBlock(col, row, player) {
    const t = this.tileAt(col, row);
    const key = `${col},${row}`;
    if(t === TILE.BRICK){
      if(player.isBig){
        // break brick
        this.tiles[row][col] = TILE.AIR;
        Audio.brickBreak();
        return { score:50, type:'break' };
      } else {
        Audio.blockHit();
        return { score:0, type:'bump' };
      }
    }
    if(t === TILE.Q_COIN || t === TILE.Q_UP || t === TILE.Q_STAR){
      if(this.usedBlocks.has(key)) return null;
      this.usedBlocks.add(key);
      Audio.blockHit();
      const bx = (col+0.5)*this.TS;
      const by = row*this.TS;
      if(t === TILE.Q_COIN){
        const bc = new BounceCoin(bx, by);
        bc._startY = by; bc.alive=true;
        this.bounceCoins.push(bc);
        return { score:200, type:'coin' };
      } else if(t === TILE.Q_UP){
        const puType = player.isBig ? 'fireflower' : 'mushroom';
        const pu = new PowerUpEntity(bx, by, puType);
        this.powerups.push(pu);
        return { score:0, type:'powerup' };
      } else if(t === TILE.Q_STAR){
        const pu = new PowerUpEntity(bx, by, 'star');
        this.powerups.push(pu);
        return { score:0, type:'powerup' };
      }
    }
    return null;
  }

  // Returns {score, type} or null
  hitBlockAt(col, row, player){ return this._hitBlock(col, row, player); }

  update(player, game) {
    const TS = this.TS;
    // Camera
    const targetCam = player.x - CONFIG.CAM_LEAD;
    this.camX = Math.max(0, Math.min(targetCam, this.width - CONFIG.W));
    if(!player.onPole && !player.dying) {
      this.camX = Math.max(this.camX, player.x - CONFIG.W + 80);
    }

    // Entities
    this.entities.forEach(e => {
      if(!e.alive) return;
      if(Math.abs(e.x - player.x) > CONFIG.W * 1.5) return; // off screen
      e.update(this);
    });
    this.entities = this.entities.filter(e => e.alive);

    // Power-ups
    this.powerups.forEach(pu => pu.update(this));
    this.powerups = this.powerups.filter(pu => pu.alive);

    // Bounce coins
    this.bounceCoins.forEach(bc => {
      bc.frame++; bc.vy+=0.8; bc.y+=bc.vy;
      if(bc.vy>0) bc.alive=false;
    });
    this.bounceCoins = this.bounceCoins.filter(bc => bc.alive);

    this.frame++;

    // Popups
    this.popups.forEach(p => p.update());
    this.popups = this.popups.filter(p => p.alive);

    // Fireballs vs enemies
    player.fireballs.forEach(fb => {
      if(!fb.alive) return;
      fb.update(this);
      this.entities.forEach(e => {
        if(!e.alive || !fb.alive) return;
        if(Math.abs(fb.x-e.x)<20 && Math.abs(fb.y-e.y)<20){
          e.alive=false; fb.alive=false;
          game.addScore(200, e.x, e.y);
        }
      });
    });
    player.fireballs = player.fireballs.filter(fb => fb.alive);
  }

  // Check if player reached the flag pole
  checkGoal(player) {
    const goalX = (this.data.goal + 0.5) * this.TS;
    return player.x > goalX - 20 && player.x < goalX + 36;
  }

  draw(ctx) {
    const TS = this.TS;
    const camX = this.camX;
    const startCol = Math.floor(camX / TS);
    const endCol   = Math.min(startCol + Math.ceil(CONFIG.W/TS) + 2, this.cols);

    // Background decorations
    this.data.decor.forEach(d => {
      const sx = d.tx*TS - camX;
      const sy = d.ty*TS;
      if(sx < -100 || sx > CONFIG.W+100) return;
      if(d.type==='cloud') Sprites.cloud(ctx, sx, sy);
      else if(d.type==='hill') Sprites.hill(ctx, sx, sy, d.r||50);
      else if(d.type==='bush') Sprites.bush(ctx, sx, sy);
    });

    // Tiles
    for(let r=0; r<this.rows; r++){
      for(let c=startCol; c<endCol; c++){
        const raw = this.tiles[r][c];
        if(!raw) continue;
        const key = `${c},${r}`;
        const t = this.usedBlocks.has(key) ? TILE.USED : raw;
        const tx = c*TS - camX, ty = r*TS;
        switch(t){
          case TILE.GROUND:
            Sprites.ground(ctx, tx, ty, r>0 && !this.tiles[r-1][c]);
            break;
          case TILE.BRICK:   Sprites.brick(ctx, tx, ty); break;
          case TILE.Q_COIN:
          case TILE.Q_UP:
          case TILE.Q_STAR:  Sprites.qBlock(ctx, tx, ty, false, this.frame); break;
          case TILE.USED:    Sprites.qBlock(ctx, tx, ty, true, 0); break;
          case TILE.SOLID:   Sprites.solidBlock(ctx, tx, ty); break;
          case TILE.PIPE_TL: Sprites.pipe(ctx, tx, ty, 'TL'); break;
          case TILE.PIPE_TR: Sprites.pipe(ctx, tx, ty, 'TR'); break;
          case TILE.PIPE_BL: Sprites.pipe(ctx, tx, ty, 'BL'); break;
          case TILE.PIPE_BR: Sprites.pipe(ctx, tx, ty, 'BR'); break;
        }
      }
    }

    // Flag pole
    const gx = this.data.goal * TS - camX;
    const topY = 2*TS, botY = 11*TS;
    Sprites.flagPole(ctx, gx, topY, botY, topY + 10);

    // Castle
    const cx = this.data.castleCol * TS - camX;
    Sprites.castle(ctx, cx, 8*TS);

    // Entities
    this.entities.forEach(e => e.draw(ctx, camX));
    this.powerups.forEach(pu => pu.draw(ctx, camX));
    this.bounceCoins.forEach(bc => Sprites.coin(ctx, bc.x-camX, bc.y, bc.frame));
    this.popups.forEach(p => p.draw(ctx, camX));
  }
}
