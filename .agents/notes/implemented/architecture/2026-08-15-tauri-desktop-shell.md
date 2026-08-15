# Agent Note: Tauri desktop shell over the Web profile

Status: implemented

English | [中文](2026-08-15-tauri-desktop-shell.zh.md)

## Problem

DeepSeek Harness has a browser application and a Node Host with filesystem, subprocess, terminal, and plugin capabilities, but no desktop application lifecycle or platform installer. Replacing that Host while the product is in developer preview would duplicate working behavior and make upstream changes harder to absorb.

## Decision

[`apps/desktop`](../../../../apps/desktop) is a Tauri 2 application that owns only the desktop window and Host process lifecycle. Development starts the existing `dsh web` profile on loopback through Tauri's `beforeDevCommand`; the Rust application waits for that endpoint and navigates its configured WebView to it. Release builds use the same protocol and start a `dsh` executable resolved from `DSH_DESKTOP_DSH` or `PATH`, then terminate the child when the desktop process exits.

The Web profile remains the authority for HTTP, WebSocket, frontend boot metadata, plugins, settings, sessions, and model access. The desktop shell does not expose Tauri commands to page JavaScript and grants only Tauri's core default capability set. The repository pins the current Tauri 2 CLI and Rust crate versions independently because their latest patch releases are not published in lockstep.

The configured bundle targets are macOS APP/DMG, Windows NSIS/MSI, and Linux AppImage/DEB/RPM. `pnpm run desktop:package` builds every installer supported by the current host; the `desktop:package:windows-x64`, `desktop:package:macos-arm64`, `desktop:package:linux-x64`, and `desktop:package:linux-arm64` commands pin the release target and installer formats. Each target command runs on its named operating system because native Node dependencies, WebView libraries, signing, and installer tools are host-specific. A self-contained release still requires a platform-matched `dsh` sidecar carrying Node and native dependencies; this developer-preview shell does not claim that system-installed `dsh` is a final distribution contract.

## Verification

`pnpm run desktop:check` validates the local Tauri, WebView, Rust, Node, and package-manager environment. `cargo check` in `apps/desktop/src-tauri` compiles the Rust lifecycle code and validates Tauri configuration and capabilities. Installer and native capability validation remains platform-local because `node-pty`, `koffi`, subprocess helpers, signing, and Linux WebKit dependencies cannot be proven by a Windows build.

## Alternatives considered

**Electron.** Electron would reuse Node directly and reduce sidecar work, but it bundles Chromium and gives up the smaller system-WebView distribution requested for the desktop product.

**Rewrite the Host in Rust.** This would duplicate the plugin runtime and its Node-native capability implementations, creating a second product rather than a desktop projection of the official upstream.

**Expose native behavior through Tauri commands.** Bridging existing filesystem and subprocess APIs through a second IPC surface would split authorization and lifecycle ownership. The shell therefore navigates to the existing loopback Host and keeps application behavior on its established transport.

## Consequences

The desktop application stays small in source and tracks upstream Web/Host behavior without a fork. Rust owns reliable window and child-process teardown, while the existing Web profile remains runnable in a normal browser. The cost is a dual Rust/Node release toolchain, per-platform native builds, system-WebView differences, and an explicit remaining packaging step before installers are self-contained.
