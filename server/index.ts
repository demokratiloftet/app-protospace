import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error("Invalid PORT");
const host = process.env.HOST ?? "127.0.0.1";
const server = createApp({
  pdsUrl: process.env.PDS_URL,
  pdsPublicUrl: process.env.PDS_PUBLIC_URL,
  appName: process.env.APP_NAME,
  revision: process.env.APP_REVISION,
});
server.listen(port, host, () =>
  console.log(`App listening on ${host}:${port}`),
);
for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5000).unref();
  });
}
