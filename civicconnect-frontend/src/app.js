import { RequestFactory, CATEGORIES } from './request-factory.js';

const API = 'http://localhost:3000/api';
const DAY = 864e5;
const STATUSES = ['Submitted', 'In Progress', 'Resolved', 'Closed'];
const NEXT = { 'Submitted': 'In Progress', 'In Progress': 'Resolved', 'Resolved': 'Closed' };
const store = k => { try { return localStorage.getItem(k); } catch { return null; } };

const savedUser = JSON.parse(store('user') || 'null');
const determineRole = (u) => {
    if (!u) return 'resident';
    if (u.role === 'admin') return 'management';
    if (u.role === 'staff' || u.role === 'supervisor') return 'staff';
    return 'resident';
};

const state = { 
    token: store('token') || '',
    user: savedUser,
    role: determineRole(savedUser), 
    authMode: 'login',
    list: [], 
    apiErr: '', 
    editing: null, 
    msg: '', 
    err: '', 
    cat: '', 
    f: { q: '', status: '', category: '', sort: 'new' } 
};

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const badge = s => `<span class="badge badge-${String(s).toLowerCase().replace(/\s+/g, '-')}">${esc(s)}</span>`;
const date = d => d ? new Date(d).toLocaleDateString('en-ZA') : '';
const isOpen = r => !['Resolved', 'Closed'].includes(r.status);
const overdue = r => isOpen(r) && Date.now() - new Date(r.createdAt || r.submittedAt || Date.now()) > 7 * DAY;
const auth = () => ({ Authorization: `Bearer ${state.token}` });
const opts = (arr, sel) => arr.map(v => `<option${v === sel ? ' selected' : ''}>${v}</option>`).join('');

async function load() {
    if (!state.token) return render();
    try {
        const r = await fetch(`${API}/requests`, { headers: auth() });
        if (!r.ok) throw new Error(`The API responded with status ${r.status}.`);
        const d = await r.json();
        const rawList = d.data || d;
        state.list = Array.isArray(rawList) ? rawList.map(x => ({ 
            notes: x.notes || [], 
            ...x, 
            id: x._id || x.id, 
            createdAt: x.createdAt || x.submittedAt || new Date().toISOString() 
        })) : [];
        state.apiErr = '';
    } catch (e) {
        state.list = [];
        state.apiErr = `Could not load requests from ${API}. Is the backend running? (${e.message})`;
    }
    render();
}

async function act(method, path, body) {
    try {
        const r = await fetch(API + path, { 
            method, 
            headers: { 'Content-Type': 'application/json', ...auth() }, 
            body: body ? JSON.stringify(body) : undefined 
        });
        if (!r.ok) {
            const errData = await r.json().catch(() => ({}));
            throw new Error(errData.message || `Request failed (${r.status}).`);
        }
        state.err = '';
        await load();
    } catch (e) { 
        state.msg = ''; 
        state.err = e.message; 
        render(); 
    }
}

const card = (r, extra = '') => `
    <div class="request-card" data-id="${esc(r.id)}">
        <div class="row"><h3>${esc(r.title)}</h3><div>${overdue(r) ? '<span class="badge badge-overdue">Overdue</span> ' : ''}${badge(r.status)}</div></div>
        <p class="meta"><strong>${esc(r.category)}</strong> &middot; ${r.owner ? 'Owner: ' + esc(r.owner) : 'Unassigned'} &middot; ${date(r.createdAt)}</p>
        <p>${esc(r.description)}</p>${extra}
    </div>`;

function resident() {
    const e = state.list.find(r => r.id === state.editing) || {};
    const rows = state.list.map(r => card(r, r.status === 'Submitted'
        ? `<div class="actions"><button class="btn-secondary" data-act="edit" data-id="${esc(r.id)}">Edit</button><button class="btn-danger" data-act="del" data-id="${esc(r.id)}">Delete</button></div>`
        : '<small class="muted">Editing is locked once staff accept a request.</small>')).join('') || '<p>No service requests found.</p>';
    return `
    <section class="card">
        <h2>${e.id ? 'Edit Request' : 'Submit a New Request'}</h2>
        <p class="card-lead">It takes about a minute. Fields marked * are required.</p>
        <form id="reqForm">
            <div class="form-group"><label for="title">Title *</label><input id="title" name="title" value="${esc(e.title)}" placeholder="e.g., Burst water pipe on 5th Ave"></div>
            <div class="form-group"><label for="category">Category *</label><select id="category" name="category"><option value="">-- Select Category --</option>${opts(CATEGORIES, e.category)}</select></div>
            <div class="form-group"><label for="description">Description *</label><textarea id="description" name="description" rows="4" placeholder="Provide detailed information regarding the issue...">${esc(e.description)}</textarea></div>
            <button type="submit">${e.id ? 'Save Changes' : 'Submit Request'}</button>
            ${e.id ? '<button type="button" class="btn-secondary btn-block" style="margin-top:.5rem" data-act="cancel">Cancel</button>' : ''}
        </form>
        <div class="feedback-msg ${state.err ? 'error' : state.msg ? 'success' : ''}" role="status">${esc(state.err || state.msg)}</div>
    </section>
    <section class="card">
        <div class="head"><h2>My Submitted Requests</h2><button class="btn-secondary" data-act="refresh">Refresh</button></div>
        <div class="request-list">${rows}</div>
    </section>`;
}

