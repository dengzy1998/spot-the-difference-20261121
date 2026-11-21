// random.js — seeded RNG so decoration is deterministic for screenshots and replays.
// mulberry32: small, fast, and fully deterministic from one integer seed.
export function makeRng(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Pick a stable integer in [min, max] from an rng.
export function randInt(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1));
}

// Pick one item from an array with an rng.
export function pick(rng, items) {
  return items[Math.floor(rng() * items.length)];
}
