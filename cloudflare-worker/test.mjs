import worker from "./src/index.js";

const originalFetch = globalThis.fetch;
const calls = [];

globalThis.fetch = async (url, init) => {
  calls.push({url: String(url), method: init.method, headers: new Headers(init.headers)});
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode("event: message\ndata: {\"ok\":true}\n\n"));
      controller.close();
    },
  });
  return new Response(stream, {
    status: 200,
    headers: {
      "content-type": "text/event-stream",
      "mcp-session-id": "test-session",
      "set-cookie": "should-not-leak=1",
      "x-sb-edge-region": "should-not-leak",
    },
  });
};

const env = {
  UPSTREAM_MCP: "https://aaszxmakdzorbpkttlon.supabase.co/functions/v1/map-hamikra-mcp",
  OPENAI_APPS_CHALLENGE: "challenge-token",
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const health = await worker.fetch(new Request("https://example.workers.dev/health"), env);
assert(health.status === 200, "health status");
assert((await health.json()).mcp_path === "/mcp", "health body");
assert(calls.length === 0, "health must not call upstream");

const challenge = await worker.fetch(new Request("https://example.workers.dev/.well-known/openai-apps-challenge"), env);
assert(await challenge.text() === "challenge-token", "challenge must be exact");

const options = await worker.fetch(new Request("https://example.workers.dev/mcp", {method: "OPTIONS"}), env);
assert(options.status === 204, "OPTIONS status");
assert(calls.length === 0, "OPTIONS must not call upstream");

const missing = await worker.fetch(new Request("https://example.workers.dev/https://attacker.example"), env);
assert(missing.status === 404, "arbitrary paths must be rejected");
assert(calls.length === 0, "arbitrary paths must not call upstream");

const internalRest = await worker.fetch(new Request("https://example.workers.dev/mcp", {
  method: "POST",
  headers: {"content-type": "application/json"},
  body: JSON.stringify({action: "get_research_witness_passage", reference: "Gen.3.20"}),
}), env);
assert(internalRest.status === 400, "non-MCP internal REST actions must be rejected");
assert(calls.length === 0, "non-MCP internal REST actions must not call upstream");

const request = new Request("https://example.workers.dev/mcp?trace=off", {
  method: "POST",
  headers: {
    accept: "application/json, text/event-stream",
    "content-type": "application/json",
    "mcp-protocol-version": "2025-06-18",
  },
  body: JSON.stringify({jsonrpc: "2.0", id: 1, method: "tools/list", params: {}}),
});
const proxied = await worker.fetch(request, env);
assert(calls.length === 1, "MCP request must call upstream once");
assert(calls[0].url === `${env.UPSTREAM_MCP}?trace=off`, "upstream target must be fixed");
assert(calls[0].method === "POST", "method must be preserved");
assert(proxied.headers.get("content-type") === "text/event-stream", "SSE content type must be preserved");
assert(proxied.headers.get("mcp-session-id") === "test-session", "MCP session header must be preserved");
assert(!proxied.headers.has("set-cookie"), "upstream cookies must not leak");
assert(!proxied.headers.has("x-sb-edge-region"), "Supabase infrastructure headers must not leak");
assert((await proxied.text()).includes("event: message"), "stream body must be preserved");

const loop = await worker.fetch(new Request("https://example.workers.dev/mcp", {method: "GET"}), {
  UPSTREAM_MCP: "https://example.workers.dev/mcp",
});
assert(loop.status === 500, "looping/misconfigured upstream must be rejected");
assert(calls.length === 1, "misconfigured upstream must not be fetched");

globalThis.fetch = originalFetch;
console.log("worker tests: PASS");
