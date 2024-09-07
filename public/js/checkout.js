document.addEventListener("DOMContentLoaded", async function() {
    // Function to fetch cart items from cookies
    function getCartItemsFromCookies() {
        const cartCookie = document.cookie.split('; ').find(row => row.startsWith('cart='));
        return cartCookie ? JSON.parse(decodeURIComponent(cartCookie.split('=')[1])) : [];
    }

    // Function to update cart cookie
    function updateCartCookie(cartItems) {
        document.cookie = `cart=${encodeURIComponent(JSON.stringify(cartItems))}; path=/`;
    }

    // Function to clear the cart cookie
    function clearCartCookie() {
        document.cookie = "cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    }

    // Function to create a cart item template
    function createCartItemTemplate(item, index) {
        return `
            <table class='order-table checkout-item'>
                <tbody>
                    <tr>
                        <td><img src='${item.image}' class='full-width'></td>
                        <td>
                            <br> <span class='thin'>${item.name}</span>
                        </td>
                        <td>
                            <input type='number' value='${item.quantity}' min='1' class='quantity-input' data-index='${index}'>
                        </td>
                        <td>
                            <div class='price'>R${item.price * item.quantity}</div>
                        </td>
                        <td>
                            <button class='delete-btn' data-index='${index}'>Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
    }

    // Function to display cart items
    async function displayCartItems() {
        const cartItems = getCartItemsFromCookies();
        const orderSummaryContainer = document.getElementById('order-summary-container');

        let totalCost = 0;
        orderSummaryContainer.innerHTML = cartItems.map((item, index) => {
            if (isNaN(item.quantity) || item.quantity <= 0) {
                item.quantity = 1;
            }
            totalCost += item.price * item.quantity;
            return createCartItemTemplate(item, index);
        }).join('');

        const shippingCost = totalCost * 0.10;
        document.getElementById('order-total').textContent = `Total: R${totalCost}.00`;
        document.getElementById('delivery-cost').textContent = `Delivery: R${shippingCost.toFixed(2)}`; 
    }

    displayCartItems();

    // Handle quantity change
    document.getElementById('order-summary-container').addEventListener('input', async function(event) {
        if (event.target.classList.contains('quantity-input')) {
            const cartItems = getCartItemsFromCookies();
            const index = event.target.getAttribute('data-index');
            const newQuantity = parseInt(event.target.value) || 1;
            cartItems[index].quantity = newQuantity;
            updateCartCookie(cartItems);
            await displayCartItems();
        }
    });

    // Handle delete button click
    document.getElementById('order-summary-container').addEventListener('click', async function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const cartItems = getCartItemsFromCookies();
            const index = event.target.getAttribute('data-index');
            cartItems.splice(index, 1);
            updateCartCookie(cartItems);
            await displayCartItems();
        }
    });

    // Handle purchase button click
    document.getElementById('purchase-button').addEventListener('click', async function() {
        const cartItems = getCartItemsFromCookies();

        // Decrease stock on the server
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cartItems })
        });

        if (response.ok) {
            // Show confirmation popup
            alert('Order placed successfully!');
            // Clear cart
            clearCartCookie();
            await displayCartItems();
        } else {
            alert('Failed to place the order. Please try again.');
        }
    });
});
