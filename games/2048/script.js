document.addEventListener("DOMContentLoaded", () => {
  const gridContainer = document.getElementById("grid-container");
  const scoreDisplay = document.getElementById("score");
  const bestScoreDisplay = document.getElementById("best-score");
  const restartBtn = document.getElementById("restart-btn");

  let board = Array(4).fill().map(() => Array(4).fill(0));
  let score = 0;
  let bestScore = localStorage.getItem("2048-best") || 0;
  bestScoreDisplay.textContent = bestScore;

  function initGame() {
    board = Array(4).fill().map(() => Array(4).fill(0));
    score = 0;
    updateScore(0);
    addRandomTile();
    addRandomTile();
    renderBoard();
  }

  function addRandomTile() {
    let emptyCells = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length > 0) {
      let { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  function renderBoard() {
    gridContainer.innerHTML = "";
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        let val = board[r][c];
        if (val > 0) {
          cell.textContent = val;
          cell.classList.add(`tile-${val}`);
        }
        gridContainer.appendChild(cell);
      }
    }
  }

  function updateScore(amount) {
    score += amount;
    scoreDisplay.textContent = score;
    if (score > bestScore) {
      bestScore = score;
      bestScoreDisplay.textContent = bestScore;
      localStorage.setItem("2048-best", bestScore);
    }
  }

  function slide(row) {
    let arr = row.filter(val => val !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        updateScore(arr[i]);
        arr[i + 1] = 0;
      }
    }
    arr = arr.filter(val => val !== 0);
    while (arr.length < 4) arr.push(0);
    return arr;
  }

  function rotateBoard() {
    let newBoard = Array(4).fill().map(() => Array(4).fill(0));
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        newBoard[c][3 - r] = board[r][c];
      }
    }
    board = newBoard;
  }

  function moveLeft() {
    let hasChanged = false;
    for (let r = 0; r < 4; r++) {
      let oldRow = [...board[r]];
      let newRow = slide(board[r]);
      board[r] = newRow;
      if (oldRow.join() !== newRow.join()) hasChanged = true;
    }
    return hasChanged;
  }

  function move(direction) {
    let moved = false;
    let rotations = { 'left': 0, 'down': 1, 'right': 2, 'up': 3 }[direction];
    
    for (let i = 0; i < rotations; i++) rotateBoard();
    moved = moveLeft();
    for (let i = 0; i < (4 - rotations) % 4; i++) rotateBoard();

    if (moved) {
      addRandomTile();
      renderBoard();
      checkGameOver();
    }
  }

  function checkGameOver() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] === 0) return;
        if (c < 3 && board[r][c] === board[r][c + 1]) return;
        if (r < 3 && board[r][c] === board[r + 1][c]) return;
      }
    }
    setTimeout(() => alert("Game Over!"), 200);
  }

  document.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      const dirMap = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
      move(dirMap[e.key]);
    }
  });

  let startX = 0, startY = 0;
  gridContainer.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  gridContainer.addEventListener("touchend", (e) => {
    let diffX = e.changedTouches[0].clientX - startX;
    let diffY = e.changedTouches[0].clientY - startY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > 30) move(diffX > 0 ? 'right' : 'left');
    } else {
      if (Math.abs(diffY) > 30) move(diffY > 0 ? 'down' : 'up');
    }
  });

  restartBtn.addEventListener("click", initGame);
  initGame();
});