const Most = require("most");
const R = require("ramda");
const S = require("sanctuary");

// isNotEmpty :: String -> Bool
const isNotEmpty = R.compose(
	R.not,
	R.isEmpty,
	R.trim
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

// throwWith :: String -> Stream ()
const throwWith = msg => {
	const e = new Error(msg);
	return Most.throwError(e);
};

// guardMaybe :: String -> Maybe a -> Stream a
const guardMaybe = R.curry((msg, x) => {
	if (S.isJust(x)) {
		return Most.of(S.maybeToNullable(x));
	}
	else {
		const e = S.Left(msg);
		return Most.throwError(e);
	}
});

// swapEither :: Either a b -> Either b a
const swapEither = x => {
	if (S.isRight(x)) {
		return S.Left(x.value);
	}
	else {
		return S.Right(x.value);
	}
};

// swapToMaybe :: Either a b -> Maybe a
const swapToMaybe = R.compose(
	S.eitherToMaybe,
	swapEither
);

// fmap :: (a -> b) -> Maybe a -> Maybe b
const fmap = R.curry((f, x) => {
	if (R.isNil(x)) {
		return null;
	}

	return f(x);
});

// renderWhen :: Bool -> Bool -> View
const renderWhen = R.curry((b, f) => {
	if (!b) {
		return null;
	}

	return f(b);
});

exports.isNotEmpty = isNotEmpty;

exports.chooseIO = chooseIO;
exports.oneOfIO = oneOfIO;

exports.throwWith = throwWith;
exports.guardMaybe = guardMaybe;

exports.swapEither = swapEither;
exports.swapToMaybe = swapToMaybe;

exports.fmap = fmap;
exports.renderWhen = renderWhen;
