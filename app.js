const products = [
  { id: 1, name: 'Studio wireless headphones', category: 'Electronics', price: 48.99, oldPrice: 69.99, rating: '4.8', reviews: '2,419', badge: '−30%', image: 'photo-1505740420928-5e560c06d30e' },
  { id: 2, name: 'Minimal ceramic table lamp', category: 'Home', price: 32.50, oldPrice: 44.00, rating: '4.7', reviews: '864', badge: 'TOP PICK', image: 'photo-1507473885765-e6ed057f782c' },
  { id: 3, name: 'Everyday carry canvas tote', category: 'Style', price: 19.95, oldPrice: 26.00, rating: '4.6', reviews: '1,203', badge: '−23%', image: 'photo-1590874103328-eac38a683ce7' },
  { id: 4, name: 'Insulated trail bottle · 24 oz', category: 'Outdoors', price: 24.00, oldPrice: 32.00, rating: '4.9', reviews: '3,087', badge: 'BESTSELLER', image: 'photo-1602143407151-7111542de6e8' },
  { id: 5, name: 'Compact bluetooth speaker', category: 'Electronics', price: 39.99, oldPrice: 54.99, rating: '4.7', reviews: '1,764', badge: '−27%', image: 'photo-1608043152269-423dbba4e7e1' },
  { id: 6, name: 'Soft knit throw blanket', category: 'Home', price: 28.00, oldPrice: 36.00, rating: '4.8', reviews: '976', badge: '−22%', image: 'photo-1600210492486-724fe5c67fb0' },
  { id: 7, name: 'Classic square sunglasses', category: 'Style', price: 21.50, oldPrice: 29.00, rating: '4.5', reviews: '642', badge: 'JUST IN', image: 'photo-1511499767150-a48a237f0083' },
  { id: 8, name: 'Packable day hike backpack', category: 'Outdoors', price: 42.00, oldPrice: 58.00, rating: '4.8', reviews: '1,105', badge: '−28%', image: 'photo-1553062407-98eeb64c6a62' },
];

const grid = document.querySelector('#product-grid');
const searchInput = document.querySelector('#search-input');
const categorySelect = document.querySelector('#category-select');
const resultsCount = document.querySelector('.results-count');
const emptyState = document.querySelector('.empty-state');
const toast = document.querySelector('.toast');
const cart = new Map();
let activeCategory = 'all';
let toastTimer;

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedCategory = categorySelect.value === 'all' ? activeCategory : categorySelect.value;
  const filtered = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = `${product.name} ${product.category}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  grid.innerHTML = filtered.map((product) => `
    <article class="product-card">
      <div class="product-image-wrap"><img src="https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=600&q=80" alt="${product.name}" loading="lazy" /><span class="product-badge">${product.badge}</span></div>
      <div class="product-info"><span class="product-category">${product.category}</span><h3>${product.name}</h3>
        <div class="rating" aria-label="Rated ${product.rating} out of 5">★★★★★ <span>${product.rating} (${product.reviews})</span></div>
        <div class="price-row"><span class="price">$${product.price.toFixed(2)}</span><span class="old-price">$${product.oldPrice.toFixed(2)}</span></div>
        <button class="add-button" data-add="${product.id}"><i data-lucide="plus"></i> Add to cart</button>
      </div>
    </article>`).join('');
  resultsCount.textContent = `${filtered.length} finds`;
  emptyState.hidden = filtered.length !== 0;
  grid.hidden = filtered.length === 0;
  window.lucide?.createIcons();
}

function updateCart() {
  const quantity = [...cart.values()].reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector('.cart-count').textContent = quantity;
  document.querySelector('.drawer-count').textContent = `(${quantity})`;
  const cartItems = document.querySelector('.cart-items');
  const entries = [...cart.values()];
  document.querySelector('.cart-empty').hidden = entries.length > 0;
  document.querySelector('.cart-footer').hidden = entries.length === 0;
  cartItems.innerHTML = entries.map(({ product, quantity: count }) => `
    <div class="cart-item"><img src="https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=160&q=70" alt="" />
      <div><strong>${product.name}</strong><small>$${product.price.toFixed(2)} each</small>
        <div class="quantity"><button data-quantity="${product.id}" data-change="-1" aria-label="Remove one">−</button><span>${count}</span><button data-quantity="${product.id}" data-change="1" aria-label="Add one">+</button></div>
      </div><span class="cart-item-price">$${(product.price * count).toFixed(2)}</span></div>`).join('');
  const subtotal = entries.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  document.querySelector('.subtotal strong').textContent = `$${subtotal.toFixed(2)}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2100);
}

