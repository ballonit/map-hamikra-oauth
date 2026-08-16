# Free Cloudflare proxy for Map HaMikra MCP

This Worker adds a free `workers.dev` hostname in front of the public, read-only Map HaMikra MCP on Supabase. It also reserves the exact root path OpenAI uses for domain verification.

## Public routes

- `GET /` and `GET /health` return a local health response without calling Supabase.
- `GET`, `POST`, and `OPTIONS /mcp` serve the MCP streamable HTTP transport.
- `GET /.well-known/openai-apps-challenge` returns the configured OpenAI challenge exactly, with no trailing newline.
- Every other path returns `404` and is never forwarded.

The upstream target is restricted to:

`https://aaszxmakdzorbpkttlon.supabase.co/functions/v1/map-hamikra-mcp`

The Worker preserves MCP request bodies, required request headers, SSE response bodies, response status, content type, and MCP session headers. It strips upstream cookies and infrastructure-identifying response headers. It does not contain or require a Supabase service-role key.

## Verify locally

```bash
node test.mjs
```

## Deploy on Workers Free

From this directory, after authorizing Wrangler for the intended Cloudflare account:

```bash
npx wrangler@4.34.0 deploy
```

The intended MCP URL is:

`https://map-hamikra-mcp.<ACCOUNT_SUBDOMAIN>.workers.dev/mcp`

No custom domain, paid Worker feature, paid rate-limiting product, or Supabase custom domain is required by this configuration.

## OpenAI domain challenge

Do not set a placeholder. After the OpenAI submission portal generates the token, store it as the Worker secret `OPENAI_APPS_CHALLENGE`, deploy, and verify that:

`https://map-hamikra-mcp.<ACCOUNT_SUBDOMAIN>.workers.dev/.well-known/openai-apps-challenge`

returns the exact token while `/mcp` continues to pass the end-to-end MCP tests.
