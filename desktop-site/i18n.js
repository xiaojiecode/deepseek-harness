/* DeepSeek Harness Desktop — landing page i18n (zh / en) */
(function () {
  "use strict";

  var VERSION = "v0.1.0-desktop.1";
  var STORAGE_KEY = "dsh-desktop-lang";

  var DICT = {
    zh: {
      "nav.features": "功能",
      "nav.screens": "界面预览",
      "nav.build": "构建",
      "nav.github": "GitHub",
      "nav.download": "下载",
      "hero.badge": "社区桌面发行版 · Tauri 2",
      "hero.tagline": "把工作区、会话、模型、工具、权限与插件带进原生桌面窗口。打开应用即可继续工作，无需再管理浏览器标签页。",
      "hero.cta.download": "下载 Windows x64",
      "hero.cta.source": "查看源码",
      "hero.note": "Windows 10/11 · NSIS 与 MSI 安装包 · 需先安装 dsh CLI",
      "term.comment": "# 安装 CLI 并启动桌面开发版",
      "term.output": "Tauri dev 窗口已启动 · http://localhost:1420",
      "kp.native": "原生桌面",
      "kp.native.sub": "系统 WebView 与本地 Host",
      "kp.plugin": "插件架构",
      "kp.plugin.sub": "沿用 DeepSeek Harness 全部能力",
      "kp.update": "签名更新",
      "kp.update.sub": "从 GitHub Releases 自动升级",
      "features.eyebrow": "桌面工作台",
      "features.title": "为持续使用而设计",
      "features.desc": "桌面壳不改变 Harness 的插件模型，只把日常入口、窗口生命周期与平台安装体验整合到一起。",
      "f1.title": "完整工作区",
      "f1.desc": "管理多个工作区和会话，在对话、轨迹与任务详情之间快速切换。",
      "f2.title": "模型与权限",
      "f2.desc": "在设置页连接提供方、选择模型，并为新会话配置权限模式与 Agent 预设。",
      "f3.title": "插件生态",
      "f3.desc": "继续使用 Cordis 插件体系、工具与配置文件，桌面版不会锁住现有工作流。",
      "f4.title": "签名更新",
      "f4.desc": "安装包与更新包均带签名校验，从 GitHub Releases 自动升级到新版本。",
      "screens.eyebrow": "界面预览",
      "screens.title": "模型与用量，一个窗口",
      "screens.desc": "输入 OPENCODE_API_KEY 验证套餐并导入官方模型，在提供方行内直接查看用量窗口，随请求完成自动刷新。",
      "screens.chip5": "5 小时窗口",
      "screens.chip1w": "1 周窗口",
      "screens.chip1m": "1 月窗口",
      "screens.window.title": "模型设置 · DeepSeek Harness Desktop",
      "screens.caption": "模型设置集中管理 Provider 与凭据；OpenCode Go 用量随请求完成自动刷新。",
      "build.eyebrow": "开放源码",
      "build.title": "在你的平台上构建",
      "build.desc": "安装包需要系统 PATH 中已有 dsh CLI。桌面壳与上游 Harness 位于同一个 pnpm workspace，准备好 Node.js、Rust 与 Tauri 2 平台依赖即可开发。",
      "build.docs": "构建文档",
      "build.upstream": "官方上游",
      "code.copy": "复制",
      "code.copied": "已复制",
      "band.eyebrow": "Desktop preview",
      "band.title": "下载并开始一个新会话",
      "band.cta": "前往 GitHub Releases",
      "footer.disclaimer": "社区维护的公开 Fork，不是 DeepSeek 官方桌面发行版。",
      "footer.source": "源码",
      "footer.releases": "发行版",
      "footer.upstream": "官方上游",
      "footer.license": "MIT License",
      "meta.title": "DeepSeek Harness Desktop — 社区桌面发行版",
      "meta.description": "DeepSeek Harness Desktop：基于 Tauri 2 的社区桌面发行版，集成工作区、模型、插件与 OpenCode Go 套餐用量。"
    },
    en: {
      "nav.features": "Features",
      "nav.screens": "Screens",
      "nav.build": "Build",
      "nav.github": "GitHub",
      "nav.download": "Download",
      "hero.badge": "Community Desktop · Tauri 2",
      "hero.tagline": "Bring workspaces, sessions, models, tools, permissions, and plugins into a native desktop window. Open the app and keep working — no more juggling browser tabs.",
      "hero.cta.download": "Download for Windows x64",
      "hero.cta.source": "View source",
      "hero.note": "Windows 10/11 · NSIS & MSI installers · requires the dsh CLI",
      "term.comment": "# Install the CLI, then launch the desktop dev build",
      "term.output": "Tauri dev window ready · http://localhost:1420",
      "kp.native": "Native desktop",
      "kp.native.sub": "System WebView & local Host",
      "kp.plugin": "Plugin architecture",
      "kp.plugin.sub": "All of DeepSeek Harness, unchanged",
      "kp.update": "Signed updates",
      "kp.update.sub": "Auto-update from GitHub Releases",
      "features.eyebrow": "Desktop workbench",
      "features.title": "Designed for daily use",
      "features.desc": "The desktop shell leaves Harness's plugin model untouched — it just bundles the everyday entry point, window lifecycle, and platform install experience.",
      "f1.title": "Full workspaces",
      "f1.desc": "Manage multiple workspaces and sessions, switching quickly between chats, traces, and task details.",
      "f2.title": "Models & permissions",
      "f2.desc": "Connect providers and pick models in Settings, and configure permission modes and agent presets per session.",
      "f3.title": "Plugin ecosystem",
      "f3.desc": "Keep using the Cordis plugin system, tools, and config files — the desktop app never locks you in.",
      "f4.title": "Signed updates",
      "f4.desc": "Installers and update payloads are signature-checked, with auto-updates delivered from GitHub Releases.",
      "screens.eyebrow": "Preview",
      "screens.title": "Models & usage, one window",
      "screens.desc": "Paste OPENCODE_API_KEY to verify your plan and import official models. Check usage windows inline per provider, refreshed as requests complete.",
      "screens.chip5": "5-hour window",
      "screens.chip1w": "1-week window",
      "screens.chip1m": "1-month window",
      "screens.window.title": "Models · DeepSeek Harness Desktop",
      "screens.caption": "The model settings page manages providers and credentials; OpenCode Go usage refreshes as requests complete.",
      "build.eyebrow": "Open source",
      "build.title": "Build it yourself",
      "build.desc": "The installer expects the dsh CLI on your PATH. The desktop shell lives in the same pnpm workspace as upstream Harness — bring Node.js, Rust, and the Tauri 2 platform dependencies and you're ready.",
      "build.docs": "Build docs",
      "build.upstream": "Official upstream",
      "code.copy": "Copy",
      "code.copied": "Copied",
      "band.eyebrow": "Desktop preview",
      "band.title": "Download & start a session",
      "band.cta": "Go to GitHub Releases",
      "footer.disclaimer": "A community-maintained public fork — not an official DeepSeek desktop release.",
      "footer.source": "Source",
      "footer.releases": "Releases",
      "footer.upstream": "Upstream",
      "footer.license": "MIT License",
      "meta.title": "DeepSeek Harness Desktop — Community Desktop",
      "meta.description": "DeepSeek Harness Desktop: a community Tauri 2 desktop distribution of DeepSeek Harness with workspaces, models, plugins, and OpenCode Go plan usage."
    }
  };

  function detectLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "zh" || saved === "en") return saved;
    } catch (e) { /* private mode */ }
    return (navigator.language || "en").toLowerCase().indexOf("zh") === 0 ? "zh" : "en";
  }

  var current = detectLang();

  function applyLang(lang) {
    current = lang;
    var dict = DICT[lang];
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].getAttribute("data-i18n");
      if (dict[key]) nodes[i].textContent = dict[key];
    }

    document.title = dict["meta.title"] || document.title;
    var meta = document.querySelector('meta[name="description"]');
    if (meta && dict["meta.description"]) meta.setAttribute("content", dict["meta.description"]);

    var buttons = document.querySelectorAll(".lang-btn");
    for (var j = 0; j < buttons.length; j++) {
      buttons[j].setAttribute("aria-pressed", String(buttons[j].getAttribute("data-lang") === lang));
    }

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
  }

  function fillVersion() {
    var nodes = document.querySelectorAll("[data-version]");
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = VERSION;
  }

  function initCopy() {
    var btn = document.querySelector(".copy-btn");
    if (!btn) return;
    var label = btn.querySelector("[data-i18n]");
    var original = label ? label.textContent : "";
    btn.addEventListener("click", function () {
      var code = document.querySelector(btn.getAttribute("data-copy-target") || "#build-code");
      var text = code ? code.textContent : "";
      function done() {
        if (!label) return;
        var dict = DICT[current];
        label.textContent = dict["code.copied"] || "Copied";
        setTimeout(function () { label.textContent = dict["code.copy"] || original; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) { /* ignore */ }
        document.body.removeChild(ta);
        done();
      }
    });
  }

  function initStar() {
    var el = document.querySelector(".gh-star-count");
    if (!el) return;
    fetch("https://api.github.com/repos/xiaojiecode/deepseek-harness")
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.stargazers_count > 0) {
          el.textContent = "★ " + data.stargazers_count;
          el.hidden = false;
        }
      })
      .catch(function () { /* keep hidden */ });
  }

  function initSwitcher() {
    var buttons = document.querySelectorAll(".lang-btn");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () {
        applyLang(this.getAttribute("data-lang"));
      });
    }
  }

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    fillVersion();
    initSwitcher();
    initCopy();
    initStar();
    applyLang(current);
  });
})();
