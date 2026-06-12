# Markdown Preview Engine

iPhoneアプリに将来的にWKWebViewで同梱することを想定した、静的Web版のMarkdown Preview Engine試作品です。XcodeなしでブラウザとGitHub Pages上で表示確認できるように、素のHTML/CSS/JavaScriptで構成しています。

## 構成

```text
markdown-preview-engine/
├─ index.html
├─ preview.html
├─ css/
│  └─ style.css
├─ js/
│  ├─ app.js
│  ├─ i18n.js
│  └─ preview.js
├─ sample.md
├─ README.md
└─ vendor/
   ├─ markdown-it/
   │  └─ markdown-it.min.js
   └─ markdown-it-emoji/
      └─ markdown-it-emoji.min.js
```

## 機能

- Markdown入力欄とリアルタイムプレビュー
- `.md`, `.markdown`, `.txt` ファイルの読み込み
- `sample.md` の読み込み
- `markdown-it` によるMarkdown変換
- `markdown-it-emoji` によるGFM風の絵文字記法
- Markdown内HTMLタグの直接埋め込みを無効化
- リンクを別タブで開き、`rel="noopener noreferrer"` を付与
- ライト/ダーク/システムテーマ切り替え
- 本文文字サイズの切り替え
- 入力中のMarkdown、テーマ、文字サイズを `localStorage` に保存
- `preview.html` で本文だけのプレビュー表示
- iPhone幅で縦並び表示
- 長いURLの折り返し
- 画像の画面幅内縮小
- コードブロックだけ横スクロール
- Markdownから生成された表を `.table-wrapper` で包み、表だけ横スクロール

## ローカルでの起動方法

このプロジェクトは静的ファイルだけで動作します。ファイル読み込みや `sample.md` の `fetch` を安定して確認するため、簡易HTTPサーバーで起動してください。

```bash
python3 -m http.server 8000
```

ブラウザで以下を開きます。

```text
http://localhost:8000
```

本文だけのプレビュー画面は以下で開けます。

```text
http://localhost:8000/preview.html
```

`index.html` の「プレビューを開く」ボタンからも開けます。編集中のMarkdown、テーマ、文字サイズは `localStorage` 経由で `preview.html` に引き継がれます。

## 絵文字記法

`markdown-it-emoji` を同梱しているため、GFM風の絵文字記法を表示できます。

```markdown
:smile: :rocket: :tada:
```

表示例:

```text
😄 🚀 🎉
```

## markdown-it と markdown-it-emoji の同梱

`vendor/` 配下に `markdown-it` と `markdown-it-emoji` を同梱してCDN依存を避ける想定です。未配置の場合は以下で取得してください。

```bash
mkdir -p vendor/markdown-it vendor/markdown-it-emoji
curl -L -o vendor/markdown-it/markdown-it.min.js https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js
curl -L -o vendor/markdown-it-emoji/markdown-it-emoji.min.js https://cdn.jsdelivr.net/npm/markdown-it-emoji@3.0.0/dist/markdown-it-emoji.min.js
```

取得後は `index.html` と `preview.html` がローカルの `vendor/` 配下から読み込みます。

## GitHub Pagesで公開する手順

GitHub CLIで `lalamalink@gmail.com` のGitHubアカウントにログインしていることを確認します。

```bash
gh auth status
```

未ログインまたは別アカウントの場合は、対象アカウントでログインし直します。

```bash
gh auth login
```

リポジトリ作成、初回pushの例です。

```bash
git init
git add index.html preview.html css/style.css js/app.js js/i18n.js js/preview.js sample.md README.md vendor/markdown-it/markdown-it.min.js vendor/markdown-it-emoji/markdown-it-emoji.min.js
git commit -m "Initial markdown preview engine"
gh repo create markdown-preview-engine --public --source=. --remote=origin --push
```

GitHub上で以下を設定します。

1. GitHubのリポジトリページを開く
2. `Settings` を開く
3. `Pages` を開く
4. `Build and deployment` の `Source` を `Deploy from a branch` にする
5. `Branch` を `main`、フォルダを `/ (root)` にして保存する

公開URLは通常、以下の形式になります。

```text
https://<github-user>.github.io/markdown-preview-engine/
```

このリポジトリでは、以下のURLで確認できます。

```text
https://lalamalink.github.io/markdown-preview-engine/
https://lalamalink.github.io/markdown-preview-engine/preview.html
```

## iPhone Safariで確認する方法

GitHub Pages公開後、iPhone Safariで公開URLを開いて確認します。

重点確認項目:

- ページ全体が横スクロールしない
- 長いURLが折り返される
- 画像が画面幅内に収まる
- コードブロックだけ横スクロールできる
- 表だけ横スクロールできる
- テーマ切り替えが反映される
- 文字サイズ切り替えが反映される
- `.md` ファイル選択後にファイル名とプレビューが更新される
- `:smile: :rocket: :tada:` が `😄 🚀 🎉` と表示される
- 「プレビューを開く」から本文だけの `preview.html` を開ける
- `preview.html` ではヘッダー、入力欄、操作パネル、枠線が表示されない

## WKWebView同梱に向けた想定

最終的には `index.html`, `preview.html`, `css/`, `js/`, `sample.md`, `vendor/` をiPhoneアプリのバンドルに含め、WKWebViewでローカル表示する想定です。インターネット接続なしで動かすため、外部CDNや外部画像への依存は避ける方針です。

## セキュリティ上の注意

初期版では、ユーザーがローカルで読み込んだMarkdownをブラウザ内でHTML変換して表示します。`markdown-it` は `html: false` にしているため、Markdown内のHTMLタグは直接HTMLとしては解釈しません。

GitHub Pagesは公開Webサイトです。実データ、個人情報、社内情報、機密情報を含むMarkdownや画像をリポジトリやGitHub Pagesに置かないでください。

## 既知の制約

- Markdownファイルの文字コードはUTF-8前提です。
- 保存機能はありません。
- 表のカード表示は未対応です。
- 外部画像URLはネットワーク接続がない環境では表示されません。
- WKWebView組み込み時のファイル読み込み権限やアプリ側ブリッジは未実装です。
