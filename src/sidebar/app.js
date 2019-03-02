const Most = require("most");
const R = require("ramda");
const dom = require("@cycle/dom");
const Fetch = require("../lib/fetch");

const Nav = require("./nav");

// render :: Object -> View
const render = option => dom.div(".ui.segment", [
	dom.h2(option.addr),
	dom.h2(option.token)
]);

const main = (source, input$) => {
	const init$ = Most.of(R.always(null));

	const { send_$ } = Fetch(input$);

	const group$ = send_$("/show/all/group");

	const nav = Nav(source, group$);

	return {
		DOM: nav.DOM,
		state: init$
	};
};

module.exports = main;
