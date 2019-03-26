const Most = require("most");
const R = require("ramda");
const S = require("sanctuary");

const Modal = require("./modal");
const { drawDialog } = require("./draw");

// main :: Maybe String -> String -> Source -> Sink
const main = R.curry((title, msg, source) => {
	const accept$ = source.DOM.select(".accept")
		.events("click")
	;

	const reject$ = source.DOM.select(".reject")
		.events("click")
	;

	return {
		DOM: Most.of(drawDialog(title, msg)),
		accept$,
		reject$
	};
});

// show :: Nullable String -> String -> Stream ()
const show = R.curry((title, msg) => {
	const modalTitle = S.toMaybe(title);
	const modal = Modal(main(modalTitle, msg));

	modal.reject$.observe(modal.hideModal);

	return modal.accept$.tap(modal.hideModal);
});

// show_ :: String -> Stream ()
const show_ = show(null);

// tapShow :: a -> Nullable String -> String -> Stream a
const tapShow = R.curry((a, title, msg) => {
	return show(title, msg).constant(a);
});

// tapShow_ :: a -> String -> Stream a
const tapShow_ = tapShow(R.__, null, R.__);

exports.show = show;
exports.show_ = show_;
exports.tapShow = tapShow;
exports.tapShow_ = tapShow_;
