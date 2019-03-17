const R = require("ramda");
const S = require("sanctuary");
const Most = require("most");
const dom = require("@cycle/dom");
const Modal = require("./modal");

const Eff = require("XGLib/effect");
const { drawMaybe } = require("XGWidget/draw");

// render :: String -> Maybe String -> View
const render = (msg, title) => dom.div(".ui.modal.transition.visible", [
	drawMaybe(title => dom.div(".header", title))(title),
	dom.div(".content", msg),
	dom.div(".actions", [
		dom.button(".ui.accept.primary.button", "OK")
	])
]);

const main = R.curry((msg, title, source) => {
	const accept$ = source.DOM.select(".accept")
		.events("click")
	;

	return {
		DOM: Most.of(render(msg, title)),
		accept$
	};
});

// show :: String -> Nullable String -> Stream Element
const show = R.curry((msg, title) => {
	const modal = Modal(main(msg, S.toMaybe(title)));

	return modal.sinks.accept$
		.tap(modal.dispose)
		.tap(Eff.hideMaskWhen)
	;
});

// show_ :: String -> Stream Element
const show_ = R.flip(show)(null);

exports.show = show;
exports.show_ = show_;
