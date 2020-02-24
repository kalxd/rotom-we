const R = require("ramda");
const Most = require("most");

const EmojiFormW = require("../widget/emojiform");
const { nodeIndex } = require("XGLib/effect");
const ConfirmW = require("XGWidget/confirm");
const LoadState = require("XGState/load");
const EmojiState = require("XGState/emoji");
const GroupState = require("XGState/group");
const LoadW = require("../widget/load");

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

	// 新建$ :: Stream (LoadState EmojiState -> LoadState EmojiState)
	const 新建$ = 点击新建$
		.sample(R.pair, state$, sidebarState$)
		.map(([state, sidebarState]) => {
			if (LoadState.是否完成(state)) {
				return Most.of(state)
					.map(R.view(LoadState.内容lens))
					.concatMap(state => {
						const dropdownState = DropdownState.生于SidebarState(sidebarState);
						return EmojiFormW(null, dropdownState)
							.concatMap(State.新建表情(state))
							.map(x => R.over(State.表情列表lens, R.append(x)))
							.map(LoadState.fmap)
						;
					})
				;
			}
			else {
				return Most.of(R.identity);
			}
		})
		.switchLatest()
	;

	// 编辑$ :: Stream (LoadState EmojiState -> LoadState EmojiState)
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
			if (LoadState.是否完成(state)) {
				return Most.of(state)
					.map(R.view(LoadState.内容lens))
					.concatMap(state => {
						const index = nodeIndex(cardEl);
						const lens = R.compose(
							State.表情列表lens,
							R.lensIndex(index)
						);

						const 旧表情 = R.view(lens, state);
						const dropdownState = DropdownState.生于SidebarState(sidebarState);

						return EmojiFormW(旧表情, dropdownState)
							.concatMap(State.更新表情(state, 旧表情))
							.map(新表情 => {
								const 新表情id = R.view(EmojiState.分组idlens, 新表情);
								const 现在分组id = R.view(
									R.compose(
										State.当前分组lens,
										GroupState.idlens
									),
									state
								);

								if (新表情id === 现在分组id) {
									return R.set(lens, 新表情);
								}
								else {
									return R.over(State.表情列表lens, R.remove(index, 1));
								}
							})
							.map(LoadState.fmap)
						;
					})
				;
			}
			else {
				return Most.of(R.identity);
			}
		})
		.switchLatest()
	;

	// 删除$ :: Stream (LoadState EmojiAppState -> LoadState EmojiAppState)
	const 删除$ = state$
		.combine(R.pair, 点击删除$.map(nodeIndex))
		.sampleWith(点击删除$)
		.map(([state, index]) => {
			return ConfirmW.show_("确认删除该表情？")
				.concatMap(_ => {
					const lens = R.compose(
						State.表情列表lens,
						R.lensIndex(index)
					);

					const 表情 = R.view(lens, state);
					return State.删除表情(state, 表情);
				})
				.constant(R.over(State.表情列表lens, R.remove(index, 1)))
			;
		})
		.switchLatest()
	;

	return {
		新建$,
		编辑$,
		删除$
	};
});

// main :: Source -> Stream SidebarState -> Application
const main = R.curry((source, sidebarState$) => {
	const state$ = source.state.stream;
	const Action = intent(source, sidebarState$);

	// 分组切换 :: Stream (FetchReader, Maybe Group)
	const 分组切换$ = sidebarState$
		.map(state => {
			const fetch = R.view(SidebarState.fetchlens, state);
			const 当前分组 = SidebarState.选中分组(state);
			return [fetch, 当前分组];
		})
		.filter(R.nth(1))
		.skipRepeatsWith((x, y) => x[1] === y[1])
	;

	// state :: Stream (LoadState EmojiAppState -> LoadState EmojiAppState)
	const state = 分组切换$
		.map(R.apply(State.生成))
		.concatMap(state => {
			return State.获取表情列表(state)
				.map(xs => R.set(State.表情列表lens, xs, state))
				.map(LoadState.pure)
				.startWith(LoadState.empty)
				.map(R.always)
			;
		})
		.merge(Action.新建$)
		.merge(Action.编辑$)
		.merge(Action.删除$)
	;

	const DOM$ = state$
		.map(LoadState.fmap(render))
		.map(LoadW.render)
		.startWith(null)
	;

	return {
		DOM$,
		state
	};
});

module.exports = main;
