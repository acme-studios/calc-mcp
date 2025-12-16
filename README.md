# Calculator MCP (Cloudflare Workers)

An authless remote MCP server deployed on Cloudflare Workers that exposes a small set of calculator tools.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=[https://github.com/acme-studios/calc-mcp](https://github.com/acme-studios/calc-mcp))

## Endpoints

- **SSE (recommended for most MCP clients):** `/sse`
- **Streamable HTTP:** `/mcp`

Local example:

- `http://localhost:8787/sse`

## Tools

All tools return a single text output containing the result, or an error message.

- **`add`**
  - Input: `{ a: number, b: number }`
- **`subtract`**
  - Input: `{ a: number, b: number }`
- **`multiply`**
  - Input: `{ a: number, b: number }`
- **`divide`**
  - Input: `{ a: number, b: number }` (errors on `b = 0`)
- **`modulo`**
  - Input: `{ a: number, b: number }` (errors on `b = 0`)

Input validation:

- Numbers must be finite (no `NaN`/`Infinity`)
- Absolute value is capped at `1e15`

## Run locally

```bash
npm install
npx wrangler dev --port 8787
```

Connect an MCP client to `http://localhost:8787/sse`.

## Deploy

```bash
npx wrangler deploy
```

Your Worker will be available at `https://<name>.<subdomain>.workers.dev/sse`.

## Customize

Edit `src/index.ts` and register new tools inside `init()` using `this.server.tool(name, schema, handler)`.
