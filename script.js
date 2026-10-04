/* MAXIMIZE — storefront interactions (vanilla JS) */

// ---------- Data ----------
const products = [
  { name: 'NovaPods Air', price: 15, image: 'assets/earbuds-case.png' },
  { name: 'NovaSound Pro', price: 25, image: 'assets/silver-headphones.png' },
  { name: 'AuraPods Lite', price: 20, image: 'assets/lifestyle-headphones.jpg' },
];

const showcase = [
  { src: 'assets/silver-headphones.png', alt: 'Silver and black wireless headphones' },
  { src: 'assets/hero-headphones.png', alt: 'Black wireless headphones' },
  { src: 'assets/earbuds-case.png', alt: 'Wireless earbuds' },
];

// ---------- Helpers ----------
const $ = (id) => document.getElementById(id);
const money = (n) => '$' + n.toFixed(2);

// ---------- Mobile menu ----------
const menuToggle = $('menu-toggle');
const mobilePanel = $('mobile-panel');
menuToggle.addEventListener('click', () => {
  const open = mobilePanel.hidden;
  mobilePanel.hidden = !open;
  menuToggle.querySelector('.icon-menu').hidden = open;
  menuToggle.querySelector('.icon-close').hidden = !open;
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
mobilePanel.addEventListener('click', () => {
  mobilePanel.hidden = true;
  menuToggle.querySelector('.icon-menu').hidden = false;
  menuToggle.querySelector('.icon-close').hidden = true;
});

// ---------- Search ----------
const searchPanel = $('search-panel');
const searchInput = $('search-input');
const searchResults = $('search-results');

function renderSearch() {
  const q = searchInput.value.trim().toLowerCase();
  const matches = products.filter((p) => p.name.toLowerCase().includes(q));
  searchResults.innerHTML = matches.length
    ? matches.map((p) => `<a href="#collection">${p.name} — ${money(p.price)}</a>`).join('')
    : '<p>No products found.</p>';
}

$('search-toggle').addEventListener('click', () => {
  searchPanel.hidden = !searchPanel.hidden;
  if (!searchPanel.hidden) {
    renderSearch();
    searchInput.focus();
  }
});
searchInput.addEventListener('input', renderSearch);
searchResults.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') searchPanel.hidden = true;
});

// ---------- User icon -> scroll to about ----------
$('about-link').addEventListener('click', () => {
  document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
});

// ---------- Showcase carousel ----------
let showcaseIndex = 0;
const showcaseImage = $('showcase-image');
const showcaseCounter = $('showcase-counter');

function renderShowcase() {
  showcaseImage.src = showcase[showcaseIndex].src;
  showcaseImage.alt = showcase[showcaseIndex].alt;
  showcaseCounter.textContent = '0' + (showcaseIndex + 1) + ' / 03';
}
$('showcase-prev').addEventListener('click', () => {
  showcaseIndex = (showcaseIndex + showcase.length - 1) % showcase.length;
  renderShowcase();
});
$('showcase-next').addEventListener('click', () => {
  showcaseIndex = (showcaseIndex + 1) % showcase.length;
  renderShowcase();
});

// ---------- Color swatches ----------
document.querySelectorAll('.swatches').forEach((group) => {
  group.addEventListener('click', (e) => {
    const swatch = e.target.closest('.swatch');
    if (!swatch) return;
    group.querySelectorAll('.swatch').forEach((s) => s.classList.remove('active'));
    swatch.classList.add('active');
  });
});

// ---------- Cart ----------
const cart = [];
const cartDrawer = $('cart-drawer');
const cartBackdrop = $('cart-backdrop');
const cartItems = $('cart-items');
const cartCount = $('cart-count');

function renderCart() {
  cartCount.hidden = cart.length === 0;
  cartCount.textContent = cart.length;
  $('cart-title-count').textContent = cart.length;
  cartItems.innerHTML = cart.length
    ? cart.map((p, i) => `
      <div class="cart-item">
        <img src="${p.image}" alt="" width="1024" height="1024" />
        <div>
          <h3>${p.name}</h3>
          <p>${money(p.price)}</p>
          <button class="remove" data-index="${i}">Remove</button>
        </div>
      </div>`).join('')
    : '<p class="cart-empty">Your bag is empty.</p>';
  const subtotal = cart.reduce((sum, p) => sum + p.price, 0);
  $('cart-subtotal').textContent = money(subtotal);
}

function openCart() {
  renderCart();
  cartDrawer.hidden = false;
  cartBackdrop.hidden = false;
}
function closeCart() {
  cartDrawer.hidden = true;
  cartBackdrop.hidden = true;
}

$('cart-open').addEventListener('click', openCart);
$('cart-close').addEventListener('click', closeCart);
$('cart-continue').addEventListener('click', closeCart);
cartBackdrop.addEventListener('click', closeCart);

cartItems.addEventListener('click', (e) => {
  const btn = e.target.closest('.remove');
  if (!btn) return;
  cart.splice(Number(btn.dataset.index), 1);
  renderCart();
});

document.querySelectorAll('.product-card').forEach((card) => {
  card.querySelector('.product-add').addEventListener('click', () => {
    const product = products.find((p) => p.name === card.dataset.name);
    if (product) cart.push(product);
    openCart();
  });
});

// ---------- Newsletter ----------
$('newsletter-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if ($('newsletter-email').value.trim()) {
    $('form-message').hidden = false;
  }
});
