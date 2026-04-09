# IIIF 画像配信の技術構成

## 概要

高解像度の画像を効率的に配信・表示するために、IIIF（International Image Interoperability Framework）Image API 3.0 を採用する。

## 全体の流れ

画像の登録から表示まで、以下の流れで処理する。

1. 通常の画像（JPEG/PNG）をアップロードする
2. Pyramidal TIFF に変換し、ストレージに配置する
3. Viewer が info.json（画像メタデータ）を取得する
4. Viewer が表示領域に応じたタイルリクエストを送信する
5. IIIF Image Server がソース画像から該当タイルを切り出して返す

## 技術構成

```
┌─────────────────────────────────────────────────────┐
│  Viewer（OpenSeadragon）                              │
│  info.json を取得し、タイル URL を組み立てて表示する       │
└──────────────┬──────────────────────────────────────┘
               │ HTTP
┌──────────────▼──────────────────────────────────────┐
│  IIIF Image API エンドポイント（Next.js Route Handler） │
│  iiif-processor がリクエストを処理する                   │
└──────────────┬──────────────────────────────────────┘
               │
┌──────────────▼──────────────────────────────────────┐
│  ソース画像ストレージ（Pyramidal TIFF）                  │
└─────────────────────────────────────────────────────┘
```

| レイヤー | 役割 | 採用技術 |
|---|---|---|
| Viewer | タイルのズーム・パン表示 | OpenSeadragon |
| IIIF Image API | URL パース、画像処理、info.json 生成 | iiif-processor（npm） |
| ストレージ | Pyramidal TIFF の保管 | ローカルファイルシステム（将来的に S3 等） |

### IIIF Image API の URL 体系

```
GET /api/iiif/3/{identifier}/info.json
GET /api/iiif/3/{identifier}/{region}/{size}/{rotation}/{quality}.{format}
```

- `info.json`: 画像のメタデータ（幅・高さ・タイル情報）を返す。Viewer が最初に取得する
- 画像リクエスト: 指定された領域・サイズ・回転・品質・フォーマットで画像を返す

## Pyramidal TIFF

### なぜ変換が必要か

IIIF Image Server は、リクエストに応じてソース画像から必要な領域だけを切り出して配信する。通常の JPEG/PNG はランダムアクセスができないため、タイル1枚を返すだけでも画像全体をメモリに展開する必要がある。

Pyramidal TIFF（PTIF）は複数の解像度レイヤーと空間タイルを1ファイルに持つフォーマットであり、必要なタイルだけをファイルから直接読み出せる。これにより、画像サイズに依存しない一定のメモリ消費で配信が可能になる。

### 内部構造

```
Level 0: 原寸（例: 8000 x 6000）
Level 1: 1/2（4000 x 3000）
Level 2: 1/4（2000 x 1500）
Level 3: 1/8（1000 x 750）
...
各レベルが 256x256 のタイルに分割されている
```

Viewer がズームアウトしている場合は低解像度レイヤーから、ズームインしている場合は高解像度レイヤーから、表示領域に該当するタイルだけを取得する。

### 変換方法

libvips の `vips` コマンドを使用する。IIIF サーバーの実装（Cantaloupe, IIPImage 等）でも推奨されている標準的な手法である。

```bash
# インストール（macOS）
brew install vips

# JPEG/PNG → Pyramidal TIFF
vips tiffsave input.jpg output.ptif --tile --pyramid --compression jpeg --tile-width 256 --tile-height 256
```

| オプション | 説明 |
|---|---|
| `--tile` | タイル分割を有効にする |
| `--pyramid` | 複数解像度レイヤー（ピラミッド）を生成する |
| `--compression jpeg` | タイルの圧縮方式。jpeg, deflate, lzw, webp, zstd から選択 |
| `--tile-width 256` | タイルの幅（px） |
| `--tile-height 256` | タイルの高さ（px） |
