const R = require("ramda");

// curGroup :: Maybe Int
// group :: [a]
// emojiVec :: [b]

const curGroupLens = R.lensProp("curGroup");
const groupLens = R.lensProp("group");
const emojiVecLens = R.lensProp("emojiVec");

exports.curGroupLens = curGroupLens;
exports.groupLens = groupLens;
exports.emojiVecLens = emojiVecLens;
