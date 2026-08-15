# DeepSeek Harness Desktop

English | [中文](README.zh.md)

DeepSeek Harness Desktop is a community-maintained desktop distribution of [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). It packages the existing plugin-based agent workspace in a native [Tauri 2](https://tauri.app/) shell for Windows, macOS, and Linux.

This repository is a public fork and is not an official DeepSeek desktop release.

## Download

Download the latest installer from [GitHub Releases](https://github.com/xiaojiecode/deepseek-harness/releases/latest).

- Windows 10/11 x64: NSIS `.exe` and MSI installers are attached to each desktop release.
- macOS and Linux: build from source with the platform commands below until signed installers are published.

The desktop app uses the operating system WebView. Windows requires the Microsoft Edge WebView2 Runtime, which is included with current Windows 10 and Windows 11 installations.

This first developer-preview shell also requires the `dsh` CLI on `PATH`:

```sh
npm install --global @deepseek-ai/dsh
```

## Desktop features

- Native Tauri 2 window backed by the local DeepSeek Harness host.
- Workspaces, sessions, tools, permissions, plugins, agent presets, and model selection in one application.
- Provider setup from the Models settings page without editing configuration files.
- OpenCode Go quick connect with model import and 5-hour, weekly, and monthly subscription usage.
- Signed automatic updates from this repository's GitHub Releases.
- Local credential references for provider API keys; credentials are never included in release artifacts.

DeepSeek Harness remains a developer preview. Configuration and plugin APIs may change between releases.

## Get started

1. Install the `dsh` CLI globally, then install and launch DeepSeek Harness Desktop.
2. Open **Settings → Models**.
3. Add a provider and enter its API key.
4. Select a model and start a new session.

For OpenCode Go, choose `opencode-go` and use **Connect and import**. The app validates `OPENCODE_API_KEY`, imports the models available to the subscription, and displays the current usage windows in the provider row.

Release builds check for signed updates shortly after launch and every six hours while running. A newer release is downloaded, signature-verified, installed, and then restarted automatically.

## Build from source

Prerequisites:

- Node.js `^22.19.0` or `>=24`
- pnpm `11.7.0`
- Rust `1.85` or later
- The [Tauri 2 platform prerequisites](https://v2.tauri.app/start/prerequisites/)

```sh
git clone https://github.com/xiaojiecode/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run desktop:dev
```

Build installers for a supported host:

```sh
pnpm run desktop:package:windows-x64
pnpm run desktop:package:macos-arm64
pnpm run desktop:package:linux-x64
pnpm run desktop:package:linux-arm64
```

Each platform package must be built on its matching operating system and toolchain.

## Upstream and development

- Upstream project: [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
- User guide: [docs/user/guide](docs/user/guide/index.md)
- Development guide: [docs/development.md](docs/development.md)
- Architecture: [docs/architecture.md](docs/architecture.md)
- Contributing: [CONTRIBUTING.md](CONTRIBUTING.md)

## License

[MIT](LICENSE). Third-party dependencies and their licenses are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
