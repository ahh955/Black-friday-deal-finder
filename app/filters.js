// Search, filter and sort for DealHound. One job: given the deals and the
// shopper's choices, return the deals to show, in the order to show them.
// Nothing here touches the page; render.js does that.

import { discountPct, saving } from './format.js';

export function applyFilters(deals, state) {
  const q = state.query.trim().toLowerCase();
  let list = deals.filter((d) => {
    if (state.category !== 'all' && d.cat !== state.category) return false;
    if (state.store !== 'all' && d.store !== state.store) return false;
    if (state.minDiscount > 0 && discountPct(d.sale, d.usual) < state.minDiscount) return false;
    if (q) {
      const hay = (d.name + ' ' + d.store + ' ' + d.cat).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  return sortDeals(list, state.sort);
}

export function sortDeals(list, sort) {
  const copy = [...list];
  switch (sort) {
    case 'discount':
      copy.sort((a, b) => discountPct(b.sale, b.usual) - discountPct(a.sale, a.usual));
      break;
    case 'saving':
      copy.sort((a, b) => saving(b.sale, b.usual) - saving(a.sale, a.usual));
      break;
    case 'price-asc':
      copy.sort((a, b) => a.sale - b.sale);
      break;
    case 'price-desc':
      copy.sort((a, b) => b.sale - a.sale);
      break;
    case 'verdict':
      // New lows first, then strong prices, then routine sales; inside each
      // group the biggest discount wins.
      const rank = { 'new-low': 0, strong: 1, routine: 2 };
      copy.sort(
        (a, b) =>
          rank[a.verdict] - rank[b.verdict] ||
          discountPct(b.sale, b.usual) - discountPct(a.sale, a.usual),
      );
      break;
    default:
      break;
  }
  return copy;
}
