let timer, elapsedTime = 0, selectedMap, playerName;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
let selectedDifficulty = 'easy';
const images = {};

function preloadImages() {
  const imageNames = {
    bridge_rail: 'tiles/bridge_rail.png',
    bridge: 'tiles/bridge.png',
    curve_rail: 'tiles/curve_rail.png',
    empty: 'tiles/empty.png',
    mountain_rail: 'tiles/mountain_rail.png',
    mountain: 'tiles/mountain.png',
    oasis: 'tiles/oasis.png',
    straight_rail: 'tiles/straight_rail.png'
  };
  for (const [name, path] of Object.entries(imageNames)) {
    const img = new Image();
    img.src = `pics/${path}`;
    img.onload = () => console.log(`${name} loaded successfully`);
    img.onerror = () => console.error(`Failed to load ${name}`);
    images[name] = img;
  }
}

function initialize() {
  preloadImages();

  document.querySelector('#easyOption').addEventListener('click', () => selectDifficulty('easy'));
  document.querySelector('#hardOption').addEventListener('click', () => selectDifficulty('hard'));
  document.querySelector('#startGameButton').addEventListener('click', startGame);
  document.querySelector('#showRulesButton').addEventListener('click', showRules);
  document.querySelector('#closeRulesButton').addEventListener('click', closeRules);
  document.querySelector('#restartGameButton').addEventListener('click', restartGame);
  document.querySelector('#endGameButton').addEventListener('click', endGame);

  document.querySelector('#playerName').addEventListener('input', () => {
    const playerName = document.querySelector('#playerName').value;
    const startGameButton = document.querySelector('#startGameButton');
    if (playerName.trim() !== '') {
      startGameButton.classList.add('active');
    } else {
      startGameButton.classList.remove('active');
    }
  });

  document.querySelector('#closeIncompleteGamePopup').addEventListener('click', () => {
    document.querySelector('#incompleteGamePopup').style.display = 'none';
  });
}

initialize();

function selectDifficulty(difficulty) {
  selectedDifficulty = difficulty;
  document.querySelector('#box5x5').style.background = difficulty === 'easy' ? '#FFFFFF' : '#EAEFD3';
  document.querySelector('#box5x5').style.color = difficulty === 'easy' ? '#B4BFA3' : '#505168';
  document.querySelector('#box7x7').style.background = difficulty === 'hard' ? '#FFFFFF' : '#EAEFD3';
  document.querySelector('#box7x7').style.color = difficulty === 'hard' ? '#B4BFA3' : '#505168';
}

function startGame() {
  playerName = document.querySelector('#playerName').value;
  const difficulty = selectedDifficulty;
  document.querySelector('#playerDisplay').innerText = playerName;

  selectedMap = chooseMap(difficulty);
  if (!selectedMap) {
    console.error('No map found for the selected difficulty');
    return;
  }

  renderGrid(selectedMap);

  document.querySelector('#menu').style.display = 'none';
  document.querySelector('#game').style.display = 'block';
  document.querySelector('#rulesPopup').style.display = 'none'; 

  startTimer();
}

function showRules() {
  document.querySelector('#rulesPopup').style.display = 'block';
}

function closeRules() {
  document.querySelector('#rulesPopup').style.display = 'none';
}

function startTimer() {
  elapsedTime = 0;
  timer = setInterval(() => {
    elapsedTime++;
    document.querySelector('#timer').innerText = elapsedTime;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function chooseMap(difficulty) {
  const maps = {
    easy: [
      ['empty', 'mountain', 'empty', 'empty', 'oasis'],
      ['empty', 'empty', 'empty', 'bridge', 'oasis'],
      ['bridge', 'empty', 'mountain', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'oasis', 'empty'],
      ['empty', 'empty', 'mountain', 'empty', 'empty']
    ],
    hard: [
      ['empty', 'mountain', 'oasis', 'oasis', 'empty', 'bridge', 'empty'],
      ['bridge', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'bridge', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'mountain', 'empty', 'empty', 'empty'],
      ['mountain', 'empty', 'mountain', 'empty', 'bridge', 'empty', 'oasis'],
      ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'bridge', 'empty', 'empty', 'empty']
    ]
  };
  return maps[difficulty];
}

const railTypes = ['straight_rail', 'curve_rail'];

let isDrawing = false; 

function handleMouseDown(cellDiv) {
  isDrawing = true;
  placeRail(cellDiv);
}

function handleMouseOver(cellDiv) {
  if (isDrawing) {
    placeRail(cellDiv);
  }
}

function handleMouseUp() {
  isDrawing = false;
}

function renderGrid(map) {
  const gameContainer = document.querySelector('#gameContainer');
  gameContainer.innerHTML = '';

  map.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');
    row.forEach(cell => {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');
      cellDiv.style.backgroundImage = `url(${images[cell].src})`;
      cellDiv.style.backgroundSize = 'cover';
      cellDiv.dataset.type = cell;
      cellDiv.dataset.railType = ''; 
      cellDiv.dataset.direction = '0'; 
      
      cellDiv.addEventListener('mousedown', () => handleMouseDown(cellDiv));
      cellDiv.addEventListener('mouseover', () => handleMouseOver(cellDiv));
      cellDiv.addEventListener('mouseup', handleMouseUp);
      cellDiv.oncontextmenu = (e) => {
        e.preventDefault();
        removeRail(cellDiv);
      };

      rowDiv.appendChild(cellDiv);
    });
    gameContainer.appendChild(rowDiv);
  });

  document.addEventListener('mouseup', handleMouseUp);
}

