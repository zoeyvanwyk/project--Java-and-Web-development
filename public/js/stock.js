document.addEventListener('DOMContentLoaded', () => {
    loadStockItems();

    document.getElementById('add-item-button').addEventListener('click', () => {
        showAddItemForm();
    });

   
    document.getElementById('add-item-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = {
            name: document.getElementById('add-name').value,
            categoryid: Number(document.getElementById('add-categoryid').value),
            description: document.getElementById('add-description').value,
            price: Number(document.getElementById('add-price').value),
            stock: Number(document.getElementById('add-stock').value),
            material: document.getElementById('add-material').value,
            colour: document.getElementById('add-colour').value,
            image: document.getElementById('add-image').value
        };
        await addItem(data);
    });

    document.getElementById('edit-item-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Correctly get itemId from the form field
        const itemId = document.getElementById('edit-item-id').value;
        
        // Check if itemId is correctly set
        if (!itemId) {
            console.error('Item ID is missing');
            return;
        }
    
        const data = {
            name: document.getElementById('edit-name').value,
            categoryid: Number(document.getElementById('edit-categoryid').value),
            description: document.getElementById('edit-description').value,
            price: Number(document.getElementById('edit-price').value),
            stock: Number(document.getElementById('edit-stock').value),
            material: document.getElementById('edit-material').value,
            colour: document.getElementById('edit-colour').value,
            image: document.getElementById('edit-image').value
        };
    
        console.log('Editing item:', itemId); 
        console.log('Data:', data); 
    
        try {
            await editItem(itemId, data);
        } catch (error) {
            console.error('Error editing item:', error);
        }
    });
    

});

async function loadStockItems() {
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
                <td>${item.item_id}</td>
                <td><img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;"></td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.stock}</td>
                <td>
                    <button class="btn btn-secondary btn-sm edit-button" data-id="${item.item_id}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-button" data-id="${item.item_id}">Delete</button>
                </td>
            </tr>
        `;
        stockItems.insertAdjacentHTML('beforeend', itemRow);
    });

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', event => {
            const itemId = event.target.getAttribute('data-id');
            showEditItemForm(itemId);
        });
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', event => {
            const itemId = event.target.getAttribute('data-id');
            deleteItem(itemId);
        });
    });
}


async function addItem(data) {
    try {
        const response = await fetch('/api/stock', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const newItem = await response.json();
        console.log('New item added:', newItem);
        loadStockItems();
        const addItemModal = bootstrap.Modal.getInstance(document.getElementById('addItemModal'));
        addItemModal.hide();
    } catch (error) {
        console.error('Error adding item:', error);
    }
}

async function editItem(itemId, data) {
    console.log('Sending PATCH request for item ID:', itemId);
    try {
        const response = await fetch(`/api/stock/${itemId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error('Error updating item');
        }
        const updatedItem = await response.json();
        console.log('Item updated:', updatedItem);
        loadStockItems();
        const editItemModal = bootstrap.Modal.getInstance(document.getElementById('editItemModal'));
        editItemModal.hide();
    } catch (error) {
        console.error('Error editing item:', error);
    }
}

async function deleteItem(itemId) {
    try {
        await fetch(`/api/stock/${itemId}`, {
            method: 'DELETE'
        });
        console.log('Item deleted:', itemId);
        loadStockItems();
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}

function showAddItemForm() {
    resetForm('add-item-form');
    const addItemModal = new bootstrap.Modal(document.getElementById('addItemModal'));
    addItemModal.show();
}

async function showEditItemForm(itemId) {
    try {
        const response = await fetch(`/api/stock/${itemId}`);
        const item = await response.json();

        if (!itemId || !item) {
            console.error('Item ID is missing or incorrect');
            return;
        }

        // Log fetched item data
        console.log('Fetched item:', item);

        // Populate the edit form fields with the item's data
        document.getElementById('edit-item-id').value = item.item_id;
        document.getElementById('edit-name').value = item.name;
        document.getElementById('edit-categoryid').value = item.categoryid;
        document.getElementById('edit-description').value = item.description;
        document.getElementById('edit-price').value = item.price;
        document.getElementById('edit-stock').value = item.stock;
        document.getElementById('edit-material').value = item.material;
        document.getElementById('edit-colour').value = item.colour;
        document.getElementById('edit-image').value = item.image;

        // Log form field values after assignment
        console.log('Form populated:', {
            item_id: document.getElementById('edit-item-id').value,
            name: document.getElementById('edit-name').value,
            categoryid: document.getElementById('edit-categoryid').value,
            description: document.getElementById('edit-description').value,
            price: document.getElementById('edit-price').value,
            stock: document.getElementById('edit-stock').value,
            material: document.getElementById('edit-material').value,
            colour: document.getElementById('edit-colour').value,
            image: document.getElementById('edit-image').value
        });

        // Show the edit modal
        const editItemModal = new bootstrap.Modal(document.getElementById('editItemModal'));
        editItemModal.show();
    } catch (error) {
        console.error('Error fetching item details:', error);
    }
}

function resetForm(formId) {
    document.getElementById(formId).reset();
}