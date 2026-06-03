const CONFIG = {
  W: 800, H: 480,
  TS: 32,           // tile size
  GRAVITY: 0.52,
  MAX_FALL: 14,
  JUMP_V: -13,
  JUMP_HOLD: 14,    // frames jump key adds boost
  JUMP_BOOST: 0.25,
  WALK: 3.5,
  RUN: 6.5,
  ACCEL: 0.45,
  DECEL: 0.35,
  CAM_LEAD: 240,    // pixels ahead of mario
  INVINCIBLE: 180,
  STAR_DUR: 660,
  ROWS: 15,
  START_LIVES: 3,
  COIN_1UP: 100,
  TIME: 400,
};

const TILE = { AIR:0, GROUND:1, BRICK:2, Q_COIN:3, Q_UP:4, Q_STAR:5, USED:6,
               PIPE_TL:7, PIPE_TR:8, PIPE_BL:9, PIPE_BR:10, SOLID:11 };

const SOLID_TILES = new Set([1,2,3,4,5,6,7,8,9,10,11]);

const ST = { SMALL:'s', BIG:'b', FIRE:'f' };
const GS = { MENU:'menu', PLAY:'play', PAUSE:'pause', DYING:'dying',
             LVLEND:'lvlend', GAMEOVER:'go', WIN:'win', TRANS:'trans' };

// Character → tile mapping for level strings
const CHAR_MAP = {
  ' ':0, 'g':1, 'b':2, 'q':3, 'm':4, 's':5, 'e':6,
  '[':7, ']':8, '(':9, ')':10, '#':11
};
