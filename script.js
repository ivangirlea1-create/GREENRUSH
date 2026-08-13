const game =
  document.getElementById("game");

const player =
  document.getElementById("player");

const scoreText =
  document.getElementById("score");

const bestText =
  document.getElementById("best");

const startScreen =
  document.getElementById("startScreen");

const endScreen =
  document.getElementById("endScreen");

const resultTitle =
  document.getElementById("resultTitle");

const finalScore =
  document.getElementById("finalScore");

const startBtn =
  document.getElementById("startBtn");

const againBtn =
  document.getElementById("againBtn");

const leftBtn =
  document.getElementById("leftBtn");

const rightBtn =
  document.getElementById("rightBtn");


/* =========================
   GAME VARIABLES
========================= */

let running = false;

let moveLeft = false;
let moveRight = false;

let playerX = 0;
let playerY = 0;

let enemies = [];

let score = 0;

let best = 0;

let lastSpawn = 0;


/* =========================
   LOAD BEST
========================= */

try {

  best =
    Number(
      localStorage.getItem(
        "greenRushBest"
      )
    ) || 0;

} catch (error) {

  best = 0;

}

bestText.textContent = best;


/* =========================
   GAME SIZE
========================= */

function gameWidth() {

  return game.getBoundingClientRect().width;

}

function gameHeight() {

  return game.getBoundingClientRect().height;

}


/* =========================
   START GAME
========================= */

function startGame() {

  running = false;


  for (
    const enemy of enemies
  ) {

    enemy.element.remove();

  }


  enemies = [];

  score = 0;

  scoreText.textContent = "0";


  moveLeft = false;

  moveRight = false;


  startScreen.style.display =
    "none";

  endScreen.style.display =
    "none";


  playerX =
    gameWidth() / 2 - 21;


  playerY =
    gameHeight() - 155;


  player.style.left =
    playerX + "px";

  player.style.top =
    playerY + "px";

  player.style.display =
    "block";


  lastSpawn =
    performance.now();


  running = true;


  requestAnimationFrame(
    gameLoop
  );

}


/* =========================
   CREATE ENEMY
========================= */

function createEnemy() {

  if (!running) return;


  const element =
    document.createElement(
      "div"
    );


  element.className =
    "enemy";


  const size =
    25 +
    Math.random() * 30;


  const x =
    Math.random() *
    (
      gameWidth() -
      size
    );


  element.style.width =
    size + "px";

  element.style.height =
    size + "px";

  element.style.left =
    x + "px";

  element.style.top =
    -size + "px";


  game.appendChild(
    element
  );


  enemies.push({

    element: element,

    x: x,

    y: -size,

    size: size,

    speed:
      3 +
      Math.random() * 3

  });

}


/* =========================
   COLLISION
========================= */

function collision(enemy) {

  return (

    playerX <
      enemy.x +
      enemy.size &&

    playerX + 42 >
      enemy.x &&

    playerY <
      enemy.y +
      enemy.size &&

    playerY + 42 >
      enemy.y

  );

}


/* =========================
   GAME LOOP
========================= */

function gameLoop(time) {

  if (!running) return;


  /* PLAYER */

  if (moveLeft) {

    playerX -= 7;

  }


  if (moveRight) {

    playerX += 7;

  }


  /* BOUNDARIES */

  if (playerX < 0) {

    playerX = 0;

  }


  if (
    playerX >
    gameWidth() - 42
  ) {

    playerX =
      gameWidth() - 42;

  }


  player.style.left =
    playerX + "px";


  /* ENEMY SPAWN */

  const spawnDelay =
    Math.max(
      300,
      800 - score * 6
    );


  if (
    time - lastSpawn >
    spawnDelay
  ) {

    createEnemy();

    lastSpawn = time;

  }


  /* MOVE ENEMIES */

  for (
    let i =
      enemies.length - 1;

    i >= 0;

    i--
  ) {

    const enemy =
      enemies[i];


    enemy.y +=
      enemy.speed;


    enemy.element.style.top =
      enemy.y + "px";


    /* COLLISION */

    if (
      collision(enemy)
    ) {

      gameOver();

      return;

    }


    /* ENEMY LEFT SCREEN */

    if (
      enemy.y >
      gameHeight() + 50
    ) {

      enemy.element.remove();

      enemies.splice(
        i,
        1
      );


      score++;

      scoreText.textContent =
        score;


      /* 100 POINTS = WIN */

      if (
        score >= 100
      ) {

        winGame();

        return;

      }

    }

  }


  requestAnimationFrame(
    gameLoop
  );

}


