// prefab-shop.js

const shopContainer = document.getElementById('shop-container');
const shopTabs = document.querySelectorAll('.shop-tab');
const prefabList = document.getElementById('prefab-list');

const shopItems = [
  { name: "Grass Hut", image: "images/prefabs/grass_hut.png", cost: 5 },
  { name: "Stone Tower", image: "images/prefabs/stone_tower.png", cost: 8 },
  { name: "Magma Fortress", image: "images/prefabs/magma_fortress.png", cost: 12 }
];

function renderShopItems() {
  prefabList.innerHTML = '';
  shopItems.forEach(item => {
    const el = document.createElement('div');
    el.className = 'shop-item';

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;

    const name = document.createElement('div');
    name.className = 'shop-name';
    name.textContent = item.name;

    const cost = document.createElement('div');
    cost.className = 'shop-cost';
    cost.textContent = `Cost: ${item.cost} Blocks`;

    const btn = document.createElement('button');
    btn.textContent = 'Place';
    btn.className = 'shop-place-btn';
    btn.addEventListener('click', () => placePrefab(item));

    el.append(img, name, cost, btn);
    prefabList.appendChild(el);
  });
}

function placePrefab(prefab) {
  alert(`Placing prefab: ${prefab.name}`);
  // Extend with placement UI logic
}

shopTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    shopTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderShopItems();
  });
});

document.addEventListener('DOMContentLoaded', renderShopItems);
