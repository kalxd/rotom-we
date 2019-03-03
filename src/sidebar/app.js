const Most = require("most");
const Fetch = require("../lib/fetch");

const ST = require("./state");

const Nav = require("./nav");

const main = (source, input$) => {
	const fetch = Fetch(input$)

	const navProps = {
		group$: fetch.send_$("/show/all/group"),
		curGroup$: Most.of(null),
		fetch
	};

	const nav = Nav(source, navProps);

	return {
		DOM: nav.DOM,
		state: nav.state.tap(console.log)
	};
};

module.exports = main;
