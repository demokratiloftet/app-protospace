import { createApp } from "./app.ts";
createApp().listen(3000, "127.0.0.1", () =>
  console.log("API: http://127.0.0.1:3000"),
);
