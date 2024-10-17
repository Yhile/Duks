let audio = new Audio('Pixel Party.mp3');

document.getElementById('playButton').addEventListener('click', function() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('gameArea').classList.remove('hidden');
    audio.play().catch(error => console.log('Autoplay prevented:', error));
});

const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const playButton = document.getElementById('playButton');
const restartButton = document.getElementById('restartButton');
const shop = document.getElementById('shop');
let score = 0;
let isJumping = false;
let flyingObjects = [];
let lastTime = 0;
const columns = [100, 350, 600, 850, 1100]; // Adjusted X positions for the columns
const objectHeight = 30; // Height of the flying objects
const jumpHeight = 150; // Jump height for the player
const flyingObjectImage = 'pixilart-drawing (2).png';

playButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
document.addEventListener('click', jump); // Tap to jump

function jump() {
    if (!isJumping) {
        isJumping = true;
        player.style.transition = 'bottom 0.5s ease'; // Smooth jump
        player.style.bottom = `${jumpHeight}px`; // Jump height
        setTimeout(() => {
            player.style.bottom = '50px'; // Return to normal position
            isJumping = false;
        }, 500); // Duration of the jump
    }
}

function startGame() {
    if (flyingObjects.length > 0) return; // Prevent starting if the game is already running
    score = 0;
    updateScore();
    flyingObjects.forEach(object => object.element.remove()); // Remove existing flying objects
    flyingObjects = []; // Reset flying objects
    gameArea.classList.remove('hidden');
    shop.style.display = 'block';
    playButton.parentElement.classList.add('hidden');
    lastTime = performance.now();
    audio.play().catch(error => console.log('Autoplay prevented:', error));
    requestAnimationFrame(gameLoop);
    setInterval(spawnObject, 900); // Spawn objects at intervals
}

function restartGame() {
    flyingObjects.forEach(object => object.element.remove()); // Remove flying objects on restart
    flyingObjects = []; // Reset flying objects
    score = 0; // Reset score
    updateScore(); // Update score display
    audio.pause(); // Stop the music
    audio.currentTime = 0; // Reset the music to the beginning
    startGame(); // Start the game again
}

function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    moveObjects();
    checkCollisions();
    updateScore();
    requestAnimationFrame(gameLoop); // Continue the game loop
}

function moveObjects() {
    flyingObjects.forEach(object => {
        const objectRect = object.element.getBoundingClientRect();
        if (objectRect.right < 0) {
            object.element.remove();
            flyingObjects = flyingObjects.filter(o => o !== object); // Remove from array
        } else {
            object.element.style.left = (objectRect.left - 5) + 'px'; // Decrease speed
        }
    });
}

function checkCollisions() {
    const playerRect = player.getBoundingClientRect();
    flyingObjects.forEach(object => {
        const objectRect = object.element.getBoundingClientRect();
        // Check collision with the player's jump height
        if (
            objectRect.left < playerRect.right &&
            objectRect.right > playerRect.left &&
            objectRect.top < playerRect.bottom &&
            objectRect.bottom > playerRect.top &&
            parseInt(player.style.bottom) < jumpHeight // Only check if player is jumping
        ) {
            endGame();
        }
    });
}

function spawnObject() {
    const object = document.createElement('div');
    object.classList.add('flying-object');
    object.style.backgroundImage = `url('${flyingObjectImage}')`;
    object.style.width = '50px'; 
    object.style.height = `${objectHeight}px`; // Use defined height
    
    
    let columnX;
    do {
        columnX = columns[Math.floor(Math.random() * columns.length)];
    } while (Math.abs(columnX - parseInt(player.style.left)) < 100);
    object.style.left = `${columnX}px`;
    object.style.top = `${window.innerHeight - objectHeight - 50}px`; 
    gameArea.appendChild(object);
    flyingObjects.push({ element: object }); // Track the flying object
}

function endGame() {
    alert('Game Over! Your score: ' + score);
    playButton.parentElement.classList.remove('hidden');
    gameArea.classList.add('hidden');
    audio.pause(); // Stop the music
    audio.currentTime = 0; // Reset the music to the beginning
}

function updateScore() {
    score++;
    scoreDisplay.innerText = 'Score: ' + score;
}

// Add grass floor
const grass = document.createElement('div');
grass.classList.add('grass');
grass.style.position = 'absolute';
grass.style.bottom = '0';
grass.style.width = '100%';
grass.style.height = '50px'; 
grass.style.backgroundColor = 'green'; // Grass color
gameArea.appendChild(grass);
