import test from 'node:test'; import assert from 'node:assert';
import { parseNews, formatDate } from '../src/parse.js';
const md = `---
date: 2026-10-22
day: 床の日
title: 今日のAIニュース
---
## OpenAIが新モデル発表
概要テキスト

## Anthropicの話
本文
`;
test('frontmatter', () => { const r = parseNews(md); assert.equal(r.day, '床の日'); assert.equal(r.date, '2026-10-22'); });
test('sections', () => { const r = parseNews(md); assert.equal(r.items.length, 2); assert.equal(r.items[0].title, 'OpenAIが新モデル発表'); assert.match(r.items[1].body, /本文/); });
test('date format', () => { assert.equal(formatDate('2026-10-22'), '10月22日（木曜日）'); });
