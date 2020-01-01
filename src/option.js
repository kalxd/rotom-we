const Most = require("most");
const dom = require("@cycle/dom");

const LoadState = require("XGState/load");
const AppState = require("XGState/index");

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
	const DOM$ = Most.fromPromise(AppState.读取选项())
		.concatMap(state => OptionW(source, state).DOM$)
		.map(LoadState.pure)
		.startWith(LoadState.empty)
		.map(render)
	;

	return {
		DOM$
	};
};

runAtApp(main);
