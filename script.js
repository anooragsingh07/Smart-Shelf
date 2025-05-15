// DOM Elements
const addItemForm = document.getElementById('addItemForm');
const inventoryBody = document.getElementById('inventoryBody');
const searchInput = document.getElementById('searchInput');
const updateModal = document.getElementById('updateModal');
const updateForm = document.getElementById('updateForm');
const closeModal = document.querySelector('.close');
const lastUpdatedSpan = document.getElementById('lastUpdated');
const downloadReceiptBtn = document.getElementById('downloadReceipt');

// State
let currentItemId = null;
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

function sanitizeInventory() {
    inventory = inventory.map(item => ({
        ...item,
        quantity: parseFloat(item.quantity),
        minLimit: parseFloat(item.minLimit)
    }));
}

sanitizeInventory();

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderInventory();
    updateLastUpdated();
    addFormValidation();
    showExpiryNotifications();
    attachEditShoppingListHandler();
});

// Event Listeners
addItemForm.addEventListener('submit', handleAddItem);
searchInput.addEventListener('input', handleSearch);
updateForm.addEventListener('submit', handleUpdateQuantity);
closeModal.addEventListener('click', () => {
    updateModal.style.display = 'none';
    document.getElementById('updateQuantity').value = '';
});
downloadReceiptBtn.addEventListener('click', generateShoppingList);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === updateModal) {
        updateModal.style.display = 'none';
        document.getElementById('updateQuantity').value = '';
    }
});

// Form validation
function addFormValidation() {
    const inputs = addItemForm.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.validity.valid) {
                input.style.borderColor = 'var(--secondary-color)';
            } else {
                input.style.borderColor = 'var(--danger-color)';
            }
        });
    });
}

// Functions
function handleAddItem(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    setLoading(submitButton, true);
    
    setTimeout(() => {
        const item = {
            id: Date.now(),
            name: document.getElementById('itemName').value.trim(),
            quantity: parseFloat(document.getElementById('quantity').value),
            unit: document.getElementById('unit').value,
            minLimit: parseFloat(document.getElementById('minLimit').value),
            expiryDate: document.getElementById('expiryDate').value
        };

        if (item.minLimit < 0) {
            showNotification('Minimum limit cannot be negative', 'error');
            setLoading(submitButton, false);
            return;
        }

        inventory.push(item);
        saveToLocalStorage();
        renderInventory();
        addItemForm.reset();
        updateLastUpdated();
        showNotification('Item added successfully!', 'success');
        setLoading(submitButton, false);
        showExpiryNotifications();
    }, 500); // Simulate network delay
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredItems = inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm)
    );
    renderInventory(filteredItems);
}

function handleUpdateQuantity(e) {
    e.preventDefault();
    
    const newQuantity = parseFloat(document.getElementById('updateQuantity').value);
    const itemIndex = inventory.findIndex(item => item.id === currentItemId);
    
    if (itemIndex !== -1) {
        if (newQuantity < 0) {
            showNotification('Quantity cannot be negative', 'error');
            return;
        }
        
        inventory[itemIndex].quantity = newQuantity;
        saveToLocalStorage();
        renderInventory();
        updateModal.style.display = 'none';
        updateLastUpdated();
        showNotification('Quantity updated successfully!', 'success');
    }
}

function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        inventory = inventory.filter(item => item.id !== id);
        saveToLocalStorage();
        renderInventory();
        updateLastUpdated();
        showNotification('Item deleted successfully!', 'success');
    }
}

function openUpdateModal(id) {
    currentItemId = id;
    const item = inventory.find(item => item.id === id);
    if (item) {
        document.getElementById('updateQuantity').value = item.quantity;
        updateModal.style.display = 'block';
    }
}

function renderInventory(items = inventory) {
    inventoryBody.innerHTML = '';
    
    if (items.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = `
            <td colspan="7" style="text-align: center; padding: 30px;">
                <div style="color: var(--text-secondary);">
                    <i class="fas fa-box-open" style="font-size: 2em; margin-bottom: 10px;"></i>
                    <p>No items found</p>
                </div>
            </td>
        `;
        inventoryBody.appendChild(emptyRow);
        return;
    }
    
    items.forEach(item => {
        const row = document.createElement('tr');
        const isLowStock = item.quantity < item.minLimit;
        let statusClass, statusText;
        if (isLowStock) {
            statusClass = 'status-low';
            statusText = 'Low Stock';
            row.classList.add('low-stock');
        } else {
            statusClass = getStatusColor(item.expiryDate);
            statusText = statusClass === 'status-ok' ? 'Good' : statusClass === 'status-soon' ? 'Expires Soon' : 'Use Immediately';
        }
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.unit}</td>
            <td>${item.minLimit}</td>
            <td>${item.expiryDate ? item.expiryDate : '-'}</td>
            <td class="${statusClass}">
                ${statusText}
            </td>
            <td>
                <button class="action-btn edit-btn" onclick="openUpdateModal(${item.id})" data-tooltip="Update quantity">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete-btn" onclick="deleteItem(${item.id})" data-tooltip="Remove item">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        inventoryBody.appendChild(row);
    });
    
    addTooltips();
}

