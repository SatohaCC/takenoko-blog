# Satoha's Blog

Next.js・PandaCSS・MDX で構築した静的生成ブログ（[satoha.net](https://satoha.net/)）。

## 技術スタック

Next.js 16 (App Router) / PandaCSS / React Aria Components / MDX / Storybook / Vitest / Playwright

## はじめに

```bash
npm install
npm run dev      # http://localhost:3000
```

## 主な npm scripts

| コマンド            | 説明              |
| ------------------- | ----------------- |
| `npm run dev`       | 開発サーバー起動  |
| `npm run build`     | 本番ビルド        |
| `npm run lint`      | ESLint 実行       |
| `npm run format`    | Prettier 整形     |
| `npm run storybook` | Storybook 起動    |
| `npm run test`      | テスト実行        |

## 記事の追加

`src/content/posts/` に `.mdx` ファイルを作成します。

```mdx
---
title: '記事タイトル'
date: '2024-01-01'
excerpt: '記事の概要'
tags: ['Next.js', 'React']
---

ここに本文...
```

## ドキュメント

- [デザイン](docs/DESIGN.md) — デザインシステム・PandaCSS
- [テスト](docs/TESTING.md) — Vitest / Storybook / Playwright の使い分け
- [アニメーション](docs/ANIMATIONS.md) — モーション設計
