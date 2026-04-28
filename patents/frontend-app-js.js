const API = 'http://localhost:3001/api';
const DEMO_USER = 1; // replace with real auth session

let currentType    = 'patent';
let currentResults = [];

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateBadge();
  document.getElementById('search-input')
    .addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
});

// ─── NAV ──────────────────────────────────────────────────────────────────────
function showSection(name, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('sec-' + name).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (name === 'watchlist') renderWatchlist();
  if (name === 'trends')    renderTrends();
}

function toggleTheme() {
  const html = document.documentElement;
  html.setAttribute('data-theme', html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

// ─── SEARCH ───────────────────────────────────────────────────────────────────
function setSearchType(t) {
  currentType = t;
  document.getElementById('type-patent').classList.toggle('active',    t === 'patent');
  document.getElementById('type-trademark').classList.toggle('active', t === 'trademark');
}

function quickSearch(q) {
  document.getElementById('search-input').value = q;
  doSearch();
}

async function doSearch() {
  const q = document.getElementById('search-input').value.trim();
  if (!q) { showToast('Please enter a search term'); return; }

  const area = document.getElementById('results-area');
  const btn  = document.getElementById('search-btn');
  btn.disabled = true;
  btn.textContent = 'Searching…';
  area.innerHTML = `<div class="loading"><div class="spinner"></div><span>Querying database…</span></div>`;

  try {
    const endpoint = currentType === 'patent' ? 'patents' : 'trademarks';
    const res  = await fetch(`${API}/${endpoint}?q=${encodeURIComponent(q)}&limit=12`);
    const data = await res.json();

    currentResults = data.results || [];
    btn.disabled = false;
    btn.textContent = 'Search';

    if (!currentResults.length) {
      area.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-title">No results found</div><div class="empty-sub">Try different keywords.</div></div>`;
      return;
    }

    area.innerHTML = `
      <div class="results-header">
        <span class="results-count">${data.total} result${data.total !== 1 ? 's' : ''} for "${q}"</span>
      </div>
      <div class="results-grid" id="results-grid"></div>
    `;
    const grid = document.getElementById('results-grid');
    currentResults.forEach(r => { grid.innerHTML += buildResultCard(r, currentType); });
  } catch (err) {
    console.error(err);
    btn.disabled = false;
    btn.textContent = 'Search';
    area.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-title">Connection error</div><div class="empty-sub">Make sure the backend server is running on port 3001.</div></div>`;
  }
}

// ─── CARDS ────────────────────────────────────────────────────────────────────
function buildResultCard(r, type) {
  const title      = type === 'patent' ? r.title : r.name;
  const idNum      = type === 'patent' ? r.patent_number : r.trademark_number;
  const pillClass  = type === 'patent' ? 'pill-patent' : 'pill-trademark';
  const statusCls  = r.status === 'Active' ? 'status-active' : r.status === 'Pending' ? 'status-pending' : 'status-expired';
  const date       = r.filing_date ? r.filing_date.split('T')[0] : '';
  return `
    <div class="result-card" onclick="openDetail(${r.id}, '${type}')">
      <button class="card-watch-btn" onclick="event.stopPropagation(); toggleWatch(${r.id}, '${type}')"
        id="watch-${type}-${r.id}" title="Add to watchlist">♡</button>
      <div class="card-type-pill ${pillClass}">${type === 'patent' ? 'Patent' : 'Trademark'}</div>
      <div class="card-title">${title}</div>
      <div class="card-owner">${r.owner}</div>
      <div class="card-meta">
        <span class="meta-item"><span class="status-dot ${statusCls}"></span> ${r.status}</span>
        <span class="meta-item">${date}</span>
        <span class="meta-item">${idNum}</span>
      </div>
    </div>
  `;
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────
async function openDetail(id, type) {
  const endpoint = type === 'patent' ? 'patents' : 'trademarks';
  try {
    const res  = await fetch(`${API}/${endpoint}/${id}`);
    const item = await res.json();
    const title = type === 'patent' ? item.title : item.name;
    const idNum = type === 'patent' ? item.patent_number : item.trademark_number;
    const date  = item.filing_date ? item.filing_date.split('T')[0] : '';
    const body  = type === 'patent'
      ? `<div class="detail-row"><span class="detail-label">Category</span><span class="detail-value">${item.category}</span></div>
         <div class="detail-abstract">${item.abstract || 'No abstract available.'}</div>`
      : `<div class="detail-row"><span class="detail-label">Goods/Services</span><span class="detail-value">${item.goods_services || '—'}</span></div>`;

    document.getElementById('modal-content').innerHTML = `
      <div class="modal-header">
        <div class="modal-title">${title}</div>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="detail-row"><span class="detail-label">Number</span><span class="detail-value" style="font-family:var(--font-mono)">${idNum}</span></div>
      <div class="detail-row"><span class="detail-label">Type</span><span class="detail-value">${type === 'patent' ? 'Utility Patent' : 'Trademark'}</span></div>
      <div class="detail-row"><span class="detail-label">Owner</span><span class="detail-value">${item.owner}</span></div>
      <div class="detail-row"><span class="detail-label">Filing Date</span><span class="detail-value">${date}</span></div>
      <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value">${item.status}</span></div>
      ${body}
      <div class="modal-actions">
        <button class="btn-primary" onclick="toggleWatch(${id}, '${type}'); closeModal()">♡ Add to Watchlist</button>
        <button class="btn-secondary" onclick="closeModal()">Close</button>
      </div>
    `;
    document.getElementById('modal-overlay').classList.remove('hidden');
  } catch (err) {
    showToast('Could not load details');
  }
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modal-overlay')) {
    document.getElementById('modal-overlay').classList.add('hidden');
  }
}

// ─── WATCHLIST ────────────────────────────────────────────────────────────────
async function toggleWatch(itemId, itemType) {
  try {
    const res = await fetch(`${API}/watchlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: DEMO_USER, item_type: itemType, item_id: itemId })
    });
    const data = await res.json();
    showToast(data.inserted ? '♥ Added to watchlist' : 'Already in watchlist');
    updateBadge();
    const btn = document.getElementById(`watch-${itemType}-${itemId}`);
    if (btn) { btn.textContent = '♥'; btn.classList.add('watching'); }
  } catch (err) {
    showToast('Could not update watchlist');
  }
}

async function updateBadge() {
  try {
    const res  = await fetch(`${API}/watchlist?user_id=${DEMO_USER}`);
    const data = await res.json();
    document.getElementById('watch-count').textContent = Array.isArray(data) ? data.length : 0;
  } catch { /* ignore */ }
}

async function renderWatchlist() {
  const area = document.getElementById('watchlist-items');
  area.innerHTML = `<div class="loading"><div class="spinner"></div><span>Loading watchlist…</span></div>`;
  try {
    const res  = await fetch(`${API}/watchlist?user_id=${DEMO_USER}`);
    const list = await res.json();
    if (!list.length) {
      area.innerHTML = `<div class="empty-state"><div class="empty-icon">♡</div><div class="empty-title">Nothing saved yet</div><div class="empty-sub">Search and click the heart icon to watch items.</div></div>`;
      return;
    }
    area.innerHTML = `<div class="results-grid">${list.map(r => `
      <div class="result-card">
        <button class="card-watch-btn watching" onclick="removeFromWatchlist(${r.id})" title="Remove">♥</button>
        <div class="card-type-pill ${r.item_type === 'patent' ? 'pill-patent' : 'pill-trademark'}">${r.item_type}</div>
        <div class="card-title">${r.title}</div>
        <div class="card-owner">${r.owner}</div>
        <div class="card-meta">
          <span class="meta-item">${r.status}</span>
          <span class="meta-item">${r.filing_date ? r.filing_date.split('T')[0] : ''}</span>
          <span class="meta-item">Added ${r.added_at ? r.added_at.split('T')[0] : ''}</span>
        </div>
      </div>`).join('')}</div>`;
  } catch (err) {
    area.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><div class="empty-title">Connection error</div></div>`;
  }
}

async function removeFromWatchlist(wlId) {
  try {
    await fetch(`${API}/watchlist/${wlId}?user_id=${DEMO_USER}`, { method: 'DELETE' });
    showToast('Removed from watchlist');
    updateBadge();
    renderWatchlist();
  } catch { showToast('Error removing item'); }
}

async function exportWatchlist() {
  try {
    const res  = await fetch(`${API}/watchlist?user_id=${DEMO_USER}`);
    const list = await res.json();
    if (!list.length) { showToast('Watchlist is empty'); return; }
    const rows = [['Type','Title','Owner','Status','Filing Date','Added']];
    list.forEach(r => rows.push([r.item_type, `"${r.title}"`, r.owner, r.status,
      r.filing_date?.split('T')[0] || '', r.added_at?.split('T')[0] || '']));
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'watchlist.csv' });
    a.click();
    showToast('Exported watchlist.csv');
  } catch { showToast('Export failed'); }
}

// ─── TRENDS ───────────────────────────────────────────────────────────────────
async function renderTrends() {
  const grid = document.getElementById('trends-grid');
  grid.innerHTML = `<div class="loading" style="grid-column:1/-1"><div class="spinner"></div><span>Loading trends…</span></div>`;
  try {
    const res  = await fetch(`${API}/trends`);
    const data = await res.json();
    const allCounts = Object.values(data).flatMap(rows => rows.map(r => r.patent_count));
    const max = Math.max(...allCounts, 1);
    const MONTHS = ['Nov','Dec','Jan','Feb','Mar','Apr'];

    grid.innerHTML = Object.entries(data).map(([cat, rows]) => `
      <div class="trend-card">
        <div class="trend-category">${cat}</div>
        ${rows.map((r, i) => `
          <div class="trend-bar-row">
            <span class="trend-month">${MONTHS[i] || r.month}</span>
            <div class="trend-bar-bg"><div class="trend-bar-fill" style="width:${(r.patent_count/max*100).toFixed(1)}%"></div></div>
            <span class="trend-count">${Number(r.patent_count).toLocaleString()}</span>
          </div>`).join('')}
      </div>`).join('');
  } catch {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">⚠️</div><div class="empty-title">Could not load trends</div></div>`;
  }
}

// ─── UTILS ────────────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
