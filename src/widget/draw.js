const R = require("ramda");
const S = require("sanctuary");

// renderMaybe :: Maybe View -> View
const renderMaybe = S.maybeToNullable;

// renderEither :: (a -> View) -> Either String a -> View
const renderEither = R.curry((f, x) => {
	const g = msg => dom.div(".ui.red.message", msg);

	return S.either(g)(f)(x);
});

// renderEither_ -> Either String View -> View
const renderEither_ = renderEither(S.I);

exports.renderMaybe = renderMaybe;
exports.renderEither = renderEither;
exports.renderEither_ = renderEither_;
