const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");

const LoadState = require("XGState/load");
const Fetch = require("XGLib/fetch");

const LoadV = require("./view/load");

// main :: Source -> Stream AppState -> Application
const main = (source, appState$) => {
	const DOM$ = appState$
		.map(Fetch.组装)
		.concatMap(FetchReader => {
			return FetchReader.GET_("/分组/列表");
		})
		.tap(console.log)
		.map(LoadV.render)
	;

	return {
		DOM$
	};
};

module.exports = main;
