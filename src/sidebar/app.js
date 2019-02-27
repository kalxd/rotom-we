const Most = require("most");
const R = require("ramda");
const dom = require("@cycle/dom");
const Fetch = require("../lib/fetch");

// render :: Object -> View
const render = option => dom.div(".ui.segment", [
	dom.h2(option.addr),
	dom.h2(option.token)
]);

const main = (source, input$) => {
	const init$ = Most.of(R.always(null));

	const view = input$
		.concatMap(x => Fetch.send_$("/self")
			.tap(console.log)
			.constant(x)
		)
		.map(render)
	;

	return {
		DOM: view,
		state: init$
	};
};

module.exports = main;
