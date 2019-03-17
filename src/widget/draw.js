const R = require("ramda");
const S = require("sanctuary");
const dom = require("@cycle/dom");

// renderError :: Show a => a -> View
const renderError = msg => dom.div(".ui.red.message", S.show(msg));

// drawMaybe :: Maybe View -> View
const drawMaybe = S.maybeToNullable;

// drawEither :: (a -> View) -> Either String a -> View
const drawEither = R.curry((f, x) => {
	return S.either(renderError)(f)(x);
});

// drawEither_ -> Either String View -> View
const drawEither_ = drawEither(S.I);

// drawError :: Maybe String -> View
const drawError = R.compose(
	drawMaybe,
	S.map(es => dom.div(".ui.red.message", [
		dom.ul(".list", R.map(dom.li)(es))
	]))
);

exports.drawMaybe = drawMaybe;
exports.drawEither = drawEither;
exports.drawEither_ = drawEither_;
exports.drawError = drawError;
