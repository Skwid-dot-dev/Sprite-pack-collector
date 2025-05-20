// world-builder.js

const worldState = {
  gridSize: 10,
  scale: 1,
  selectedBlockId: null,
  blocks: {}
};

const gridContainer = document.getElementById('grid-container');
const diamondGrid = document.getElementById('diamond-grid');
const blockSelector = document.getElementById('block-selector');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');
const resetViewBtn = document.getElementById('reset-view');
const clearGridBtn = document.getElementById('clear-grid');
const saveWorldBtn = document.getElementById('save-world');

function initDiamondGrid() {
  diamondGrid.innerHTML = '';
  const cellWidth = 28, cellHeight = 16;

  for (let row = 0; row < worldState.gridSize; row++) {
    for (let col = 0; col < worldState.gridSize; col++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      const x = (col - row) * (cellWidth / 2);
      const y = (col + row) * (cellHeight / 2);
      cell.style.left = `${x + 1000 - (cellWidth / 2)}px`;
      cell.style.top = `${y + 500}px`;
      cell.addEventListener('click', () => placeBlock(row, col));
      diamondGrid.appendChild(cell);
    }
  }
  initBlockSelector();
  restoreBlocks();
}

function initBlockSelector() {
  blockSelector.innerHTML = '';
  gameState.inventory.forEach(item => {
    if (item.count > 0) {
      const option = document.createElement('div');
      option.className = 'block-option';
      option.dataset.blockId = item.id;
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name;
      option.appendChild(img);
      option.addEventListener('click', () => selectBlock(item.id));
      blockSelector.appendChild(option);
    }
  });
  if (gameState.inventory.length === 0) {
    const msg = document.createElement('div');
    msg.textContent = 'Open packs to collect blocks!';
    msg.style.color = 'white';
    blockSelector.appendChild(msg);
  }
}

function selectBlock(blockId) {
  worldState.selectedBlockId = blockId;
  document.querySelectorAll('.block-option').forEach(option => {
    option.classList.toggle('selected', option.dataset.blockId == blockId);
  });
}

function placeBlock(row, col) {
  const key = `${row}-${col}`;
  if (!worldState.selectedBlockId) {
    alert('Select a block first!');
    return;
  }
  const block = gameState.inventory.find(i => i.id == worldState.selectedBlockId);
  if (block && block.count > 0) {
    if (worldState.blocks[key]) removeBlock(row, col);
    worldState.blocks[key] = { id: block.id, image: block.image, name: block.name };
    renderBlock(row, col);
    saveWorldState();
  }
}

function removeBlock(row, col) {
  const key = `${row}-${col}`;
  if (worldState.blocks[key]) {
    const el = document.querySelector(`.placed-block[data-position="${key}"]`);
    if (el) el.remove();
    delete worldState.blocks[key];
    const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
    if (cell) cell.classList.remove('has-block');
    saveWorldState();
  }
}

function renderBlock(row, col) {
  const key = `${row}-${col}`;
  const block = worldState.blocks[key];
  if (!block) return;
  const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
  if (cell) {
    cell.classList.add('has-block');
    const img = document.createElement('img');
    img.className = 'placed-block';
    img.src = block.image;
    img.alt = block.name;
    img.dataset.position = key;
    img.style.left = cell.style.left;
    img.style.top = cell.style.top;
    diamondGrid.appendChild(img);
  }
}

function saveWorldState() {
  localStorage.setItem('pixelBlockWorld', JSON.stringify(worldState.blocks));
}

function loadWorldState() {
  try {
    const saved = localStorage.getItem('pixelBlockWorld');
    if (saved) worldState.blocks = JSON.parse(saved);
  } catch (e) {
    console.error('Load error:', e);
    worldState.blocks = {};
  }
}

function restoreBlocks() {
  loadWorldState();
  Object.keys(worldState.blocks).forEach(key => {
    const [row, col] = key.split('-').map(Number);
    renderBlock(row, col);
  });
}

function updateZoom() {
  diamondGrid.style.transform = `scale(${worldState.scale})`;
}

function setupZoomControls() {
  zoomInBtn.addEventListener('click', () => {
    if (worldState.scale < 2) {
      worldState.scale += 0.2;
      updateZoom();
    }
  });

  zoomOutBtn.addEventListener('click', () => {
    if (worldState.scale > 0.4) {
      worldState.scale -= 0.2;
      updateZoom();
    }
  });

  resetViewBtn.addEventListener('click', () => {
    worldState.scale = 1;
    updateZoom();
    gridContainer.scrollTo({
      top: 500,
      left: 1000 - (gridContainer.clientWidth / 2),
      behavior: 'smooth'
    });
  });
}

function clearGrid() {
  if (confirm('Clear your world?')) {
    worldState.blocks = {};
    diamondGrid.querySelectorAll('.placed-block').forEach(b => b.remove());
    diamondGrid.querySelectorAll('.grid-cell').forEach(c => c.classList.remove('has-block'));
    saveWorldState();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (diamondGrid) {
    initDiamondGrid();
    setupZoomControls();
    clearGridBtn?.addEventListener('click', clearGrid);
    saveWorldBtn?.addEventListener('click', saveWorldState);
    setTimeout(() => {
      gridContainer.scrollTo({
        top: 500,
        left: 1000 - (gridContainer.clientWidth / 2)
      });
    }, 100);
  }
});
