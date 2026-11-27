// Rendering for DealHound. One job: turn deals into HTML. Every string that
// comes from the data is escaped, so a product name can never break the page.

import { money, moneyFull, discountPct, saving } from './format.js';
import { VERDICT_LABELS } from './deals.js';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function verdictBadge(verdict) {
  return `<span class="verdict verdict-${verdict}">${VERDICT_LABELS[verdict]}</span>`;
}

export function dealCard(d) {
  const pct = discountPct(d.sale, d.usual);
  const unit = d.unit ? esc(d.unit) : '';
  const also = d.also ? `<p class="also">${esc(d.also)}</p>` : '';
  return `<article class="card" data-id="${esc(d.id)}">
  <div class="card-top">
    <span class="store">${esc(d.store)}</span>
    <span class="cat">${esc(d.cat)}</span>
  </div>
  <h3 class="name"><a href="#/deal/${esc(d.id)}">${esc(d.name)}</a></h3>
  <div class="prices">
    <span class="sale">${money(d.sale)}${unit}</span>
    <span class="usual">${moneyFull(d.usual)}${unit}</span>
    <span class="pct">−${pct}%</span>
  </div>
  <p class="save">You save ${money(saving(d.sale, d.usual))}</p>
  <p class="verdict-row">${verdictBadge(d.verdict)}</p>
  <p class="evidence">${esc(d.evidence)}</p>
  ${also}
  <p class="checked">Checked ${esc(d.checked)} · Source: ${esc(d.source)}</p>
  <a class="buy" href="${esc(d.url)}" target="_blank" rel="noopener">View at ${esc(d.store)} ↗</a>
</article>`;
}

export function dealList(deals) {
  if (deals.length === 0) {
    return '<p class="empty">No deals match those filters. Try clearing the search or lowering the discount.</p>';
  }
  return deals.map(dealCard).join('\n');
}

export function dealDetail(d) {
  const pct = discountPct(d.sale, d.usual);
  const unit = d.unit ? esc(d.unit) : '';
  const also = d.also ? `<p class="also">${esc(d.also)}</p>` : '';
  return `<article class="detail">
  <p class="crumbs"><a href="#/">← All deals</a></p>
  <div class="card-top">
    <span class="store">${esc(d.store)}</span>
    <span class="cat">${esc(d.cat)}</span>
  </div>
  <h2 class="name">${esc(d.name)}</h2>
  <div class="prices big">
    <span class="sale">${money(d.sale)}${unit}</span>
    <span class="usual">${moneyFull(d.usual)}${unit}</span>
    <span class="pct">−${pct}%</span>
  </div>
  <p class="save">You save ${money(saving(d.sale, d.usual))} off the usual price.</p>
  <p class="verdict-row">${verdictBadge(d.verdict)}</p>
  <p class="evidence">${esc(d.evidence)}</p>
  ${also}
  <dl class="facts">
    <div><dt>Store</dt><dd>${esc(d.store)}</dd></div>
    <div><dt>Sale price</dt><dd>${money(d.sale)}${unit}</dd></div>
    <div><dt>Usual price</dt><dd>${moneyFull(d.usual)}${unit}</dd></div>
    <div><dt>Discount</dt><dd>${pct}% (${money(saving(d.sale, d.usual))} off)</dd></div>
    <div><dt>Price checked</dt><dd>${esc(d.checked)}</dd></div>
    <div><dt>Checked at</dt><dd>${esc(d.source)}</dd></div>
  </dl>
  <a class="buy big" href="${esc(d.url)}" target="_blank" rel="noopener">View at ${esc(d.store)} ↗</a>
  <p class="note">Prices move fast on Black Friday — check the price at checkout before you pay.</p>
</article>`;
}
