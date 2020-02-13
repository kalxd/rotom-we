const R = require("ramda");
const Most = require("most");

const EmojiFormW = require("../widget/emojiform");
const { nodeIndex } = require("XGLib/effect");

const State = require("./state");
const DropdownState = require("../widget/dropdown/state");
const SidebarState = require("../state");
const render = require("./render");

const intent = R.curry((source, sidebarState$) => {
	const state$ = source.state.stream;
	const 点击新建$ = source.DOM$.select(".__add__")
		.events("click")
	;

	// 点击编辑$ :: Stream Element
	const 点击编辑$ = source.DOM$.select(".__edit__")
		.events("click")
		.map(e => e.target.parentNode.parentNode)
	;

	// 点击删除$ :: Stream Element
	const 点击删除$ = source.DOM$.select(".__del__")
		.events("click")
		.map(e => e.target.parentNode.parentNode)
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

	// 编辑$ :: Stream (EmojiState -> EmojiState)
	const 编辑$ = Most.combineArray(
			(...xs) => xs,
			[
				state$,
				点击编辑$,
				sidebarState$
			]
		)
		.sampleWith(点击编辑$)
		.map(([state, cardEl, sidebarState]) => {
			const index = nodeIndex(cardEl);
			const lens = R.compose(
				State.表情列表lens,
				R.lensIndex(index)
			);

			const 旧表情 = R.view(lens, state);
			const dropdownState = DropdownState.生于SidebarState(sidebarState);

			return EmojiFormW(旧表情, dropdownState)
				.concatMap(State.更新表情(state, 旧表情))
				.map(R.set(lens))
			;
		})
		.switchLatest()
	;

	return {
		新建$,
		编辑$
	};
});

// main :: Source -> Stream SidebarState -> Application
const main = R.curry((source, sidebarState$) => {
	const state$ = source.state.stream;
	const Action = intent(source, sidebarState$);

	// 分组切换 :: Stream (a -> EmojiAppState)
	const 分组切换$ = sidebarState$
		.map(state => {
			const fetch = R.view(SidebarState.fetchlens, state);
			const 当前分组 = SidebarState.选中分组(state);
			return [fetch, 当前分组];
		})
		.tap(console.info)
		.filter(R.nth(1))
		.skipRepeatsWith((x, y) => x[1] === y[1])
	;

	// state :: Stream (EmojiAppState -> EmojiAppState)
	const state = 分组切换$
		.map(R.apply(State.生成))
		.concatMap(state => {
			return State.获取表情列表(state)
				.map(xs => R.set(State.表情列表lens, xs, state))
				.map(R.always)
			;
		})
		.merge(Action.新建$)
		.merge(Action.编辑$)
	;

	const DOM$ = state$.tap(console.warn)
		.map(render)
		.startWith(null)
	;

	return {
		DOM$,
		state
	};
});

module.exports = main;
