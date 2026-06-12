# Markdown Preview Engine

Markdown Preview Engine is a WKWebView-ready Markdown rendering prototype for an iPhone Markdown reader app.

このリポジトリは、単なるWeb版Markdownビューアではありません。最終的には **iPhone向けMarkdown reader app** の中で、`WKWebView` に組み込む Markdown Preview Engine として使うことを想定しています。

現時点では、Xcodeを使わずに表示と操作感を検証できるよう、plain HTML / CSS / JavaScript だけで作った静的Webプロトタイプとして実装しています。React、Vue、Next.js などのフロントエンドフレームワークは使っていません。

Markdown変換には `markdown-it` を使用しています。将来的にiOSアプリ内でオフライン動作できるよう、`markdown-it` と `markdown-it-emoji` はCDNではなく `vendor/` 配下に同梱する方針です。

## Demo

GitHub Pages:

https://lalamalink.github.io/markdown-preview-engine/

本文専用プレビュー:

https://lalamalink.github.io/markdown-preview-engine/preview.html

## 主な機能

- Markdown貼り付け入力
- `.md` / `.markdown` / `.txt` ファイル読み込み
- `sample.md` の読み込み
- `markdown-it` によるMarkdown変換
- CommonMark系の基本記法対応
- GFM風の表表示
- GFM風のタスクリスト
- GFM風の打ち消し線
- GFM風の絵文字記法
- Markdown内HTMLタグの直接描画を無効化
- リンクを別タブで開き、`rel="noopener noreferrer"` を付与
- ライト / ダーク / システムテーマ切り替え
- 文字サイズ切り替え
- 入力中のMarkdown、テーマ、文字サイズを `localStorage` に保存
- `preview.html` による本文専用プレビュー
- UI文言のJavaScript辞書管理
- iPhone Safariでの表示確認
- 将来の `WKWebView` 組み込みを想定した構成

## モバイル表示で重視していること

このエンジンでは、iPhoneの狭い画面でMarkdown本文を読みやすく表示することを重視しています。

- 本文全体は横スクロールさせない
- 表の部分だけ横スクロール可能にする
- コードブロックだけ横スクロール可能にする
- 長いURLは折り返す
- 長い英数字も本文幅内に収める
- 画像は画面幅内に縮小する
- 横スクロール可能な表・コードブロックには「横にスクロールできます →」の小さなヒントを表示する
- ヒントをタップすると、その表またはコードブロックの横スクロール位置が左端に戻る
- 横スクロール可能でない表・コードブロックにはヒントを出さない

## Pages

### index.html

Markdownの入力・ファイル読み込み・表示確認を行う開発用画面です。

主な用途:

- Markdownの貼り付け
- Markdownファイルの読み込み
- サンプルMarkdownの読み込み
- テーマ変更
- 文字サイズ変更
- プレビュー更新
- `preview.html` を開く

### preview.html

Markdown本文だけを表示するプレビュー専用画面です。

iPhone Markdown reader app の読書画面に近い状態を確認するためのページです。

主な特徴:

- 編集UIを表示しない
- 入力欄を表示しない
- 操作ボタンを表示しない
- Markdown本文だけを表示する
- `WKWebView` に組み込む表示部分の検証に使う

## Project Structure

```text
markdown-preview-engine/
├── index.html
├── preview.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── i18n.js
│   └── preview.js
├── samples/
│   ├── commonmark.md
│   ├── gfm.md
│   └── stress-test.md
├── sample.md
├── README.md
└── vendor/
    ├── markdown-it/
    │   └── markdown-it.min.js
    └── markdown-it-emoji/
        └── markdown-it-emoji.min.js
```

`sample.md` は現在の `index.html` の「サンプルを読み込む」ボタンで使う簡易サンプルです。`samples/` は記法別・負荷確認用のMarkdown例を置くためのディレクトリです。

## Usage

1. GitHub Pages のURLを開く
2. Markdownを入力欄に貼り付ける、または `.md` / `.markdown` / `.txt` ファイルを読み込む
3. 必要に応じてテーマと文字サイズを変更する
4. 「プレビュー更新」で表示を確認する
5. 「プレビューを開く」で本文専用プレビューを確認する

## Local Preview

このプロジェクトは静的ファイルのみで構成されています。ローカルで確認する場合は、任意のローカルサーバーを使ってください。

