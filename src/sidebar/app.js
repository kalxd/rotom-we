const Most = require("most");
const R = require("ramda");
const STATE = require("./state");
const dom = require("@cycle/dom");
const Alert = require("../lib/alert");

const main = source => {
	const state$ = source.state.stream;

	const inc$ = source.DOM.select(".inc")
		.events("click")
		.flatMap(_ => Alert.show("abc"))
		.flatMap(_ => Alert.show("ffff"))
		.constant(R.inc)
	;

	return {
		DOM: state$.map(n => dom.button(".ui.button.inc", n)),
		state: Most.of(R.always(0)).merge(inc$)
	};
};

module.exports = main;
