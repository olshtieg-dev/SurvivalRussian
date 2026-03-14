(function () {
  var isStart = false;
  var tetris = {
    board: [],
    boardDiv: null,
    canvas: null,
    pSize: 20,
    canvasHeight: 440,
    canvasWidth: 200,
    boardHeight: 0,
    boardWidth: 0,
    spawnX: 4,
    spawnY: 1,
    shapes: [
      [
        [-1, 1],
        [0, 1],
        [1, 1],
        [0, 0], //TEE
      ],
      [
        [-1, 0],
        [0, 0],
        [1, 0],
        [2, 0], //line
      ],
      [
        [-1, -1],
        [-1, 0],
        [0, 0],
        [1, 0], //L EL
      ],
      [
        [1, -1],
        [-1, 0],
        [0, 0],
        [1, 0], //R EL
      ],
      [
        [0, -1],
        [1, -1],
        [-1, 0],
        [0, 0], // R ess
      ],
      [
        [-1, -1],
        [0, -1],
        [0, 0],
        [1, 0], //L ess
      ],
      [
        [0, -1],
        [1, -1],
        [0, 0],
        [1, 0], //square
      ],
    ],
    tempShapes: null,
    curShape: null,
    curShapeIndex: null,
    curX: 0,
    curY: 0,
    curSqs: [],
    nextShape: null,
    nextShapeDisplay: null,
    nextShapeIndex: null,
    sqs: [],
    score: 0,
    scoreDisplay: null,
    level: 1,
    levelDisplay: null,
    numLevels: 10,
    time: 0,
    maxTime: 1000,
    timeDisplay: null,
    isActive: 0,
    curComplete: false,
    timer: null,
    sTimer: null,
    speed: 800,
    lines: 0,

    init: function () {
      isStart = true;
      this.canvas = document.getElementById('canvas');
      this.initBoard();
      this.initInfo();
      //this.initLevelScores();
      this.initShapes();
      this.bindKeyEvents();
      this.play();
    },
    initBoard: function () {
      this.boardHeight = this.canvasHeight / this.pSize;
      this.boardWidth = this.canvasWidth / this.pSize;
      var s = this.boardHeight * this.boardWidth;
      for (var i = 0; i < s; i++) {
        this.board.push(0);
      }
      //this.boardDiv = document.getElementById('board); //for debugging
    },
    initInfo: function () {
      this.nextShapeDisplay = document.getElementById('next_shape');
      this.levelDisplay = document
        .getElementById('level')
        .getElementsByTagName('span')[0];
      this.timeDisplay = document
        .getElementById('time')
        .getElementsByTagName('span')[0];
      this.scoreDisplay = document
        .getElementById('score')
        .getElementsByTagName('span')[0];
      this.linesDisplay = document
        .getElementById('lines')
        .getElementsByTagName('span')[0];
      this.setInfo('time');
      this.setInfo('score');
      this.setInfo('level');
      this.setInfo('lines');
    },
    initShapes: function () {
      this.curSqs = [];
      this.curComplete = false;
      this.shiftTempShapes();
      this.curShapeIndex = this.tempShapes[0];
      this.curShape = this.shapes[this.curShapeIndex];
      this.initNextShape();
      this.setCurCoords(this.spawnX, this.spawnY);
      this.drawShape(this.curX, this.curY, this.curShape);
    },
    initNextShape: function () {
      if (typeof this.tempShapes[1] === 'undefined') {
        this.initTempShapes();
      }
      try {
        this.nextShapeIndex = this.tempShapes[1];
        this.nextShape = this.shapes[this.nextShapeIndex];
        this.drawNextShape();
      } catch (e) {
        throw new Error('Could not create next shape. ' + e);
      }
    },
    initTempShapes: function () {
      this.tempShapes = [];
      for (var i = 0; i < this.shapes.length; i++) {
        this.tempShapes.push(i);
      }
      var k = this.tempShapes.length;
      while (--k) {
        //Fisher Yates Shuffle
        var j = Math.floor(Math.random() * (k + 1));
        var tempk = this.tempShapes[k];
        var tempj = this.tempShapes[j];
        this.tempShapes[k] = tempj;
        this.tempShapes[j] = tempk;
      }
    },
    shiftTempShapes: function () {
      try {
        if (
          typeof this.tempShapes === 'undefined' ||
          this.tempShapes === null
        ) {
          this.initTempShapes();
        } else {
          this.tempShapes.shift();
        }
      } catch (e) {
        throw new Error('Could not shift or init tempShapes: ' + e);
      }
    },
    initTimer: function () {
      var me = this;
      var tLoop = function () {
        me.incTime();
        me.timer = setTimeout(tLoop, 2000);
      };
      this.timer = setTimeout(tLoop, 2000);
    },
   incLines: function (num) {
  // increase total line count
  this.lines += num;
  this.setInfo('lines');

  // compute new level (1 + every 5 lines)
  const newLevel = Math.floor(this.lines / 5) + 1;

  // if we crossed into a new level, update
  if (newLevel > this.level) {
    this.level = newLevel;
    this.updateSpeed();
    this.setInfo('level');
  }
},

updateSpeed: function () {
  // NES-inspired speed table (milliseconds per drop)
  const speedTable = {
    1: 800,
    2: 717,
    3: 633,
    4: 550,
    5: 467,
    6: 383,
    7: 300,
    8: 217,
    9: 133,
    10: 100,
    11: 83,
    14: 67,
    15: 50
  };

  // fallback: cap at fastest speed
  this.speed = speedTable[this.level] || 83;
  
}, 

    setInfo: function (el) {
      this[el + 'Display'].innerHTML = this[el];
    },
    drawNextShape: function () {
      var ns = [];
      for (var i = 0; i < this.nextShape.length; i++) {
        ns[i] = this.createSquare(
          this.nextShape[i][0] + 2,
          this.nextShape[i][1] + 2,
          this.nextShapeIndex
        );
      }
      this.nextShapeDisplay.innerHTML = '';
      for (var k = 0; k < ns.length; k++) {
        this.nextShapeDisplay.appendChild(ns[k]);
      }
    },
    drawShape: function (x, y, p) {
      for (var i = 0; i < p.length; i++) {
        var newX = p[i][0] + x;
        var newY = p[i][1] + y;
        this.curSqs[i] = this.createSquare(newX, newY, this.curShapeIndex);
      }
      for (var k = 0; k < this.curSqs.length; k++) {
        this.canvas.appendChild(this.curSqs[k]);
      }
    },
    createSquare: function (x, y, type) {
      var el = document.createElement('div');
      el.className = 'square type' + type;
      el.style.left = x * this.pSize + 'px';
      el.style.top = y * this.pSize + 'px';
      return el;
    },
   removeCur: function () {
  for (let i = 0; i < this.curSqs.length; i++) {
    if (this.curSqs[i].parentNode === this.canvas) {
      this.canvas.removeChild(this.curSqs[i]);
    }
  }
  this.curSqs = [];
},
    setCurCoords: function (x, y) {
      this.curX = x;
      this.curY = y;
    },
   bindKeyEvents: function () {
  var me = this;
  document.addEventListener('keydown', function (e) {
    me.handleKey(e);
  });
},
    handleKey: function (e) {
      var c = this.whichKey(e);
      var dir = '';
      switch (c) {
        case 37:
          this.move('L');
          break;
        case 38:
          this.move('RT');
          break;
        case 39:
          this.move('R');
          break;
        case 40:
          this.move('D');
          break;
        case 27: //esc: pause
          this.togglePause();
          break;
        default:
          break;
      }
    },
    whichKey: function (e) {
      var c;
      if (window.event) {
        c = window.event.keyCode;
      } else if (e) {
        c = e.keyCode;
      }
      return c;
    },
    incTime: function () {
      this.time++;
      this.setInfo('time');
    },
    incScore: function (amount) {
      this.score = this.score + amount;
      this.setInfo('score');
    },
    //incLevel: function () {
      //this.level++;
      //this.speed = this.speed - 75;
      //this.setInfo('level');
    //},
   
   calcScore: function (args) {
  const lines = args.lines || 0;
  const shape = args.shape || false;
  let points = 0;

  // NES-style scoring
  const lineScores = [0, 40, 100, 300, 1200];
  if (lines > 0) {
    points += lineScores[lines] * this.level;
  }

  // Optional bonus for placing a shape
  if (shape) {
    points += 5 * this.level;
  }

  this.incScore(points);
},
        //checkScore: function () {
       //if (this.score >= this['level' + this.level][0]) {
      //  this.incLevel();
     // }
    //},
   gameOver: function (text = 'конец игры') {
  // Stop any running timers
  this.clearTimers();
  isStart = false;
  this.isGameOver = true;
  this.isActive = 0;
  this.curComplete = true; // prevent further moves

  // Create overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.color = '#ff0000';
  overlay.style.fontSize = '36px';
  overlay.style.fontFamily = 'Russo One, sans-serif';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.05)';
  overlay.innerText = text;

  // Append overlay to canvas
  this.canvas.appendChild(overlay);
},
    play: function () {
      var me = this;
      if (this.timer === null) {
        this.initTimer();
      }
      var gameLoop = function () {
        if (me.isGameOver) return;  // ❌ Stop the loop
        me.move('D');
        if (me.curComplete) {
          me.markBoardShape(me.curX, me.curY, me.curShape);
          me.curSqs.eachdo(function () {
            me.sqs.push(this);
          });
          me.calcScore({ shape: true });
          me.checkRows();
          //me.checkScore();
          me.initShapes();
          me.play();
        } else {
          me.pTimer = setTimeout(gameLoop, me.speed);
        }
      };
      this.pTimer = setTimeout(gameLoop, me.speed);
      this.isActive = 1;
    },

    restartTimer: function () {
  var me = this;
  if (me.pTimer) clearTimeout(me.pTimer);

  var gameLoop = function () {
    me.move('D');
    if (me.curComplete) {
      me.markBoardShape(me.curX, me.curY, me.curShape);
      me.curSqs.eachdo(function () {
        me.sqs.push(this);
      });
      me.calcScore({ shape: true });
      me.checkRows();
      me.initShapes();
      me.play();
    } else {
      me.pTimer = setTimeout(gameLoop, me.speed);
    }
  };

  me.pTimer = setTimeout(gameLoop, me.speed);
},
togglePause: function (auto = false) {
  const music = document.getElementById('theme');
  
  if (this.isActive === 1) {
    this.clearTimers();
    this.isActive = 0;
    music.pause();

    if (auto) {
      const pauseMsg = document.createElement('div');
      pauseMsg.id = 'pauseOverlay';
      pauseMsg.style.position = 'absolute';
      pauseMsg.style.top = '0';
      pauseMsg.style.left = '0';
      pauseMsg.style.width = '100%';
      pauseMsg.style.height = '100%';
      pauseMsg.style.display = 'flex';
      pauseMsg.style.alignItems = 'center';
      pauseMsg.style.justifyContent = 'center';
      pauseMsg.style.color = '#00ffff';
      pauseMsg.style.fontSize = '32px';
      pauseMsg.style.backgroundColor = 'rgba(0,0,0,0.3)';
      pauseMsg.innerText = '⏸ Paused';
      this.canvas.appendChild(pauseMsg);
    }
  } else {
    this.play();
    music.play();

    const msg = document.getElementById('pauseOverlay');
    if (msg) msg.remove();
  }
},


    clearTimers: function () {
      clearTimeout(this.timer);
      clearTimeout(this.pTimer);
      this.timer = null;
      this.pTimer = null;
    },
    move: function (dir) {
      var s = '';
      var me = this;
      var tempX = this.curX;
      var tempY = this.curY;
      switch (dir) {
        case 'L':
          s = 'left';
          tempX -= 1;
          break;
        case 'R':
          s = 'left';
          tempX += 1;
          break;
        case 'D':
          s = 'top';
          tempY += 1;
          break;
        case 'RT':
          this.rotate();
          return true;
          break;
        default:
          throw new Error('wtf');
          break;
      }
      if (this.checkMove(tempX, tempY, this.curShape)) {
        this.curSqs.eachdo(function (i) {
          var l = parseInt(this.style[s], 10);
          dir === 'L' ? (l -= me.pSize) : (l += me.pSize);
          this.style[s] = l + 'px';
        });
        this.curX = tempX;
        this.curY = tempY;
      } else if (dir === 'D') {
        if (this.curY === 1 || this.time === this.maxTime) {
          this.gameOver();
          return false;
        }
        this.curComplete = true;
      }
    },
     rotate: function () {
  if (this.curShapeIndex === 6) return; // square doesn't rotate

  var temp = [];
  // rotate 90° clockwise
  this.curShape.eachdo(function () {
    temp.push([this[1] * -1, this[0]]);
  });

  // Check if rotation is valid; if not, try wall kicks
  if (this.checkMove(this.curX, this.curY, temp)) {
    this.applyRotation(temp);
  } else {
    // Wall kick offsets to try: right, left, up
    var kicks = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: -1 },
    ];
    var kicked = false;
    for (var i = 0; i < kicks.length; i++) {
      var nx = this.curX + kicks[i].x;
      var ny = this.curY + kicks[i].y;
      if (this.checkMove(nx, ny, temp)) {
        this.curX = nx;
        this.curY = ny;
        this.applyRotation(temp);
        kicked = true;
        break;
      }
    }
    if (!kicked) {
      // rotation fails, leave shape as-is
      // optionally you could play a "bump" sound
    }
  }
},

