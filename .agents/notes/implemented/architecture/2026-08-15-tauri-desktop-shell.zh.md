# Agent Note: 基于 Web profile 的 Tauri 桌面壳

Status: implemented

[English](2026-08-15-tauri-desktop-shell.md) | 中文

## Problem

DeepSeek Harness 已有浏览器应用和具备文件系统、子进程、终端及插件能力的 Node Host，但没有桌面应用生命周期和平台安装包。在产品仍处于开发预览阶段时替换该 Host，会重复实现已经可用的行为，并增加吸收上游变更的难度。

## Decision

[`apps/desktop`](../../../../apps/desktop) 是一个 Tauri 2 应用，只负责桌面窗口和 Host 进程生命周期。开发环境通过 Tauri 的 `beforeDevCommand` 在回环地址启动现有 `dsh web` profile；Rust 应用等待该 endpoint 就绪，再将配置的 WebView 导航至该地址。Release 构建沿用同一协议，从 `DSH_DESKTOP_DSH` 或 `PATH` 解析并启动 `dsh` 可执行文件，并在桌面进程退出时终止子进程。

Web profile 继续负责 HTTP、WebSocket、前端启动元数据、插件、设置、Session 和模型访问。桌面壳不向页面 JavaScript 暴露 Tauri command，只授予 Tauri 的 core default capability。仓库分别固定当前 Tauri 2 CLI 和 Rust crate 版本，因为它们的最新 patch release 并不总是同步发布。

配置的 bundle target 包括 macOS APP/DMG、Windows NSIS/MSI，以及 Linux AppImage/DEB/RPM。`pnpm run desktop:package` 会构建当前宿主支持的全部安装包；`desktop:package:windows-x64`、`desktop:package:macos-arm64`、`desktop:package:linux-x64` 和 `desktop:package:linux-arm64` 命令会固定 release target 和安装包格式。每个目标命令都应在对应操作系统运行，因为 Node 原生依赖、WebView 库、签名和安装包工具依赖宿主平台。自包含 release 仍需要携带 Node 和原生依赖的目标平台 `dsh` sidecar；该开发预览桌面壳不会把系统已安装的 `dsh` 宣称为最终分发约定。

## Verification

`pnpm run desktop:check` 检查本地 Tauri、WebView、Rust、Node 和包管理器环境。在 `apps/desktop/src-tauri` 运行 `cargo check` 会编译 Rust 生命周期代码，并验证 Tauri 配置和 capability。安装包及原生能力仍需在各目标平台验证，因为 Windows 构建无法证明 `node-pty`、`koffi`、子进程 helper、签名和 Linux WebKit 依赖的正确性。

## Alternatives considered

**Electron。** Electron 可以直接复用 Node 并减少 sidecar 工作，但它会捆绑 Chromium，不符合桌面产品采用更小的系统 WebView 分发方式这一要求。

**使用 Rust 重写 Host。** 这会重复插件运行时及其 Node 原生能力实现，形成第二套产品，而不是官方上游的桌面投影。

**通过 Tauri command 暴露原生行为。** 通过第二套 IPC 转接现有文件系统和子进程 API，会拆分授权与生命周期所有权。因此桌面壳导航至现有回环 Host，并让应用行为继续使用既有传输层。

## Consequences

桌面应用的源码保持精简，可以跟随上游 Web/Host 行为而无需维护 fork。Rust 负责可靠的窗口与子进程退出处理，现有 Web profile 仍可在普通浏览器中运行。代价是同时维护 Rust/Node 两套发布工具链、按平台构建原生依赖、处理系统 WebView 差异，并在安装包实现自包含之前完成明确的后续打包步骤。
