# Agent Note: OpenCode Go catalog and subscription usage

Status: implemented

English | [中文](2026-08-15-opencode-go-subscription.zh.md)

## Problem

OpenCode Go is already an upstream pi-ai route, but its managed model directory and subscription windows are separate from chat requests.

## Decision

Keep one `opencode-go` route inside `llm-pi-ai`. Use OpenCode's fixed `/models` and `/usage` endpoints, resolve the shared `OPENCODE_API_KEY`, import only ids with pinned local metadata, and retain the last successful directory on refresh failure. Expose usage through a lifecycle-scoped LLM reader and a credential-free Host RPC snapshot.

## Consequences

The settings page can validate and import a key in one action, while usage is cached and refreshed without returning secrets. New upstream models remain visible as unavailable until the application updates its pi-ai catalog.
