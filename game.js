const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ballSpeed = 4;
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 20,
  dx: ballSpeed,
  dy: ballSpeed,
  color: 'red'
};

let paddle = {
  width: 100,
  height: 20,
  x: canvas.width / 2 - 50,
  y: canvas.height - 40,
  speed: 10
};

let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;
let isGameOver = false;

document.getElementById('bestScore').innerText = `Best Score: ${bestScore}`;

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.closePath();
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball bouncing off walls
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
    ball.dx *= -1;
  }

  // Ball bouncing off top
  if (ball.y - ball.radius < 0) {
    ball.dy *= -1;
  }

  // Ball and paddle collision
  if (
    ball.y + ball.radius > paddle.y &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    ball.dy *= -1;
    score++;
    document.getElementById('score').innerText = `Score: ${score}`;
  }

  // Ball touches the bottom - Game Over
  if (ball.y + ball.radius > canvas.height) {
    isGameOver = true;
    showGameOverBanner();
    checkBestScore();
  }
}

function checkBestScore() {
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('bestScore', bestScore);
    document.getElementById('bestScore').innerText = `Best Score: ${bestScore}`;
  }
}

function movePaddleTouch(event) {
  let touchX = event.touches[0].clientX;
  
  // Ensure paddle stays within the screen
  if (touchX > 0 && touchX < canvas.width - paddle.width) {
    paddle.x = touchX - paddle.width / 2;
  }
}

function showGameOverBanner() {
  document.getElementById('gameOverBanner').style.display = 'flex';
  document.getElementById('finalScore').innerText = `Final Score: ${score}`;
}

function update() {
  if (!isGameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    moveBall();
    requestAnimationFrame(update);
  }
}

// Event Listener for restarting the game
document.getElementById('restartGame').addEventListener('click', function() {
  document.location.reload();
});

// Event Listener for speed control
document.getElementById('speedControl').addEventListener('input', function(event) {
  ball.dx = ball.dy = Number(event.target.value);
});

// Event Listener for toggling settings menu
document.getElementById('settings').addEventListener('click', function() {
  const settingsMenu = document.getElementById('settingsMenu');
  settingsMenu.style.display = settingsMenu.style.display === 'block' ? 'none' : 'block';
});

// Touch control for mobile devices
canvas.addEventListener('touchmove', movePaddleTouch);

// Start the game
update();