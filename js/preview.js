(function () {
  "use strict";

  const engine = window.MarkdownPreviewEngine;
  const t = engine.getText();
  const storageKeys = engine.storageKeys;
  const preview = document.getElementById("preview");

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

  function applySavedDisplaySettings() {
    const savedTheme = localStorage.getItem(storageKeys.theme) || "system";
    const savedFontSize = localStorage.getItem(storageKeys.fontSize) || "normal";
    document.documentElement.dataset.theme = resolveTheme(savedTheme);
    document.documentElement.dataset.fontSize = savedFontSize;
  }

  function renderMarkdown(markdown) {
    if (!md) {
      const message = document.createElement("p");
      message.textContent = t.markdownItMissing;
      preview.appendChild(message);
      return;
    }

    preview.innerHTML = md.render(markdown || "");
    engine.wrapScrollableTables(preview);
    engine.wrapScrollableCodeBlocks(preview);
    engine.enhanceTaskListItems(preview);
  }

  function init() {
    applySavedDisplaySettings();
    renderMarkdown(localStorage.getItem(storageKeys.content) || "");

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      const savedTheme = localStorage.getItem(storageKeys.theme) || "system";
      if (savedTheme === "system") document.documentElement.dataset.theme = resolveTheme("system");
    });
  }

  init();
})();
