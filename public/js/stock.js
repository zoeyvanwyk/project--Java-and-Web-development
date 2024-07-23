// document.addEventListener('DOMContentLoaded', () => {
//     loadStockItems();

//     document.getElementById('add-item-button').addEventListener('click', () => {
//         // Show a form to add a new item
//         showAddItemForm();
//     });
// });

// async function loadStockItems() {
//     try {
//         const response = await fetch('/api/stock');
//         const items = await response.json();
//         displayItems(items);
//     } catch (error) {
//         console.error('Error fetching items:', error);
//     }
// }

// // Assuming you have a function to load stock items and attach event listeners
// // async function loadStockItems() {
// //     const response = await fetch('/api/stock');
// //     const items = await response.json();

// //     const stockItemsContainer = document.getElementById('stock-items');
// //     stockItemsContainer.innerHTML = '';

// //     items.forEach(item => {
// //         const row = document.createElement('tr');
// //         row.innerHTML = `
// //             <td><img src="${item.image}" alt="${item.name}" width="50"></td>
// //             <td>${item.name}</td>
// //             <td>${item.price}</td>
// //             <td>${item.stock}</td>
// //             <td>
// //                 <button class="btn btn-warning btn-sm edit-button" data-id="${item.item_id}">Edit</button>
// //                 <button class="btn btn-danger btn-sm delete-button" data-id="${item.item_id}">Delete</button>
// //             </td>
// //         `;
// //         stockItemsContainer.appendChild(row);
// //     });


// function displayItems(items) {
// const stockItemsContainer = document.getElementById('stock-items');
// stockItemsContainer.innerHTML = '';

// items.forEach(item => {
//     const row = document.createElement('tr');
//     row.innerHTML = `
//         <td><img src="${item.image}" alt="${item.name}" width="50"></td>
//         <td>${item.name}</td>
//         <td>${item.price}</td>
//         <td>${item.stock}</td>
//         <td>
//             <button class="btn btn-warning btn-sm edit-button" data-id="${item.item_id}">Edit</button>
//             <button class="btn btn-danger btn-sm delete-button" data-id="${item.item_id}">Delete</button>
//         </td>
//     `;
//     stockItemsContainer.appendChild(row);
// });

//     // Attach event listeners to the edit buttons
//     document.querySelectorAll('.edit-button').forEach(button => {
//         button.addEventListener('click', async (event) => {
//             const itemId = event.target.dataset.id;
//             const response = await fetch(`/api/stock/${itemId}`);
//             const item = await response.json();

//             document.getElementById('item-id').value = item.item_id;
//             document.getElementById('name').value = item.name;
//             document.getElementById('categoryid').value = item.categoryid;
//             document.getElementById('description').value = item.description;
//             document.getElementById('price').value = item.price;
//             document.getElementById('stock').value = item.stock;
//             document.getElementById('material').value = item.material;
//             document.getElementById('colour').value = item.colour;
//             document.getElementById('image').value = item.image;

//             const editItemModal = new bootstrap.Modal(document.getElementById('editItemModal'));
//             editItemModal.show();
//         });
//     });

//     // Attach event listeners to the delete buttons
//     document.querySelectorAll('.delete-button').forEach(button => {
//         button.addEventListener('click', async (event) => {
//             const itemId = event.target.dataset.id;
//             await deleteItem(itemId);
//         });
//     });

// }

// document.getElementById('stock-form').addEventListener('submit', async (event) => {
//     event.preventDefault();

//     const itemId = document.getElementById('item-id').value;
//     const data = {
//         name: document.getElementById('name').value,
//         categoryid: document.getElementById('categoryid').value,
//         description: document.getElementById('description').value,
//         price: document.getElementById('price').value,
//         stock: document.getElementById('stock').value,
//         material: document.getElementById('material').value,
//         colour: document.getElementById('colour').value,
//         image: document.getElementById('image').value
//     };

//     try {
//         const response = await fetch(`/api/stock/${itemId}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         });

//         if (response.ok) {
//             // Hide the modal
//             const editItemModal = bootstrap.Modal.getInstance(document.getElementById('editItemModal'));
//             editItemModal.hide();
            
//             // Reload the stock items
//             loadStockItems();
//         } else {
//             console.error('Failed to update stock item');
//         }
//     } catch (error) {
//         console.error('Error updating stock item:', error);
//     }
// });

// async function deleteItem(itemId) {
//     try {
//         await fetch(`/api/stock/${itemId}`, { method: 'DELETE' });
//         loadStockItems();
//     } catch (error) {
//         console.error('Error deleting item:', error);
//     }
// }

// //ask chat for help with this
// function showAddItemForm() {
//     // Display a form to add a new item (implementation depends on your preference)
// }


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
//                     <button class="btn btn-secondary btn-sm" onclick="editItem(${item.id})">Edit</button>
//                     <button class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">Delete</button>
//                 </td>
//             </tr>
//         `;
//         stockItems.insertAdjacentHTML('beforeend', itemRow);
//     });
// }

// // function showAddItemForm() {
// //     // Display a form to add a new item (implementation depends on your preference)
// // }

// // async function editItem(itemId) {
// //     // Implement the logic to edit an item
// //     // document.getElementById('stock-form').addEventListener('submit', async (event) => {
// //     //     event.preventDefault();
    
// //     //     const data = {
// //     //         name: document.getElementById('name').value,
// //     //         categoryid: document.getElementById('categoryid').value,
// //     //         description: document.getElementById('description').value,
// //     //         price: document.getElementById('price').value,
// //     //         stock: document.getElementById('stock').value,
// //     //         material: document.getElementById('material').value,
// //     //         colour: document.getElementById('colour').value,
// //     //         image: document.getElementById('image').value
// //     //     };
    