例:

```bash
python3 -m http.server 8000
```

その後、ブラウザで以下を開きます。

```text
http://localhost:8000/
```

本文専用プレビューは以下で確認できます。

```text
http://localhost:8000/preview.html
```

## Supported Markdown Features

- Headings
- Paragraphs
- Bold / Italic
- Blockquotes
- Ordered lists
- Unordered lists
- Inline code
- Fenced code blocks
- Links
- Images
- Tables
- Task lists
- Strikethrough
- Emoji shortcodes

## Emoji Shortcodes

`markdown-it-emoji` を同梱しているため、GFM風の絵文字記法を表示できます。

```markdown
:smile: :rocket: :tada:
```

表示例:

```text
😄 🚀 🎉
```

## Design Policy

- Plain HTML / CSS / JavaScript only
- No React, Vue, Next.js, or other frontend framework
- Designed for iPhone Safari first
- Designed for future `WKWebView` integration
- Keep the rendering layer simple and portable
- Avoid horizontal scrolling on the whole page
- Allow horizontal scrolling only where it is necessary
- Keep UI text in a JavaScript dictionary for future localization
- Avoid CDN dependency where possible

## HTML Handling

For safety, raw HTML in Markdown is currently rendered as text instead of being executed or inserted as HTML.

This behavior is intentional for the current prototype because the final target is an iPhone reader app using `WKWebView`.

安全性を優先し、現時点ではMarkdown内の生HTMLはHTMLとして描画せず、文字として表示する方針です。実装上は `markdown-it` を `html: false` で初期化しています。

## Bundled Libraries

`vendor/` 配下に `markdown-it` と `markdown-it-emoji` を同梱してCDN依存を避けています。未配置の場合は以下で取得できます。

```bash
mkdir -p vendor/markdown-it vendor/markdown-it-emoji
curl -L -o vendor/markdown-it/markdown-it.min.js https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js
curl -L -o vendor/markdown-it-emoji/markdown-it-emoji.min.js https://cdn.jsdelivr.net/npm/markdown-it-emoji@3.0.0/dist/markdown-it-emoji.min.js
```

取得後は `index.html` と `preview.html` がローカルの `vendor/` 配下から読み込みます。

## iPhone Safariで確認すること

GitHub Pages公開後、iPhone Safariで公開URLを開いて確認します。

重点確認項目:

- ページ全体が横スクロールしない
- 長いURLが折り返される
- 長い英数字が本文幅内に収まる
- 画像が画面幅内に収まる
- コードブロックだけ横スクロールできる
- 表だけ横スクロールできる
- 横スクロール可能な表・コードブロックだけにヒントが表示される
- ヒントをタップすると対象要素だけ左端に戻る
- テーマ切り替えが反映される
- 文字サイズ切り替えが反映される
- `.md` ファイル選択後にファイル名とプレビューが更新される
- `:smile: :rocket: :tada:` が `😄 🚀 🎉` と表示される
- `preview.html` ではヘッダー、入力欄、操作パネル、枠線が表示されない

## Known Limitations

- 現時点では静的Webプロトタイプであり、ネイティブiOSアプリではありません。
- `WKWebView` 組み込みはまだ未実装です。
- GitHub Flavored Markdown の一部機能はGitHub本体と完全に同一ではない場合があります。
- `html: false` を使っているため、生HTMLの描画は安全性優先で無効化しています。
- ファイルアクセスの挙動は iPhone Safari と `WKWebView` で異なる可能性があります。
- 外部画像URLはネットワーク接続がない環境では表示されません。
- Markdownファイルの文字コードはUTF-8前提です。

## Roadmap

- Improve sample Markdown files
- Add more rendering test cases
- Verify behavior in iPhone Safari
- Prepare `WKWebView` integration
- Package the engine for offline use inside the iOS app bundle
- Add localization support
- Consider native iOS settings UI integration

## Security Notes

初期版では、ユーザーがローカルで読み込んだMarkdownをブラウザ内でHTML変換して表示します。Markdown内HTMLは `html: false` により直接HTMLとして解釈しません。

GitHub Pagesは公開Webサイトです。実データ、個人情報、社内情報、機密情報を含むMarkdownや画像をリポジトリやGitHub Pagesに置かないでください。
