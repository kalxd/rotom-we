const R = require("ramda");

/*
 * global state:
 * curColSize :: Int
 * curGroup :: Maybe Int
 */
const INIT = {
	curColSize: 2,
	curGroup: null
};

const curColSizeLens = R.lensProp("curColSize");
const curGroupLens = R.lensProp("curGroup");

exports.INIT = INIT;

exports.curColSizeLens = curColSizeLens;
exports.curGroupLens = curGroupLens;
