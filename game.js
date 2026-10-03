/* MEGAMANIA 8-bit — shmup tela fixa. Canvas 240x320, sem dependências. */
(function () {
'use strict';
var W = 240, H = 320;
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

var elScore = document.getElementById('score');
var elHi = document.getElementById('hi');
var elLevel = document.getElementById('level');
var elLives = document.getElementById('lives');
var elEnergy = document.getElementById('energy-fill');
var elEnergyNum = document.getElementById('energy-num');
var overlay = document.getElementById('overlay');
var ovTitle = document.getElementById('ov-title');
var ovSub = document.getElementById('ov-sub');
var ovEnemy = document.getElementById('ov-enemy');
var ovInfo = document.getElementById('ov-info');
var ovScore = document.getElementById('ov-score');
var btnStart = document.getElementById('btn-start');

var IS_TOUCH = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

/* ---------- AUDIO (Web Audio, procedural, sem assets) ---------- */
var AC = null;
function audio() {
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
  if (AC && AC.state === 'suspended') { AC.resume(); }
  return AC;
}
function sfxLaser() {
  var ac = audio(); if (!ac) return;
  var o = ac.createOscillator(), g = ac.createGain();
  o.type = 'square';
  o.frequency.setValueAtTime(1400, ac.currentTime);
  o.frequency.exponentialRampToValueAtTime(180, ac.currentTime + 0.12);
  g.gain.setValueAtTime(0.12, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.12);
  o.connect(g); g.connect(ac.destination);
  o.start(); o.stop(ac.currentTime + 0.13);
}
function sfxEnemyLaser() {
  var ac = audio(); if (!ac) return;
  var o = ac.createOscillator(), g = ac.createGain();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(500, ac.currentTime);
  o.frequency.exponentialRampToValueAtTime(120, ac.currentTime + 0.18);
  g.gain.setValueAtTime(0.06, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18);
  o.connect(g); g.connect(ac.destination);
  o.start(); o.stop(ac.currentTime + 0.19);
}
function sfxExplosion() { // crushing: noise + queda grave
  var ac = audio(); if (!ac) return;
  var dur = 0.35, buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
  var d = buf.getChannelData(0);
  for (var i = 0; i < d.length; i++) { d[i] = (Math.random() * 2 - 1) * (1 - i / d.length); }
  var src = ac.createBufferSource(); src.buffer = buf;
  var f = ac.createBiquadFilter(); f.type = 'lowpass';
  f.frequency.setValueAtTime(2500, ac.currentTime);
  f.frequency.exponentialRampToValueAtTime(120, ac.currentTime + dur);
  var g = ac.createGain();
  g.gain.setValueAtTime(0.35, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
  src.connect(f); f.connect(g); g.connect(ac.destination); src.start();
  var o = ac.createOscillator(), g2 = ac.createGain();
  o.type = 'triangle';
  o.frequency.setValueAtTime(220, ac.currentTime);
  o.frequency.exponentialRampToValueAtTime(35, ac.currentTime + dur);
  g2.gain.setValueAtTime(0.3, ac.currentTime);
  g2.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
  o.connect(g2); g2.connect(ac.destination); o.start(); o.stop(ac.currentTime + dur);
}
function sfxPlayerHit() { sfxExplosion(); }
function sfxLevelClear() {
  var ac = audio(); if (!ac) return;
  [523, 659, 784, 1046].forEach(function (fr, i) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = 'square'; o.frequency.value = fr;
    var t = ac.currentTime + i * 0.09;
    g.gain.setValueAtTime(0.1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 0.11);
  });
}

/* ---------- SPRITES pixel-art (1 char = 1px, '.' = transparente) ---------- */
function makeSprite(rows, pal) {
  var h = rows.length, w = 0, i, j;
  for (i = 0; i < h; i++) w = Math.max(w, rows[i].length);
  var c = document.createElement('canvas'); c.width = w; c.height = h;
  var g = c.getContext('2d');
  for (i = 0; i < h; i++) for (j = 0; j < rows[i].length; j++) {
    var ch = rows[i][j];
    if (ch === '.' || ch === ' ') continue;
    g.fillStyle = pal[ch] || '#f0f';
    g.fillRect(j, i, 1, 1);
  }
  return c;
}

var ENEMY_DEFS = [
  { name: 'HAMBÚRGUERES', score: 100, pal: { '#': '#e89b3a', W: '#ffffff', G: '#39ff5a', Y: '#ffeb00', B: '#7a2e00', D: '#c97a1a' },
    rows: ['.....######.....', '...##########...', '..############..', '..WWWWWWWWWWWW..', '...GGGGGGGGGG...', '..GGGGGGGGGGGG..', '...YYYYYYYYYY...', '..Y..Y..Y..YYY..', '...BBBBBBBBBB...', '..BBBBBBBBBBBB..', '...DDDDDDDDDD...', '....DDDDDDDD....'] },
  { name: 'BOLACHAS', score: 150, pal: { M: '#d9a441', K: '#4a2000', L: '#f4d488' },
    rows: ['.....MMMMMM.....', '...MMMMMMMMMM...', '..MMLMMMMMMMLM..', '.MMMKMMMMMKMMMM.', '.MMMMMMMMMMMMMM.', 'MMMMMKMMMMMKMMM', 'MMMMMMMMMMMMMMM', 'MMMMMKMMMMLMMMM', '.MMMMMMMMMMKMM..', '.MMMKMMMMMMMMM..', '..MMMMMLMMMMM..', '...MMMMMMMMMM...', '.....MMMMMM.....'] },
  { name: 'FERROS', score: 200, pal: { H: '#3a3a4a', S: '#c0d0e8', P: '#606060', O: '#ff6a00', W: '#ffffff' },
    rows: ['.....HHHHHH.....', '....HHHHHHHH....', '....H......H....', '...SSSSSSSSS....', '..SSSSWSSSSSSSS..', '.SSSSSSSSSSSSSSS', 'SSSSSSSSSSSSSSSS', 'SSSSSSSSSSSSSSSS', '.PPPPPPPPPPPPPP.', '..OOOOOOOOOOOO..'] },
  { name: 'GRAVATAS', score: 250, pal: { R: '#ff2244', W: '#ffeb00', D: '#990011' },
    rows: ['RRR..........RRR', 'RRRRR......RRRRR', 'RRRRRRR..RRRRRRR', '.RRRRRRRRRRRRRR.', '..RRRRRWWRRRRR..', '..RRRRDWDRRRRR..', '.RRRRRRRRRRRRRR.', 'RRRRRRR..RRRRRRR', 'RRRRR......RRRRR', 'RRR..........RRR'] },
  { name: 'DIAMANTES', score: 300, pal: { W: '#ffffff', C: '#4defff', D: '#1a8fb0' },
    rows: ['......WW......', '.....WCCW.....', '....WCCCCW....', '...WCDDCCW...', '..WCCDDCCCW..', '.WCCCDDDCCCW.', '..WCCDDCCCW..', '...WCCCCCCW...', '....WCCCCW....', '.....WCCW.....', '......WW......'] }
];
var enemySprites = ENEMY_DEFS.map(function (d) { return makeSprite(d.rows, d.pal); });

var playerSprite = makeSprite([
  '......W......',
  '......W......',
  '.....WWW.....',
  '.....WRW.....',
  '....WWWWW....',
  '....WWWWW....',
  '..WWWWWWWWW..',
  '.WWWWWWWWWWW.',
  'WWWWWWWWWWWWW',
  'WW..W...W..WW'
], { W: '#33ccff', R: '#ff2244' });

/* ---------- ESTADO ---------- */
var S = 2; // inimigos desenhados em 2x (pixelado preservado)
var game = null;
function newGame() {
  var hi = 0;
  try { hi = parseInt(localStorage.getItem('mega_hi') || '0', 10) || 0; } catch (e) { hi = 0; }
  return {
    state: 'title', // title | playing | dying | clear | over
    score: 0, hi: hi,
    lives: 3, level: 1, energy: 100,
    time: 0, fireCd: 0, enemyFireT: 1.5, stateT: 0, shake: 0,
    player: { x: W / 2, w: 13 * 2, h: 10 * 2, speed: 150, alive: true },
    bullets: [], ebullets: [], enemies: [], parts: [],
    formX: W / 2, formDir: 1, kills: 0, dragX: null
  };
}
game = newGame();

function enemyTypeForLevel(lv) { return (lv - 1) % 5; }
function levelSpeed(lv) { return { form: 22 + lv * 7, desc: 6 + lv * 2.0, ebullet: 85 + lv * 9, drain: 2.0 + lv * 0.28 }; }

function spawnWave() {
  var lv = game.level, type = enemyTypeForLevel(lv), sp = levelSpeed(lv);
  game.enemies.length = 0; game.ebullets.length = 0;
  game.formX = W / 2; game.formDir = 1;
  var n = 6, gap = 34, y0 = 34;
  for (var i = 0; i < n; i++) {
    var spr = enemySprites[type];
    game.enemies.push({
      type: type, offX: (i - (n - 1) / 2) * gap, y: y0,
      x: 0, w: spr.width * S, h: spr.height * S,
      phase: i * 0.9, alive: true
    });
  }
  game.enemyFireT = 1.2;
  ovEnemy.textContent = '— ' + ENEMY_DEFS[type].name + ' —';
}

/* ---------- INPUT ---------- */
var keys = {};
window.addEventListener('keydown', function (e) {
  if (['ArrowLeft', 'ArrowRight', ' '].indexOf(e.key) >= 0) e.preventDefault();
  keys[e.key.toLowerCase()] = true;
  keys[e.key] = true;
  audio();
  if ((e.key === ' ' || e.key === 'Enter') && game.state !== 'playing') startFromOverlay();
});
window.addEventListener('keyup', function (e) { keys[e.key.toLowerCase()] = false; keys[e.key] = false; });

var touchL = false, touchR = false, touchF = false;
function bindHold(id, set) {
  var el = document.getElementById(id);
  var on = function (e) { e.preventDefault(); audio(); set(true); };
  var off = function (e) { e.preventDefault(); set(false); };
  el.addEventListener('pointerdown', on);
  el.addEventListener('pointerup', off);
  el.addEventListener('pointercancel', off);
  el.addEventListener('pointerleave', off);
}
bindHold('btn-left', function (v) { touchL = v; });
bindHold('btn-right', function (v) { touchR = v; });
bindHold('btn-fire', function (v) { touchF = v; });

canvas.addEventListener('pointerdown', function (e) { audio(); game.dragX = toGameX(e); canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', function (e) { if (game.dragX !== null) game.dragX = toGameX(e); });
canvas.addEventListener('pointerup', function () { game.dragX = null; });
canvas.addEventListener('pointercancel', function () { game.dragX = null; });
function toGameX(e) {
  var r = canvas.getBoundingClientRect();
  return (e.clientX - r.left) / r.width * W;
}
btnStart.addEventListener('click', function () { audio(); startFromOverlay(); });

function startFromOverlay() {
  if (game.state === 'title' || game.state === 'over') {
    game = newGame(); game.state = 'playing'; game.lives = 3; game.score = 0; game.level = 1; game.energy = 100;
    spawnWaveKeepScore(); hideOverlay(); sfxLevelClear();
  } else if (game.state === 'clear') { /* auto-avança */ }
}
function hideOverlay() { overlay.classList.add('hidden'); }
function showOverlay(title, sub, score) {
  ovTitle.innerHTML = title; ovSub.textContent = sub || '';
  ovScore.textContent = score || '';
  overlay.classList.remove('hidden');
}
function spawnWaveKeepScore() {
  var keepScore = game.score, keepHi = game.hi, keepLives = game.lives, keepLevel = game.level;
  spawnWave();
  game.score = keepScore; game.hi = keepHi; game.lives = keepLives; game.level = keepLevel;
}

/* ---------- LÓGICA ---------- */
function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh, sh) {
  sh = sh || 0;
  return ax + sh < bx + bw - sh && ax + aw - sh > bx + sh && ay + sh < by + bh - sh && ay + ah - sh > by + sh;
}

function firePlayer() {
  if (game.fireCd > 0) return;
  game.fireCd = 0.21;
  game.bullets.push({ x: game.player.x - 2, y: H - 52, w: 4, h: 10, vy: -400, alive: true });
  sfxLaser();
}
function explode(x, y, big) {
  var n = big ? 26 : 12;
  for (var i = 0; i < n; i++) {
    var a = Math.random() * Math.PI * 2, sp = 30 + Math.random() * (big ? 130 : 90);
    game.parts.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0.4 + Math.random() * 0.4, t: 0, c: ['#ffe600', '#ff6600', '#ff2222', '#ffffff'][i % 4] });
  }
  game.shake = big ? 6 : 3;
}
function playerHit() {
  if (game.state !== 'playing') return;
  explode(game.player.x, H - 40, true);
  sfxPlayerHit();
  game.lives--; game.state = 'dying'; game.stateT = 1.4; game.energy = Math.max(game.energy, 30);
  updateHUD();
  if (game.lives < 0) { /* game over tratado ao fim de dying */ }
}
function updateHUD() {
  elScore.textContent = String(game.score).padStart(6, '0');
  elHi.textContent = String(Math.max(game.hi, game.score)).padStart(6, '0');
  var t = enemyTypeForLevel(game.level);
  elLevel.textContent = game.level + '-' + (t + 1);
  var lv = Math.max(0, Math.min(3, game.lives));
  var s = '';
  for (var i = 0; i < 3; i++) s += i < lv ? '★' : '☆';
  elLives.textContent = game.lives <= 0 ? '---' : s;
  var e = Math.max(0, Math.round(game.energy));
  elEnergy.style.width = e + '%';
  elEnergyNum.textContent = e;
  elEnergy.classList.toggle('low', e < 25);
}

function update(dt) {
  game.time += dt;
  var sp = levelSpeed(game.level);

  if (game.state === 'playing') {
    // input lateral
    var left = keys['arrowleft'] || keys['a'] || touchL;
    var right = keys['arrowright'] || keys['d'] || touchR;
    var p = game.player;
    if (game.dragX !== null) {
      var dx = game.dragX - p.x;
      p.x += Math.max(-1, Math.min(1, dx * 0.25)) * p.speed * 1.6 * dt;
      if (Math.abs(dx) < 2) p.x = game.dragX;
    } else {
      var v = 0;
      if (left) v -= 1; if (right) v += 1;
      p.x += v * p.speed * dt;
    }
    p.x = Math.max(p.w / 2 + 2, Math.min(W - p.w / 2 - 2, p.x));

    var wantFire = keys[' '] || keys['spacebar'] || touchF || (IS_TOUCH);
    game.fireCd -= dt;
    if (wantFire) firePlayer();

    // energia drena sempre
    game.energy -= sp.drain * dt;
    if (game.energy <= 0) {
      game.energy = 0;
      ovScore.textContent = 'SEM COMBUSTÍVEL!';
      playerHit(); // perde uma vida; dying restaura parcial
      game.energy = 100; // renova após perda (evita loop)
      if (game.state === 'dying') { /* ok */ }
    }

    // formação zigue-zague
    game.formX += game.formDir * sp.form * dt;
    var half = 100;
    if (game.formX > W / 2 + half - 20) { game.formX = W / 2 + half - 20; game.formDir = -1; }
    if (game.formX < W / 2 - half + 20) { game.formX = W / 2 - half + 20; game.formDir = 1; }
    var yLim = 96 + Math.min(44, game.level * 5);
    for (var i = 0; i < game.enemies.length; i++) {
      var e = game.enemies[i];
      if (!e.alive) continue;
      e.x = game.formX + e.offX + Math.sin(game.time * 2.2 + e.phase) * 10;
      if (e.y < yLim) e.y += sp.desc * dt;
      else e.y = yLim + Math.sin(game.time * 1.5 + e.phase) * 6;
    }

    // tiro inimigo: um de cada vez
    var anyEB = game.ebullets.some(function (b) { return b.alive; });
    game.enemyFireT -= dt;
    if (!anyEB && game.enemyFireT <= 0) {
      var alive = game.enemies.filter(function (e) { return e.alive; });
      if (alive.length) {
        var s = alive[(Math.random() * alive.length) | 0];
        game.ebullets.push({ x: s.x - 2, y: s.y + s.h / 2, w: 4, h: 8, vy: sp.ebullet, alive: true });
        sfxEnemyLaser();
        game.enemyFireT = Math.max(0.55, 1.6 - game.level * 0.08);
      }
    }

    // balas player
    for (var bi = 0; bi < game.bullets.length; bi++) {
      var b = game.bullets[bi];
      if (!b.alive) continue;
      b.y += b.vy * dt;
      if (b.y < -12) b.alive = false;
    }
    game.bullets = game.bullets.filter(function (b) { return b.alive; });

    // balas inimigas
    for (var ei = 0; ei < game.ebullets.length; ei++) {
      var eb = game.ebullets[ei];
      if (!eb.alive) continue;
      eb.y += eb.vy * dt;
      if (eb.y > H) eb.alive = false;
    }
    game.ebullets = game.ebullets.filter(function (b) { return b.alive; });

    // colisão precisa: tiro x inimigo (hitbox 70%)
    for (var k = 0; k < game.bullets.length; k++) {
      var pb = game.bullets[k];
      if (!pb.alive) continue;
      for (var m = 0; m < game.enemies.length; m++) {
        var en = game.enemies[m];
        if (!en.alive) continue;
        var ex = en.x - en.w / 2, ey = en.y - en.h / 2;
        if (rectsOverlap(pb.x, pb.y, pb.w, pb.h, ex, ey, en.w, en.h, 5)) {
          pb.alive = false; en.alive = false;
          explode(en.x, en.y, false);
          sfxExplosion();
          game.score += ENEMY_DEFS[en.type].score;
          if (game.score > game.hi) { game.hi = game.score; try { localStorage.setItem('mega_hi', String(game.hi)); } catch (e) {} }
          break;
        }
      }
    }
    game.bullets = game.bullets.filter(function (b) { return b.alive; });

    // colisão inimigo/bala x player (precisa, núcleo)
    var px = game.player.x - game.player.w / 2, py = H - 40 - game.player.h / 2;
    for (var q = 0; q < game.ebullets.length; q++) {
      var sb = game.ebullets[q];
      if (sb.alive && rectsOverlap(sb.x, sb.y, sb.w, sb.h, px, py, game.player.w, game.player.h, 4)) {
        sb.alive = false; playerHit(); break;
      }
    }
    if (game.state === 'playing') {
      for (var z = 0; z < game.enemies.length; z++) {
        var en2 = game.enemies[z];
        if (!en2.alive) continue;
        var ex2 = en2.x - en2.w / 2, ey2 = en2.y - en2.h / 2;
        if (rectsOverlap(px, py, game.player.w, game.player.h, ex2, ey2, en2.w, en2.h, 4)) { playerHit(); break; }
      }
    }

    // onda limpa?
    if (game.state === 'playing' && !game.enemies.some(function (e) { return e.alive; })) {
      game.state = 'clear'; game.stateT = 2.0;
      game.score += game.level * 100;
      game.energy = Math.min(100, game.energy + 35);
      sfxLevelClear();
    }
    updateHUD();
  } else if (game.state === 'dying') {
    game.stateT -= dt;
    updateParts(dt);
    if (game.stateT <= 0) {
      if (game.lives <= 0) {
        game.state = 'over';
        showOverlay('GAME<br>OVER', 'Fase ' + game.level, 'SCORE ' + game.score + ' • HI ' + game.hi);
        btnStart.textContent = '↻ JOGAR DE NOVO';
      } else {
        game.state = 'playing';
        game.ebullets.length = 0;
      }
    }
  } else if (game.state === 'clear') {
    game.stateT -= dt;
    updateParts(dt);
    if (game.stateT <= 0) {
      game.level++;
      game.energy = 100; // renova ao mudar de fase
      var sc = game.score, hi = game.hi, lv = game.lives;
      spawnWave();
      game.score = sc; game.hi = hi; game.lives = lv;
      game.state = 'playing';
      updateHUD();
    }
  }
  updateParts(dt);
  if (game.shake > 0) game.shake = Math.max(0, game.shake - dt * 20);
}

function updateParts(dt) {
  for (var i = 0; i < game.parts.length; i++) {
    var p = game.parts[i];
    p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.98; p.vy *= 0.98;
  }
  game.parts = game.parts.filter(function (p) { return p.t < p.life; });
}

/* ---------- RENDER ---------- */
function render() {
  ctx.save();
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  if (game.shake > 0) ctx.translate((Math.random() - 0.5) * game.shake, (Math.random() - 0.5) * game.shake);

  // linha do topo (score espelhado sutil) + divisórias arcade
  ctx.fillStyle = '#111'; ctx.fillRect(0, 0, W, 2);

  // inimigos
  for (var i = 0; i < game.enemies.length; i++) {
    var e = game.enemies[i];
    if (!e.alive) continue;
    var spr = enemySprites[e.type];
    ctx.drawImage(spr, Math.round(e.x - spr.width * S / 2), Math.round(e.y - spr.height * S / 2), spr.width * S, spr.height * S);
  }
  // balas player (rápidas, amarelas vibrantes)
  ctx.fillStyle = '#ffe600';
  for (var b = 0; b < game.bullets.length; b++) {
    var pb = game.bullets[b];
    ctx.fillRect(Math.round(pb.x), Math.round(pb.y), pb.w, pb.h);
    ctx.fillStyle = '#fff'; ctx.fillRect(Math.round(pb.x) + 1, Math.round(pb.y), 2, 3); ctx.fillStyle = '#ffe600';
  }
  // balas inimigas (rosas, lentas)
  for (var k = 0; k < game.ebullets.length; k++) {
    var eb = game.ebullets[k];
    ctx.fillStyle = '#ff44ff';
    ctx.fillRect(Math.round(eb.x), Math.round(eb.y), eb.w, eb.h);
    ctx.fillStyle = '#fff'; ctx.fillRect(Math.round(eb.x) + 1, Math.round(eb.y) + 2, 2, 2);
  }
  // player
  if (game.state === 'playing' || game.state === 'clear') {
    var px = Math.round(game.player.x - playerSprite.width * S / 2);
    var py = H - 40 - Math.round(playerSprite.height * S / 2);
    // pisca invencível logo após dying
    ctx.drawImage(playerSprite, px, py, playerSprite.width * S, playerSprite.height * S);
    // chama do motor (2 frames)
    var f = (game.time * 12 | 0) % 2;
    ctx.fillStyle = f ? '#ff6600' : '#ffe600';
    ctx.fillRect(Math.round(game.player.x) - 2, py + playerSprite.height * S, 4, 4 + f * 2);
  }
  // partículas
  for (var p = 0; p < game.parts.length; p++) {
    var pt = game.parts[p];
    ctx.globalAlpha = 1 - pt.t / pt.life;
    ctx.fillStyle = pt.c;
    ctx.fillRect(Math.round(pt.x), Math.round(pt.y), 2, 2);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ---------- LOOP fixo 60Hz ---------- */
var last = performance.now(), acc = 0, STEP = 1000 / 60;
function loop(t) {
  requestAnimationFrame(loop);
  var dt = t - last; last = t;
  if (dt > 100) dt = 100;
  acc += dt;
  while (acc >= STEP) { update(STEP / 1000); acc -= STEP; }
  render();
}
document.addEventListener('visibilitychange', function () { last = performance.now(); });

spawnWave();
game.state = 'title';
updateHUD();
showOverlay('MEGA<br>MANIA', '8-BIT SHMUP', '');
requestAnimationFrame(loop);
})();