function saveToLocalStorage() {
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

function updateLastUpdated() {
    const now = new Date();
    lastUpdatedSpan.textContent = now.toLocaleString();
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Make functions available globally
window.openUpdateModal = openUpdateModal;
window.deleteItem = deleteItem;

function generateShoppingList(listOverride) {
    sanitizeInventory();
    // Use override list if provided and is an array, else use low-stock items
    const sourceList = Array.isArray(listOverride) ? listOverride : inventory.filter(item => parseFloat(item.quantity) < parseFloat(item.minLimit));
    const lowStockItems = sourceList
        .map(item => ({
            name: item.name,
            toBuy: Math.max(0, (parseFloat(item.minLimit || item.toBuy) - parseFloat(item.quantity || 0))),
            unit: item.unit
        }))
        .filter(item => item.toBuy > 0 || (typeof item.toBuy === 'number' && item.toBuy > 0));
    if (lowStockItems.length === 0) {
        showNotification('No items need to be restocked!', 'info');
        return;
    }
    setLoading(downloadReceiptBtn, true);

    // Minimal receipt-style container
    const listContainer = document.createElement('div');
    listContainer.style.position = 'absolute';
    listContainer.style.left = '-9999px';
    listContainer.style.background = '#fff';
    listContainer.style.color = '#111';
    listContainer.style.fontFamily = 'monospace, Courier, Arial, sans-serif';
    listContainer.style.padding = '0';
    listContainer.style.borderRadius = '0';
    listContainer.style.boxShadow = 'none';
    listContainer.style.width = '400px';
    listContainer.style.overflow = 'hidden';
    listContainer.style.border = '1px solid #eee';

    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();

    listContainer.innerHTML = `
        <div style="padding: 32px 0 0 0; text-align: center;">
            <div style='font-size:2em;font-weight:700;margin-bottom:8px;'>Shopping List</div>
            <div style='font-size:1em;margin-bottom:18px;'>${dateStr}, ${timeStr}</div>
        </div>
        <div style="padding: 0 24px;">
            <div style="border-top:2px dashed #222;margin-bottom:10px;"></div>
            <ul style="list-style:none;padding:0;margin:0;">
                ${lowStockItems.map(item => `
                    <li style="display:flex;justify-content:space-between;padding:8px 0 8px 0;border-bottom:1px dotted #ddd;font-size:1.1em;">
                        <span>${item.name}</span>
                        <span>${item.toBuy} ${item.unit}</span>
                    </li>
                `).join('')}
            </ul>
            <div style="border-bottom:2px dashed #222;margin-top:10px;"></div>
        </div>
        <div style="padding: 18px 0 24px 0; text-align: center; font-size:1.1em;">Total Items: ${lowStockItems.length}</div>
    `;
    document.body.appendChild(listContainer);

    setTimeout(() => {
        html2canvas(listContainer, {
            scale: 2,
            backgroundColor: '#fff',
            logging: false,
            useCORS: true
        }).then(canvas => {
            try {
                const link = document.createElement('a');
                link.download = `shopping-list-${now.toISOString().split('T')[0]}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                showNotification('Shopping list downloaded!', 'success');
            } catch (error) {
                showNotification('Error generating list. Please try again.', 'error');
            } finally {
                document.body.removeChild(listContainer);
                setLoading(downloadReceiptBtn, false);
            }
        }).catch(error => {
            showNotification('Error generating list. Please try again.', 'error');
            document.body.removeChild(listContainer);
            setLoading(downloadReceiptBtn, false);
        });
    }, 100);
}

function addTooltips() {
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    editButtons.forEach(btn => {
        btn.setAttribute('data-tooltip', 'Update quantity');
    });
    
    deleteButtons.forEach(btn => {
        btn.setAttribute('data-tooltip', 'Remove item');
    });
}

function setLoading(element, isLoading) {
    if (isLoading) {
        element.classList.add('loading');
        element.disabled = true;
    } else {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

function getStatusColor(expiryDateStr) {
    if (!expiryDateStr) return 'status-ok';
    const today = new Date();
    const expiry = new Date(expiryDateStr);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'status-expired'; // Red
    if (diffDays <= 3) return 'status-soon';   // Orange
    return 'status-ok';                        // Green
}

function showExpiryNotifications() {
    const soonExpiring = inventory.filter(item => {
        if (!item.expiryDate) return false;
        const expiry = new Date(item.expiryDate);
        const today = new Date();
        const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 3;
    });
    const expired = inventory.filter(item => {
        if (!item.expiryDate) return false;
        const expiry = new Date(item.expiryDate);
        const today = new Date();
        return expiry < today;
    });
    if (expired.length > 0) {
        showNotification(`⚠️ ${expired.length} item(s) expired!`, 'error');
    }
    if (soonExpiring.length > 0) {
        showNotification(`⏰ ${soonExpiring.length} item(s) expiring soon!`, 'info');
    }
}

// Placeholder for import/scan features
function importInventory() {
    showNotification('Import feature coming soon! You will be able to import from CSV/text or scan receipts.', 'info');
}

// Add modal for editing shopping list before download
function openEditShoppingListModal() {
    sanitizeInventory();
    // Get low-stock items
    const lowStockItems = inventory.filter(item => parseFloat(item.quantity) < parseFloat(item.minLimit))
        .map(item => ({
            name: item.name,
            toBuy: Math.max(0, (parseFloat(item.minLimit) - parseFloat(item.quantity))),
            unit: item.unit
        }))
        .filter(item => item.toBuy > 0);
    if (lowStockItems.length === 0) {
        showNotification('No items need to be restocked!', 'info');
        return;
    }
    // Create modal
    let modal = document.getElementById('editShoppingListModal');
    if (modal) modal.remove();
    modal = document.createElement('div');
    modal.id = 'editShoppingListModal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.3)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';
    modal.innerHTML = `
        <div style="background:#fff;padding:32px 24px 24px 24px;border-radius:10px;min-width:340px;max-width:95vw;box-shadow:0 4px 24px rgba(0,0,0,0.15);position:relative;">
            <button id="closeEditShoppingListModal" style="position:absolute;top:10px;right:14px;font-size:1.3em;background:none;border:none;cursor:pointer;color:#888;">&times;</button>
            <h2 style="text-align:center;margin-bottom:18px;">Edit Shopping List</h2>
            <form id="editShoppingListForm">
                <ul style="list-style:none;padding:0;margin:0;max-height:300px;overflow-y:auto;">
                    ${lowStockItems.map((item, idx) => `
                        <li style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
                            <input type="text" value="${item.name}" data-idx="${idx}" style="flex:2;padding:6px 8px;border:1px solid #ccc;border-radius:4px;" required />
                            <input type="number" value="${item.toBuy}" min="1" data-idx="${idx}" style="width:60px;padding:6px 8px;border:1px solid #ccc;border-radius:4px;" required />
                            <input type="text" value="${item.unit}" data-idx="${idx}" style="width:50px;padding:6px 8px;border:1px solid #ccc;border-radius:4px;" required />
                            <button type="button" data-remove="${idx}" style="background:#e74c3c;color:#fff;border:none;border-radius:4px;padding:6px 10px;cursor:pointer;">Remove</button>
                        </li>
                    `).join('')}
                </ul>
                <div style="text-align:center;margin-top:18px;">
                    <button type="submit" style="background:#4a90e2;color:#fff;padding:10px 24px;border:none;border-radius:5px;font-size:1em;cursor:pointer;">Download</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    // Close modal
    document.getElementById('closeEditShoppingListModal').onclick = () => modal.remove();
    // Remove item
    modal.querySelectorAll('button[data-remove]').forEach(btn => {
        btn.onclick = function() {
            const idx = parseInt(this.getAttribute('data-remove'));
            this.closest('li').remove();
        };
    });
    // Download edited list
    document.getElementById('editShoppingListForm').onsubmit = function(e) {
        e.preventDefault();
        // Gather edited items
        const editedItems = Array.from(modal.querySelectorAll('li')).map(li => {
            const inputs = li.querySelectorAll('input');
            return {
                name: inputs[0].value,
                toBuy: parseFloat(inputs[1].value),
                unit: inputs[2].value
            };
        }).filter(item => item.toBuy > 0);
        modal.remove();
        // Pass editedItems directly to generateShoppingList
        generateShoppingList(editedItems);
    };
}

// Attach Edit Shopping List button handler on DOMContentLoaded
function attachEditShoppingListHandler() {
    const editBtn = document.getElementById('editShoppingListBtn');
    if (editBtn) {
        editBtn.onclick = openEditShoppingListModal;
    }
}