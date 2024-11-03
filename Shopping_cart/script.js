const itemForm = document.getElementById('itemForm');
const itemNameInput = document.getElementById('itemName');
const itemCountInput = document.getElementById('itemCount');
const itemList = document.getElementById('itemList');
const sortOptions = document.getElementById('sortOptions');

let items = JSON.parse(localStorage.getItem('items')) || [];

const electronics = [
    { name: 'Kabel CYKY 2x4mm', price: 100 },
    { name: 'NYFAZ 10x4', price: 150 },
    { name: 'Spojovací válečky 5mm', price: 50 },
    { name: 'DIN lišta ISO', price: 200 },
    { name: 'Kabel AIKY 3x5mm', price: 120 },
    { name: 'Relé 24V15A', price: 300 },
    { name: 'Relé 12V10A', price: 250 },
    { name: 'Startovací kondenzátor 12V', price: 180 },
    { name: 'Startovací kondenzátor 24V', price: 220 },
    { name: 'Zalamovací nůž', price: 80 }
];

function initializeItemSelect() {
    electronics.forEach(item => {
        const option = document.createElement('option');
        option.value = item.name;
        option.textContent = `${item.name} - ${item.price} Kč`;
        itemNameInput.appendChild(option);
    });
}

function addItem(name, count) {
    const price = electronics.find(item => item.name === name).price;
    const existingItem = items.find(item => item.name === name);

    if (existingItem) {
        existingItem.count += parseInt(count);
    } else {
        items.push({ name, count: parseInt(count), price });
    }
    localStorage.setItem('items', JSON.stringify(items));
    renderItems();
}

function removeItem(name, count) {
    const existingItem = items.find(item => item.name === name);
    if (existingItem) {
        existingItem.count -= count;
        if (existingItem.count <= 0) {
            items = items.filter(item => item.name !== name);
        }
        localStorage.setItem('items', JSON.stringify(items));
        renderItems();
    }
}

function renderItems() {
    itemList.innerHTML = '';
    if (items.length === 0) {
        itemList.innerHTML = '<li>Seznam je prázdný.</li>';
    } else {
        let totalPrice = 0;
        items.forEach(item => {
            const li = document.createElement('li');
            const itemTotalPrice = item.count * item.price;
            totalPrice += itemTotalPrice;
            li.textContent = `${item.name} - ${item.count} ks - ${item.price} Kč za kus - Celkem: ${itemTotalPrice} Kč`;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Odebrat';
            removeButton.classList.add('remove');
            removeButton.addEventListener('click', () => {
                const countToRemove = parseInt(prompt(`Kolik kusů chcete odebrat z ${item.name}?`, '1'));
                if (!isNaN(countToRemove) && countToRemove > 0) {
                    removeItem(item.name, countToRemove);
                }
            });

            li.appendChild(removeButton);
            itemList.appendChild(li);
        });

        const totalLi = document.createElement('li');
        totalLi.textContent = `Celková cena nákupu: ${totalPrice} Kč`;
        totalLi.style.fontWeight = 'bold';
        itemList.appendChild(totalLi);
    }
}

itemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = itemNameInput.value;
    const count = itemCountInput.value;
    addItem(name, count);
    itemNameInput.value = '';
    itemCountInput.value = '';
});

sortOptions.addEventListener('change', () => {
    const sortValue = sortOptions.value;
    if (sortValue === 'name') {
        items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === 'count') {
        items.sort((a, b) => b.count - a.count);
    } else if (sortValue === 'price') {
        items.sort((a, b) => a.price - b.price);
    }
    renderItems();
});

initializeItemSelect();
renderItems();
