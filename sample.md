# サンプルMarkdown

これは **Markdown Preview Engine** の表示確認用サンプルです。段落、リスト、表、コード、長いURLなどをまとめて確認できます。

## 見出しと段落

本文はiPhone Safariでも読みやすい幅に収まり、長いテキストやURLが画面外にはみ出さないことを確認します。

### 太字とインラインコード

この行には **太字** と `inline code` が含まれています。

## 箇条書き

- Markdownを貼り付ける
- `.md` ファイルを読み込む
- プレビューを確認する

## 番号リスト

1. サンプルを読み込む
2. 文字サイズを切り替える
3. ライト/ダークテーマを切り替える

## 引用

> Markdown内のHTMLタグは初期設定では無効です。ローカルで読み込んだMarkdownでも、安全側の設定で表示します。

## コードブロック

```js
const md = window.markdownit({
  html: false,
  linkify: true,
  typographer: true
});

console.log(md.render("# Hello Markdown"));
```

## リンクと長いURL

[OpenAI](https://openai.com/)

https://example.com/this/is/a/very/long/url/that/should/wrap/on/iphone/safari/without/forcing/the/whole/page/to/scroll/horizontally?with=query-string&and=more-values&preview=markdown

## 画像のサンプル記法

![サンプル画像](https://placehold.co/900x480/png?text=Markdown+Preview+Image)

## 2列の表

| 項目 | 内容 |
| --- | --- |
| 目的 | WKWebViewに将来同梱するMarkdownプレビュー |
| 実装 | 素のHTML/CSS/JavaScript |
| 表示 | 表の部分だけ横スクロール |

## 4列以上の表

| 日付 | 画面 | 確認内容 | 結果 | メモ |
| --- | --- | --- | --- | --- |
| 2026-06-12 | iPhone Safari | 長いURLの折り返し | OK | ページ全体は横スクロールしない |
| 2026-06-12 | PCブラウザ | 入力欄とプレビュー | OK | 横並びで確認しやすい |
| 2026-06-12 | GitHub Pages | 静的配信 | OK | サーバー処理なし |

## チェックボックス記法

- [x] サンプルMarkdownを読み込める
- [x] 表だけ横スクロールできる
- [ ] WKWebView同梱用の最終調整

---

区切り線の下にある最後の段落です。
