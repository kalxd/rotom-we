const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");

const LoadState = require("XGState/load");
const Fetch = require("XGLib/fetch");
const State = require("./state");
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
		.tap(console.info)
		.map(render)
	;

	const state = 初始状态$;

	return {
		DOM$,
		state
	};
};

module.exports = main;
