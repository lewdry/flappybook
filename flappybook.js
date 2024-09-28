const book = document.querySelector('.book');
const container = document.querySelector('.container');
const pipeTop = document.querySelector('.pipe.top');
const pipeBottom = document.querySelector('.pipe.bottom');
let bookY = container.clientHeight / 2;
let bookVelocity = 0;
let gravity = 0.2;
let jumpForce = -6;
let isOpen = false;
let pipeX = container.clientWidth;
let pipeGap = 450;
let pipeWidth = 80;
let score = 0;

function update() {
  // Update book position
  bookY += bookVelocity;
  bookVelocity += gravity;
  book.style.top = `${bookY}px`;

  // Update pipe position
  pipeX -= 6;
  if (pipeX < -pipeWidth) {
    pipeX = container.clientWidth;
    setPipeHeights();
    score++;
  }
  pipeTop.style.right = pipeBottom.style.right = `${container.clientWidth - pipeX}px`;

  // Check for collisions
  if (checkCollision()) {
    gameOver();
    return;
  }

  requestAnimationFrame(update);
}

function checkCollision() {
  const bookRect = book.getBoundingClientRect();
  const topPipeRect = pipeTop.getBoundingClientRect();
  const bottomPipeRect = pipeBottom.getBoundingClientRect();

  return (
    bookRect.right > topPipeRect.left &&
    bookRect.left < topPipeRect.right &&
    (bookRect.top < topPipeRect.bottom || bookRect.bottom > bottomPipeRect.top)
  ) || bookY < 0 || bookY > container.clientHeight - book.clientHeight;
}

function jump() {
  bookVelocity = jumpForce;
  toggleBook();
}

function toggleBook() {
  isOpen = !isOpen;
  book.textContent = isOpen ? '📖' : '📘';
}

function setPipeHeights() {
  const minHeight = 100;
  const maxHeight = container.clientHeight - pipeGap - minHeight;
  const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
  pipeTop.style.height = `${topHeight}px`;
  pipeBottom.style.height = `${container.clientHeight - topHeight - pipeGap}px`;
}

function gameOver() {
  alert(`Game Over! Your score: ${score}`);
  resetGame();
}

function resetGame() {
  bookY = container.clientHeight / 2;
  bookVelocity = 0;
  book.style.top = `${bookY}px`;
  book.textContent = '📘';
  isOpen = false;
  pipeX = container.clientWidth;
  score = 0;
  setPipeHeights();
  requestAnimationFrame(update);
}

// Event listeners for touch and click
container.addEventListener('click', jump);
container.addEventListener('touchstart', (e) => {
  e.preventDefault();
  jump();
});

setPipeHeights();
update();