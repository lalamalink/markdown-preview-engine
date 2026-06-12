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
      horizontalScrollHint: "横にスクロールできます →",
      resetHorizontalScroll: "横スクロール位置を左端に戻す",
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
      horizontalScrollHint: "Scroll horizontally →",
      resetHorizontalScroll: "Reset horizontal scroll to the left edge",
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

  window.MarkdownPreviewEngine.enhanceTaskListItems = function enhanceTaskListItems(root) {
    root.querySelectorAll("li").forEach((item) => {
      const match = item.innerHTML.match(/^\s*\[( |x|X)\]\s+/);
      if (!match) return;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.disabled = true;
      checkbox.checked = match[1].toLowerCase() === "x";

      item.innerHTML = item.innerHTML.replace(/^\s*\[( |x|X)\]\s+/, "");
      item.prepend(checkbox);
    });
  };

  function createScrollHint(t) {
    const hint = document.createElement("button");
    hint.type = "button";
    hint.className = "scroll-hint";
    hint.textContent = t.horizontalScrollHint;
    hint.setAttribute("aria-label", t.resetHorizontalScroll);
    return hint;
  }

  function scrollToLeft(scrollElement) {
    try {
      scrollElement.scrollTo({ left: 0, behavior: "smooth" });
    } catch (error) {
      scrollElement.scrollLeft = 0;
    }
  }

  function updateScrollCue(wrap, scrollElement) {
    const canScrollRight = scrollElement.scrollLeft + scrollElement.clientWidth < scrollElement.scrollWidth - 1;
    wrap.classList.toggle("is-scrollable", scrollElement.scrollWidth > scrollElement.clientWidth + 1);
    wrap.classList.toggle("is-scrolled", scrollElement.scrollLeft > 4);
    wrap.classList.toggle("is-at-end", !canScrollRight);
  }

  window.MarkdownPreviewEngine.wrapScrollableTables = function wrapScrollableTables(root) {
    const t = window.MarkdownPreviewEngine.getText();

    root.querySelectorAll("table").forEach((table) => {
      if (table.closest(".table-scroll-wrap")) return;

      const parent = table.parentElement;
      if (!parent || table.scrollWidth <= parent.clientWidth + 1) return;

      const wrap = document.createElement("div");
      const scroll = document.createElement("div");
      const hint = createScrollHint(t);

      wrap.className = "table-scroll-wrap";
      scroll.className = "table-scroll";
      hint.classList.add("table-scroll-hint");

      parent.insertBefore(wrap, table);
      wrap.appendChild(scroll);
      scroll.appendChild(table);
      wrap.appendChild(hint);

      scroll.addEventListener("scroll", () => updateScrollCue(wrap, scroll), { passive: true });
      hint.addEventListener("click", () => {
        scrollToLeft(scroll);
        window.setTimeout(() => updateScrollCue(wrap, scroll), 180);
        hint.blur();
      });
      window.addEventListener("resize", () => updateScrollCue(wrap, scroll));
      updateScrollCue(wrap, scroll);
    });
  };

  window.MarkdownPreviewEngine.wrapScrollableCodeBlocks = function wrapScrollableCodeBlocks(root) {
    const t = window.MarkdownPreviewEngine.getText();

    root.querySelectorAll("pre").forEach((pre) => {
      if (pre.closest(".code-scroll-wrap")) return;
      if (pre.scrollWidth <= pre.clientWidth + 1) return;

      const parent = pre.parentElement;
      if (!parent) return;

      const wrap = document.createElement("div");
      const hint = createScrollHint(t);

      wrap.className = "code-scroll-wrap";
      pre.classList.add("code-scroll");
      hint.classList.add("code-scroll-hint");

      parent.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      wrap.appendChild(hint);

      pre.addEventListener("scroll", () => updateScrollCue(wrap, pre), { passive: true });
      hint.addEventListener("click", () => {
        scrollToLeft(pre);
        window.setTimeout(() => updateScrollCue(wrap, pre), 180);
        hint.blur();
      });
      window.addEventListener("resize", () => updateScrollCue(wrap, pre));
      updateScrollCue(wrap, pre);
    });
  };
})();
