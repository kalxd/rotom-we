const Most = require("most");
const R = require("ramda");

// isEmpty :: String -> Bool
const isEmpty = R.compose(
	R.isEmpty,
	R.trim
);

// isNotEmpty :: String -> Bool
const isNotEmpty = R.compose(
	R.not,
	isEmpty
);

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

// initState :: a -> Stream (b -> a)
const initState = x => Most.of(x).map(R.always);

// liftThrow :: String -> Stream a
const liftThrow = msg => {
	const e = new Error(msg);
	return Most.throwError(e);
};

// orEmpty :: Maybe String -> String
const orEmpty = R.defaultTo("");

// fmap :: (a -> b) -> Maybe a -> Maybe b
const fmap = R.curry((f, x) => {
	if (R.isNil(x)) {
		return null;
	}

	return f(x);
});

// renderWhen :: Bool -> (() -> View) -> View
const renderWhen = R.curry((b, f) => {
	if (!b) {
		return null;
	}

	return f();
});

module.exports = {
	isEmpty,
	isNotEmpty,
	chooseIO,
	oneOfIO,
	initState,
	liftThrow,
	orEmpty,
	fmap,
	renderWhen
};