applyRotation: function (rotatedShape) {
  this.curShape = rotatedShape;
  this.removeCur();
  this.drawShape(this.curX, this.curY, this.curShape);
},

    checkMove: function (x, y, p) {
      if (this.isOB(x, y, p) || this.isCollision(x, y, p)) {
        return false;
      }
      return true;
    },
    isCollision: function (x, y, p) {
      var me = this;
      var bool = false;
      p.eachdo(function () {
        var newX = this[0] + x;
        var newY = this[1] + y;
        if (me.boardPos(newX, newY) === 1) {
          bool = true;
        }
      });
      return bool;
    },
    isOB: function (x, y, p) {
      var w = this.boardWidth - 1;
      var h = this.boardHeight - 1;
      var bool = false;
      p.eachdo(function () {
        var newX = this[0] + x;
        var newY = this[1] + y;
        if (newX < 0 || newX > w || newY < 0 || newY > h) {
          bool = true;
        }
      });
      return bool;
    },
    getRowState: function (y) {
      var c = 0;
      for (var x = 0; x < this.boardWidth; x++) {
        if (this.boardPos(x, y) === 1) {
          c = c + 1;
        }
      }
      if (c === 0) {
        return 'E';
      }
      if (c === this.boardWidth) {
        return 'F';
      }
      return 'U';
    },
    checkRows: function () {
      var me = this;
      var start = this.boardHeight;
      this.curShape.eachdo(function () {
        var n = this[1] + me.curY;
        console.log(n);
        if (n < start) {
          start = n;
        }
      });
      console.log(start);

      var c = 0;
      var stopCheck = false;
      for (var y = this.boardHeight - 1; y >= 0; y--) {
        switch (this.getRowState(y)) {
          case 'F':
            this.removeRow(y);
            c++;
            break;
          case 'E':
            if (c === 0) {
              stopCheck = true;
            }
            break;
          case 'U':
            if (c > 0) {
              this.shiftRow(y, c);
            }
            break;
          default:
            break;
        }
        if (stopCheck === true) {
          break;
        }
      }
      if (c > 0) {
        this.calcScore({ lines: c });
        this.incLines(c); // triggers level + speed changes
      }
    },
    shiftRow: function (y, amount) {
      var me = this;
      for (var x = 0; x < this.boardWidth; x++) {
        this.sqs.eachdo(function () {
          if (me.isAt(x, y, this)) {
            me.setBlock(x, y + amount, this);
          }
        });
      }
      me.emptyBoardRow(y);
    },
    emptyBoardRow: function (y) {
      for (var x = 0; x < this.boardWidth; x++) {
        this.markBoardAt(x, y, 0);
      }
    },
    removeRow: function (y) {
      for (var x = 0; x < this.boardWidth; x++) {
        this.removeBlock(x, y);
      }
    },
    removeBlock: function (x, y) {
      var me = this;
      this.markBoardAt(x, y, 0);
      this.sqs.eachdo(function (i) {
        if (me.getPos(this)[0] === x && me.getPos(this)[1] === y) {
          me.canvas.removeChild(this);
          me.sqs.splice(i, 1);
        }
      });
    },
    setBlock: function (x, y, block) {
      this.markBoardAt(x, y, 1);
      var newX = x * this.pSize;
      var newY = y * this.pSize;
      block.style.left = newX + 'px';
      block.style.top = newY + 'px';
    },
    isAt: function (x, y, block) {
      if (this.getPos(block)[0] === x && this.getPos(block)[1] === y) {
        return true;
      }
      return false;
    },
    getPos: function (block) {
      var p = [];
      p.push(parseInt(block.style.left, 10) / this.pSize);
      p.push(parseInt(block.style.top, 10) / this.pSize);
      return p;
    },
    getBoardIdx: function (x, y) {
      return x + y * this.boardWidth;
    },
    boardPos: function (x, y) {
      return this.board[x + y * this.boardWidth];
    },
    markBoardAt: function (x, y, val) {
      this.board[this.getBoardIdx(x, y)] = val;
    },
    markBoardShape: function (x, y, p) {
      var me = this;
      p.eachdo(function (i) {
        var newX = p[i][0] + x;
        var newY = p[i][1] + y;
        me.markBoardAt(newX, newY, 1);
      });
    },
    isIE: function () {
      return this.bTest(/IE/);
    },
    isFirefox: function () {
      return this.bTest(/Firefox/);
    },
    isSafari: function () {
      return this.bTest(/Safari/);
    },
    bTest: function (rgx) {
      return rgx.test(navigator.userAgent);
    },
  };
  const btn = document.querySelector('#start');
