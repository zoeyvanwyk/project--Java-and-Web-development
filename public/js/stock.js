document.addEventListener('DOMContentLoaded', () => {
    loadStockItems();

    document.getElementById('add-item-button').addEventListener('click', () => {
        showAddItemForm();
    });

    // document.getElementById('stock-form').addEventListener('submit', async (event) => {
    //     event.preventDefault();
    //     console.log('Form submitted');

    //     const itemId = document.getElementById('item-id').value;
    //     const data = {
    //         name: document.getElementById('name').value,
    //         categoryid: Number(document.getElementById('categoryid').value), // Ensure this is a number
    //         description: document.getElementById('description').value,
    //         price: Number(document.getElementById('price').value), // Ensure this is a number
    //         stock: Number(document.getElementById('stock').value), // Ensure this is a number
    //         material: document.getElementById('material').value,
    //         colour: document.getElementById('colour').value,
    //         image: document.getElementById('image').value
    //     };

    //     console.log('Form data:', data);
    //     console.log('Item ID:', itemId);

    //     if (itemId) {
    //         // Edit item
    //         console.log('Editing item:', itemId);
    //         await editItem(itemId, data);
    //     } else {
    //         // Add item
    //         console.log('Adding new item');
    //         await addItem(data);
    //     }
    // });
    document.getElementById('stock-form').addEventListener('submit', async function (event) {
        event.preventDefault();
    
        const itemId = document.getElementById('item-id').value;
        const name = document.getElementById('name').value;
        const categoryid = document.getElementById('categoryid').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;
        const stock = document.getElementById('stock').value;
        const material = document.getElementById('material').value;
        const colour = document.getElementById('colour').value;
        const image = document.getElementById('image').value;
    
        // Validate inputs before sending the request
        if (!itemId || !name || !categoryid || !price || !stock) {
            alert('Please fill in all required fields');
            return;
        }
    
        const itemData = {
            name,
            categoryid: parseInt(categoryid, 10),
            description,
            price: parseFloat(price),
            stock: parseInt(stock, 10),
            material,
            colour,
            image
        };
    
        try {
            const response = await fetch(`/api/stock/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(itemData)
            });
    
            if (!response.ok) {
                throw new Error('Failed to update item');
            }
    
            // Handle success
            alert('Item updated successfully');
            const editItemModal = new bootstrap.Modal(document.getElementById('editItemModal'));
            editItemModal.hide();
            // Refresh the items list or update the UI as needed
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

    // Attach event listeners to the edit and delete buttons
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', event => {
            const itemId = event.target.getAttribute('data-id');
            // const item = items.find(i => i.item_id === itemId);
            // const itemId = event.target.getAttribute('data-id');
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


// async function editItem(itemId, data) {
//     try {
//         const response = await fetch(`/api/stock/${itemId}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         console.log('Item updated successfully');
//         loadStockItems();
//         const editItemModal = bootstrap.Modal.getInstance(document.getElementById('editItemModal'));
//         editItemModal.hide();
//     } catch (error) {
//         console.error('Error updating item:', error);
//     }
// }



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
        const editItemModal = bootstrap.Modal.getInstance(document.getElementById('editItemModal'));
        editItemModal.hide();
    } catch (error) {
        console.error('Error adding item:', error);
    }
}

async function editItem(itemId, data) {
    try {
        const response = await fetch(`/api/stock/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
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
    resetForm();
    const editItemModal = new bootstrap.Modal(document.getElementById('editItemModal'));
    editItemModal.show();
}

async function showEditItemForm(itemId) {
    try {
        // const response = await fetch(`http://localhost:3000/api/stock/${itemId}`);
        const response = await fetch(`/api/stock/${itemId}`);
        if (!response.ok) {
            throw new Error('Item not found');
        }
        const item = await response.json();

        // Populate the form with item data
        // document.getElementById('item-id').value = item.item_id;
        // document.getElementById('name').value = item.name;
        // document.getElementById('categoryid').value = item.categoryid;
        // document.getElementById('description').value = item.description;
        // document.getElementById('price').value = item.price;
        // document.getElementById('stock').value = item.stock;
        // document.getElementById('material').value = item.material;
        // document.getElementById('colour').value = item.colour;
        // document.getElementById('image').value = item.image;
        document.getElementById('item-id').value = item.item_id || '';
        document.getElementById('name').value = item.name || '';
        document.getElementById('categoryid').value = item.categoryid || '';
        document.getElementById('description').value = item.description || '';
        document.getElementById('price').value = item.price || '';
        document.getElementById('stock').value = item.stock || '';
        document.getElementById('material').value = item.material || '';
        document.getElementById('colour').value = item.colour || '';
        document.getElementById('image').value = item.image || '';

        // Show the edit form
        // document.getElementById('edit-item-form').style.display = 'block';
        const editItemModal = new bootstrap.Modal(document.getElementById('editItemModal'));
        editItemModal.show();
    } catch (error) {
        console.error('Error fetching item:', error.message);
    }
}

function resetForm() {
    document.getElementById('item-id').value = '';
    document.getElementById('stock-form').reset();
}

// function showEditItemForm(item) {
//     if (!item) {
//         console.error('Item not found');
//         return;
//     }

//     resetForm();
//     document.getElementById('item-id').value = item.item_id;
//     document.getElementById('name').value = item.name;
//     document.getElementById('categoryid').value = item.categoryid;
//     document.getElementById('description').value = item.description;
//     document.getElementById('price').value = item.price;
//     document.getElementById('stock').value = item.stock;
//     document.getElementById('material').value = item.material;
//     document.getElementById('colour').value = item.colour;
//     document.getElementById('image').value = item.image;
    
//     const editItemModal = new bootstrap.Modal(document.getElementById('editItemModal'));
//     editItemModal.show();
// }

// function resetForm() {
//     document.getElementById('item-id').value = '';
//     document.getElementById('stock-form').reset();
// }


// document.addEventListener('DOMContentLoaded', () => {
//     document.querySelectorAll('.edit-btn').forEach(button => {
//         button.addEventListener('click', (event) => {
//             const itemId = event.target.getAttribute('data-id');
//             showEditItemForm(itemId);
//         });
//     });
// });








