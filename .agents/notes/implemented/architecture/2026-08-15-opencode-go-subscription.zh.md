# Agent Note：OpenCode Go 模型目录与套餐用量

Status: implemented

[English](2026-08-15-opencode-go-subscription.md) | 中文

## 问题

OpenCode Go 已经是上游 pi-ai 路由，但套餐模型目录和用量窗口由独立的管理接口提供，不属于对话请求本身。

## 决策

在 `llm-pi-ai` 内继续使用唯一的 `opencode-go` 路由。调用 OpenCode 固定的 `/models` 与 `/usage` 接口，统一解析 `OPENCODE_API_KEY`，只导入本地锁定元数据能够描述的模型，并在同步失败时保留上次成功目录。用生命周期托管的 LLM reader 和不携带凭据的 Host RPC 暴露用量快照。

## 后果

设置页可以一次完成密钥校验和模型导入，用量通过缓存刷新且不会回传密钥。上游新增但本地目录尚未认识的模型会显示为不可用，直到应用更新其 pi-ai 目录。
