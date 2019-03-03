const R = require("ramda");

// curGroup :: Maybe Int
// group :: [a]

const curGroupLens = R.lensProp("curGroup");
const groupLens = R.lensProp("group");

exports.curGroupLens = curGroupLens;
exports.groupLens = groupLens;
