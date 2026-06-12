(function () {
  "use strict";

  const i18n = {
    ja: {
      openFile: ".mdファイルを開く",
      loadSample: "サンプルを読み込む",
      updatePreview: "プレビュー更新",
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
      editorPlaceholder: "ここにMarkdownを入力または貼り付けてください。"
    },
    en: {
      openFile: "Open .md file",
      loadSample: "Load sample",
      updatePreview: "Update preview",
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
      editorPlaceholder: "Type or paste Markdown here."
    }
  };

  const lang = "ja";
  const t = i18n[lang];
  const storageKeys = {
    theme: "markdown-preview-engine:theme",
    fontSize: "markdown-preview-engine:font-size",
    content: "markdown-preview-engine:content"
  };

  const elements = {
    input: document.getElementById("markdownInput"),
    preview: document.getElementById("preview"),
    fileInput: document.getElementById("fileInput"),
    fileName: document.getElementById("fileName"),
    loadSampleButton: document.getElementById("loadSampleButton"),
    updatePreviewButton: document.getElementById("updatePreviewButton"),
    themeSelect: document.getElementById("themeSelect"),
    fontSizeSelect: document.getElementById("fontSizeSelect"),
    editorStatus: document.getElementById("editorStatus"),
    previewStatus: document.getElementById("previewStatus")
  };

  const md = window.markdownit
    ? window.markdownit({
        html: false,
        linkify: true,
        typographer: true,
        breaks: false
      })
    : null;

  if (md) {
    const defaultRender =
      md.renderer.rules.link_open ||
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

    md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
      const targetIndex = tokens[idx].attrIndex("target");
      const relIndex = tokens[idx].attrIndex("rel");

      if (targetIndex < 0) {
        tokens[idx].attrPush(["target", "_blank"]);
      } else {
        tokens[idx].attrs[targetIndex][1] = "_blank";
      }

      if (relIndex < 0) {
        tokens[idx].attrPush(["rel", "noopener noreferrer"]);
      } else {
        tokens[idx].attrs[relIndex][1] = "noopener noreferrer";
      }

      return defaultRender(tokens, idx, options, env, self);
    };
  }

  function applyI18n() {
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      if (t[key]) node.textContent = t[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const key = node.getAttribute("data-i18n-placeholder");
      if (t[key]) node.setAttribute("placeholder", t[key]);
    });
  }

  function resolveTheme(theme) {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = resolveTheme(theme);
    elements.themeSelect.value = theme;
    localStorage.setItem(storageKeys.theme, theme);
  }

  function applyFontSize(size) {
    document.documentElement.dataset.fontSize = size;
    elements.fontSizeSelect.value = size;
    localStorage.setItem(storageKeys.fontSize, size);
  }

  function wrapTables() {
    elements.preview.querySelectorAll("table").forEach((table) => {
      if (table.parentElement && table.parentElement.classList.contains("table-wrapper")) {
        return;
      }

      const wrapper = document.createElement("div");
      wrapper.className = "table-wrapper";
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }

  function enhanceTaskListItems() {
    elements.preview.querySelectorAll("li").forEach((item) => {
      const match = item.innerHTML.match(/^\s*\[( |x|X)\]\s+/);
      if (!match) return;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.disabled = true;
      checkbox.checked = match[1].toLowerCase() === "x";

      item.innerHTML = item.innerHTML.replace(/^\s*\[( |x|X)\]\s+/, "");
      item.prepend(checkbox);
    });
  }

  function renderMarkdown(markdown) {
    if (!md) {
      elements.preview.innerHTML = "";
      const message = document.createElement("p");
      message.textContent = t.markdownItMissing;
      elements.preview.appendChild(message);
      elements.previewStatus.textContent = "";
      return;
    }

    elements.preview.innerHTML = md.render(markdown || "");
    wrapTables();
    enhanceTaskListItems();
    elements.previewStatus.textContent = t.updated;
  }

  function updateContent(markdown, statusText) {
    elements.input.value = markdown;
    localStorage.setItem(storageKeys.content, markdown);
    renderMarkdown(markdown);
    elements.editorStatus.textContent = statusText || "";
  }

  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => fn.apply(this, args), delay);
    };
  }

  async function loadSample() {
    const response = await fetch("sample.md", { cache: "no-cache" });
    if (!response.ok) throw new Error("sample.md could not be loaded");
    const markdown = await response.text();
    elements.fileName.textContent = "sample.md";
    updateContent(markdown, t.loadedSample);
  }

  function loadFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const markdown = String(reader.result || "");
      elements.fileName.textContent = file.name;
      updateContent(markdown, t.loadedFile);
    });
    reader.readAsText(file, "utf-8");
  }

  function init() {
    applyI18n();

    const savedTheme = localStorage.getItem(storageKeys.theme) || "system";
    const savedFontSize = localStorage.getItem(storageKeys.fontSize) || "normal";
    const savedContent = localStorage.getItem(storageKeys.content);

    applyTheme(savedTheme);
    applyFontSize(savedFontSize);

    const initialContent =
      savedContent ||
      "# Markdown Preview Engine\n\nMarkdownを入力すると、ここにプレビューが表示されます。\n\n- `.md` ファイルを読み込めます\n- 表とコードブロックはその部分だけ横スクロールします\n- テーマと文字サイズは保存されます\n";

    updateContent(initialContent, "");

    const debouncedRender = debounce(() => {
      const markdown = elements.input.value;
      localStorage.setItem(storageKeys.content, markdown);
      renderMarkdown(markdown);
      elements.editorStatus.textContent = "";
    }, 180);

    elements.input.addEventListener("input", debouncedRender);
    elements.updatePreviewButton.addEventListener("click", () => renderMarkdown(elements.input.value));
    elements.loadSampleButton.addEventListener("click", () => {
      loadSample().catch((error) => {
        elements.editorStatus.textContent = error.message;
      });
    });
    elements.fileInput.addEventListener("change", (event) => loadFile(event.target.files[0]));
    elements.themeSelect.addEventListener("change", (event) => applyTheme(event.target.value));
    elements.fontSizeSelect.addEventListener("change", (event) => applyFontSize(event.target.value));

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (elements.themeSelect.value === "system") applyTheme("system");
    });
  }

  init();
})();
