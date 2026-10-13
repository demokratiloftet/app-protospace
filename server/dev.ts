import { createApp } from "./app.ts";
const port = Number(process.env.API_PORT ?? 3000);
createApp().listen(port, "127.0.0.1", () =>
  console.log(`API: http://127.0.0.1:${port}`),
);
