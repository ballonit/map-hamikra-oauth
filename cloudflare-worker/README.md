# Free Cloudflare proxy for Map HaMikra MCP

This Worker keeps the public MCP on Supabase and adds a free `workers.dev` hostname that can also serve OpenAI's domain-verification challenge.

## Upstream

`https://aaszxmakdzorbpkttlon.supabase.co/functions/v1/map-hamikra-mcp`

The Worker preserves the incoming path and query string. For example:

- `/` -> upstream function root
- `/mcp` -> upstream `/mcp`
- `/?health=1` -> upstream health route
- `/.well-known/openai-apps-challenge` -> handled locally by the Worker

## Deploy

From this directory, after signing in to Cloudflare:

```bash
npx wrangler@latest deploy
```

Cloudflare assigns the Worker a URL in the form:

`https://map-hamikra-mcp.<ACCOUNT_SUBDOMAIN>.workers.dev`

## OpenAI domain challenge

After the OpenAI submission portal generates the challenge token, set it as a Worker secret:

```bash
npx wrangler@latest secret put OPENAI_APPS_CHALLENGE
```

Then verify that:

`https://map-hamikra-mcp.<ACCOUNT_SUBDOMAIN>.workers.dev/.well-known/openai-apps-challenge`

returns the exact token and that MCP requests still proxy to Supabase.

## Cost behavior

This configuration uses the Cloudflare Workers Free `workers.dev` route and does not enable a Supabase custom domain.
