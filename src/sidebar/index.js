const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");

const LoadState = require("XGState/load");

const LoadV = require("./view/load");

// main :: Source -> Stream (Maybe AppState) -> Application
const main = (source, appState$) => {
	const DOM$ = Most.of(LoadState.empty)
		.map(LoadV.render)
	;

	return {
		DOM$
	};
};

module.exports = main;
