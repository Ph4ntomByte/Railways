let timer, elapsedTime = 0, selectedMap, playerName;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
let selectedDifficulty = 'null';
let isDrawing = false;
let startX, startY, lastDirection;
const images = {};
const railTypes = ['straight_rail', 'curve_rail'];
document.addEventListener('mouseup', handleMouseUp);

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
  document.querySelector('#startGameButton').addEventListener('click', (event) => {
    if (!playerName || playerName.trim() === '' || selectedDifficulty === 'null') {
      event.preventDefault();
      const errorMessage = document.querySelector('#errorMessage');
      if (errorMessage) {
        errorMessage.style.display = 'block';
      }
    } else {
      const errorMessage = document.querySelector('#errorMessage');
      if (errorMessage) {
        errorMessage.style.display = 'none';
      }
      startGame();
    }
  });
  document.querySelector('#showRulesButton').addEventListener('click', showRules);
  document.querySelector('#closeRulesButton').addEventListener('click', closeRules);
  document.querySelector('#restartGameButton').addEventListener('click', restartGame);
  document.querySelector('#endGameButton').addEventListener('click', endGame);
  
  const playerNameInput = document.querySelector('#playerName');
  const startGameButton = document.querySelector('#startGameButton');

  playerNameInput.addEventListener('input', () => {
    playerName = playerNameInput.value;
    if (playerName.trim() !== '') {
      startGameButton.classList.add('active');
      startGameButton.disabled = false;
    } else {
      startGameButton.classList.remove('active');
      startGameButton.disabled = true;
    }
  });

  document.querySelector('#closeIncompleteGamePopup').addEventListener('click', () => {
    document.querySelector('#incompleteGamePopup').style.display = 'none';
  });
}

initialize();

function selectDifficulty(difficulty) {
  selectedDifficulty = difficulty;
  const box5x5 = document.querySelector('#box5x5');
  const box7x7 = document.querySelector('#box7x7');

  if (difficulty === 'easy') {
    box5x5.classList.add('selected');
    box5x5.classList.remove('unselected');
    box7x7.classList.add('unselected');
    box7x7.classList.remove('selected');
  } else {
    box5x5.classList.add('unselected');
    box5x5.classList.remove('selected');
    box7x7.classList.add('selected');
    box7x7.classList.remove('unselected');
  }
}

function startGame() {
  playerName = document.querySelector('#playerName').value;
  const difficulty = selectedDifficulty;
  document.querySelector('#playerDisplay').innerText = playerName;

  selectedMap = chooseMap(difficulty);

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
      [
        [{ type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'bridge', rotation: 90 }, { type: 'empty', rotation: 0 }],
        [{ type: 'bridge', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'oasis', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'mountain', rotation: 180 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }]
      ],
      [
        [{ type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'oasis', rotation: 0 }],
        [{ type: 'empty', rotation: 0 }, { type: 'bridge', rotation: 90 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'mountain', rotation: 180 }, { type: 'empty', rotation: 0 }, { type: 'bridge', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'oasis', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'empty', rotation: 0 }, { type: 'mountain', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }]
      ],
      [
        [{ type: 'oasis', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'empty', rotation: 0 }, { type: 'bridge', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'mountain', rotation: 180 }, { type: 'empty', rotation: 0 }, { type: 'bridge', rotation: 90 }],
        [{ type: 'empty', rotation: 0 }, { type: 'oasis', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'mountain', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }]
      ]
    ],
    hard: [
      [
        [{ type: 'empty', rotation: 0 }, { type: 'mountain', rotation: 0 }, { type: 'oasis', rotation: 0 }, { type: 'oasis', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'bridge', rotation: 90 }, { type: 'empty', rotation: 0 }],
        [{ type: 'bridge', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'bridge', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'mountain', rotation: 90 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'mountain', rotation: 180 }, { type: 'empty', rotation: 0 }, { type: 'mountain', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'bridge', rotation: 90 }, { type: 'empty', rotation: 0 }, { type: 'oasis', rotation: 0 }],
        [{ type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'bridge', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }]
      ],
      [
        [{ type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'mountain', rotation: 90 }, { type: 'oasis', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'bridge', rotation: 90 }, { type: 'empty', rotation: 0 }],
        [{ type: 'bridge', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'bridge', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'empty', rotation: 0 }, { type: 'mountain', rotation: 180 }, { type: 'empty', rotation: 0 }, { type: 'mountain', rotation: 90 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'mountain', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'bridge', rotation: 90 }, { type: 'empty', rotation: 0 }, { type: 'oasis', rotation: 0 }],
        [{ type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'bridge', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }]
      ],
      [
        [{ type: 'empty', rotation: 0 }, { type: 'mountain', rotation: 0 }, { type: 'oasis', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'bridge', rotation: 90 }, { type: 'empty', rotation: 0 }],
        [{ type: 'bridge', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'bridge', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'mountain', rotation: 90 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'mountain', rotation: 180 }, { type: 'empty', rotation: 0 }, { type: 'mountain', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'bridge', rotation: 90 }, { type: 'empty', rotation: 0 }, { type: 'oasis', rotation: 0 }],
        [{ type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }],
        [{ type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'bridge', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }, { type: 'empty', rotation: 0 }]
      ]
    ]
  };
  const randomIndex = Math.floor(Math.random() * maps[difficulty].length);
  return maps[difficulty][randomIndex];
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
      cellDiv.style.backgroundImage = `url(${images[cell.type].src})`;
      cellDiv.style.backgroundSize = 'cover';
      cellDiv.dataset.type = cell.type;
      cellDiv.dataset.railType = ''; 
      cellDiv.dataset.direction = cell.rotation; 
      cellDiv.style.transform = `rotate(${cell.rotation}deg)`;
      
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
  const direction = parseInt(cellDiv.dataset.direction);

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
    cellDiv.style.transform = `rotate(${direction}deg)`;
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

