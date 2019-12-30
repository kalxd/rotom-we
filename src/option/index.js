const R = require("ramda");
const Most = require("most");

const render = require("./render");

// main :: Source -> Application
const main = R.curry((source) => {
	return {
		DOM$: Most.of().map(render)
	};
});

module.exports = main;
