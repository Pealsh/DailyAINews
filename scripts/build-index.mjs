// public/news/*.md から public/news/index.json を生成
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { parseNews } from '../src/parse.js';
const dir = 'public/news';
const files = readdirSync(dir).filter(f => f.endsWith('.md')).sort().reverse();
const list = files.map(f => {
  const n = parseNews(readFileSync(`${dir}/${f}`, 'utf8'));
  return { file: f, date: n.date || f.slice(0, 10), day: n.day, title: n.title, count: n.items.length, heads: n.items.slice(0, 3).map(i => i.title) };
});
writeFileSync(`${dir}/index.json`, JSON.stringify(list, null, 2));
console.log(`${list.length} 件`);
