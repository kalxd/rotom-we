const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");

const LoadState = require("XGState/load");
const Fetch = require("XGLib/fetch");
const State = require("./state");

const LoadV = require("./view/load");
const render = require("./render");

// main :: Source -> Stream AppState -> Application
const main = (source, appState$) => {
	const state$ = source.state.stream;

	// 初始状态$ :: Stream (a -> SidebarState)
	const 初始状态$ = appState$
		.map(Fetch.组装)
		.concatMap(fetch => {
			const state = State.生成(fetch);
			return State.获取分组列表(state)
				.map(xs => R.set(State.分组lens, xs, state))
			;
		})
		.map(R.always)
	;

	const DOM$ = state$
		.tap(console.log)
		.map(render)
		.map(LoadState.pure)
		.startWith(LoadState.empty)
		.tap(console.log)
		.map(LoadV.render)
	;

	const state = 初始状态$;

	// 自动订阅掉第一个状态。
	state$.take(1).drain();

	return {
		DOM$,
		state
	};
};

module.exports = main;
