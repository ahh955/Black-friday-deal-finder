// Money and percent formatting for DealHound. One job: turn numbers into
// the strings the page shows, so a price is never typed in twice.

export function money(n) {
  return '$' + n.toFixed(2).replace(/\.00$/, '');
}

export function moneyFull(n) {
  return '$' + n.toFixed(2);
}

// Whole-percent discount from the two prices, so the figure on a card always
// matches the prices printed beside it.
export function discountPct(sale, usual) {
  return Math.round(((usual - sale) / usual) * 100);
}

export function saving(sale, usual) {
  return usual - sale;
}