function setCategory(category) {
  activeCategory = category;
  categorySelect.value = 'all';
  document.querySelectorAll('.category-chip').forEach((chip) => chip.classList.toggle('active', chip.dataset.category === category));
  renderProducts();
}

const heroSlides = [
  { eyebrow: 'THE EVERYDAY EDIT', title: 'Little upgrades.<br />Big everyday energy.', description: 'Fresh finds for your desk, your downtime, and everywhere in between.', image: 'photo-1498049794561-7780e7231661' },
  { eyebrow: 'SOUND, YOUR WAY', title: 'Make room for<br />a little more music.', description: 'Headphones and speakers for wherever the day takes you.', image: 'photo-1505740420928-5e560c06d30e' },
  { eyebrow: 'OUT OF OFFICE', title: 'Take the scenic<br />route this weekend.', description: 'Easygoing essentials for fresh air and new favorite places.', image: 'photo-1470770841072-f978cf4d019e' },
];
let activeSlide = 0;

function changeSlide(direction) {
  activeSlide = (activeSlide + direction + heroSlides.length) % heroSlides.length;
  const slide = heroSlides[activeSlide];
  const image = document.querySelector('.hero-image');
  image.src = `https://images.unsplash.com/${slide.image}?auto=format&fit=crop&w=2000&q=85`;
  document.querySelector('.hero-copy .eyebrow').textContent = slide.eyebrow;
  document.querySelector('.hero-copy h1').innerHTML = slide.title;
  document.querySelector('.hero-copy p').textContent = slide.description;
  document.querySelector('.slide-indicator').innerHTML = `<b>${String(activeSlide + 1).padStart(2, '0')}</b> / ${String(heroSlides.length).padStart(2, '0')}`;
}

document.querySelector('.search').addEventListener('submit', (event) => {
  event.preventDefault();
  renderProducts();
  document.querySelector('#products').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
searchInput.addEventListener('input', renderProducts);
categorySelect.addEventListener('change', renderProducts);
document.querySelectorAll('.category-chip').forEach((chip) => chip.addEventListener('click', () => setCategory(chip.dataset.category)));
grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  const product = products.find((item) => item.id === Number(button.dataset.add));
  const existing = cart.get(product.id);
  cart.set(product.id, { product, quantity: (existing?.quantity || 0) + 1 });
  updateCart();
  showToast(`${product.name} added to your cart`);
});
document.querySelector('.cart-items').addEventListener('click', (event) => {
  const button = event.target.closest('[data-quantity]');
  if (!button) return;
  const id = Number(button.dataset.quantity);
  const entry = cart.get(id);
  entry.quantity += Number(button.dataset.change);
  if (entry.quantity <= 0) cart.delete(id);
  updateCart();
});
const drawer = document.querySelector('.cart-drawer');
const scrim = document.querySelector('.scrim');
function toggleCart(open) {
  drawer.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  scrim.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
}
document.querySelector('.cart-button').addEventListener('click', () => toggleCart(true));
document.querySelector('.close-cart').addEventListener('click', () => toggleCart(false));
scrim.addEventListener('click', () => toggleCart(false));
document.querySelector('.checkout-button').addEventListener('click', () => showToast('Checkout is ready for your next step.'));
document.querySelector('.newsletter-form').addEventListener('submit', (event) => {
  event.preventDefault();
  showToast('You’re on the list. See you in your inbox!');
  event.currentTarget.reset();
});
document.querySelector('.location-button').addEventListener('click', () => showToast('Delivery location: Seattle, WA 98101'));
document.querySelector('.hero-next').addEventListener('click', () => changeSlide(1));
document.querySelector('.hero-prev').addEventListener('click', () => changeSlide(-1));
document.querySelector('.product-next').addEventListener('click', () => document.querySelector('.product-grid').scrollIntoView({ behavior: 'smooth', block: 'center' }));
document.querySelector('.product-prev').addEventListener('click', () => document.querySelector('.category-section').scrollIntoView({ behavior: 'smooth' }));
window.lucide?.createIcons();
renderProducts();