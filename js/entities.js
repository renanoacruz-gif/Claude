// ── Base Entity ──────────────────────────────────────────────────────────────
class Entity {
  constructor(x, y, w, h) {
    this.x=x; this.y=y; this.w=w; this.h=h;
    this.vx=0; this.vy=0; this.onGround=false; this.alive=true; this.frame=0;
  }
  get left()   { return this.x-this.w/2; }
  get right()  { return this.x+this.w/2; }
  get top()    { return this.y-this.h; }
  get bottom() { return this.y; }
  overlaps(o) {
    return this.left<o.right&&this.right>o.left&&this.top<o.bottom&&this.bottom>o.top;
  }
}

// ── Score Popup ───────────────────────────────────────────────────────────────
class ScorePopup {
  constructor(x,y,text){ this.x=x; this.y=y; this.text=text; this.life=50; }
  update(){ this.y-=0.6; this.life--; }
  draw(ctx,cx){ Sprites.scorePopup(ctx,this.text,this.x-cx,this.y,this.life/50); }
  get alive(){ return this.life>0; }
}

// ── Player (Mario) ─────────────────────────────────────────────────────────────
class Player extends Entity {
  constructor(x,y){
    super(x,y,22,28);
    this.state=ST.SMALL;
    this.dir=1;
    this.invincible=0; this.starTimer=0;
    this.dying=false; this.dyingTimer=0;
    this.jumpTimer=0; this.walkAnim=0;
    this.skidding=false;
    this.fireballs=[]; this.fbCooldown=0;
    this.onPole=false; this.poleX=0; this.poleTopY=0; this.poleBotY=0;
    this.poleSlideY=0; this.poleWalkTimer=0;
    this.levelClearTimer=0;
  }
  get isBig()  { return this.state!==ST.SMALL; }
  get isFire() { return this.state===ST.FIRE; }
  get isInvincible() { return this.invincible>0||this.starTimer>0; }
  isStar()     { return this.starTimer > 0; }

  resize(big) {
    if(big && !this.isBig){ this.h=56; }
    else if(!big && this.isBig){ this.h=28; }
  }

  takeDamage() {
    if(this.isInvincible) return false;
    if(this.isBig){ this.state=ST.SMALL; this.h=28; this.invincible=CONFIG.INVINCIBLE; Audio.damage(); return false; }
    return true; // died
  }

  collectPowerUp(type) {
    if(type==='mushroom'||type==='fireflower'){
      if(!this.isBig){ this.state=ST.BIG; this.h=56; }
      else if(type==='fireflower'){ this.state=ST.FIRE; }
      Audio.powerup();
    } else if(type==='star'){
      this.starTimer=CONFIG.STAR_DUR; Audio.star();
    } else if(type==='coin'){
      // handled by caller
    }
  }

  update(input, lv, popups, score_cb) {
    this.frame++;
    if(this.dying){ this._updateDying(); return; }
    if(this.onPole){ this._updatePole(lv); return; }
    if(this.levelClearTimer>0){ this.levelClearTimer--; return; }

    if(this.invincible>0) this.invincible--;
    if(this.starTimer>0)  this.starTimer--;
    if(this.fbCooldown>0) this.fbCooldown--;

    const spd = input.run() ? CONFIG.RUN : CONFIG.WALK;

    if(input.left()){
      this.vx = Math.max(this.vx-CONFIG.ACCEL,-spd);
      this.dir=-1;
    } else if(input.right()){
      this.vx = Math.min(this.vx+CONFIG.ACCEL, spd);
      this.dir=1;
    } else {
      const d=CONFIG.DECEL;
      if(Math.abs(this.vx)<d) this.vx=0;
      else this.vx -= Math.sign(this.vx)*d;
    }
    this.skidding=(input.left()&&this.vx>0.6)||(input.right()&&this.vx<-0.6);

    // jump
    if(input.jumpHit()&&this.onGround){
      this.vy=CONFIG.JUMP_V; this.jumpTimer=CONFIG.JUMP_HOLD; this.onGround=false; Audio.jump();
    }
    if(input.jump()&&this.jumpTimer>0){ this.jumpTimer--; this.vy-=CONFIG.JUMP_BOOST; }
    else { this.jumpTimer=0; }

    this.vy = Math.min(this.vy+CONFIG.GRAVITY, CONFIG.MAX_FALL);

    // fire
    if(input.fire()&&this.isFire&&this.fbCooldown===0){
      this.fireballs.push(new Fireball(this.x+this.dir*16, this.y-this.h/2, this.dir));
      this.fbCooldown=22; Audio.fireball();
    }

    if(this.onGround&&Math.abs(this.vx)>0.4) this.walkAnim++;

    lv.moveEntity(this);

    if(this.y > (CONFIG.ROWS+2)*CONFIG.TS){ this.die(); }
  }

