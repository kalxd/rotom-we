const R = require("ramda");
const { oneOfIO } = require("./ext");

const COLOR_VEC = [
	"red",
	"orange",
	"yellow",
	"olive",
	"green",
	"teal",
	"blue",
	"violet",
	"purple",
	"pink",
	"brown",
	"grey",
	"black"
];

// randomColorIO :: () -> IO String
const randomColorIO = () => oneOfIO(COLOR_VEC);

const NUM_VEC = [
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
	"ten",
	"eleven",
	"twelve",
	"thirteen",
	"fourteen",
	"fifteen",
	"sixteen"
];

// showNumName :: Int -> Maybe String
const showNumName = R.flip(R.nth)(NUM_VEC);

exports.COLOR_VEC = COLOR_VEC;
exports.randomColorIO = randomColorIO;

exports.NUM_VEC = NUM_VEC;
exports.showNumName = showNumName;
