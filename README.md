# AI Daily

毎朝ClaudeがAIニュースをMDで書き、pushすると表示されるニュースサイト。

## MDの書式（`public/news/YYYY-MM-DD.md`）

```md
---
date: 2026-10-22
day: 床の日
title: 今日のAIニュース
---
## 記事タイトル1
本文（Markdown可、ソースリンクも）

## 記事タイトル2
本文
```

- `## ` 1つ = ニュース1件
- index.json はビルド時に自動生成

## ローカル確認

```sh
npm install && npm run dev
```

## テスト

```sh
node --test tests/parse.test.mjs
```

## 公開

GitHub Pages（Settings → Pages → Source: GitHub Actions）。main への push でテスト→ビルド→デプロイ。