/* =========================
   GAME OVER
========================= */

function gameOver() {

  running = false;

  moveLeft = false;

  moveRight = false;


  finalScore.textContent =
    score;


  resultTitle.textContent =
    "GAME OVER";


  updateBest();


  endScreen.style.display =
    "flex";

}


/* =========================
   WIN
========================= */

function winGame() {

  running = false;

  moveLeft = false;

  moveRight = false;


  finalScore.textContent =
    score;


  resultTitle.textContent =
    "🎉 ТЫ ВЫИГРАЛ!";


  updateBest();


  endScreen.style.display =
    "flex";

}


/* =========================
   BEST SCORE
========================= */

function updateBest() {

  if (
    score > best
  ) {

    best = score;

    bestText.textContent =
      best;


    try {

      localStorage.setItem(
        "greenRushBest",
        best
      );

    } catch (error) {}

  }

}


/* =========================
   MOBILE CONTROLS
========================= */

function leftStart(event) {

  event.preventDefault();

  moveLeft = true;

}


function leftStop(event) {

  event.preventDefault();

  moveLeft = false;

}


function rightStart(event) {

  event.preventDefault();

  moveRight = true;

}


function rightStop(event) {

  event.preventDefault();

  moveRight = false;

}


/* LEFT */

leftBtn.addEventListener(
  "touchstart",
  leftStart,
  {
    passive: false
  }
);

leftBtn.addEventListener(
  "touchend",
  leftStop,
  {
    passive: false
  }
);

leftBtn.addEventListener(
  "touchcancel",
  leftStop,
  {
    passive: false
  }
);


/* RIGHT */

rightBtn.addEventListener(
  "touchstart",
  rightStart,
  {
    passive: false
  }
);

rightBtn.addEventListener(
  "touchend",
  rightStop,
  {
    passive: false
  }
);

rightBtn.addEventListener(
  "touchcancel",
  rightStop,
  {
    passive: false
  }
);


/* =========================
   KEYBOARD
========================= */

document.addEventListener(
  "keydown",
  function(event) {

    if (
      event.key === "ArrowLeft" ||
      event.key.toLowerCase() === "a"
    ) {

      moveLeft = true;

    }


    if (
      event.key === "ArrowRight" ||
      event.key.toLowerCase() === "d"
    ) {

      moveRight = true;

    }

  }
);


document.addEventListener(
  "keyup",
  function(event) {

    if (
      event.key === "ArrowLeft" ||
      event.key.toLowerCase() === "a"
    ) {

      moveLeft = false;

    }


    if (
      event.key === "ArrowRight" ||
      event.key.toLowerCase() === "d"
    ) {

      moveRight = false;

    }

  }
);


/* =========================
   BUTTONS
========================= */

startBtn.addEventListener(
  "click",
  startGame
);

againBtn.addEventListener(
  "click",
  startGame
);


/* =========================
   RESIZE
========================= */

window.addEventListener(
  "resize",
  function() {

    if (!running) return;


    playerY =
      gameHeight() - 155;


    if (
      playerX >
      gameWidth() - 42
    ) {

      playerX =
        gameWidth() - 42;

    }


    player.style.left =
      playerX + "px";


    player.style.top =
      playerY + "px";

  }
);
