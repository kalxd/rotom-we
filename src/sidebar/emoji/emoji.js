const R = require("ramda");
const LoadW = require("../widget/load");
const EmojiFormW = require("../widget/emojiform");

const State = require("./state");
const LoadState = require("XGState/load");
const DropdownState = require("../widget/dropdown/state");
const SidebarState = require("../state");
const render = require("./render");

const intent = R.curry((source, state$, sidebarState$) => {
	const 点击新建$ = source.DOM$.select(".__add__")
		.events("click")
	;

	// 新建$ :: Stream (EmojiState -> EmojiState)
	const 新建$ = 点击新建$
		.sample(R.pair, state$, sidebarState$)
		.map(([state, sidebarState]) => {
			const dropdownState = DropdownState.生于SidebarState(sidebarState);
			return EmojiFormW(null, dropdownState)
				.concatMap(State.新建表情(state))
				.map(x => R.over(State.表情分表lens, R.append(x)))
			;
		})
		.switchLatest()
	;

	return {
		新建$
	};
});

// main :: Source -> Stream State -> Stream SidebarState -> Application
const main = R.curry((source, state$, sidebarState$) => {
	const Action = intent(source, state$, sidebarState$);

	const DOM$ = state$
		.concatMap(state => {
			return State.获取表情列表(state)
				.map(xs => R.set(State.表情列表lens, xs, state))
				.map(LoadState.pure)
				.startWith(LoadState.empty)
				.map(R.always)
			;
		})
		.merge(Action.新建$)
		.scan((acc, f) => f(acc), LoadState.empty)
		.map(LoadState.fmap(render))
		.map(LoadW.render)
	;

	return {
		DOM$
	};
});

module.exports = main;
