const Most = require("most");
const R = require("ramda");

// init :: a -> Stream (b -> a)
const init = x => Most.of(R.always(x));

// chooseIO :: Int -> Int -> IO Int
const chooseIO = (n, m) => {
	return Math.floor(Math.random() * (m - n)) + n;
};

// oneOfIO :: [a] -> Maybe a
const oneOfIO = xs => {
	if (!xs.length) {
		return null;
	}
	const i = chooseIO(0, xs.length - 1);
	return xs[i];
};

exports.init = init;
exports.chooseIO = chooseIO;
exports.oneOfIO = oneOfIO;