const music = document.getElementById('theme'); // link to your <audio> tag

btn.addEventListener('click', function () {
  btn.style.display = 'none';
  if (!isStart) {
    tetris.init();    // start the game
  }
  music.volume = 0.5; // optional: adjust volume
  music.play();        // start the Tetris theme
});

// --- Mobile + Desktop Controls ---
function triggerKey(keyCode) {
  document.dispatchEvent(new KeyboardEvent('keydown', { keyCode }));
}

const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const downBtn = document.getElementById('downBtn');
const rotateBtn = document.getElementById('rotateBtn');

function bindControl(btn, keyCode) {
  if (!btn) return;
  // for phones
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    triggerKey(keyCode);
  });
  // for desktop clicks
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    triggerKey(keyCode);
  });
}

// --- Repeating controls for mobile + desktop ---
function bindHoldControl(btn, keyCode, interval = 100) {
  if (!btn) return;
  let timer = null;

  function start() {
    if (timer) return;
    triggerKey(keyCode); // immediate fire
    timer = setInterval(() => triggerKey(keyCode), interval);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  // Touch events
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    start();
  });
  btn.addEventListener('touchend', stop);
  btn.addEventListener('touchcancel', stop);

  // Mouse events
  btn.addEventListener('mousedown', (e) => {
    e.preventDefault();
    start();
  });
  btn.addEventListener('mouseup', stop);
  btn.addEventListener('mouseleave', stop);
}

