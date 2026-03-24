# CLAUDE.md

デジタルアーカイブに関するドキュメントを管理するためのリポジトリである。

## 技術スタック

- pnpm 10 (workspace + catalog)
- TypeScript 5
- Next.js 16 / React 19
- Tailwind CSS 4（設定ファイル不要、CSS の `@import` で構成）
- ESLint 9（flat config）/ Prettier 3
- Fumadocs（ドキュメント）

## 構成

pnpm workspace モノレポ。`apps/*` にアプリ、`packages/*` に共有パッケージ。

- `apps/docs` — Fumadocs + Next.js 16 のドキュメントサイト
- `packages/eslint-config` — 共有 ESLint 設定 (`@repo/eslint-config`)

## コマンド

```bash
pnpm install                  # 依存インストール
pnpm lint                     # 全体の lint
pnpm --filter docs dev        # docs 開発サーバー
pnpm --filter docs build      # docs ビルド
```

## コーディング規約

- 関数はアロー関数で定義する（`function` 宣言は ESLint で禁止）
- default export は原則禁止（Next.js の規約ファイルは除外済み）
- import は `import/order` で自動ソート。external → internal の順、グループ間に空行
- `../../` 以上の相対パスは禁止。`@/` エイリアスを使う
- Prettier: シングルクォート、セミコロンあり、末尾カンマあり

## lint-staged の注意点

lint-staged の eslint は `pnpm --filter <app> exec eslint` で実行する。
ルートに eslint.config がないため、`eslint` を直接呼ぶとエラーになる。
アプリ追加時は `package.json` の `lint-staged` にエントリを追加すること。
