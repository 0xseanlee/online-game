document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  const scoreDisplay = document.getElementById("score");
  const bestScoreDisplay = document.getElementById("best-score");
  const restartBtn = document.getElementById("restart-btn");

  const gridSize = 16;
  const tileCount = 20;

  let snake = [];
  let food = { x: 0, y: 0 };
  let dx = gridSize;
  let dy = 0;
  let score = 0;
  let bestScore = localStorage.getItem("snake-best") || 0;
  let gameInterval = null;
  let isGameOver = false;

  bestScoreDisplay.textContent = bestScore;

  function initGame() {
    if (gameInterval) clearInterval(gameInterval);

    snake = [
      { x: 160, y: 160 },
      { x: 144, y: 160 },
      { x: 128, y: 160 }
    ];
    dx = gridSize;
    dy = 0;
    score = 0;
    isGameOver = false;
    scoreDisplay.textContent = score;

    generateFood();
    gameInterval = setInterval(gameLoop, 100);
  }

  function generateFood() {
    food.x = Math.floor(Math.random() * tileCount) * gridSize;
    food.y = Math.floor(Math.random() * tileCount) * gridSize;

    snake.forEach(part => {
      if (part.x === food.x && part.y === food.y) {
        generateFood();
      }
    });
  }

  function gameLoop() {
    if (isGameOver) return;

    clearCanvas();
    moveSnake();
    checkCollision();
    drawFood();
    drawSnake();
  }

  function clearCanvas() {
    ctx.fillStyle = "#eee4da";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function drawSnake() {
    snake.forEach((part, index) => {
      ctx.fillStyle = index === 0 ? "#8f7a66" : "#bbada0";
      ctx.fillRect(part.x, part.y, gridSize - 1, gridSize - 1);
    });
  }

  function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 10;
      scoreDisplay.textContent = score;
      if (score > bestScore) {
        bestScore = score;
        bestScoreDisplay.textContent = bestScore;
        localStorage.setItem("snake-best", bestScore);
      }
      generateFood();
    } else {
      snake.pop();
    }
  }

  function drawFood() {
    ctx.fillStyle = "#f65e3b";
    ctx.fillRect(food.x, food.y, gridSize - 1, gridSize - 1);
  }

  function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
      endGame();
    }

    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        endGame();
      }
    }
  }

  function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    setTimeout(() => alert("Game Over!"), 100);
  }

  function changeDirection(newDx, newDy) {
    if (isGameOver) return;
    if (newDx === -dx && newDx !== 0) return;
    if (newDy === -dy && newDy !== 0) return;
    dx = newDx;
    dy = newDy;
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") changeDirection(0, -gridSize);
    if (e.key === "ArrowDown") changeDirection(0, gridSize);
    if (e.key === "ArrowLeft") changeDirection(-gridSize, 0);
    if (e.key === "ArrowRight") changeDirection(gridSize, 0);
  });

  let startX = 0, startY = 0;
  canvas.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  canvas.addEventListener("touchend", (e) => {
    let diffX = e.changedTouches[0].clientX - startX;
    let diffY = e.changedTouches[0].clientY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > 20) changeDirection(diffX > 0 ? gridSize : -gridSize, 0);
    } else {
      if (Math.abs(diffY) > 20) changeDirection(0, diffY > 0 ? gridSize : -gridSize);
    }
  });

  restartBtn.addEventListener("click", initGame);
  initGame();
});