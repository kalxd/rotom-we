const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");

// main :: Source -> Stream (Maybe Group) -> Application
const main = R.curry((source, group$) => {
	const DOM$ = Most.of()
		.constant(dom.div(".ui.segment", "hello world"))
	;

	return {
		DOM$
	};
});

module.exports = main;
