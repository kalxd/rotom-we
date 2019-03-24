const R = require("ramda");
const S = require("sanctuary");
const dom = require("@cycle/dom");

const dialogStyle = {
	transition: "opacity .3s, transform .3s",
	opacity: 0,
	transform: "translateX(+20px) rotateY(-60deg)",
	delayed: {
		opacity: 1,
		transform: "translateX(0) rotateY(0)"
	}
};


// renderError :: Show a => a -> View
const renderError = msg => dom.div(".ui.red.message", S.show(msg));

// drawMaybe :: (a -> View) -> Maybe View -> View
const drawMaybe = R.curry((f, x) => {
	const y = S.map(f)(x);
	return S.maybeToNullable(y);
});

// drawEither :: (a -> View) -> Either String a -> View
const drawEither = R.curry((f, x) => {
	return S.either(renderError)(f)(x);
});

// drawEither_ -> Either String View -> View
const drawEither_ = drawEither(S.I);

// drawError :: Maybe String -> View
const drawError = R.compose(
	S.maybeToNullable,
	S.map(es => dom.div(".ui.red.message", [
		dom.ul(".list", R.map(dom.li)(es))
	]))
);

// drawModal :: View -> View
const drawModal = view => (
	dom.div(".ui.modal.transition.visible", { style: dialogStyle }, view)
);

// drawDialog :: Maybe title -> View -> View
const drawDialog = R.curry((title, view) => (
	drawModal([
		drawMaybe(title => dom.div(".header", title))(title),
		dom.div(".content", view),
		dom.div(".actions", [
			dom.button(".ui.reject.button", "不好"),
			dom.button(".ui.accept.primary.button", "好")
		])
	])
));

exports.drawMaybe = drawMaybe;
exports.drawEither = drawEither;
exports.drawEither_ = drawEither_;
exports.drawError = drawError;
exports.drawModal = drawModal;
exports.drawDialog = drawDialog;
