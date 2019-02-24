const R = require("ramda");

const tokenLens = R.lensProp("token");

const addrLens = R.lensProp("addr");

exports.tokenLens = tokenLens;
exports.addrLens = addrLens;