// Left, Right, Down repeat while held
bindHoldControl(leftBtn, 37, 100);   // ⟵
bindHoldControl(rightBtn, 39, 100);  // ⟶
bindHoldControl(downBtn, 40, 50);    // ⟱ faster drop

// Rotate single tap
bindControl(rotateBtn, 38); // ⟳

const refreshBtn = document.getElementById('refreshBtn');
if (refreshBtn) {
  const restart = () => {
    window.location.reload();
  };
  refreshBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    restart();
  });
  refreshBtn.addEventListener('click', (e) => {
    e.preventDefault();
    restart();
  });
}

// 🧭 Responsive scaling logic
function resizeGame() {
  const gameWidth = 360;
  const gameHeight = 640;
  const wrapper = document.getElementById('game-wrapper');

  const style = getComputedStyle(wrapper);
  const paddingLeft = parseInt(style.paddingLeft) || 0;
  const paddingRight = parseInt(style.paddingRight) || 0;
  const paddingTop = parseInt(style.paddingTop) || 0;
  const paddingBottom = parseInt(style.paddingBottom) || 0;

  const vw = window.innerWidth - paddingLeft - paddingRight;
  const vh = window.innerHeight - paddingTop - paddingBottom;

  // Get bottom buttons height
  const bottomControls = document.getElementById('controls');
  const bottomHeight = bottomControls ? bottomControls.offsetHeight + 20 : 0;

  const availableHeight = vh - bottomHeight;

  const scaleX = vw / gameWidth;
  const scaleY = availableHeight / gameHeight;

  const scale = Math.min(scaleX, scaleY);

  document.documentElement.style.setProperty('--scale', scale);
}

