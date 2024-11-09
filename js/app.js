let timer, elapsedTime = 0, selectedMap, playerName;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
const images = {};

function preloadImages() {
  const imageNames = {
    background: 'screens/background.png',
    bridge: 'tiles/bridge.png',
    curve: 'tiles/curve_rail.png',
    mountain: 'tiles/mountain.png',
    screen: 'screens/playscreen.png'
  };
  for (const [name, path] of Object.entries(imageNames)) {
    const img = new Image();
    img.src = `pics/${path}`;
    img.onload = () => console.log(`${name} loaded successfully`);
    img.onerror = () => console.error(`Failed to load ${name}`);
    images[name] = img;
  }
}

window.onload = function() {
  preloadImages();
};

function startGame() {
  console.log("startGame function called");

  playerName = document.getElementById('playerName').value;
  const difficulty = document.getElementById('difficulty').value;
  document.getElementById('playerDisplay').innerText = playerName;

  console.log("Player Name:", playerName);
  console.log("Difficulty:", difficulty);

  selectedMap = chooseMap(difficulty);
  console.log("Selected Map:", selectedMap);

  renderGrid(selectedMap, difficulty);

  document.getElementById('menu').style.display = 'none';
  document.getElementById('game').style.display = 'block';

  startTimer();
}

function showRules() {
  document.getElementById('rulesPopup').style.display = 'block';
}

function closeRules() {
  document.getElementById('rulesPopup').style.display = 'none';
}

function startTimer() {
  elapsedTime = 0;
  timer = setInterval(() => {
    elapsedTime++;
    document.getElementById('timer').innerText = elapsedTime;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function chooseMap(difficulty) {
  const maps = {
    easy: [
      [[0, 0, 1, 0, 0], [0, 1, 1, 1, 0], [1, 1, 2, 1, 1], [0, 1, 1, 1, 0], [0, 0, 1, 0, 0]],
      [[0, 1, 1, 1, 0], [1, 2, 0, 2, 1], [1, 0, 3, 0, 1], [1, 2, 0, 2, 1], [0, 1, 1, 1, 0]]
    ],
    hard: [
      [[0, 1, 1, 1, 1, 1, 0], [1, 2, 2, 2, 2, 2, 1], [1, 2, 3, 3, 3, 2, 1], [1, 2, 3, 4, 3, 2, 1], [1, 2, 3, 3, 3, 2, 1], [1, 2, 2, 2, 2, 2, 1], [0, 1, 1, 1, 1, 1, 0]]
    ]
  };
  return maps[difficulty][Math.floor(Math.random() * maps[difficulty].length)];
}

function renderGrid(map, difficulty) {
  const gameContainer = document.getElementById('gameContainer');
  if (!gameContainer) {
    console.error("gameContainer element not found");
    return;
  }
  gameContainer.innerHTML = ''; // Clear previous grid

  map.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');
    row.forEach(cell => {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');
      switch(cell) {
        case 1:
          cellDiv.style.backgroundImage = `url(${images['bridge'].src})`;
          break;
        case 2:
          cellDiv.style.backgroundImage = `url(${images['curve'].src})`;
          break;
        case 3:
          cellDiv.style.backgroundImage = `url(${images['mountain'].src})`;
          break;
        default:
          cellDiv.style.backgroundImage = `url(${images['screen'].src})`;
      }
      cellDiv.style.backgroundSize = 'cover'; // Ensure the image covers the cell
      rowDiv.appendChild(cellDiv);
    });
    gameContainer.appendChild(rowDiv);
  });
}

function isGameSolved() {
  const grid = document.getElementById('grid');
  const cells = grid.querySelectorAll('.cell');
  for (let cell of cells) {
    const type = parseInt(cell.dataset.type);
    if (type === 3 && cell.classList.contains('rail')) return false; 
    if (type === 2 && cell.dataset.railType !== 'straight') return false;
    if (type === 1 && cell.dataset.railType !== 'curve') return false; 
  }
  return true;
}

function saveToLeaderboard() {
  leaderboard.push({ playerName, elapsedTime });
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function showLeaderboard() {
  const leaderboardElement = document.getElementById('leaderboard');
  leaderboardElement.innerHTML = '<h2>Leaderboard</h2>';
  leaderboard.sort((a, b) => a.elapsedTime - b.elapsedTime);
  leaderboard.forEach(entry => {
    const entryElement = document.createElement('div');
    entryElement.innerText = `${entry.playerName}: ${entry.elapsedTime} seconds`;
    leaderboardElement.appendChild(entryElement);
  });
  leaderboardElement.style.display = 'block';
}

function endGame() {
  stopTimer();
  saveToLeaderboard();
  showLeaderboard();
  document.getElementById('game').style.display = 'none';
  document.getElementById('menu').style.display = 'block';
}