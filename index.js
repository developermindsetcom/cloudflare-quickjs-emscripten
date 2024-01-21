import fs from 'fs'
import { Miniflare } from "miniflare";

const script = `
addEventListener("fetch", (event) => {
  event.respondWith(new Response("Hello Miniflare!"));
});`

const mf = new Miniflare({
  script
});
const res = await mf.dispatchFetch("http://localhost:8787/");
console.log(await res.text()); // Hello Miniflare!
