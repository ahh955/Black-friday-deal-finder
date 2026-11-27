// Wiring for DealHound. One job: read the controls, keep the state, and put
// the right deals on the page — the list, or one deal's page on a #/deal/<id>
// route. All the work of filtering and drawing lives in filters.js and
// render.js; this file only connects them to the page.

import { DEALS, CATEGORIES, STORES } from './deals.js';
import { applyFilters } from './filters.js';
import { dealList, dealDetail } from './render.js';
import { discountPct } from './format.js';

const state = { query: '', category: 'all', store: 'all', minDiscount: 0, sort: 'verdict' };

const resultsEl = document.getElementById('results');
const countEl = document.getElementById('count');
const listView = document.getElementById('list-view');
const detailView = document.getElementById('detail-view');

function fillSelect(el, items) {
  for (const item of items) {
    const opt = document.createElement('option');
    opt.value = item;
    opt.textContent = item;
    el.appendChild(opt);
  }
}

fillSelect(document.getElementById('category'), CATEGORIES);
fillSelect(document.getElementById('store'), STORES);

function render() {
  const hash = location.hash;
  const match = hash.match(/^#\/deal\/([a-z0-9-]+)$/);
  if (match) {
    const deal = DEALS.find((d) => d.id === match[1]);
    if (deal) {
      listView.hidden = true;
      detailView.hidden = false;
      detailView.innerHTML = dealDetail(deal);
      document.title = deal.name + ' — DealHound';
      window.scrollTo(0, 0);
      return;
    }
  }
  listView.hidden = false;
  detailView.hidden = true;
  document.title = 'DealHound — Black Friday 2026 Deal Finder';
  const shown = applyFilters(DEALS, state);
  resultsEl.innerHTML = dealList(shown);
  const best = shown.length ? Math.max(...shown.map((d) => discountPct(d.sale, d.usual))) : 0;
  countEl.textContent =
    shown.length === DEALS.length
      ? `${DEALS.length} deals · up to ${best}% off`
      : `${shown.length} of ${DEALS.length} deals · up to ${best}% off`;
}

document.getElementById('search').addEventListener('input', (e) => {
  state.query = e.target.value;
  render();
});
document.getElementById('category').addEventListener('change', (e) => {
  state.category = e.target.value;
  render();
});
document.getElementById('store').addEventListener('change', (e) => {
  state.store = e.target.value;
  render();
});
document.getElementById('discount').addEventListener('change', (e) => {
  state.minDiscount = Number(e.target.value);
  render();
});
document.getElementById('sort').addEventListener('change', (e) => {
  state.sort = e.target.value;
  render();
});
document.getElementById('clear').addEventListener('click', () => {
  state.query = '';
  state.category = 'all';
  state.store = 'all';
  state.minDiscount = 0;
  state.sort = 'verdict';
  document.getElementById('search').value = '';
  document.getElementById('category').value = 'all';
  document.getElementById('store').value = 'all';
  document.getElementById('discount').value = '0';
  document.getElementById('sort').value = 'verdict';
  // Back to the list when clearing from a deal's own page.
  if (location.hash.startsWith('#/deal/')) location.hash = '#/';
  render();
});

window.addEventListener('hashchange', render);
render();
