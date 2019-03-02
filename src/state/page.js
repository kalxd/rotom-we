const R = require("ramda");

const loadingLens = R.lensProp("loading");
const errorLens = R.lensProp("error");

exports.loadingLens = loadingLens;
exports.errorLens = errorLens;
