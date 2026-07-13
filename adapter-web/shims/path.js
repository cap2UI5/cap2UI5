// Minimal posix-path shim for the browser bundle — only the operations the
// framework's (no-op'd) discovery code touches.
"use strict";

function normalize(p) {
  const abs = p.startsWith("/");
  const out = [];
  for (const seg of p.split("/")) {
    if (!seg || seg === ".") continue;
    if (seg === "..") { if (out.length && out[out.length - 1] !== "..") out.pop(); else if (!abs) out.push(".."); }
    else out.push(seg);
  }
  return (abs ? "/" : "") + out.join("/") || (abs ? "/" : ".");
}

const path = {
  sep: "/",
  delimiter: ":",
  join: (...parts) => normalize(parts.filter(Boolean).join("/")),
  resolve: (...parts) => {
    let r = "";
    for (const p of parts) r = p.startsWith("/") ? p : r + "/" + p;
    return normalize(r || "/");
  },
  relative: (from, to) => to, // discovery is no-op'd; exact value unused
  dirname: (p) => normalize(p).split("/").slice(0, -1).join("/") || "/",
  basename: (p, ext) => {
    let b = normalize(p).split("/").pop() || "";
    if (ext && b.endsWith(ext)) b = b.slice(0, -ext.length);
    return b;
  },
  extname: (p) => {
    const b = normalize(p).split("/").pop() || "";
    const i = b.lastIndexOf(".");
    return i > 0 ? b.slice(i) : "";
  },
};

module.exports = path;
