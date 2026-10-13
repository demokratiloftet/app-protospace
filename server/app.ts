import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

export function createApp(
  options: { publicDir?: string; appName?: string; revision?: string } = {},
) {
  const publicDir = resolve(options.publicDir ?? "dist/client");
  return createServer(async (req, res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
    );
    const json = (status: number, body: unknown) => {
      res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      });
      res.end(JSON.stringify(body));
    };
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.setHeader("Allow", "GET, HEAD");
      json(405, { error: "Method not allowed" });
      return;
    }
    try {
      const url = new URL(req.url ?? "/", "http://localhost");
      if (url.pathname === "/health") {
        json(200, { status: "ok", revision: options.revision ?? "local" });
        return;
      }
      if (url.pathname === "/api/hello") {
        const name = (url.searchParams.get("name") ?? "").trim();
        if (name.length > 80 || /[\u0000-\u001f\u007f]/u.test(name)) {
          json(400, {
            error: "Bruk et navn på maks 80 tegn uten kontrolltegn.",
          });
          return;
        }
        json(200, {
          message: name
            ? `Hei, ${name}! Din første API-forespørsel er i mål.`
            : "Hei fra Løftet! Appen og API-et snakker sammen.",
          app: options.appName ?? "Hello Løftet",
          revision: options.revision ?? "local",
        });
        return;
      }
      const pathname = decodeURIComponent(url.pathname);
      const file = resolve(
        publicDir,
        "." + (pathname === "/" ? "/index.html" : pathname),
      );
      if (
        !file.startsWith(publicDir + sep) ||
        pathname.split("/").some((part) => part.startsWith("."))
      ) {
        json(404, { error: "Not found" });
        return;
      }
      const mime: Record<string, string> = {
        ".html": "text/html; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".svg": "image/svg+xml",
        ".png": "image/png",
      };
      if (!mime[extname(file)]) {
        json(404, { error: "Not found" });
        return;
      }
      const body = await readFile(file);
      res.writeHead(200, {
        "Content-Type": mime[extname(file)],
        "Cache-Control": "no-cache",
      });
      res.end(req.method === "HEAD" ? undefined : body);
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      json(
        error instanceof URIError
          ? 400
          : code === "ENOENT" || code === "EISDIR"
            ? 404
            : 500,
        {
          error:
            error instanceof URIError
              ? "Invalid URL"
              : code === "ENOENT" || code === "EISDIR"
                ? "Not found"
                : "Request failed",
        },
      );
    }
  });
}