function staff() {
    const f = state.f;
    return `
    <section class="card">
        <div class="head"><h2>Staff Queue</h2><span class="muted" id="count"></span></div>
        <div class="filters">
            <input id="fq" placeholder="Search title or description" value="${esc(f.q)}">
            <select id="fs"><option value="">All statuses</option>${opts(STATUSES, f.status)}</select>
            <select id="fc"><option value="">All categories</option>${opts(CATEGORIES, f.category)}</select>
            <select id="fo">
                <option value="new"${f.sort === 'new' ? ' selected' : ''}>Newest first</option>
                <option value="old"${f.sort === 'old' ? ' selected' : ''}>Oldest first</option>
                <option value="status"${f.sort === 'status' ? ' selected' : ''}>By status</option>
            </select>
        </div>
        <div id="staffList" class="request-list"></div>
    </section>`;
}

function staffList() {
    const f = state.f, q = f.q.toLowerCase();
    const rows = state.list
        .filter(r => (!f.status || r.status === f.status) && (!f.category || r.category === f.category) && (!q || (r.title + ' ' + r.description).toLowerCase().includes(q)))
        .sort((a, b) => f.sort === 'status' ? STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status)
            : (f.sort === 'old' ? 1 : -1) * (new Date(a.createdAt) - new Date(b.createdAt)));
    
    const countEl = $('#count');
    if (countEl) countEl.textContent = `${rows.length} of ${state.list.length} requests`;
    
    const listEl = $('#staffList');
    if (listEl) {
        listEl.innerHTML = rows.map(r => {
            const id = esc(r.id), nxt = NEXT[r.status];
            const btn = r.status === 'Submitted' ? `<button data-act="accept" data-id="${id}">Accept</button>`
                : nxt ? `<button data-act="advance" data-id="${id}">Mark ${nxt}</button>` : '';
            return card(r, `
                <div class="actions">${btn}</div>
                <details><summary>Notes (${(r.notes || []).length})</summary>
                    ${(r.notes || []).map(n => `<p class="note"><small>${new Date(n.at).toLocaleString('en-ZA')}</small><br>${esc(n.text)}</p>`).join('')}
                    <form data-form="note" data-id="${id}" class="note-form"><input name="text" placeholder="Add an action or resolution note" required><button type="submit">Add note</button></form>
                </details>`);
        }).join('') || '<p>No matching requests.</p>';
    }
}

function management() {
    const L = state.list, by = k => L.filter(r => r.category === k).length;
    const max = Math.max(1, ...CATEGORIES.map(by));
    const kpi = (n, l, c = '') => `<div class="kpi ${c}"><b>${n}</b><span>${l}</span></div>`;
    const rows = L.filter(r => !state.cat || r.category === state.cat);
    return `
    <section class="card"><h2>Service Activity &amp; Management Overview</h2>
        <div class="kpis">${kpi(L.length, 'Total')}${kpi(L.filter(isOpen).length, 'Open', 'k-open')}${kpi(L.filter(overdue).length, 'Overdue (7+ days)', 'k-over')}${kpi(L.filter(r => r.status === 'Resolved').length, 'Resolved')}${kpi(L.filter(r => r.status === 'Closed').length, 'Closed')}</div>
    </section>
    <section class="card">
        <div class="head"><h2>Requests by Category</h2>${state.cat ? '<button class="btn-secondary" data-act="cat" data-cat="">Clear filter</button>' : ''}</div>
        <div class="bars">${CATEGORIES.map(k => `<button class="bar${state.cat === k ? ' on' : ''}" data-act="cat" data-cat="${k}"><span>${k}</span><span class="track"><i style="width:${by(k) / max * 100}\%"></i></span><em>${by(k)}</em></button>`).join('')}</div>
    </section>
    <section class="card"><h2 style="margin-bottom:1rem">${state.cat || 'All'} requests</h2><div class="request-list">${rows.map(r => card(r)).join('') || '<p>No requests.</p>'}</div></section>`;
}

