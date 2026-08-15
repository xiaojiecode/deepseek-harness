# DeepSeek Harness Desktop

[English](README.md) | 中文

DeepSeek Harness Desktop 是基于 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的社区桌面发行版。它使用 [Tauri 2](https://tauri.app/) 将现有的插件化智能体工作区封装为 Windows、macOS 和 Linux 桌面应用。

本仓库是公开 Fork，不是 DeepSeek 官方桌面发行版。

## 下载

请从 [GitHub Releases](https://github.com/xiaojiecode/deepseek-harness/releases/latest) 下载最新安装包。

- Windows 10/11 x64：每个桌面版本均附带 NSIS `.exe` 和 MSI 安装包。
- macOS 与 Linux：签名安装包发布前，可按下文命令从源码构建。

桌面应用使用系统 WebView。Windows 需要 Microsoft Edge WebView2 Runtime，当前 Windows 10 和 Windows 11 通常已内置该组件。

首个开发者预览版桌面壳还要求系统 `PATH` 中存在 `dsh` CLI：

```sh
npm install --global @deepseek-ai/dsh
```

## 桌面版功能

- 原生 Tauri 2 窗口，内置本地 DeepSeek Harness Host。
- 在同一应用中使用工作区、会话、工具、权限、插件、Agent 预设与模型选择。
- 可直接在“模型”设置页连接提供方，无需手动编辑配置文件。
- 支持 OpenCode Go 快捷连接、套餐模型导入，以及 5 小时、1 周、1 月用量展示。
- 支持从本仓库 GitHub Releases 获取经过签名的自动更新。
- Provider API Key 使用本地凭据引用管理，不会进入 Release 构建产物。

DeepSeek Harness 目前仍处于开发者预览阶段，配置与插件接口可能在版本间发生变化。

## 开始使用

1. 全局安装 `dsh` CLI，然后安装并启动 DeepSeek Harness Desktop。
2. 打开**设置 → 模型**。
3. 添加提供方并输入对应 API Key。
4. 选择模型，然后新建会话。

使用 OpenCode Go 时，选择 `opencode-go` 并点击**连接并导入**。应用会验证 `OPENCODE_API_KEY`，导入套餐当前可用的模型，并在提供方行内显示三个用量周期。

Release 构建会在启动后不久检查一次签名更新，并在运行期间每 6 小时继续检查。发现新版本后，应用会下载、校验签名、安装并自动重启。

## 从源码构建

环境要求：

- Node.js `^22.19.0` 或 `>=24`
- pnpm `11.7.0`
- Rust `1.85` 或更高版本
- [Tauri 2 对应平台依赖](https://v2.tauri.app/start/prerequisites/)

```sh
git clone https://github.com/xiaojiecode/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run desktop:dev
```

在对应系统上构建安装包：

```sh
pnpm run desktop:package:windows-x64
pnpm run desktop:package:macos-arm64
pnpm run desktop:package:linux-x64
pnpm run desktop:package:linux-arm64
```

每种平台安装包都需要在匹配的操作系统和工具链上构建。

## 上游与开发

- 上游项目：[deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
- 用户指南：[docs/user/guide](docs/user/guide/index.md)
- 开发指南：[docs/development.md](docs/development.md)
- 架构文档：[docs/architecture.md](docs/architecture.md)
- 参与贡献：[CONTRIBUTING.md](CONTRIBUTING.md)

## 许可证

[MIT](LICENSE)。第三方依赖及其许可证见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
