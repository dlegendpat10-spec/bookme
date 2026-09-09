/* ===================================================================
   BOOKME — Shared App Utilities
   =================================================================== */

// ── Apply Business Config ──────────────────────────────────────────
function applyBusinessConfig() {
  const cfg = window.BUSINESS_CONFIG || {};
  // Update page title
  if (cfg.name) {
    const titleEl = document.querySelector('title');
    if (titleEl && !titleEl.dataset.custom) {
      titleEl.textContent = titleEl.textContent.replace('Bookme', cfg.name);
    }
  }
  // Update any [data-business-name] elements
  document.querySelectorAll('[data-business-name]').forEach(el => {
    el.textContent = cfg.name || 'Bookme';
  });
  document.querySelectorAll('[data-business-tagline]').forEach(el => {
    el.textContent = cfg.tagline || '';
  });
  document.querySelectorAll('[data-business-initials]').forEach(el => {
    el.textContent = cfg.initials || 'BM';
  });
}

// ── Toast Notifications ────────────────────────────────────────────
function ensureToastContainer() {
  let el = document.getElementById('toast-container');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast-container';
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'false');
    document.body.appendChild(el);
  }
  return el;
}

function showToast(message, type = 'info', durationMs = 3500) {
  const container = ensureToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `<span class="toast-dot" aria-hidden="true"></span>${escapeHtml(message)}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 300ms, transform 300ms';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => toast.remove(), 320);
  }, durationMs);
}

// ── Loading State Helpers ──────────────────────────────────────────
function setButtonLoading(btn, loading, originalText) {
  if (loading) {
    btn.disabled = true;
    btn.classList.add('loading');
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = '<span class="btn-text" style="opacity:0">' + (originalText || btn.textContent) + '</span>';
  } else {
    btn.disabled = false;
    btn.classList.remove('loading');
    if (btn.dataset.originalText) {
      btn.innerHTML = btn.dataset.originalText;
      delete btn.dataset.originalText;
    }
  }
}

function showSkeleton(container, rows = 3) {
  container.innerHTML = Array.from({length: rows}, () =>
    `<div style="height:48px;border-radius:var(--r-md);background:var(--surface-3);animation:shimmer 1.5s infinite linear;background-size:200% auto;background-image:linear-gradient(90deg,var(--surface-3) 0%,var(--surface-4) 50%,var(--surface-3) 100%);margin-bottom:.5rem"></div>`
  ).join('');
}

// ── HTML Escape ────────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Status badge HTML ─────────────────────────────────────────────
function statusBadge(status) {
  const map = {
    PENDING:   'badge-pending',
    CONFIRMED: 'badge-confirmed',
    CANCELLED: 'badge-cancelled',
    COMPLETED: 'badge-completed',
  };
  const cls = map[status] || 'badge-neutral';
  const label = status.charAt(0) + status.slice(1).toLowerCase();
  return `<span class="badge ${cls}">${label}</span>`;
}

// ── Date/Time helpers ──────────────────────────────────────────────
function isToday(dateStr) {
  return dateStr === window.API.fmt(new Date());
}
function isFuture(dateStr) {
  return dateStr > window.API.fmt(new Date());
}
function dayName(dow) {
  return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][dow];
}

// ── Sidebar toggle (admin pages) ───────────────────────────────────
function initSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebar-overlay');
  const toggle   = document.getElementById('menu-toggle');
  if (!sidebar) return;

  function open()  { sidebar.classList.add('open');  overlay?.classList.add('open'); }
  function close() { sidebar.classList.remove('open'); overlay?.classList.remove('open'); }

  toggle?.addEventListener('click', () => sidebar.classList.contains('open') ? close() : open());
  overlay?.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // Highlight active nav item
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-item[href]').forEach(link => {
    if (link.getAttribute('href') && currentPath.endsWith(link.getAttribute('href').split('/').pop())) {
      link.classList.add('active');
    }
  });

  // Populate user info
  const user = window.API?.getAuthUser?.();
  if (user) {
    const nameEl = document.getElementById('sidebar-user-name');
    const avatarEl = document.getElementById('sidebar-avatar');
    if (nameEl) nameEl.textContent = user.full_name;
    if (avatarEl) avatarEl.textContent = user.full_name.split(' ').map(p => p[0]).join('').slice(0,2);
  }
}

// ── Modal helpers ──────────────────────────────────────────────────
function openModal(id) {
  const dialog = document.getElementById(id);
  if (dialog) dialog.showModal();
}
function closeModal(id) {
  const dialog = document.getElementById(id);
  if (dialog) dialog.close();
}
// Close on backdrop click (light dismiss)
document.addEventListener('click', e => {
  if (e.target.tagName === 'DIALOG') {
    e.target.close();
  }
});

// ── Copy to clipboard ──────────────────────────────────────────────
async function copyToClipboard(text, feedbackEl) {
  try {
    await navigator.clipboard.writeText(text);
    if (feedbackEl) {
      const orig = feedbackEl.textContent;
      feedbackEl.textContent = 'Copied!';
      setTimeout(() => { feedbackEl.textContent = orig; }, 1800);
    }
    showToast('Copied to clipboard', 'success');
  } catch {
    showToast('Could not copy', 'error');
  }
}

// ── Init on DOM ready ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  applyBusinessConfig();
  initSidebar();
});

// Expose helpers
window.APP = {
  showToast,
  setButtonLoading,
  showSkeleton,
  escapeHtml,
  statusBadge,
  isToday,
  isFuture,
  dayName,
  openModal,
  closeModal,
  copyToClipboard,
};