window.addEventListener('resize', resizeGame);
window.addEventListener('load', resizeGame);


// --- 🎵 Song switching controls ---
const themeAudio = document.getElementById('theme');
const prevSongBtn = document.getElementById('prevSongBtn');
const nextSongBtn = document.getElementById('nextSongBtn');

const songs = [
  { name: 'Korobeiniki', src: 'tetris-theme.mp3' },
  { name: 'Dance of the sugar plum fairies', src: 'sugarplumfairies.mp3' },
  { name: 'Trepak', src: 'trepak.mp3' },
];

let currentSongIndex = 0;

// make sure loop stays on
themeAudio.loop = true;
themeAudio.src = songs[currentSongIndex].src;

// helper to switch songs
function playSong(index) {
  if (index < 0) index = songs.length - 1;
  if (index >= songs.length) index = 0;
  currentSongIndex = index;
  themeAudio.src = songs[currentSongIndex].src;
  themeAudio.play();
}

function bindSongButton(btn, direction) {
  if (!btn) return;
  const handler = (e) => {
    e.preventDefault();
    playSong(currentSongIndex + direction);
  };
  btn.addEventListener('click', handler);
  btn.addEventListener('touchstart', handler);
}

bindSongButton(prevSongBtn, -1);
bindSongButton(nextSongBtn, +1);


