import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
  server = new McpServer({
    name: "Calculator MCP",
    version: "1.0.0",
  });

  async init() {
    const finiteNumber = z
      .number()
      .refine((n) => Number.isFinite(n), "Must be a finite number")
      .refine(
        (n) => Math.abs(n) <= 1e15,
        "Absolute value too large (max 1e15)"
      );

    const twoNumberArgs = {
      a: finiteNumber,
      b: finiteNumber,
    };

    const formatResult = (value: number) => {
      if (!Number.isFinite(value)) return "Error: Result is not finite";
      return String(value);
    };

    this.server.tool("add", twoNumberArgs, async ({ a, b }) => ({
      content: [{ type: "text", text: formatResult(a + b) }],
    }));

    this.server.tool("subtract", twoNumberArgs, async ({ a, b }) => ({
      content: [{ type: "text", text: formatResult(a - b) }],
    }));

    this.server.tool("multiply", twoNumberArgs, async ({ a, b }) => ({
      content: [{ type: "text", text: formatResult(a * b) }],
    }));

    this.server.tool("divide", twoNumberArgs, async ({ a, b }) => {
      if (b === 0) {
        return {
          content: [{ type: "text", text: "Error: Cannot divide by zero" }],
        };
      }
      return { content: [{ type: "text", text: formatResult(a / b) }] };
    });

    this.server.tool("modulo", twoNumberArgs, async ({ a, b }) => {
      if (b === 0) {
        return {
          content: [{ type: "text", text: "Error: Cannot modulo by zero" }],
        };
      }
      return { content: [{ type: "text", text: formatResult(a % b) }] };
    });
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
    }

    if (url.pathname === "/mcp") {
      return MyMCP.serve("/mcp").fetch(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  },
};