function render() {
    const banner = $('#apiBanner');
    if (banner) {
        banner.hidden = !state.apiErr;
        banner.textContent = state.apiErr;
    }

    const authContainer = $('#authContainer');
    const view = $('#view');
    const navRoles = $('#navRoles');

    if (!state.token) {
        if (authContainer) authContainer.hidden = false;
        if (view) view.innerHTML = '';
        if (navRoles) navRoles.innerHTML = '<span style="color:#c5d3e8">Please login or sign up to continue</span>';
        
        const isLogin = state.authMode === 'login';
        if ($('#authTitle')) $('#authTitle').textContent = isLogin ? 'Login to CivicConnect' : 'Create an Account';
        if ($('#authSubtitle')) $('#authSubtitle').textContent = isLogin ? 'Enter your credentials to access your account.' : 'Register as a Resident, Staff, Supervisor, or Admin.';
        if ($('#nameGroup')) $('#nameGroup').hidden = isLogin;
        if ($('#roleGroup')) $('#roleGroup').hidden = isLogin;
        if ($('#authSubmitBtn')) $('#authSubmitBtn').textContent = isLogin ? 'Login' : 'Sign Up';
        
        const tabLogin = $('#tabLogin');
        if (tabLogin) {
            tabLogin.style.background = isLogin ? 'var(--accent)' : '#6b7a8c';
            tabLogin.style.color = isLogin ? 'var(--navy)' : '#fff';
        }
        
        const tabSignup = $('#tabSignup');
        if (tabSignup) {
            tabSignup.style.background = !isLogin ? 'var(--accent)' : '#6b7a8c';
            tabSignup.style.color = !isLogin ? 'var(--navy)' : '#fff';
        }
        return;
    }

    if (authContainer) authContainer.hidden = true;
    
    // Strict RBAC Navigation: Display user info and logout instead of a multi-role switcher
    if (navRoles) {
        const userName = state.user?.name || 'User';
        const userRoleLabel = state.user?.role ? state.user.role.toUpperCase() : 'USER';
        navRoles.innerHTML = `
            <span style="color:#c5d3e8; font-weight:600; padding:0.4rem 0;">👤 ${esc(userName)} <small style="opacity:0.8">(${userRoleLabel})</small></span>
            <button id="logoutBtn" class="btn-danger" style="padding:0.4rem 1rem; margin-left:1rem;">Logout</button>
        `;
    }

    if (view) {
        const viewFn = { resident, staff, management }[state.role];
        view.innerHTML = viewFn ? viewFn() : '<p>Unauthorized dashboard access.</p>';
    }
    if (state.role === 'staff') staffList();
}

// Global Event Listeners
document.addEventListener('click', e => {
    const t = e.target.closest('[data-act],#tabLogin,#tabSignup,#logoutBtn');
    if (!t) return;

    if (t.id === 'tabLogin') {
        state.authMode = 'login';
        if ($('#authError')) $('#authError').textContent = '';
        return render();
    }
    if (t.id === 'tabSignup') {
        state.authMode = 'signup';
        if ($('#authError')) $('#authError').textContent = '';
        return render();
    }
    if (t.id === 'logoutBtn') {
        state.token = '';
        state.user = null;
        state.role = 'resident';
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
        } catch {}
        return render();
    }

    const a = t.dataset.act, id = t.dataset.id, r = state.list.find(x => x.id === id);
    if (a === 'edit') { state.editing = id; state.msg = state.err = ''; render(); window.scrollTo(0, 0); }
    else if (a === 'cancel') { state.editing = null; render(); }
    else if (a === 'refresh') load();
    else if (a === 'cat') { state.cat = t.dataset.cat; render(); }
    else if (a === 'del' && confirm('Delete this request?')) act('DELETE', `/requests/${id}`);
    else if (a === 'accept') act('PATCH', `/requests/${id}/status`, { status: 'In Progress' });
    else if (a === 'advance' && r) act('PATCH', `/requests/${id}/status`, { status: NEXT[r.status] });
});

document.addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target, el = f.elements;

    if (f.id === 'authForm') {
        const email = el.authEmail.value.trim();
        const password = el.authPassword.value;
        const endpoint = state.authMode === 'login' ? '/auth/login' : '/auth/register';
        const body = state.authMode === 'login' 
            ? { email, password } 
            : { name: el.authName.value.trim(), email, password, role: el.authRole.value };

        try {
            const res = await fetch(`${API}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Authentication failed.');

            state.token = data.token;
            state.user = data.user;
            state.role = determineRole(data.user);
            
            localStorage.setItem('token', state.token);
            localStorage.setItem('user', JSON.stringify(state.user));
            localStorage.setItem('role', state.role);

            if ($('#authError')) $('#authError').textContent = '';
            await load();
        } catch (err) {
            if ($('#authError')) $('#authError').textContent = err.message;
        }
        return;
    }

    if (f.id === 'reqForm') {
        state.msg = state.err = '';
        try {
            const p = RequestFactory.createRequest(el.title.value, el.category.value, el.description.value);
            if (state.editing) {
                const id = state.editing; state.editing = null; state.msg = 'Request updated.';
                act('PATCH', `/requests/${id}`, p);
            } else {
                state.msg = 'Request submitted successfully!';
                act('POST', '/requests', p);
            }
        } catch (err) { state.err = err.message; render(); }
    } else if (f.dataset.form === 'note') {
        const text = el.text.value.trim();
        if (text) act('POST', `/requests/${f.dataset.id}/notes`, { text });
    }
});

document.addEventListener('input', e => { if (e.target.id === 'fq') { state.f.q = e.target.value; staffList(); } });
document.addEventListener('change', e => {
    const k = { fs: 'status', fc: 'category', fo: 'sort' }[e.target.id];
    if (k) { state.f[k] = e.target.value; staffList(); }
});

load();