const Most = require("most");
const R = require("ramda");

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

// throwWith :: String -> Stream ()
const throwWith = msg => {
	const e = new Error(msg);
	return Most.throwError(e);
};

exports.chooseIO = chooseIO;
exports.oneOfIO = oneOfIO;

exports.throwWith = throwWith;
