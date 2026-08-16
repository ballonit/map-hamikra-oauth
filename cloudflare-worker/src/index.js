const DEFAULT_UPSTREAM = "https://aaszxmakdzorbpkttlon.supabase.co/functions/v1/map-hamikra-mcp";
const ALLOWED_UPSTREAM_ORIGIN = "https://aaszxmakdzorbpkttlon.supabase.co";
const ALLOWED_UPSTREAM_PATH = "/functions/v1/map-hamikra-mcp";
const MAX_DECLARED_BODY_BYTES = 1024 * 1024;

const SECURITY_HEADERS = {
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
};

function plainText(value, status = 200, includeBody = true) {
  return new Response(includeBody ? value : null, {
    status,
    headers: {
      ...SECURITY_HEADERS,
      "content-type": "text/plain; charset=utf-8",
    },
  });
}

function json(value, status = 200, includeBody = true) {
  return new Response(includeBody ? JSON.stringify(value) : null, {
    status,
    headers: {
      ...SECURITY_HEADERS,
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function corsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "accept, authorization, content-type, last-event-id, mcp-protocol-version, mcp-session-id",
    "access-control-max-age": "86400",
  };
}

function validatedUpstream(value) {
  try {
    const upstream = new URL(String(value || DEFAULT_UPSTREAM));
    const normalizedPath = upstream.pathname.replace(/\/+$/u, "");
    if (
      upstream.origin !== ALLOWED_UPSTREAM_ORIGIN ||
      normalizedPath !== ALLOWED_UPSTREAM_PATH ||
      upstream.username ||
      upstream.password ||
      upstream.search ||
      upstream.hash
    ) {
      return null;
    }
    upstream.pathname = normalizedPath;
    return upstream;
  } catch {
    return null;
  }
}

function sanitizedRequestHeaders(request, incoming) {
  const headers = new Headers(request.headers);
  for (const name of [
    "host",
    "cf-connecting-ip",
    "cf-ipcountry",
    "cf-ray",
    "cf-visitor",
    "x-forwarded-for",
    "x-forwarded-host",
    "x-forwarded-proto",
  ]) headers.delete(name);
  headers.set("x-forwarded-host", incoming.host);
  headers.set("x-forwarded-proto", "https");
  return headers;
}

function sanitizedResponseHeaders(response) {
  const headers = new Headers(response.headers);
  for (const name of [...headers.keys()]) {
    if (
      name === "server" ||
      name === "set-cookie" ||
      name === "cf-ray" ||
      name === "endpoint-load-metrics" ||
      name.startsWith("sb-") ||
      name.startsWith("x-sb-") ||
      name.startsWith("x-deno-") ||
      name === "x-served-by"
    ) headers.delete(name);
  }
  for (const [name, value] of Object.entries(corsHeaders())) headers.set(name, value);
  headers.set("cache-control", "no-store");
  headers.set("x-content-type-options", "nosniff");
  headers.set("x-map-hamikra-proxy", "cloudflare-worker");
  return headers;
}

export default {
  async fetch(request, env) {
    const incoming = new URL(request.url);

    if (incoming.pathname === "/.well-known/openai-apps-challenge") {
      if (!["GET", "HEAD"].includes(request.method)) return plainText("method not allowed", 405);
      const challenge = String(env.OPENAI_APPS_CHALLENGE || "").trim();
      if (!challenge) return plainText("challenge not configured", 503);
      return plainText(challenge, 200, request.method !== "HEAD");
    }

    if (incoming.pathname === "/" || incoming.pathname === "/health") {
      if (!["GET", "HEAD"].includes(request.method)) return plainText("method not allowed", 405);
      return json({
        ok: true,
        service: "map-hamikra-mcp-proxy",
        transport: "streamable-http",
        mcp_path: "/mcp",
      }, 200, request.method !== "HEAD");
    }

    if (incoming.pathname !== "/mcp") return plainText("not found", 404);

    if (request.method === "OPTIONS") {
      return new Response(null, {status: 204, headers: corsHeaders()});
    }
    if (!["GET", "POST"].includes(request.method)) return plainText("method not allowed", 405);

    const declaredLength = Number(request.headers.get("content-length") || 0);
    if (Number.isFinite(declaredLength) && declaredLength > MAX_DECLARED_BODY_BYTES) {
      return plainText("payload too large", 413);
    }

    const upstream = validatedUpstream(env.UPSTREAM_MCP);
    if (!upstream) return json({ok: false, error: "upstream misconfigured"}, 500);
    upstream.search = incoming.search;

    const init = {
      method: request.method,
      headers: sanitizedRequestHeaders(request, incoming),
      redirect: "manual",
    };
    if (request.method === "POST") init.body = request.body;

    try {
      const response = await fetch(upstream.toString(), init);
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: sanitizedResponseHeaders(response),
      });
    } catch {
      return json({ok: false, error: "upstream unavailable"}, 502);
    }
  },
};
