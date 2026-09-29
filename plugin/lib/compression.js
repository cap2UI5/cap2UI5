// gzip on the roundtrip route - the half of upstream's SET_COMPRESSION the
// express shim does not have.
//
// z2ui5_cl_ui5_http_handler asks the ICF runtime to compress every response
// it sends (set_response: CALL METHOD mo_response_onprem->('SET_COMPRESSION')).
// Every body is text: the GET page carries the whole UI5 frontend, 358 kB,
// and a roundtrip the app's model as JSON - 180 kB for a table of 2000 rows.
// open-abap's express shim has no such method, the framework's CATCH cx_root
// reads that as "no compression on this stack", and every response went out
// as it was. Measured: the page is 83 kB gzipped.
//
// gzip, and not brotli, because of the conditional GET. The framework tags
// the page and answers a browser that still has it with a 304 itself
// (_check_etag_match), and it accepts two tags: the one it sent, and that
// one with Apache mod_deflate's `-gzip` suffix inside the quotes. So a
// compressed response carries "x-gzip" for the framework's "x" - a
// different representation needs a different strong tag - and the browser's
// If-None-Match: "x-gzip" is answered 304 by the framework. A "-br" tag
// would match nothing, and every reload would transfer the page again.
//
// Compressed: what a response sends in one piece (res.end( ) with the body -
// every responder on the route does that, send( ) and json( ) included), of
// at least THRESHOLD bytes, when Accept-Encoding allows gzip, nothing set a
// Content-Encoding already, and it is not a HEAD, 204 or 304. Behind a proxy
// that compresses as well nothing is compressed twice: the proxy sees the
// Content-Encoding and leaves the body alone. `cds.requires.cap2ui5.
// compression: false` switches this off, for a proxy that should do the work.
const zlib = require("node:zlib");

/** Below this, gzip's own header and the time it takes outweigh what it saves. */
const THRESHOLD = 1024;

/** How many compressed pages are kept. The framework tags the page per app
 *  and configuration, and a page is compressed once per tag - about 10 ms
 *  for its 358 kB, where the page itself comes out of the framework's own
 *  cache. A roundtrip is compressed every time: 3 ms for the 180 kB of a
 *  2000-row table, whose roundtrip takes seconds. */
const PAGES = 8;

/** Whether an Accept-Encoding header lets the response be gzipped: gzip (or
 *  x-gzip, its old name) listed with a weight above 0, or else `*` with one.
 *  "gzip;q=0" refuses it, and so does a header that names neither. */
function acceptsGzip(header) {
  let gzip, any;
  for (const part of String(header ?? "").split(",")) {
    const [name, ...params] = part.split(";").map((s) => s.trim().toLowerCase());
    const q = params.find((p) => p.startsWith("q="));
    const weight = q === undefined ? 1 : Number(q.slice(2)) || 0;
    if (name === "gzip" || name === "x-gzip") gzip = Math.max(gzip ?? 0, weight);
    else if (name === "*") any = weight;
  }
  return (gzip ?? any ?? 0) > 0;
}

/** The middleware. One per route; the page cache is its own. */
function compression({ threshold = THRESHOLD, pages = PAGES } = {}) {
  const cache = new Map();           // the page's ETag -> { plain, gzip }, oldest first

  /** The gzip of a page, from the cache when the page under this tag is the
   *  same, byte for byte. The tag alone would do if every tag the framework
   *  sends were strong - it has sent one tag with two bodies before (see
   *  sv_get_etag_key), and comparing costs microseconds. */
  function page(etag, plain) {
    const hit = cache.get(etag);
    cache.delete(etag);
    const entry = hit?.plain.equals(plain) ? hit : { plain, gzip: zlib.gzipSync(plain) };
    cache.set(etag, entry);
    if (cache.size > pages) cache.delete(cache.keys().next().value);
    return entry.gzip;
  }

  return function compress(req, res, next) {
    if (req.method === "HEAD") return next();
    const end = res.end;
    res.end = function (chunk, encoding, callback) {
      if (typeof encoding === "function") [callback, encoding] = [encoding, undefined];
      const status = res.statusCode;
      if (chunk == null || typeof chunk === "function" || res.headersSent ||
          status < 200 || status === 204 || status === 304 || res.getHeader("Content-Encoding")) {
        return end.call(this, chunk, encoding, callback);
      }
      const plain = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding ?? "utf8");
      if (plain.length < threshold) return end.call(this, chunk, encoding, callback);

      // the body depends on Accept-Encoding from here on, compressed or not
      res.vary("Accept-Encoding");
      if (!acceptsGzip(req.headers["accept-encoding"])) return end.call(this, chunk, encoding, callback);

      const etag = res.getHeader("ETag");
      const gzip = etag && req.method === "GET" && status === 200 ? page(String(etag), plain) : zlib.gzipSync(plain);
      res.setHeader("Content-Encoding", "gzip");
      res.setHeader("Content-Length", gzip.length);
      if (etag) res.setHeader("ETag", String(etag).replace(/"$/, '-gzip"'));
      return end.call(this, gzip, undefined, callback);
    };
    next();
  };
}

module.exports = { compression, acceptsGzip, THRESHOLD, PAGES };