  _updateDying(){
    this.dyingTimer++;
    if(this.dyingTimer===20){ this.vy=-10; }
    if(this.dyingTimer>=20){ this.vy=Math.min(this.vy+CONFIG.GRAVITY,CONFIG.MAX_FALL); this.y+=this.vy; }
  }

  _updatePole(lv){
    this.poleSlideY = Math.min(this.poleSlideY+3, this.poleBotY);
    this.y = this.poleSlideY+this.h;
    this.x = this.poleX+16;
    if(this.poleSlideY>=this.poleBotY){ this.onPole=false; this.levelClearTimer=90; }
  }

  die(){ if(!this.dying){ this.dying=true; this.dyingTimer=0; this.vy=0; Audio.die(); } }

  draw(ctx, camX){
    if(!this.alive&&!this.dying) return;
    if(this.invincible>0&&(this.frame>>2)&1) return;
    const flash = this.starTimer>0 ? ['#F00','#FF0','#FFF'][(this.frame>>2)%3] : null;
    const s = this.state;
    const sx=this.x-camX, sy=this.y;
    if(flash){ ctx.save(); ctx.globalCompositeOperation='source-over'; }
    Sprites.mario(ctx,sx,sy,this.dir,this.walkAnim,s,1);
    if(flash){ ctx.restore(); }
    // draw fireballs
    this.fireballs.forEach(fb=>fb.draw(ctx,camX));
  }
}

// ── Fireball ──────────────────────────────────────────────────────────────────
class Fireball extends Entity {
  constructor(x,y,dir){ super(x,y,10,10); this.vx=dir*9; this.vy=-3; this.bounces=0; }
  update(lv){
    this.frame++;
    this.vy=Math.min(this.vy+CONFIG.GRAVITY,12);
    const ox=this.x, oy=this.y;
    this.x+=this.vx;
    if(lv.solidAt(this.x-5,this.y)||lv.solidAt(this.x+5,this.y)){
      this.alive=false; return;
    }
    this.y+=this.vy;
    if(lv.solidAt(this.x,this.y)){
      this.y=Math.floor(this.y/CONFIG.TS)*CONFIG.TS;
      this.vy=-8; this.bounces++;
      if(this.bounces>4) this.alive=false;
    }
    if(this.x<lv.camX-32||this.x>lv.camX+CONFIG.W+32) this.alive=false;
  }
  draw(ctx,camX){ if(this.alive) Sprites.fireball(ctx,this.x-camX,this.y-5,this.frame); }
}

// ── Goomba ─────────────────────────────────────────────────────────────────────
class Goomba extends Entity {
  constructor(x,y){ super(x,y,24,28); this.vx=-1.2; this.squished=false; this.squishTimer=0; }
  update(lv){
    this.frame++;
    if(this.squished){ if(++this.squishTimer>20) this.alive=false; return; }
    this.vy=Math.min(this.vy+CONFIG.GRAVITY,CONFIG.MAX_FALL);
    lv.moveEntitySimple(this);
    if(this.onGround){
      if(lv.solidAt(this.x+this.vx*4+(this.vx>0?12:-12),this.y-4)||
         !lv.solidAt(this.x+(this.vx>0?12:-12),this.y+2)){
        this.vx=-this.vx;
      }
    }
    if(this.y>(CONFIG.ROWS+2)*CONFIG.TS) this.alive=false;
  }
  stomp(){ this.squished=true; this.vx=0; this.vy=0; Audio.stomp(); }
  draw(ctx,camX){ if(this.alive) Sprites.goomba(ctx,this.x-camX,this.y,this.frame,this.squished); }
}

