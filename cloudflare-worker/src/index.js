const DEFAULT_UPSTREAM = "https://aaszxmakdzorbpkttlon.supabase.co/functions/v1/map-hamikra-mcp";

function text(value, status = 200) {
  return new Response(`${value}\n`, {
    status,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

export default {
  async fetch(request, env) {
    const incoming = new URL(request.url);

    if (incoming.pathname === "/.well-known/openai-apps-challenge") {
      if (!["GET", "HEAD"].includes(request.method)) return text("method not allowed", 405);
      const challenge = String(env.OPENAI_APPS_CHALLENGE || "").trim();
      if (!challenge) return text("challenge not configured", 503);
      return request.method === "HEAD" ? new Response(null, {
        status: 200,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "no-store",
          "x-content-type-options": "nosniff",
        },
      }) : text(challenge);
    }

    const upstreamBase = String(env.UPSTREAM_MCP || DEFAULT_UPSTREAM).replace(/\/+$/u, "");
    const upstream = new URL(upstreamBase);
    upstream.pathname = `${upstream.pathname}${incoming.pathname === "/" ? "" : incoming.pathname}`;
    upstream.search = incoming.search;

    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.set("x-forwarded-host", incoming.host);
    headers.set("x-forwarded-proto", "https");

    const init = {
      method: request.method,
      headers,
      redirect: "manual",
    };
    if (!["GET", "HEAD"].includes(request.method)) init.body = request.body;

    const response = await fetch(upstream.toString(), init);
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set("x-map-hamikra-proxy", "cloudflare-worker");

    return new Response(request.method === "HEAD" ? null : response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  },
};
