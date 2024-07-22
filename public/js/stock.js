document.addEventListener('DOMContentLoaded', () => {
    fetchItems();

    document.getElementById('add-item-button').addEventListener('click', () => {
        // Show a form to add a new item
        showAddItemForm();
    });
});

async function fetchItems() {
    try {
        const response = await fetch('/api/stock');
        const items = await response.json();
        displayItems(items);
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

function displayItems(items) {
    const stockItems = document.getElementById('stock-items');
    stockItems.innerHTML = '';
    items.forEach(item => {
        const itemRow = `
            <tr>
                <td><img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;"></td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.stock}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="editItem(${item.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">Delete</button>
                </td>
            </tr>
        `;
        stockItems.insertAdjacentHTML('beforeend', itemRow);
    });
}

function showAddItemForm() {
    // Display a form to add a new item (implementation depends on your preference)
}

async function editItem(itemId) {
    // Implement the logic to edit an item
}

async function deleteItem(itemId) {
    try {
        await fetch(`/api/stock/${itemId}`, { method: 'DELETE' });
        fetchItems();
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}
