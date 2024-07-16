document.addEventListener("DOMContentLoaded", function() {
    const products = [
        // Your product data here, possibly fetched from a database or JSON file
        { id: 1, name: "Product 1", category: "Category 1", description: "Description 1", price: 10.0, image: "image1.jpg" },
        // Add more products
    ];

    const productContainer = document.getElementById("product-container");

    function loadProducts(category) {
        productContainer.innerHTML = ""; // Clear existing products

        const filteredProducts = products.filter(product => product.category === category);

        filteredProducts.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("col-md-4");
            productCard.innerHTML = `
                <div class="card">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text">$${product.price}</p>
                    </div>
                </div>
            `;
            productContainer.appendChild(productCard);
        });
    }

    // Example usage: Load products for "Category 1"
    loadProducts("Category 1");

    // You can add event listeners to load different categories based on user interaction
});
