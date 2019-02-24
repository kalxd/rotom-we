/*
 * 页面三种状态
 */
const R = require("ramda");

const loadingLens = R.lensProp("loading");

exports.loadingLens = loadingLens;
