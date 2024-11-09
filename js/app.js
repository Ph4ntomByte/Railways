function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
}

function startGame() {
    const difficulty = document.getElementById('difficulty').value;
    const gridSize = difficulty === 'easy' ? 5 : 10;
    createGrid(gridSize);
    showScreen('game');
}

function returnToMenu() {
    showScreen('menu');
}

function showDescription() {
    document.getElementById('description').classList.remove('hidden');
}

function hideDescription() {
    document.getElementById('description').classList.add('hidden');
}

function createGrid(size) {
    const grid = document.getElementById('game-grid');
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        grid.appendChild(cell);
    }
}

showScreen('menu');