// ── Koopa ──────────────────────────────────────────────────────────────────────
class Koopa extends Entity {
  constructor(x,y){ super(x,y,26,38); this.vx=-1; this.shelled=false; this.shellTimer=0; }
  update(lv){
    this.frame++;
    this.vy=Math.min(this.vy+CONFIG.GRAVITY,CONFIG.MAX_FALL);
    lv.moveEntitySimple(this);
    if(!this.shelled&&this.onGround){
      if(lv.solidAt(this.x+this.vx*4+(this.vx>0?13:-13),this.y-4)||
         !lv.solidAt(this.x+(this.vx>0?13:-13),this.y+2)){
        this.vx=-this.vx;
      }
    }
    if(this.shelled&&this.vx===0&&this.shellTimer>0){ this.shellTimer--; if(this.shellTimer===0){ this.vx=-1; this.shelled=false; } }
    if(this.y>(CONFIG.ROWS+2)*CONFIG.TS) this.alive=false;
  }
  stomp(){
    if(!this.shelled){ this.shelled=true; this.h=22; this.vx=0; this.shellTimer=300; Audio.stomp(); }
    else { this.vx = this.vx===0 ? 8 : -this.vx*2; } // kick
  }
  draw(ctx,camX){
    if(!this.alive) return;
    if(this.shelled) Sprites.shell(ctx,this.x-camX,this.y);
    else Sprites.koopa(ctx,this.x-camX,this.y,this.frame);
  }
}

// ── Coin Entity ────────────────────────────────────────────────────────────────
class CoinEntity extends Entity {
  constructor(x,y){ super(x,y,18,18); }
  update()  { this.frame++; }
  draw(ctx,camX){ Sprites.coin(ctx,this.x-camX,this.y,this.frame); }
}

// ── Power-up Entity ────────────────────────────────────────────────────────────
class PowerUpEntity extends Entity {
  constructor(x,y,type){ super(x,y,26,28); this.type=type; this.vx=1.2; this.emerging=true; this.emergeY=0; this.birthY=y; }
  update(lv){
    this.frame++;
    if(this.emerging){ this.emergeY+=1; this.y=this.birthY-this.emergeY; if(this.emergeY>=32){ this.emerging=false; } return; }
    this.vy=Math.min(this.vy+CONFIG.GRAVITY, this.type==='star'?8:CONFIG.MAX_FALL);
    lv.moveEntitySimple(this);
    if(this.type==='star'&&this.onGround){ this.vy=-8; }
    if(this.onGround&&(this.type==='mushroom')){
      if(lv.solidAt(this.x+this.vx*3+(this.vx>0?13:-13),this.y-4)) this.vx=-this.vx;
    }
    if(this.y>(CONFIG.ROWS+2)*CONFIG.TS) this.alive=false;
  }
  draw(ctx,camX){
    if(!this.alive) return;
    const sx=this.x-camX, sy=this.y;
    if(this.type==='mushroom')  Sprites.mushroom(ctx,sx,sy);
    else if(this.type==='fireflower') Sprites.fireFlower(ctx,sx,sy,this.frame);
    else if(this.type==='star') Sprites.star(ctx,sx,sy,this.frame);
  }
}

// ── Bouncing Coin (from block hit) ───────────────────────────────────────────
class BounceCoin {
  constructor(x,y){ this.x=x; this.y=y; this.vy=-10; this.alive=true; this.frame=0; }
  update(){ this.frame++; this.vy+=0.8; this.y+=this.vy; if(this.vy>0&&this.y>this._startY+10) this.alive=false; }
  draw(ctx,camX){ Sprites.coin(ctx,this.x-camX,this.y,this.frame); }
}
