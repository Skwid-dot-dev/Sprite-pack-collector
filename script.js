// script.js
// Core interactive logic for PIXEL BLOCK GACHA

// Placeholder until full logic is reconstructed

console.log("script.js loaded");

// DOM Elements
const packCountEl = document.getElementById('pack-count');
const itemCountEl = document.getElementById('item-count');
const rareCountEl = document.getElementById('rare-count');
const inventoryGrid = document.getElementById('inventory-grid');
const gachaPack = document.getElementById('gacha-pack');
const pullBtn = document.getElementById('pull-btn');
const revealOverlay = document.getElementById('reveal-overlay');
const closeReveal = document.getElementById('close-reveal');
const revealImg = document.getElementById('reveal-img');
const revealName = document.getElementById('reveal-name');
const revealRarity = document.getElementById('reveal-rarity');
const particlesContainer = document.getElementById('particles-container');
const sortButtons = document.querySelectorAll('.sort-btn');

const pixelBlocks = [
  { id: 1, name: "Basic Grass Block", image: "images/grass_block.png", rarity: "common" },
  { id: 2, name: "Stone Block", image: "images/stone_block.png", rarity: "common" },
  { id: 3, name: "Ice Block", image: "images/ice_block.png", rarity: "uncommon" },
  { id: 4, name: "Mossy Cobble", image: "images/mossy_cobblestone_block.png", rarity: "rare" },
  { id: 5, name: "Magma Block", image: "images/magma_block.png", rarity: "rare" }
];

const rarityColors = {
  common: '#8d8d8d',
  uncommon: '#4de94c',
  rare: '#4545ff',
  epic: '#a832db',
  legendary: '#ffaa00'
};

const dropRates = {
  common: 60,
  uncommon: 25,
  rare: 10,
  epic: 4,
  legendary: 1
};

const gameState = {
  inventory: [],
  packs: 5,
  currentSort: 'newest',
  isAnimating: false
};

function updateStats() {
  packCountEl.textContent = gameState.packs;
  const totalItems = gameState.inventory.reduce((total, item) => total + item.count, 0);
  itemCountEl.textContent = totalItems;
  const rareItems = gameState.inventory.reduce((total, item) => {
    return ['rare', 'epic', 'legendary'].includes(item.rarity) ? total + item.count : total;
  }, 0);
  rareCountEl.textContent = rareItems;
}

function renderInventory() {
  const sorted = [...gameState.inventory].sort((a, b) => {
    if (gameState.currentSort === 'newest') return b.dateAdded - a.dateAdded;
    if (gameState.currentSort === 'rarity') {
      const order = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
      return order[b.rarity] - order[a.rarity];
    }
    return a.name.localeCompare(b.name);
  });

  inventoryGrid.innerHTML = '';
  sorted.forEach(item => {
    const el = document.createElement('div');
    el.className = 'item';

    const dot = document.createElement('div');
    dot.className = 'item-rarity';
    dot.style.backgroundColor = rarityColors[item.rarity];

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;

    const name = document.createElement('div');
    name.className = 'item-name';
    name.textContent = item.name;

    const count = document.createElement('div');
    count.className = 'item-count';
    count.textContent = `x${item.count}`;

    el.append(dot, img, name, count);
    inventoryGrid.appendChild(el);
  });
}

function getRandomItem() {
  const rand = Math.random() * 100;
  let acc = 0;
  let rarity = 'common';

  for (const [key, rate] of Object.entries(dropRates)) {
    acc += rate;
    if (rand <= acc) {
      rarity = key;
      break;
    }
  }
  const filtered = pixelBlocks.filter(b => b.rarity === rarity);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function addItemToInventory(item) {
  const found = gameState.inventory.find(i => i.id === item.id);
  if (found) {
    found.count++;
    found.dateAdded = Date.now();
  } else {
    gameState.inventory.push({ ...item, count: 1, dateAdded: Date.now() });
  }
}

function showRevealOverlay(item) {
  revealImg.src = item.image;
  revealName.textContent = item.name;
  revealRarity.textContent = item.rarity.toUpperCase();
  revealRarity.style.color = rarityColors[item.rarity];
  revealOverlay.classList.add('active');
}

function closeRevealOverlay() {
  revealOverlay.classList.remove('active');
}

function openPack() {
  if (gameState.packs <= 0 || gameState.isAnimating) return;

  gameState.packs--;
  gameState.isAnimating = true;
  updateStats();
  gachaPack.classList.add('opening');

  setTimeout(() => {
    const item = getRandomItem();
    addItemToInventory(item);
    renderInventory();
    showRevealOverlay(item);
    gachaPack.classList.remove('opening');
    gameState.isAnimating = false;
  }, 1200);
}

function setSortType(type) {
  gameState.currentSort = type;
  sortButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.sort === type);
  });
  renderInventory();
}

function initGame() {
  updateStats();
  renderInventory();
  pullBtn.addEventListener('click', openPack);
  closeReveal.addEventListener('click', closeRevealOverlay);
  sortButtons.forEach(btn => {
    btn.addEventListener('click', () => setSortType(btn.dataset.sort));
  });
}

document.addEventListener('DOMContentLoaded', initGame);
