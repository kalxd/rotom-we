const Most = require("most");
const dom = require("@cycle/dom");

const { runAtApp } = require("XGWidget/run");
/*
const R = require("ramda");
const Store = require("./lib/store");
*/

/*
const { render, alertError } = require("XGWidget/render");
const PlaceholderV = require("XGWidget/placeholder");
*/

// const App = require("./sidebar/index");

// main :: Source -> Application
const main = source => {
	const DOM$ = Most.of(dom.div(".ui.header", "hello"));

	return {
		DOM$
	};
};

runAtApp(main);
