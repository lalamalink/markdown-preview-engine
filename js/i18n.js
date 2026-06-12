(function () {
  "use strict";

  window.MarkdownPreviewEngine = window.MarkdownPreviewEngine || {};

  window.MarkdownPreviewEngine.i18n = {
    ja: {
      openFile: ".mdファイルを開く",
      loadSample: "サンプルを読み込む",
      updatePreview: "プレビュー更新",
      openPreview: "プレビューを開く",
      preview: "プレビュー",
      editor: "Markdown入力",
      theme: "テーマ",
      themeSystem: "システム",
      themeLight: "ライト",
      themeDark: "ダーク",
      fontSize: "文字サイズ",
      fontSmall: "小",
      fontNormal: "標準",
      fontLarge: "大",
      fontXLarge: "特大",
      noFile: "ファイル未選択",
      loadedSample: "サンプルを読み込みました",
      loadedFile: "読み込み完了",
      updated: "更新済み",
      markdownItMissing: "markdown-it.min.js が読み込めませんでした",
      emojiMissing: "markdown-it-emoji が読み込めませんでした",
      editorPlaceholder: "ここにMarkdownを入力または貼り付けてください。"
    },
    en: {
      openFile: "Open .md file",
      loadSample: "Load sample",
      updatePreview: "Update preview",
      openPreview: "Open preview",
      preview: "Preview",
      editor: "Markdown input",
      theme: "Theme",
      themeSystem: "System",
      themeLight: "Light",
      themeDark: "Dark",
      fontSize: "Text size",
      fontSmall: "Small",
      fontNormal: "Normal",
      fontLarge: "Large",
      fontXLarge: "Extra large",
      noFile: "No file selected",
      loadedSample: "Sample loaded",
      loadedFile: "Loaded",
      updated: "Updated",
      markdownItMissing: "Could not load markdown-it.min.js",
      emojiMissing: "Could not load markdown-it-emoji",
      editorPlaceholder: "Type or paste Markdown here."
    }
  };

  window.MarkdownPreviewEngine.lang = "ja";
  window.MarkdownPreviewEngine.storageKeys = {
    theme: "markdown-preview-engine:theme",
    fontSize: "markdown-preview-engine:font-size",
    content: "markdown-preview-engine:content"
  };

  window.MarkdownPreviewEngine.getText = function getText() {
    const lang = window.MarkdownPreviewEngine.lang;
    return window.MarkdownPreviewEngine.i18n[lang];
  };

  window.MarkdownPreviewEngine.applyI18n = function applyI18n(root) {
    const scope = root || document;
    const t = window.MarkdownPreviewEngine.getText();

    scope.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      if (t[key]) node.textContent = t[key];
    });

    scope.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const key = node.getAttribute("data-i18n-placeholder");
      if (t[key]) node.setAttribute("placeholder", t[key]);
    });
  };
})();
