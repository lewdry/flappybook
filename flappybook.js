const book = document.querySelector('.book');
const container = document.querySelector('.container');
const pipeTop = document.querySelector('.pipe.top');
const pipeBottom = document.querySelector('.pipe.bottom');
const startMessage = document.querySelector('.start-message');
const gameOverMessage = document.querySelector('.game-over-message');
let bookY = container.clientHeight / 2;
let bookVelocity = 0;
let gravity = 0.3;
let jumpForce = -8;
let isOpen = false;
let pipeX = container.clientWidth;
let pipeGap = 450;
let pipeWidth = 80;
let score = 0;
let isGameRunning = false;
let isGameOver = false;

function setViewportHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function update() {
    if (!isGameRunning) return;

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
    if (isGameOver) {
        resetGame();
        return;
    }
    if (!isGameRunning) {
        startGame();
        return;
    }
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
    isGameRunning = false;
    isGameOver = true;
    showGameOverMessage();
}

function resetGame() {
    bookY = container.clientHeight / 2;
    bookVelocity = 0;
    book.style.top = `${bookY}px`;
    book.textContent = '📘';
    isOpen = false;
    score = 0;
    resetPipePosition();
    setPipeHeights();
    hideGameOverMessage();
    showStartMessage();
    isGameOver = false;
}

function resetPipePosition() {
    pipeX = container.clientWidth;
    pipeTop.style.right = pipeBottom.style.right = '0px';
}

function showStartMessage() {
    startMessage.style.display = 'block';
    gameOverMessage.style.display = 'none';
}

function hideStartMessage() {
    startMessage.style.display = 'none';
}

function showGameOverMessage() {
    gameOverMessage.innerHTML = `Game over!<br>Your score: ${score}<br>Tap to play again`;
    gameOverMessage.style.display = 'block';
}

function hideGameOverMessage() {
    gameOverMessage.style.display = 'none';
}

function startGame() {
    isGameRunning = true;
    isGameOver = false;
    hideStartMessage();
    hideGameOverMessage();
    setViewportHeight(); // Set correct height before starting the game
    requestAnimationFrame(update);
}

// Event listeners for touch and click
container.addEventListener('click', jump);
container.addEventListener('touchstart', (e) => {
    e.preventDefault();
    jump();
});

// Set the height on page load
setViewportHeight();

// Update the height on window resize
window.addEventListener('resize', setViewportHeight);

// Initial setup
setPipeHeights();
resetGame();