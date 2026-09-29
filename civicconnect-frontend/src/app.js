import { RequestFactory } from './request-factory.js';

const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    const requestForm = document.getElementById('requestForm');
    const requestList = document.getElementById('requestList');
    const refreshBtn = document.getElementById('refreshBtn');
    const formFeedback = document.getElementById('formFeedback');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Fetch user requests on load (FR-004)
    fetchRequests();

    // Submit Request (FR-001 & FR-002)
    requestForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formFeedback.textContent = '';
        formFeedback.className = 'feedback-msg';

        const title = document.getElementById('title').value;
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;

        try {
            const payload = RequestFactory.createRequest(title, category, description);

            const response = await fetch(`${API_BASE_URL}/requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to submit service request.');
            }

            formFeedback.textContent = 'Request submitted successfully!';
            formFeedback.classList.add('success');
            requestForm.reset();

            fetchRequests();

        } catch (error) {
            formFeedback.textContent = error.message;
            formFeedback.classList.add('error');
        }
    });

    // Refresh Handler (FR-003)
    refreshBtn.addEventListener('click', fetchRequests);

    // Fetch and render "My Requests" (FR-003 & FR-004)
    async function fetchRequests() {
        loadingSpinner.classList.remove('hidden');
        requestList.innerHTML = '';

        try {
            const response = await fetch(`${API_BASE_URL}/requests`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to retrieve request list.');
            }

            const data = await response.json();
            const requests = data.data || data;

            renderRequestList(requests);
        } catch (error) {
            requestList.innerHTML = `<p class="feedback-msg error">${error.message}</p>`;
        } finally {
            loadingSpinner.classList.add('hidden');
        }
    }

    function renderRequestList(requests) {
        if (!requests || requests.length === 0) {
            requestList.innerHTML = '<p>No service requests found.</p>';
            return;
        }

        requestList.innerHTML = requests.map(req => {
            const statusClass = getStatusBadgeClass(req.status);
            const dateStr = new Date(req.createdAt || req.submittedAt).toLocaleDateString();

            return `
                <div class="request-card" data-id="${req._id || req.id}">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3>${escapeHtml(req.title)}</h3>
                        <span class="badge ${statusClass}">${escapeHtml(req.status || 'Submitted')}</span>
                    </div>
                    <p><strong>Category:</strong> ${escapeHtml(req.category)}</p>
                    <p>${escapeHtml(req.description)}</p>
                    <small>Submitted on: ${dateStr}</small>
                </div>
            `;
        }).join('');
    }

    function getStatusBadgeClass(status) {
        switch ((status || '').toLowerCase()) {
            case 'in progress': return 'badge-in-progress';
            case 'resolved': return 'badge-resolved';
            case 'closed': return 'badge-closed';
            default: return 'badge-submitted';
        }
    }

    function escapeHtml(str) {
        return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
});
