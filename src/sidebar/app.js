const Most = require("most");
const R = require("ramda");
const STATE = require("./state");
const dom = require("@cycle/dom");

const main = source => {
	const state$ = source.state.stream;

	const inc$ = source.DOM.select(".inc")
		.events("click")
		.constant(R.inc)
	;

	return {
		DOM: state$.map(n => dom.button(".ui.button.inc", n)),
		state: Most.of(R.always(0)).merge(inc$)
	};
};

module.exports = main;
