/**
 * BambangShop Catalog Client-Side JavaScript Template (Milestone 4)
 * Focus: Implement AJAX (Fetch API) communication with Django REST Framework backend.
 */

const BASE_PRODUCTS_ENDPOINT = "/api/v1/products/";
const BASE_CATEGORIES_ENDPOINT = "/api/v1/categories/";

let productsAbortController;
let searchDebounceTimer;

// =============================================================================
// Provided UI Helper Utilities
// =============================================================================

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

function displayPageSection({ showLoading = false, showError = false, showEmpty = false, showGrid = false }) {
    const loadingState = document.getElementById('loading');
    const errorState = document.getElementById('error');
    const emptyState = document.getElementById('empty');
    const gridContainer = document.getElementById('grid');

    if (loadingState) loadingState.classList.toggle('hide', !showLoading);
    if (errorState) errorState.classList.toggle('hide', !showError);
    if (emptyState) emptyState.classList.toggle('hide', !showEmpty);
    if (gridContainer) gridContainer.classList.toggle('hide', !showGrid);
}

function buildProductCardElement(product) {
    const card = document.createElement('article');
    card.className = 'product-card';

    const formattedPrice = Number(product.price).toFixed(2);
    const stockStatusClass = product.stock > 0 ? 'in-stock' : 'out-of-stock';
    const stockStatusText = product.stock > 0 ? `${product.stock} units available` : 'Out of stock';

    card.innerHTML = `
        <div>
            <div class="product-header">
                <h2 class="product-title">${escapeHtml(product.name)}</h2>
                <span class="badge badge-category">${escapeHtml(product.category_name || 'General')}</span>
            </div>
            <span class="badge badge-sku">SKU: ${escapeHtml(product.sku)}</span>
            <div class="product-details">
                <div class="product-price">$${escapeHtml(formattedPrice)}</div>
                <div class="product-stock ${stockStatusClass}">${escapeHtml(stockStatusText)}</div>
                <div class="product-meta">Owner: ${escapeHtml(product.owner || 'System')}</div>
            </div>
        </div>
        <div class="product-actions">
            <button type="button" class="button button-sm button-restock" data-action="restock" data-id="${escapeHtml(product.id)}">
                + Restock (5)
            </button>
            <button type="button" class="button button-sm button-danger" data-action="delete" data-id="${escapeHtml(product.id)}">
                Delete
            </button>
        </div>
    `;
    return card;
}

function apiErrorMessage(data, status) {
    if (!data || typeof data !== 'object') {
        return `Request failed with HTTP ${status}.`;
    }
    if (data.detail) {
        return data.detail;
    }
    const messages = Object.entries(data)
        .map(([field, err]) => `${field}: ${Array.isArray(err) ? err.join(' ') : err}`);
    return messages.join(' | ') || `Request failed with HTTP ${status}.`;
}

function renderCategoryList(categories) {
    const categoryListContainer = document.getElementById('category-list');
    if (!categoryListContainer) return;
    categoryListContainer.innerHTML = '';
    if (categories.length === 0) {
        categoryListContainer.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem; padding: 8px 0;">No categories registered yet.</div>';
        return;
    }
    categories.forEach(cat => {
        const item = document.createElement('div');
        item.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background-color: var(--background); border-radius: 6px; border: 1px solid var(--border);';
        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-weight: 600; font-size: 0.9rem;">${escapeHtml(cat.name)}</span>
                <span class="badge badge-sku">${escapeHtml(cat.slug)}</span>
            </div>
            <button type="button" class="button button-sm button-danger" data-category-action="delete" data-id="${escapeHtml(cat.id)}" style="padding: 2px 8px; font-size: 0.75rem;">
                Delete
            </button>
        `;
        categoryListContainer.appendChild(item);
    });
}

// =============================================================================
// TODO (Milestone 4): Implement DRF AJAX Communication Routines
// =============================================================================

// TODO: Implement getCookie(name) helper function to extract 'csrftoken' from document.cookie.
function getCookie(name) {
    // [Implement your getCookie function here]
    return null;
}

// TODO: Implement writeApi(url, method, payload) helper attaching 'X-CSRFToken' header.
async function writeApi(url, method, payload) {
    // [Implement your writeApi helper here]
    return null;
}

// TODO: Implement fetchProducts(searchQuery, categoryId) using Fetch API with abort controller.
async function fetchProducts(searchQuery = '', categoryId = '') {
    // [Implement fetchProducts here, calling displayPageSection and gridContainer.replaceChildren]
}

// TODO: Implement loadCategories(selectedId) fetching BASE_CATEGORIES_ENDPOINT and populating selects.
async function loadCategories(selectedId = null) {
    // [Implement loadCategories here and call renderCategoryList]
}
window.loadCategories = loadCategories;

// TODO: Implement addProduct(event) form submission handler calling writeApi(BASE_PRODUCTS_ENDPOINT, 'POST', payload).
async function addProduct(event) {
    event.preventDefault();
    // [Implement addProduct here]
}

// TODO: Implement addCategory(event) form submission handler calling writeApi(BASE_CATEGORIES_ENDPOINT, 'POST', payload).
async function addCategory(event) {
    event.preventDefault();
    // [Implement addCategory here]
}

// =============================================================================
// Page Initialization & Event Binding
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const categoryForm = document.getElementById('category-form');
    const categoryListContainer = document.getElementById('category-list');
    const gridContainer = document.getElementById('grid');
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');

    if (productForm) productForm.addEventListener('submit', addProduct);
    if (categoryForm) categoryForm.addEventListener('submit', addCategory);

    // TODO: Attach event delegation on categoryListContainer for deleting categories.
    // TODO: Attach event delegation on gridContainer for restock and delete actions.
    // TODO: Attach change listener on categoryFilter.
    // TODO: Attach input listener with debounce on searchInput.

    // Initial fetch
    fetchProducts();
    loadCategories();
});