function handleMouseDown(cellDiv) {
  isDrawing = true;
  startX = event.clientX;
  startY = event.clientY;
  lastDirection = null;
  placeRail(cellDiv, 'start');
}

function handleMouseOver(cellDiv) {
  if (isDrawing) {
    const currentX = event.clientX;
    const currentY = event.clientY;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    let direction;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'east' : 'west';
    } else {
      direction = deltaY > 0 ? 'south' : 'north';
    }

    if (lastDirection && lastDirection !== direction) {
      placeRailWithMouse(cellDiv, direction, true);
    } else {
      placeRailWithMouse(cellDiv, direction, false);
    }

    lastDirection = direction;
    startX = currentX;
    startY = currentY;
  }
}

function handleMouseUp() {
  isDrawing = false;
}
function placeRailWithMouse(cellDiv, direction, isTurn) {
  const type = cellDiv.dataset.type;
  const currentRailType = cellDiv.dataset.railType;

  if (type === 'oasis') {
    return;
  }

  if (type === 'empty') {
    let nextRailType;
    let nextDirection;

    if (direction === 'start') {
      nextRailType = 'straight_rail';
      nextDirection = 0;
    } else if (isTurn) {
      nextRailType = 'curve_rail';
      if (direction === 'east') {
        nextDirection = lastDirection === 'north' ? 90 : 0;
      } else if (direction === 'west') {
        nextDirection = lastDirection === 'north' ? 270 : 180;
      } else if (direction === 'north') {
        nextDirection = lastDirection === 'east' ? 270 : 0;
      } else if (direction === 'south') {
        nextDirection = lastDirection === 'east' ? 90 : 180;
      }
    } else {
      nextRailType = 'straight_rail';
      nextDirection = direction === 'east' || direction === 'west' ? 90 : 0;
    }

    cellDiv.dataset.railType = nextRailType;
    cellDiv.style.backgroundImage = `url(${images[nextRailType].src})`;
    cellDiv.dataset.direction = nextDirection;
    cellDiv.style.transform = `rotate(${nextDirection}deg)`;
  } else if (type === 'bridge' && !currentRailType) {
    cellDiv.dataset.railType = 'bridge_rail';
    cellDiv.style.backgroundImage = `url(${images['bridge_rail'].src})`;
  } else if (type === 'mountain' && !currentRailType) {
    cellDiv.dataset.railType = 'mountain_rail';
    cellDiv.style.backgroundImage = `url(${images['mountain_rail'].src})`;
    cellDiv.style.transform = `rotate(${direction}deg)`;
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
  const rowLength = Math.sqrt(grid.length);
  const visited = new Set();
  const stack = [];

  function getNeighbors(index) {
    const neighbors = [];
    const row = Math.floor(index / rowLength);
    const col = index % rowLength;
    const cell = grid[index];

    if (!cell.railType) return neighbors;

    const direction = parseInt(cell.direction);
    const connections = getConnections(cell.railType, direction);

    if (connections.includes('north') && row > 0 && grid[index - rowLength].railType) {
      const neighbor = grid[index - rowLength];
      const neighborConnections = getConnections(neighbor.railType, parseInt(neighbor.direction));
      if (neighborConnections.includes('south')) {
        neighbors.push(index - rowLength);
      }
    }
    if (connections.includes('south') && row < rowLength - 1 && grid[index + rowLength].railType) {
      const neighbor = grid[index + rowLength];
      const neighborConnections = getConnections(neighbor.railType, parseInt(neighbor.direction));
      if (neighborConnections.includes('north')) {
        neighbors.push(index + rowLength);
      }
    }
    if (connections.includes('west') && col > 0 && grid[index - 1].railType) {
      const neighbor = grid[index - 1];
      const neighborConnections = getConnections(neighbor.railType, parseInt(neighbor.direction));
      if (neighborConnections.includes('east')) {
        neighbors.push(index - 1);
      }
    }
    if (connections.includes('east') && col < rowLength - 1 && grid[index + 1].railType) {
      const neighbor = grid[index + 1];
      const neighborConnections = getConnections(neighbor.railType, parseInt(neighbor.direction));
      if (neighborConnections.includes('west')) {
        neighbors.push(index + 1);
      }
    }

    return neighbors;
  }

  function getConnections(railType, direction) {
    const connections = {
      straight_rail: {
        0: ['north', 'south'],
        90: ['west', 'east'],
        180: ['north', 'south'],
        270: ['west', 'east']
      },
      curve_rail: {
        0: ['north', 'east'],
        90: ['east', 'south'],
        180: ['south', 'west'],
        270: ['west', 'north']
      },
      bridge_rail: {
        0: ['north', 'south'],
        90: ['west', 'east'],
        180: ['north', 'south'],
        270: ['west', 'east']
      },
      mountain_rail: {
        0: ['south', 'east'],
        90: ['east', 'north'],
        180: ['north', 'west'],
        270: ['west', 'south']
      }
    };

    return connections[railType][direction];
  }

  for (let i = 0; i < grid.length; i++) {
    if (grid[i].railType) {
      stack.push(i);
      break;
    }
  }

  while (stack.length > 0) {
    const current = stack.pop();
    if (!visited.has(current)) {
      visited.add(current);
      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
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
  leaderboardDiv.innerHTML = '';
  leaderboard.forEach(entry => {
    const entryDiv = document.createElement('div');
    entryDiv.innerText = `${entry.playerName}: ${entry.time} seconds`;
    leaderboardDiv.appendChild(entryDiv);
  });
  leaderboardDiv.classList.remove('hidden');
}

function restartGame() {
  stopTimer();
  document.querySelector('#playerName').value = '';
  document.querySelector('#game').style.display = 'none';
  document.querySelector('#menu').style.display = 'block';
  document.querySelector('#box5x5').classList.remove('selected');
  document.querySelector('#box7x7').classList.remove('selected');
  document.querySelector('#startGameButton').classList.remove('active');
  selectedDifficulty = 'null';
  document.querySelector('#incompleteGamePopup').style.display = 'none';
}

function endGame() {
  stopTimer();
  const isValid = validatePuzzle();
  if (isValid) {
    updateLeaderboard(playerName, elapsedTime, selectedDifficulty);
    displayLeaderboard(leaderboard);
    document.querySelector('#game').style.display = 'none';
    document.querySelector('#leaderboardPopup').style.display = 'block'; 
  } else {
    console.log('The puzzle is not solved correctly. Please try again.');
    document.querySelector('#incompleteGamePopup').style.display = 'block';
  }
}
