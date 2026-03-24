# dac-repo

pnpm workspace によるモノレポ構成のプロジェクト。

## 技術スタック

| カテゴリ | 技術 |
| --- | --- |
| パッケージマネージャ | pnpm 10 (workspace) |
| 言語 | TypeScript 5 |
| フレームワーク | Next.js 16, React 19 |
| ドキュメント | Fumadocs |
| CSS | Tailwind CSS 4 |
| Linter / Formatter | ESLint 9 (flat config), Prettier 3 |
| Git Hooks | Husky, lint-staged |

## プロジェクト構成

```
├── apps/
│   └── docs/             # ドキュメントサイト (Fumadocs + Next.js)
├── packages/
│   └── eslint-config/    # 共有 ESLint 設定 (@repo/eslint-config)
├── .husky/               # Git hooks (pre-commit, pre-push)
├── pnpm-workspace.yaml   # ワークスペース定義 + catalog
├── .prettierrc.json      # Prettier 設定
└── package.json
```

## セットアップ

```bash
pnpm install
```

## 開発

```bash
# ドキュメントサイトの開発サーバーを起動
pnpm --filter docs dev
```

## 主要コマンド

| コマンド | 説明 |
| --- | --- |
| `pnpm install` | 依存関係のインストール |
| `pnpm lint` | 全ワークスペースの ESLint を実行 |
| `pnpm lint:fix` | 全ワークスペースの ESLint 自動修正 |
| `pnpm --filter docs dev` | ドキュメントサイトの開発サーバー起動 |
| `pnpm --filter docs build` | ドキュメントサイトのビルド |

## Git Hooks

| フック | 実行内容 |
| --- | --- |
| pre-commit | lint-staged (Prettier チェック + ESLint) |
| pre-push | `pnpm run lint` |