// ✅ Ensure game state flags exist
tetris.isGameOver = false;

// 🎮 Manual pause button
const pauseBtn = document.getElementById('pauseBtn');
if (pauseBtn) {
  pauseBtn.addEventListener('click', function () {
    tetris.togglePause();
  });
}

// --- 🔄 Auto-Pause When App Loses Focus (No Auto-Resume) ---
document.addEventListener('visibilitychange', function () {
  console.log('[visibilitychange] fired | hidden =', document.hidden);
  console.log('tetris.isActive =', tetris.isActive, 'isGameOver =', tetris.isGameOver);

  if (document.hidden && tetris.isActive === 1 && !tetris.isGameOver) {
    console.log('→ Auto-pausing: tab hidden');
    tetris.togglePause(true);
  }
});

window.addEventListener('blur', function () {
  console.log('[blur] fired | isActive =', tetris.isActive, 'isGameOver =', tetris.isGameOver);

  if (tetris.isActive === 1 && !tetris.isGameOver) {
    console.log('→ Auto-pausing: window lost focus');
    tetris.togglePause(true);
  }
});

// ✅ No auto-resume logic — player must press pause/start to continue

})();



if (!Array.prototype.eachdo) {
  Array.prototype.eachdo = function (fn) {
    for (var i = 0; i < this.length; i++) {
      fn.call(this[i], i);
    }
  };
}
if (!Array.prototype.remDup) {
  Array.prototype.remDup = function () {
    var temp = [];
    for (var i = 0; i < this.length; i++) {
      var bool = true;
      for (var j = i + 1; j < this.length; j++) {
        if (this[i] === this[j]) {
          bool = false;
        }
      }
      if (bool === true) {
        temp.push(this[i]);
      }
    }
    return temp;
  };
}
