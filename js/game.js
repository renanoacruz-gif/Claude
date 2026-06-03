class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.state = GS.MENU;
    this.score = 0;
    this.coins = 0;
    this.lives = CONFIG.START_LIVES;
    this.levelIdx = 0;
    this.level = null;
    this.player = null;
    this.frame = 0;
    this.timeLeft = CONFIG.TIME;
    this.timeAccum = 0;
    this.transTimer = 0;
    this.transNext = null;
    this.comboKills = 0;
    this._lvlEndTimer = 0;
  }

  startLevel(idx) {
    this.levelIdx = idx;
    this.level = new Level(LEVELS[idx]);
    const spawnX = 2.5 * CONFIG.TS;
    const spawnY = 12 * CONFIG.TS;
    this.player = new Player(spawnX, spawnY);
    this.timeLeft = CONFIG.TIME;
    this.timeAccum = 0;
    this.comboKills = 0;
    this._lvlEndTimer = 0;
    this.state = GS.PLAY;
  }

  restart() {
    this.score = 0; this.coins = 0; this.lives = CONFIG.START_LIVES;
    this.startLevel(0);
  }

  addScore(pts, x, y) {
    this.score += pts;
    if(x !== undefined) {
      this.level.popups.push(new ScorePopup(x, y-20, String(pts)));
    }
  }

  addCoin() {
    this.coins++;
    this.score += 200;
    if(this.coins >= CONFIG.COIN_1UP){
      this.coins -= CONFIG.COIN_1UP;
      this.lives++;
      Audio.oneUp();
    } else { Audio.coin(); }
  }

  transition(nextFn, delay=90) {
    this.state = GS.TRANS;
    this.transTimer = delay;
    this.transNext = nextFn;
  }

  _updatePlay() {
    const p = this.player, lv = this.level;

    // Time
    this.timeAccum++;
    if(this.timeAccum >= 40){ this.timeAccum=0; this.timeLeft--; }
    if(this.timeLeft <= 0){ p.die(); }

    // Player update
    p.update(Input, lv, lv.popups, (pts,x,y)=>this.addScore(pts,x,y));

    // Level update (enemies, powerups, camera)
    lv.update(p, this);

    // Player-enemy collision
    if(!p.dying && !p.onPole){
      lv.entities.forEach(e => {
        if(!e.alive || !p.overlaps(e)) return;
        const stompThreshold = e.top + 8;
        const landing = p.vy > 0 && p.bottom <= stompThreshold + 12 && p.bottom >= e.top - 4;

        if(landing && (e instanceof Goomba || e instanceof Koopa)){
          // Stomp
          const mult = [100,200,400,800,1000][Math.min(this.comboKills,4)];
          this.comboKills++;
          this.addScore(mult, e.x, e.y - 20);
          e.stomp();
          p.vy = -9; // bounce up
          if(p.onGround){ p.onGround = false; }
        } else {
          // Side hit
          if(p.starTimer > 0){  // star kills enemies
            e.alive = false; this.addScore(200, e.x, e.y);
          } else if(!p.isInvincible) {
            if(p.takeDamage()){ p.die(); }
          }
        }
      });
      if(p.onGround) this.comboKills = 0;
    }

    // Player-coin collision
    lv.entities.forEach(e => {
      if(!e.alive || !(e instanceof CoinEntity)) return;
      if(p.overlaps(e)){ e.alive=false; this.addCoin(); }
    });

    // Player-powerup collision
    lv.powerups.forEach(pu => {
      if(!pu.alive || pu.emerging) return;
      if(p.overlaps(pu)){
        pu.alive=false;
        if(pu.type==='mushroom'||pu.type==='fireflower'||pu.type==='star'){
          p.collectPowerUp(pu.type);
          if(pu.type!=='star') this.addScore(1000, pu.x, pu.y);
        }
      }
    });

    // Block hits (player jumps into block from below — handled in level.moveEntity)
    // We re-process the result via _hitBlock which returns score info
    // The block interaction is called inside moveEntity → _hitBlock
    // We need to collect results there. Let's check via a small patch:
    if(lv._lastBlockHit) {
      const h = lv._lastBlockHit; lv._lastBlockHit=null;
      if(h.score) this.addScore(h.score, h.x, h.y);
      if(h.type==='coin') this.addCoin();
    }

    // Check flag pole
    if(!p.dying && !p.onPole && lv.checkGoal(p)){
      p.onPole = true;
      p.poleX  = lv.data.goal * CONFIG.TS;
      p.poleTopY = 2 * CONFIG.TS;
      p.poleBotY = 12 * CONFIG.TS - p.h;
      p.poleSlideY = p.poleTopY;
      const heightBonus = Math.max(0, Math.floor((p.poleBotY - p.top) / CONFIG.TS)) * 100;
      this.addScore(heightBonus > 0 ? heightBonus : 500);
      Audio.flagpole();
      this.state = GS.LVLEND;
    }

    // Player dying
    if(p.dying && p.y > (CONFIG.ROWS+4)*CONFIG.TS){
      this.lives--;
      if(this.lives <= 0){
        this.transition(()=>{ this.state = GS.GAMEOVER; }, 60);
      } else {
        this.transition(()=>{ this.startLevel(this.levelIdx); }, 120);
      }
    }
  }

  _updateLvlEnd() {
    const p = this.player, lv = this.level;
    lv.frame++;
    lv.camX = Math.max(0, Math.min(p.x - CONFIG.CAM_LEAD, lv.width - CONFIG.W));

    if(p.onPole){
      p._updatePole(lv);
    } else {
      if(!this._lvlEndTimer){ // first frame after pole slide
        this._lvlEndTimer = 160;
        const bonus = Math.floor(this.timeLeft) * 50;
        this.addScore(bonus);
        this.timeLeft = 0;
        Audio.lvlClear();
      }
      this._lvlEndTimer--;
      if(this._lvlEndTimer <= 0){
        this._lvlEndTimer = 0;
        if(this.levelIdx + 1 < LEVELS.length){
          this.transition(()=>{ this.startLevel(this.levelIdx+1); }, 120);
        } else {
          this.transition(()=>{ this.state = GS.WIN; }, 120);
        }
      }
    }
  }

  update() {
    this.frame++;
    Input.tick();

    switch(this.state){
      case GS.MENU:
        if(Input.enter()) { Audio.init(); this.restart(); }
        break;
      case GS.PLAY:
        if(Input.pause()){ this.state=GS.PAUSE; break; }
        this._updatePlay();
        break;
      case GS.PAUSE:
        if(Input.pause()||Input.enter()) this.state=GS.PLAY;
        break;
      case GS.LVLEND:
        this._updateLvlEnd();
        break;
      case GS.TRANS:
        if(--this.transTimer <= 0 && this.transNext){ this.transNext(); this.transNext=null; }
        break;
      case GS.GAMEOVER:
        if(Input.enter()) this.restart();
        break;
      case GS.WIN:
        if(Input.enter()) this.restart();
        break;
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, CONFIG.W, CONFIG.H);

    if(this.state === GS.MENU){ HUD.drawMenu(ctx, this.frame); return; }
    if(this.state === GS.GAMEOVER){ HUD.drawGameOver(ctx); return; }
    if(this.state === GS.WIN){ HUD.drawWin(ctx); return; }

    // Background
    ctx.fillStyle = this.level ? this.level.data.bgColor : '#000';
    ctx.fillRect(0, 36, CONFIG.W, CONFIG.H - 36);

    // Level
    if(this.level) this.level.draw(ctx);

    // Player
    if(this.player) this.player.draw(ctx, this.level ? this.level.camX : 0);

    // HUD
    HUD.draw(ctx, {
      score: this.score,
      coins: this.coins,
      world: LEVELS[this.levelIdx]?.world || '1-1',
      time:  this.timeLeft,
      lives: this.lives,
    });

    // Overlays
    if(this.state === GS.PAUSE){
      HUD.drawOverlay(ctx, 'PAUSA', 'Pressione P para continuar');
    } else if(this.state === GS.TRANS){
      ctx.fillStyle='rgba(0,0,0,0.4)'; ctx.fillRect(0,36,CONFIG.W,CONFIG.H-36);
    } else if(this.state === GS.LVLEND && this.player && !this.player.onPole){
      // subtle "level clear" text
    }
  }
}
