const R = require("ramda");
const S = require("sanctuary");
const Most = require("most");
const dom = require("@cycle/dom");
const Modal = require("./modal");

const Eff = require("XGLib/effect");
const { drawMaybe } = require("XGWidget/draw");

// render :: Maybe String -> String -> View
const render = (title, msg) => dom.div(".ui.modal.transition.visible", [
	drawMaybe(title => dom.div(".header", title))(title),
	dom.div(".content", msg),
	dom.div(".actions", [
		dom.button(".ui.accept.primary.button", "OK")
	])
]);

// main :: Nullable String -> String -> Source -> Sink
const main = R.curry((title, msg, source) => {
	const accept$ = source.DOM.select(".accept")
		.events("click")
	;

	return {
		DOM: Most.of(render(title, msg)),
		accept$
	};
});

// show :: Nullable String -> String -> Stream Element
const show = R.curry((title, msg) => {
	const modal = Modal(main(S.toMaybe(title), msg));

	return modal.sinks.accept$
		.tap(modal.dispose)
		.tap(Eff.hideMaskWhen)
	;
});

// show_ :: String -> Stream Element
const show_ = show(null);

exports.show = show;
exports.show_ = show_;
