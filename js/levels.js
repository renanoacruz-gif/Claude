// Level format: array of 15 strings, each 100 chars.
// Chars: ' '=air g=ground b=brick q=?coin m=?powerup s=?star e=usedBlock
//        []=pipeTL/TR  ()=pipeBL/BR  #=solidBlock
//
// entities: [{type, col, row}]  types: goomba koopa coin
// goal: col where flagpole stands
// bgColor, cloudColor, groundColor

const LEVELS = [
  // ─── World 1-1 ────────────────────────────────────────────────────────────
  {
    name: '1-1', bgColor:'#5C94FC', world:'1-1',
    decor: [
      {type:'cloud',  tx:5,  ty:2},
      {type:'cloud',  tx:18, ty:1},
      {type:'cloud',  tx:38, ty:3},
      {type:'cloud',  tx:58, ty:2},
      {type:'cloud',  tx:74, ty:1},
      {type:'hill',   tx:2,  ty:12, r:56},
      {type:'hill',   tx:22, ty:12, r:40},
      {type:'bush',   tx:11, ty:12},
      {type:'bush',   tx:46, ty:12},
      {type:'bush',   tx:70, ty:12},
    ],
    goal: 92,   // flagpole col
    castleCol: 96,
    map: [
      // 0         1         2         3         4         5         6         7         8         9
      // 0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789
      "                                                                                                    ",
      "                                                                                                    ",
      "                                                                                                    ",
      "                                                                                                    ",
      "              q  m  q                                                                               ",
      "                                                                                                    ",
      "                                        ###                                                         ",
      "                        b  b  q  b                     q   q   q                                   ",
      "                                                                                                    ",
      "         []             []                          []                                              ",
      "         ()             ()                          ()                                              ",
      "                                                                                                    ",
      "gggggggggg  gggggggggggggggggggggggggggg    ggggggggggggggggggggggggggggggggggggggggggggggggg       ",
      "gggggggggg  gggggggggggggggggggggggggggg    ggggggggggggggggggggggggggggggggggggggggggggggggg       ",
      "gggggggggg  gggggggggggggggggggggggggggg    ggggggggggggggggggggggggggggggggggggggggggggggggg       ",
    ],
    entities: [
      {type:'goomba', col:18, row:11},
      {type:'goomba', col:21, row:11},
      {type:'goomba', col:33, row:11},
      {type:'koopa',  col:43, row:11},
      {type:'goomba', col:52, row:11},
      {type:'goomba', col:53, row:11},
      {type:'koopa',  col:66, row:11},
      {type:'goomba', col:76, row:11},
      {type:'goomba', col:77, row:11},
      {type:'coin',   col:57, row:8},
      {type:'coin',   col:58, row:8},
      {type:'coin',   col:59, row:8},
      {type:'coin',   col:60, row:8},
    ],
  },

  // ─── World 1-2 (Underground) ──────────────────────────────────────────────
  {
    name: '1-2', bgColor:'#000020', world:'1-2',
    decor: [],
    goal: 88,
    castleCol: 92,
    map: [
      "                                                                                                    ",
      "                                                                                                    ",
      "##################################################################                                  ",
      "#                                                                #                                  ",
      "#   q  m  q  q        b  b  b  b             s                  #                                  ",
      "#                                    ###                         #                                  ",
      "#                                                                #                                  ",
      "#                                                                #                                  ",
      "#        []                    []                   []           #                                  ",
      "#        ()                    ()                   ()           #                                  ",
      "#                                                                #                                  ",
      "#                                                                #                                  ",
      "##################################################################                                  ",
      "##################################################################                                  ",
      "##################################################################                                  ",
    ],
    entities: [
      {type:'goomba', col:10, row:11},
      {type:'goomba', col:11, row:11},
      {type:'koopa',  col:22, row:11},
      {type:'goomba', col:36, row:11},
      {type:'goomba', col:37, row:11},
      {type:'goomba', col:50, row:11},
      {type:'koopa',  col:60, row:11},
      {type:'goomba', col:68, row:11},
      {type:'goomba', col:69, row:11},
      {type:'coin',   col:20, row:7},
      {type:'coin',   col:21, row:7},
      {type:'coin',   col:22, row:7},
      {type:'coin',   col:45, row:7},
      {type:'coin',   col:46, row:7},
    ],
  },

  // ─── World 1-3 (Castle) ───────────────────────────────────────────────────
  {
    name: '1-3', bgColor:'#181820', world:'1-3',
    decor: [],
    goal: 85,
    castleCol: 89,
    map: [
      "                                                                                                    ",
      "                                                                                                    ",
      "                                                                                                    ",
      "                                                                                                    ",
      "         m        b  b  q  b            b  b  b  q  b                                             ",
      "                                                                                                    ",
      "    #####                   #####                        #####                                     ",
      "                                                                                                    ",
      "                                                                                                    ",
      "          []                        []                         []                                  ",
      "          ()                        ()                         ()                                  ",
      "                                                                                                    ",
      "ggggggg     ggggggggggggggggggggg     ggggggggggggggggggggg     gggggggggggggggggggggggggg         ",
      "ggggggg     ggggggggggggggggggggg     ggggggggggggggggggggg     gggggggggggggggggggggggggg         ",
      "ggggggg     ggggggggggggggggggggg     ggggggggggggggggggggg     gggggggggggggggggggggggggg         ",
    ],
    entities: [
      {type:'koopa',  col:12, row:11},
      {type:'koopa',  col:20, row:11},
      {type:'goomba', col:30, row:11},
      {type:'goomba', col:31, row:11},
      {type:'koopa',  col:44, row:11},
      {type:'goomba', col:55, row:11},
      {type:'koopa',  col:60, row:11},
      {type:'goomba', col:68, row:11},
      {type:'goomba', col:69, row:11},
      {type:'coin',   col:35, row:7},
      {type:'coin',   col:36, row:7},
      {type:'coin',   col:37, row:7},
    ],
  },
];
