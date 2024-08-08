// var cardDrop = document.getElementById('card-dropdown');
// var activeDropdown;
// cardDrop.addEventListener('click',function(){
//   var node;
//   for (var i = 0; i < this.childNodes.length-1; i++)
//     node = this.childNodes[i];
//     if (node.className === 'dropdown-select') {
//       node.classList.add('visible');
//        activeDropdown = node; 
//     };
// })

// window.onclick = function(e) {
//   console.log(e.target.tagName)
//   console.log('dropdown');
//   console.log(activeDropdown)
//   if (e.target.tagName === 'LI' && activeDropdown){
//     // master card section
//     if (e.target.innerHTML === 'Master Card') {
//       document.getElementById('credit-card-image').src = 'https://dl.dropboxusercontent.com/s/2vbqk5lcpi7hjoc/MasterCard_Logo.svg.png';
//           activeDropdown.classList.remove('visible');
//       activeDropdown = null;
//       e.target.innerHTML = document.getElementById('current-card').innerHTML;
//       document.getElementById('current-card').innerHTML = 'Master Card';
//     }
//     // google pay card section
//     else if (e.target.innerHTML === 'Google Pay') {
//          document.getElementById('credit-card-image').src = 'https://catalystpay.com/service/image?NGgyYTZwVDJkYjZQak9ycTh6UEJJbGtnMDRCKyswSGxLN2xZQ2pOazRNaHBnNlZtV0JUU1NIcEhEMjV3djVsVg__';
//           activeDropdown.classList.remove('visible');
//       activeDropdown = null;
//       e.target.innerHTML = document.getElementById('current-card').innerHTML;
//       document.getElementById('current-card').innerHTML = 'Google Pay';      
//     }
//     // visa card section
//     else if (e.target.innerHTML === 'Visa') {
//          document.getElementById('credit-card-image').src = 'https://dl.dropboxusercontent.com/s/ubamyu6mzov5c80/visa_logo%20%281%29.png';
//           activeDropdown.classList.remove('visible');
//       activeDropdown = null;
//       e.target.innerHTML = document.getElementById('current-card').innerHTML;
//       document.getElementById('current-card').innerHTML = 'Visa';
//     }
//   }
//   else if (e.target.className !== 'dropdown-btn' && activeDropdown) {
//     activeDropdown.classList.remove('visible');
//     activeDropdown = null;
//   }
// }

document.addEventListener("DOMContentLoaded", async function() {
  // Function to fetch cart items
  async function fetchCartItems() {
      try {
          const response = await fetch('http://localhost:3000/api/stock');
          if (response.ok) {
              const items = await response.json();
              return items;
          } else {
              console.error('Failed to fetch cart items');
              return [];
          }
      } catch (error) {
          console.error('Error fetching cart items:', error);
          return [];
      }
  }

  // Function to create a cart item template
  function createCartItemTemplate(item) {
      return `
          <table class='order-table'>
              <tbody>
                  <tr>
                      <td><img src='${item.image}' class='full-width'></td>
                      <td>
                          <br> <span class='thin'>${item.name}</span>
                          <br>${item.description}<br> 
                          <span class='thin small'>Color: ${item.colour}, Material: ${item.material}</span>
                      </td>
                  </tr>
                  <tr>
                      <td>
                          <div class='price'>R${item.price}</div>
                      </td>
                  </tr>
              </tbody>
          </table>
      `;
  }

  // Function to display cart items
  async function displayCartItems() {
      const cartItems = await fetchCartItems();
      const orderSummaryContainer = document.getElementById('order-summary-container');

      let totalCost = 0;
      orderSummaryContainer.innerHTML = cartItems.map(item => {
          totalCost += item.price;
          return createCartItemTemplate(item);
      }).join('');

      document.getElementById('order-total').textContent = `R${totalCost}.00`;
      document.getElementById('delivery-cost').textContent = `R0.00`; // Update delivery cost if needed
  }

  displayCartItems();
});


var cardDrop = document.getElementById('card-dropdown');
var activeDropdown;
cardDrop.addEventListener('click',function(){
var node;
for (var i = 0; i < this.childNodes.length-1; i++)
  node = this.childNodes[i];
  if (node.className === 'dropdown-select') {
    node.classList.add('visible');
     activeDropdown = node; 
  };
})

window.onclick = function(e) {
if (e.target.tagName === 'LI' && activeDropdown){
  if (e.target.innerHTML === 'Master Card') {
    document.getElementById('credit-card-image').src = 'https://dl.dropboxusercontent.com/s/2vbqk5lcpi7hjoc/MasterCard_Logo.svg.png';
    activeDropdown.classList.remove('visible');
    activeDropdown = null;
    e.target.innerHTML = document.getElementById('current-card').innerHTML;
    document.getElementById('current-card').innerHTML = 'Master Card';
  } else if (e.target.innerHTML === 'Google Pay') {
    document.getElementById('credit-card-image').src = 'https://catalystpay.com/service/image?NGgyYTZwVDJkYjZQak9ycTh6UEJJbGtnMDRCKyswSGxLN2xZQ2pOazRNaHBnNlZtV0JUU1NIcEhEMjV3djVsVg__';
    activeDropdown.classList.remove('visible');
    activeDropdown = null;
    e.target.innerHTML = document.getElementById('current-card').innerHTML;
    document.getElementById('current-card').innerHTML = 'Google Pay';      
  } else if (e.target.innerHTML === 'Visa') {
    document.getElementById('credit-card-image').src = 'https://dl.dropboxusercontent.com/s/ubamyu6mzov5c80/visa_logo%20%281%29.png';
    activeDropdown.classList.remove('visible');
    activeDropdown = null;
    e.target.innerHTML = document.getElementById('current-card').innerHTML;
    document.getElementById('current-card').innerHTML = 'Visa';
  }
} else if (e.target.className !== 'dropdown-btn' && activeDropdown) {
  activeDropdown.classList.remove('visible');
  activeDropdown = null;
}
}

