const R = require("ramda");

const tokenLens = R.lensProp("token");

const addrLens = R.lensProp("host");

exports.tokenLens = tokenLens;
exports.addrLens = addrLens;
