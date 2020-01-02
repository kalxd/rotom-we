const Most = require("most");
const dom = require("@cycle/dom");

const AppState = require("XGState/app");
const LoadState = require("XGState/load");

const { runAtApp } = require("XGWidget/run");

const OptionW = require("./option/index");

// render :: LoadState View -> View
const render = loadState => {
	if (loadState.已完成) {
		return loadState.内容;
	}
	else {
		return dom.progress(".progress.is-info");
	}
};

const main = source => {
	const optionApp = OptionW(source, AppState.读取选项());

	const DOM$ = optionApp.DOM$
		.map(LoadState.pure)
		.startWith(LoadState.empty)
		.map(render)
	;

	return {
		DOM$,
		state: optionApp.state
	};
};

runAtApp(main);
