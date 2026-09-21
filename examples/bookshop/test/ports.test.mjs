// The test helper's port choice, checked against what fetch( ) will actually
// talk to.
//
// A server starts perfectly well on port 6000. fetch( ) then refuses to
// connect to it - the WHATWG "bad port" list is baked into undici - and the
// run dies with
//
//   TypeError: fetch failed   [cause]: Error: bad port
//
// naming no port, no test and no cause. It happened in CI on main, between two
// green steps, after a cold-test boot drew 6000.
//
// This does not check the helper's list against documentation or memory. A
// blocked port answers "bad port" with NOTHING listening on it, while an
// ordinary closed port answers a connection error - so node itself says which
// is which, and the test asks it about every port in the range. Cheap: no
// packet leaves the machine for a blocked port, and a closed loopback port
// refuses at once. The whole scan is well under a second.
//
// Worth the exactness: the first hand-written version of that list missed
// 6679, and a version of this test that sampled 50 random ports did not
// notice.
import assert from "node:assert/strict";
import { test } from "node:test";
import { BAD_PORTS, freePort } from "./server.mjs";

const LOW = 5000;
const HIGH = 7000;

/** Why fetch( ) would not talk to this port, with nothing listening. */
const why = async (port) => {
  try {
    await fetch(`http://127.0.0.1:${port}/`);
    return "connected";
  } catch (e) {
    return String(e.cause?.message ?? e.message);
  }
};

async function scanBlocked() {
  const found = [];
  for (let from = LOW; from < HIGH; from += 100) {
    const chunk = Array.from({ length: Math.min(100, HIGH - from) }, (_, i) => from + i);
    const answers = await Promise.all(chunk.map(async (p) => [p, await why(p)]));
    for (const [p, answer] of answers) if (answer === "bad port") found.push(p);
  }
  return found;
}

test("BAD_PORTS is exactly what fetch refuses in the helper's range", async () => {
  const blocked = await scanBlocked();
  assert.deepEqual(blocked.sort((a, b) => a - b), [...BAD_PORTS].sort((a, b) => a - b),
    "the helper's list and what node refuses have diverged");
});

test("freePort never hands out one of them", () => {
  for (let i = 0; i < 5000; i++) {
    const port = freePort();
    assert.ok(port >= LOW && port < HIGH, `${port} is outside the range`);
    assert.ok(!BAD_PORTS.has(port), `freePort handed out blocked port ${port}`);
  }
});
