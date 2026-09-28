// DOM Element Selectors
const requestForm = document.getElementById('request-form');
const requestsContainer = document.getElementById('requests-container');
const refreshBtn = document.getElementById('refresh-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');

/**
 * Fetches all service requests from the backend API (GET /requests)
 */
async function fetchRequests() {
  showLoading(true);
  hideError();

  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch requests (Status: ${response.status})`);
    }

    const data = await response.json();
    renderRequests(data);
  } catch (error) {
    showError(error.message || 'Unable to connect to the server.');
  } finally {
    showLoading(false);
  }
}

/**
 * Renders the array of request objects dynamically into card elements
 * @param {Array} requests - List of service requests
 */
function renderRequests(requests) {
  requestsContainer.innerHTML = '';

  if (!requests || requests.length === 0) {
    requestsContainer.innerHTML = '<p class="empty-msg">No service requests found.</p>';
    return;
  }

  requests.forEach((req) => {
    const card = document.createElement('div');
    card.className = 'request-card';
    card.innerHTML = `
      <h3>${escapeHTML(req.title || 'Untitled Request')}</h3>
      <span class="tag">${escapeHTML(req.category || 'General')}</span>
      <p>${escapeHTML(req.description || 'No details provided.')}</p>
    `;
    requestsContainer.appendChild(card);
  });
}

/**
 * Handles form submission and sends a POST request to create a new issue
 * @param {Event} event 
 */
async function handleFormSubmit(event) {
  event.preventDefault();
  
  const formData = new FormData(requestForm);
  const payload = {
    title: formData.get('title'),
    category: formData.get('category'),
    description: formData.get('description'),
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to submit service request.');
    }

    // Reset input fields and update request list
    requestForm.reset();
    fetchRequests();
  } catch (error) {
    showError(error.message);
  }
}

// UI State Helper Functions
function showLoading(isLoading) {
  loadingSpinner.classList.toggle('hidden', !isLoading);
}

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.remove('hidden');
}

function hideError() {
  errorMessage.classList.add('hidden');
}

/**
 * Sanitizes user input to prevent XSS attacks when rendering HTML strings
 */
function escapeHTML(str) {
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Event Listeners
requestForm.addEventListener('submit', handleFormSubmit);
refreshBtn.addEventListener('click', fetchRequests);

// Initial load when DOM is ready
document.addEventListener('DOMContentLoaded', fetchRequests);
