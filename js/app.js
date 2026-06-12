(function () {
  "use strict";

  const engine = window.MarkdownPreviewEngine;
  const t = engine.getText();
  const storageKeys = engine.storageKeys;

  const elements = {
    input: document.getElementById("markdownInput"),
    preview: document.getElementById("preview"),
    fileInput: document.getElementById("fileInput"),
    fileName: document.getElementById("fileName"),
    loadSampleButton: document.getElementById("loadSampleButton"),
    updatePreviewButton: document.getElementById("updatePreviewButton"),
    openPreviewButton: document.getElementById("openPreviewButton"),
    themeSelect: document.getElementById("themeSelect"),
    fontSizeSelect: document.getElementById("fontSizeSelect"),
    editorStatus: document.getElementById("editorStatus"),
    previewStatus: document.getElementById("previewStatus")
  };

  const md = createMarkdownRenderer();

  function createMarkdownRenderer() {
    if (!window.markdownit) return null;

    const renderer = window.markdownit({
      html: false,
      linkify: true,
      typographer: true,
      breaks: false
    });

    if (window.markdownitEmoji) {
      renderer.use(window.markdownitEmoji);
    }

    const defaultRender =
      renderer.renderer.rules.link_open ||
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

    renderer.renderer.rules.link_open = function (tokens, idx, options, env, self) {
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

    return renderer;
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
    engine.wrapScrollableTables(elements.preview);
    engine.enhanceTaskListItems(elements.preview);
    elements.previewStatus.textContent = window.markdownitEmoji ? t.updated : t.emojiMissing;
  }

  function saveCurrentContent() {
    localStorage.setItem(storageKeys.content, elements.input.value);
  }

  function updateContent(markdown, statusText) {
    elements.input.value = markdown;
    saveCurrentContent();
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

  function openPreviewPage() {
    saveCurrentContent();
    window.location.href = "preview.html";
  }

  function init() {
    engine.applyI18n();

    const savedTheme = localStorage.getItem(storageKeys.theme) || "system";
    const savedFontSize = localStorage.getItem(storageKeys.fontSize) || "normal";
    const savedContent = localStorage.getItem(storageKeys.content);

    applyTheme(savedTheme);
    applyFontSize(savedFontSize);

    const initialContent =
      savedContent ||
      "# Markdown Preview Engine\n\nMarkdownを入力すると、ここにプレビューが表示されます。\n\n- `.md` ファイルを読み込めます\n- `:smile:` `:rocket:` `:tada:` は 😄 🚀 🎉 と表示されます\n- 表とコードブロックはその部分だけ横スクロールします\n- テーマと文字サイズは保存されます\n";

    updateContent(initialContent, "");

    const debouncedRender = debounce(() => {
      saveCurrentContent();
      renderMarkdown(elements.input.value);
      elements.editorStatus.textContent = "";
    }, 180);

    elements.input.addEventListener("input", debouncedRender);
    elements.updatePreviewButton.addEventListener("click", () => renderMarkdown(elements.input.value));
    elements.openPreviewButton.addEventListener("click", openPreviewPage);
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