// //     //     try {
// //     //         const response = await fetch('/api/stock', {
// //     //             method: 'POST',
// //     //             headers: {
// //     //                 'Content-Type': 'application/json'
// //     //             },
// //     //             body: JSON.stringify(data)
// //     //         });
    
// //     //         if (response.ok) {
// //     //             // Handle successful addition
// //     //         } else {
// //     //             // Handle error
// //     //         }
// //     //     } catch (error) {
// //     //         console.error('Error adding stock item:', error);
// //     //     }
// //     // });
// //     document.getElementById('stock-form').addEventListener('submit', async (event) => {
// //         event.preventDefault();
    
// //         const itemId = document.getElementById('item-id').value;
// //         const data = {
// //             name: document.getElementById('name').value,
// //             categoryid: document.getElementById('categoryid').value,
// //             description: document.getElementById('description').value,
// //             price: document.getElementById('price').value,
// //             stock: document.getElementById('stock').value,
// //             material: document.getElementById('material').value,
// //             colour: document.getElementById('colour').value,
// //             image: document.getElementById('image').value
// //         };
    
// //         try {
// //             const response = await fetch(`/api/stock/${itemId}`, {
// //                 method: 'PUT',
// //                 headers: {
// //                     'Content-Type': 'application/json'
// //                 },
// //                 body: JSON.stringify(data)
// //             });
    
// //             if (response.ok) {
// //                 // Hide the modal
// //                 const editItemModal = bootstrap.Modal.getInstance(document.getElementById('editItemModal'));
// //                 editItemModal.hide();
                
// //                 // Reload the stock items
// //                 loadStockItems();
// //             } else {
// //                 // Handle error
// //                 console.error('Failed to update stock item');
// //             }
// //         } catch (error) {
// //             console.error('Error updating stock item:', error);
// //         }
// //     });
    
    
// // }

// async function deleteItem(itemId) {
//     try {
//         await fetch(`/api/stock/${itemId}`, { method: 'DELETE' });
//         fetchItems();
//     } catch (error) {
//         console.error('Error deleting item:', error);
//     }
// }

document.addEventListener('DOMContentLoaded', () => {
    loadStockItems();

    document.getElementById('add-item-button').addEventListener('click', () => {
        showAddItemForm();
    });

    document.getElementById('stock-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Form submitted');

        const itemId = document.getElementById('item-id').value;
        const data = {

            // name: document.getElementById('name').value,
            // categoryid: document.getElementById('categoryid').value,
            // description: document.getElementById('description').value,
            // price: document.getElementById('price').value,
            // stock: document.getElementById('stock').value,
            // material: document.getElementById('material').value,
            // colour: document.getElementById('colour').value,
            // image: document.getElementById('image').value
            name: document.getElementById('name').value,
            categoryid: Number(document.getElementById('categoryid').value), // Ensure this is a number
            description: document.getElementById('description').value,
            price: Number(document.getElementById('price').value), // Ensure this is a number
            stock: Number(document.getElementById('stock').value), // Ensure this is a number
            material: document.getElementById('material').value,
            colour: document.getElementById('colour').value,
            image: document.getElementById('image').value
        };

        console.log('Form data:', data);

        if (itemId) {
            // Edit item
            console.log('Editing item:', itemId);
            await editItem(itemId, data);
        } else {
            // Add item
            console.log('Adding new item');
            await addItem(data);
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
        button.addEventListener('click', async (event) => {
            const itemId = event.target.dataset.id;
            const response = await fetch(`/api/stock/${itemId}`);
            const item = await response.json();

            document.getElementById('item-id').value = item.item_id;
            document.getElementById('name').value = item.name;
            document.getElementById('categoryid').value = item.categoryid;
            document.getElementById('description').value = item.description;
            document.getElementById('price').value = item.price;
            document.getElementById('stock').value = item.stock;
            document.getElementById('material').value = item.material;
            document.getElementById('colour').value = item.colour;
            document.getElementById('image').value = item.image;

            const editItemModal = new bootstrap.Modal(document.getElementById('editItemModal'));
            editItemModal.show();
        });
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', async (event) => {
            const itemId = event.target.dataset.id;
            await deleteItem(itemId);
        });
    });
}

async function editItem(id, data) {
    try {
        const response = await fetch(`/api/stock/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            console.log('Item updated successfully');
            loadStockItems();
            const editItemModal = bootstrap.Modal.getInstance(document.getElementById('editItemModal'));
            editItemModal.hide();
        } else {
            console.error('Failed to update item');
        }
    } catch (error) {
        console.error('Error updating item:', error);
    }
}

async function deleteItem(id) {
    try {
        const response = await fetch(`/api/stock/${id}`, { method: 'DELETE' });
        if (response.ok) {
            console.log('Item deleted successfully');
            loadStockItems();
        } else {
            console.error('Failed to delete item');
        }
    } catch (error) {
        console.error('Error deleting item:', error);
    }
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
        if (response.ok) {
            console.log('Item added successfully');
            loadStockItems();
            const editItemModal = bootstrap.Modal.getInstance(document.getElementById('editItemModal'));
            editItemModal.hide();
        } else {
            console.error('Failed to add item');
        }
    } catch (error) {
        console.error('Error adding item:', error);
    }
}

function showAddItemForm() {
    document.getElementById('item-id').value = '';
    document.getElementById('name').value = '';
    document.getElementById('categoryid').value = '';
    document.getElementById('description').value = '';
    document.getElementById('price').value = '';
    document.getElementById('stock').value = '';
    document.getElementById('material').value = '';
    document.getElementById('colour').value = '';
    document.getElementById('image').value = '';

    const editItemModal = new bootstrap.Modal(document.getElementById('editItemModal'));
    editItemModal.show();
}
