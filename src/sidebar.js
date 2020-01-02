const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");

const { runAtApp } = require("XGWidget/run");
const AppState = require("XGState/app");
const LoadState = require("XGState/load");

const LoadW = require("./sidebar/widget/load");

// main :: Source -> Application
const main = source => {
	const appState$ = AppState.读取选项()
		.map(R.view(AppState.addrLens))
		.map(LoadState.pure)
		.startWith(LoadState.empty)
	;

	const DOM$ = appState$.map(LoadW.render)
		.map(s => dom.div(".ui.header", s))
	;

	return {
		DOM$
	};
};

runAtApp(main);
