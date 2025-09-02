// State
let cart = [];
const cartCountEl = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('pageOverlay');

// Toggle cart
function toggleCart(open) {
  const willOpen = typeof open === 'boolean' ? open : !cartDrawer.classList.contains('open');
  
  if (willOpen) {
    cartDrawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  } else {
    cartDrawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = 'auto';
  }
}

// Add to cart
function addToCart(name, price, img, btn) {
  cart.push({ name, price: Number(price), img });
  renderCart();
  
  // Button animation
  if (btn) {
    btn.classList.add('bursting');
    setTimeout(() => btn.classList.remove('bursting'), 380);
  }
  
  // Cart badge animation
  if (cartCountEl) {
    cartCountEl.classList.add('bump');
    setTimeout(() => cartCountEl.classList.remove('bump'), 380);
  }
  
  // Open cart drawer
  toggleCart(true);
}

// Remove item from cart
function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

// Render cart items
function renderCart() {
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  
  if (!cartItemsEl || !cartTotalEl) return;
  
  cartItemsEl.innerHTML = '';
  let total = 0;
  
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<p class="text-center text-muted">Your cart is empty</p>';
  } else {
    cart.forEach((item, index) => {
      total += item.price;
      cartItemsEl.innerHTML += `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.name}" class="me-3">
          <div class="flex-grow-1">
            <h6 class="mb-0">${item.name}</h6>
            <p class="mb-0 text-muted">Rs. ${item.price}</p>
          </div>
          <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${index})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
    });
  }
  
  cartTotalEl.textContent = total;
  if (cartCountEl) cartCountEl.textContent = cart.length;
}

// Checkout
function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty. Add some items first!');
    return;
  }
  
  alert(`Checkout successful! Total: Rs. ${document.getElementById('cartTotal').textContent}`);
  cart = [];
  renderCart();
  toggleCart(false);
}

// Filtering functionality
function setupFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productWraps = document.querySelectorAll('.card-wrap');
  const sortSelect = document.getElementById('sort');

  // Filter buttons
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        filterProducts(filter, productWraps);
      });
    });
  }

  // Sort select
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const sortValue = sortSelect.value;
      sortProducts(sortValue, productWraps);
    });
  }
}

// Filter products
function filterProducts(filter, productWraps) {
  productWraps.forEach(product => {
    const category = product.dataset.category;
    const material = product.dataset.material;
    
    if (filter === 'all' || category === filter || material === filter) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}

// Sort products
function sortProducts(sortValue, productWraps) {
  const productsArray = Array.from(productWraps);
  const productGrid = document.querySelector('.card-container');
  
  if (!productGrid) return;
  
  productsArray.sort((a, b) => {
    const aPrice = Number(a.dataset.price);
    const bPrice = Number(b.dataset.price);
    const aName = a.dataset.name;
    const bName = b.dataset.name;
    
    switch(sortValue) {
      case 'name':
        return aName.localeCompare(bName);
      case 'low':
        return aPrice - bPrice;
      case 'high':
        return bPrice - aPrice;
      default:
        return 0;
    }
  });
  
  // Clear and re-append sorted products
  productGrid.innerHTML = '';
  productsArray.forEach(product => {
    productGrid.appendChild(product);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  setupFilters();
});