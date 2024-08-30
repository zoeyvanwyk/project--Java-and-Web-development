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

    // document.getElementById('edit-item-form').addEventListener('submit', async (event) => {
    //     event.preventDefault();
    //     const itemId = document.getElementById('edit-item-id').value ;
    //     // $('#editItemModal').modal('show');
    //     const data = {
    //         name: document.getElementById('edit-name').value,
    //         categoryid: Number(document.getElementById('edit-categoryid').value),
    //         description: document.getElementById('edit-description').value,
    //         price: Number(document.getElementById('edit-price').value),
    //         stock: Number(document.getElementById('edit-stock').value),
    //         material: document.getElementById('edit-material').value,
    //         colour: document.getElementById('edit-colour').value,
    //         image: document.getElementById('edit-image').value
    //     };
    //     await editItem(itemId, data);
    // });
    // document.getElementById('edit-item-form').addEventListener('submit', async (event) => {
    //     event.preventDefault();
    //     const itemId = document.getElementById('edit-item-id').value;
    //     const data = {
    //         name: document.getElementById('edit-name').value,
    //         categoryid: Number(document.getElementById('edit-categoryid').value),
    //         description: document.getElementById('edit-description').value,
    //         price: Number(document.getElementById('edit-price').value),
    //         stock: Number(document.getElementById('edit-stock').value),
    //         material: document.getElementById('edit-material').value,
    //         colour: document.getElementById('edit-colour').value,
    //         image: document.getElementById('edit-image').value
    //     };
    //     console.log('Editing item:', itemId);
    //     console.log('Data:', data);
    //     await editItem(itemId, data);
    // });
    // document.getElementById('edit-item-form').addEventListener('submit', async (event) => {
    //     event.preventDefault();
    //     const itemId = document.getElementById('edit-item-id').value; // Correctly get the itemId
    //     const data = {
    //         name: document.getElementById('edit-name').value,
    //         categoryid: Number(document.getElementById('edit-categoryid').value),
    //         description: document.getElementById('edit-description').value,
    //         price: Number(document.getElementById('edit-price').value),
    //         stock: Number(document.getElementById('edit-stock').value),
    //         material: document.getElementById('edit-material').value,
    //         colour: document.getElementById('edit-colour').value,
    //         image: document.getElementById('edit-image').value
    //     };
    
    //     console.log('Editing item:', itemId); // Debugging line
    //     console.log('Data:', data); // Debugging line
    
    //     if (itemId) {
    //         await editItem(itemId, data);
    //     } else {
    //         console.error('Item ID is missing');
    //     }
    // });

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
    
        console.log('Editing item:', itemId); // Debugging line
        console.log('Data:', data); // Debugging line
    
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

// function displayItems(items) {
//     const stockItems = document.getElementById('stock-items');
//     stockItems.innerHTML = '';
//     items.forEach(item => {
//         const itemRow = `
//             <tr>
//                 <td><img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px;"></td>
//                 <td>${item.name}</td>
//                 <td>${item.price}</td>
//                 <td>${item.stock}</td>
//                 <td>
//                     <button class="btn btn-secondary btn-sm edit-button" data-id="${item.item_id}">Edit</button>
//                     <button class="btn btn-danger btn-sm delete-button" data-id="${item.item_id}">Delete</button>
                    
//                 </td>
//             </tr>
//         `;
//         stockItems.insertAdjacentHTML('beforeend', itemRow);
//     });
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

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', event => {
            const itemId = event.target.getAttribute('data-id');
            showEditItemForm(itemId);
        });
    });


    // // Attach event listeners to the edit and delete buttons
    // document.querySelectorAll('.edit-button').forEach(button => {
    //     button.addEventListener('click', event => {
    //         const itemId = event.target.getAttribute('data-id');
    //         // const item = items.find(i => i.item_id === itemId);
    //         // const itemId = event.target.getAttribute('data-id');
    //         showEditItemForm(itemId);
    //     });
    // });

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


// Example function to show the edit form and populate it
async function showEditItemForm(itemId) {
    try {
        const response = await fetch(`/api/stock/${itemId}`);
        const item = await response.json();

        if (!itemId || itemId === 'undefined') {
            console.error('Item ID is missing or incorrect');
            return;
        }

        document.getElementById('edit-item-id').value = item.item_id; // Make sure this ID is set correctly
        document.getElementById('edit-name').value = item.name;
        document.getElementById('edit-categoryid').value = item.categoryid;
        document.getElementById('edit-description').value = item.description;
        document.getElementById('edit-price').value = item.price;
        document.getElementById('edit-stock').value = item.stock;
        document.getElementById('edit-material').value = item.material;
        document.getElementById('edit-colour').value = item.colour;
        document.getElementById('edit-image').value = item.image;

        const editItemModal = new bootstrap.Modal(document.getElementById('editItemModal'));
        editItemModal.show();
    } catch (error) {
        console.error('Error fetching item details:', error);
    }
}

document.getElementById('edit-item-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const itemId = document.getElementById('edit-item-id').value;

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


function resetForm(formId) {
    // document.getElementById('item-id').value = item.id;
    // document.getElementById('stock-form').reset();
    document.getElementById(formId).reset();
}

