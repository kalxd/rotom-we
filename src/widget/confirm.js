const Most = require("most");
const R = require("ramda");

const Modal = require("./modal");
const { drawDialog } = require("./draw");

// main :: Maybe String -> String -> Source -> Application
const main = R.curry((标题, 内容, source) => {
	const accept$ = source.DOM$.select(".accept")
		.events("click")
	;

	const reject$ = source.DOM$.select(".reject")
		.events("click")
	;

	const DOM$ = Most.of()
		.constant(drawDialog(标题, 内容))
	;

	return {
		DOM$,
		accept$,
		reject$
	};
});

// show :: Maybe String -> String -> Stream ()
const show = R.curry((title, msg) => {
	const modal = Modal(main(title, msg));

	modal.reject$.observe(modal.hideModal);

	return modal.accept$.tap(modal.hideModal);
});

// show_ :: String -> Stream ()
const show_ = show("提示");

module.exports = {
	show,
	show_
};
