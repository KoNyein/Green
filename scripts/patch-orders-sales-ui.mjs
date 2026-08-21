import fs from "node:fs";
const path = "client/src/pages/GwavePages.tsx";
let source = fs.readFileSync(path, "utf8");
const pattern = /<div><p className="font-mono text-\[10px\] uppercase tracking-\[\.18em\] text-\[#8bd32c\]">\{order\.reference\}<\/p><h2 className="mt-2 font-display text-4xl font-bold uppercase">\{order\.status\.replaceAll\("_", " "\)\}<\/h2><p className="mt-2 text-sm text-white\/55">\{new Date\(order\.createdAt\)\.toLocaleString\(\)\}<\/p><\/div>\{\["payment_pending", "payment_under_review"\]\.includes\(order\.status\)\}/;
const replacement = '<div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#8bd32c]">{order.reference}</p><h2 className="mt-2 font-display text-4xl font-bold uppercase">{order.status.replaceAll("_", " ")}</h2><p className="mt-2 text-sm text-white/55">{new Date(order.createdAt).toLocaleString()}</p><OrderTimeline status={order.status} copy={copy}/></div>{["payment_pending", "payment_under_review"].includes(order.status)}';
if (!pattern.test(source)) throw new Error("Orders card regex target not found");
source = source.replace(pattern, replacement);
fs.writeFileSync(path, source);
