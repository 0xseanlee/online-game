document.addEventListener("DOMContentLoaded", () => {
  let score = 0;
  const scoreDisplay = document.getElementById("score");
  const clickBtn = document.getElementById("click-btn");

  if (clickBtn) {
    clickBtn.addEventListener("click", () => {
      score += 1;
      scoreDisplay.textContent = score;

      scoreDisplay.classList.remove("score-pop");
      void scoreDisplay.offsetWidth;
      scoreDisplay.classList.add("score-pop");

      const randomX = (Math.random() - 0.5) * 15;
      const randomY = (Math.random() - 0.5) * 15;
      clickBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
    });
  }
});