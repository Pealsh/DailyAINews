export function parseNews(md) {
  const out = { date: '', day: '', title: '', items: [] };
  let body = md.replace(/\r/g, '');
  const fm = body.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fm) {
    for (const line of fm[1].split('\n')) {
      const m = line.match(/^(\w+):\s*(.*)$/);
      if (m) out[m[1]] = m[2].trim();
    }
    body = body.slice(fm[0].length);
  }
  for (const part of body.split(/^## /m).slice(1)) {
    const [title, ...rest] = part.split('\n');
    out.items.push({ title: title.trim(), body: rest.join('\n').trim() });
  }
  return out;
}
const W = ['日', '月', '火', '水', '木', '金', '土'];
export function formatDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  const w = new Date(y, m - 1, d).getDay();
  return `${m}月${d}日（${W[w]}曜日）`;
}
