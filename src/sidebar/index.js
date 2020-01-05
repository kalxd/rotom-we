const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");
const Isolate = require("@cycle/isolate").default;

const DropdownW = require("./widget/dropdown");
const DropdownState = require("./widget/dropdown/state");

const GroupW = require("./form/group");

const LoadState = require("XGState/load");
const Fetch = require("XGLib/fetch");
const State = require("./state");
const render = require("./render");

const intent = source => {
	const 新建分组$ = source.DOM$.select(".__add-group__")
		.events("click")
	;

	return {
		新建分组$
	};
};

// main :: Source -> Stream AppState -> Application
const main = (source, appState$) => {
	const Action = intent(source);

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

	const 新分组$ = Action.新建分组$
		.flatMap(_ => GroupW("abc"))
		.observe(console.log)
	;

	// 下接菜单
	const dropdownState$ = state$
		.map(state => {
			const a = R.view(State.选中分组lens, state);
			const b = R.view(State.分组lens, state);
			return DropdownState.生成(a, b);
		})
	;

	const dropdownApp = Isolate(DropdownW)(source, dropdownState$);

	const DOM$ = state$
		.combine(R.pair, dropdownApp.DOM$)
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
