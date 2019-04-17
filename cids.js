const c = require('cids');

const m = require('multihashes');

d = Buffer.from('272bbfc66166f26cae9c9b96b7f9590e095f02edf342ac2dd71e1667a12116ca', 'hex');
console.log(d.length);

i = m.toB58String(m.encode(d, 18, 32));

cid = new c(m.encode(d, 18,32));

console.log(cid.toBaseEncodedString(58));

decoded = m.decode(m.fromB58String(i));

console.log(m.toHexString(decoded.digest));
console.log(decoded);

