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

exports.randomIO = randomIO;
exports.oneOfIO = oneOfIO;
