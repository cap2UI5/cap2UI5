// The instance main( ) runs on: a PROXY whose reads unwrap the boxed fields
// and whose writes write through, so the boxes stay on the instance - which
// is what _bind( ) matches by identity.
const { isDeepStrictEqual } = require("node:util");
const { unwrap, wrap } = require("./types");

function instanceProxy(app) {
  const shapes = app.__shapes;
  // A method is bound to the PROXY, not to the instance behind it: a helper
  // bound to the instance would read the boxes, and `this.name = "x"` in it
  // would replace a box with a string, which _bind( ) then cannot find.
  //
  // A field is an OWN key of shapes, not anything every object inherits
  // (constructor, toString), so `${this}` and `this.constructor` still work.
  const isField = (prop) => typeof prop === "string" && Object.hasOwn(shapes, prop);
  // A structure or a table is read ONCE per main( ) and the same object
  // answers every later read, so what JavaScript does to it in place -
  // `this.rows.push( row )`, `this.rows[0].done = true` - is the field's
  // value and is written to the box when main( ) returns, as ABAP changes
  // the row behind a field symbol. `seen` keeps what was read and a copy of
  // it as it was, to tell whether it changed.
  const seen = new Map();                  // field -> { value, before }
  const plain = new Proxy(app, {
    get(tgt, prop, recv) {
      const v = Reflect.get(tgt, prop, recv);
      if (isField(prop)) {
        if (seen.has(prop)) return seen.get(prop).value;
        const value = unwrap(v, shapes[prop]);
        if (value !== null && typeof value === "object") seen.set(prop, { value, before: structuredClone(value) });
        return value;
      }
      // the class itself stays the class - bound, it is no constructor of anything
      return typeof v === "function" && prop !== "constructor" ? v.bind(recv) : v;
    },
    set(tgt, prop, value) {
      if (isField(prop)) {
        wrap(tgt[prop], value, shapes[prop], `this.${prop}`);
        seen.delete(prop);                 // the next read is of what was written
        return true;
      }
      return Reflect.set(tgt, prop, value);
    },
  });
  /** what main( ) changed in place, into the boxes - before anything
   *  reads them: a bind, the framework's model, the draft */
  const writeBack = () => {
    for (const [prop, { value, before }] of seen) {
      if (!isDeepStrictEqual(value, before)) wrap(app[prop], value, shapes[prop], `this.${prop}`);
    }
    seen.clear();
  };
  return { plain, writeBack };
}

module.exports = { instanceProxy };
