const Most = require("most");
const R = require("ramda");
const dom = require("@cycle/dom");

// render :: Object -> View
const render = option => dom.div(".ui.segment", [
	dom.h2(option.addr),
	dom.h2(option.token)
]);

const main = (source, input$) => {
	const init$ = Most.of(R.always(null));

	return {
		DOM: input$.map(render),
		state: init$
	};
};

module.exports = main;