function placeRail(cellDiv) {
  const type = cellDiv.dataset.type;
  if (type === 'oasis') {
    return;
  }

  if (type === 'empty') {
    const currentRailType = cellDiv.dataset.railType;
    const nextRailType = currentRailType === 'straight_rail' ? 'curve_rail' : 'straight_rail';
    
    cellDiv.dataset.railType = nextRailType;
    cellDiv.style.backgroundImage = `url(${images[nextRailType].src})`;

    const currentDirection = parseInt(cellDiv.dataset.direction);
    const directionIncrement = nextRailType === 'straight_rail' ? 180 : 90; 
    const nextDirection = (currentDirection + directionIncrement) % 360;
    
    cellDiv.dataset.direction = nextDirection;
    cellDiv.style.transform = `rotate(${nextDirection}deg)`;
  } else if (type === 'bridge' && !cellDiv.dataset.railType) {
    cellDiv.dataset.railType = 'bridge_rail';
    cellDiv.style.backgroundImage = `url(${images['bridge_rail'].src})`;
  } else if (type === 'mountain' && !cellDiv.dataset.railType) {
    cellDiv.dataset.railType = 'mountain_rail';
    cellDiv.style.backgroundImage = `url(${images['mountain_rail'].src})`;
  }
}

function removeRail(cellDiv) {
  const type = cellDiv.dataset.type;
  if (type === 'empty' || type === 'bridge' || type === 'mountain') {
    cellDiv.dataset.railType = '';
    cellDiv.style.backgroundImage = `url(${images[type].src})`;
    cellDiv.style.transform = 'rotate(0deg)';
  }
}

function validatePuzzle() {
  const gameContainer = document.querySelector('#gameContainer');
  const cells = gameContainer.getElementsByClassName('cell');
  let isValid = true;

  for (let cell of cells) {
    const type = cell.dataset.type;
    const railType = cell.dataset.railType;
    if (type === 'oasis' && railType) {
      isValid = false;
      break;
    }
    if (type === 'bridge' && railType !== 'bridge_rail') {
      isValid = false;
      break;
    }
    if (type === 'mountain' && railType !== 'mountain_rail') {
      isValid = false;
      break;
    }
  }

  const grid = Array.from(cells).map(cell => ({
    railType: cell.dataset.railType,
    direction: parseInt(cell.dataset.direction)
  }));
  if (!isContinuousLoop(grid)) {
    isValid = false;
  }

  return isValid;
}

function isContinuousLoop(grid) {
  const visited = new Set();
  const stack = [];

  for (let i = 0; i < grid.length; i++) {
    if (grid[i].railType) {
      stack.push(i);
      break;
    }
  }

  while (stack.length > 0) {
    const current = stack.pop();
    if (visited.has(current)) continue;
    visited.add(current);

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
  }

  for (let i = 0; i < grid.length; i++) {
    if (grid[i].railType && !visited.has(i)) {
      return false;
    }
  }

  return true;
}

function getNeighbors(index, grid) {
  const neighbors = [];
  const rowLength = Math.sqrt(grid.length);
  const row = Math.floor(index / rowLength);
  const col = index % rowLength;

  if (row > 0 && grid[index - rowLength].railType) {
    neighbors.push(index - rowLength);
  }
  if (row < rowLength - 1 && grid[index + rowLength].railType) {
    neighbors.push(index + rowLength);
  }
  if (col > 0 && grid[index - 1].railType) {
    neighbors.push(index - 1);
  }
  if (col < rowLength - 1 && grid[index + 1].railType) {
    neighbors.push(index + 1);
  }

  return neighbors;
}

function updateLeaderboard(playerName, time, difficulty) {
  const leaderboardKey = `leaderboard_${difficulty}`;
  let leaderboard = JSON.parse(localStorage.getItem(leaderboardKey)) || [];
  leaderboard.push({ playerName, time });
  leaderboard.sort((a, b) => a.time - b.time);
  localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));
  displayLeaderboard(leaderboard);
}

function displayLeaderboard(leaderboard) {
  const leaderboardDiv = document.querySelector('#leaderboard');
  leaderboardDiv.innerHTML = '<h2>Leaderboard</h2>';
  leaderboard.forEach(entry => {
    const entryDiv = document.createElement('div');
    entryDiv.innerText = `${entry.playerName}: ${entry.time} seconds`;
    leaderboardDiv.appendChild(entryDiv);
  });
  leaderboardDiv.classList.remove('hidden');
}

function endGame() {
  stopTimer();
  const isValid = validatePuzzle();
  if (isValid) {
    updateLeaderboard(playerName, elapsedTime, selectedDifficulty);
    displayLeaderboard(leaderboard);
    document.querySelector('#game').style.display = 'none';
    document.querySelector('#menu').style.display = 'block';
  } else {
    console.log('The puzzle is not solved correctly. Please try again.');
    document.querySelector('#incompleteGamePopup').style.display = 'block';
  }
}

function restartGame() {
  stopTimer();
  document.querySelector('#playerName').value = '';
  document.querySelector('#game').style.display = 'none';
  document.querySelector('#menu').style.display = 'block';
  document.querySelector('#box5x5').classList.remove('selected');
  document.querySelector('#box7x7').classList.remove('selected');
  selectedDifficulty = null;
}