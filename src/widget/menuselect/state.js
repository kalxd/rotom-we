const R = require("ramda");

// visible :: Bool
// itemVec :: [a]
// select :: Maybe Nat
const INIT = {
	visible: false,
	itemVec: [],
	select: null
};

const visibleLens = R.lensProp("visible");
const itemVecLens = R.lensProp("itemVec");
const selectLens = R.lensProp("select");

exports.INIT = INIT;

exports.visibleLens = visibleLens;
exports.itemVecLens = itemVecLens;
exports.selectLens = selectLens;
