const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");
const Isolate = require("@cycle/isolate").default;

const ConfirmW = require("XGWidget/confirm");

const DropdownW = require("./widget/dropdown");
const DropdownState = require("./widget/dropdown/state");
const GroupFormW = require("./widget/groupform");
const EmojiW = require("./emoji/index");

const LoadState = require("XGState/load");
const GroupState = require("XGState/group");
const Fetch = require("XGLib/fetch");
const State = require("./state");
const render = require("./render");

const intent = source => {
	const state$ = source.state.stream;

	// 点击添加分组$ :: Stream ()
	const 点击添加分组$ = source.DOM$.select(".__add-group__")
		.events("click")
	;

	// 点击更新分组$ :: Stream ()
	const 点击更新分组$ = source.DOM$.select(".__edit-group__")
		.events("click")
	;

	// 点击删除分组$ :: Stream ()
	const 点击删除分组$ = source.DOM$.select(".__delete-group__")
		.events("click")
		.map(_ => ConfirmW.show_("确定删除？"))
		.switchLatest()
	;

	// 新建分组$ :: Stream (SidebarState -> SidebarState)
	const 新建分组$ = state$
		.sampleWith(点击添加分组$)
		.map(state => {
			return GroupFormW(null)
				.concatMap(State.新建分组(state))
				.map(新分组 => R.over(State.分组lens, R.append(新分组)))
			;
		})
		.switchLatest()
	;

	// 更新分组$ :: Stream (SidebarState -> SidebarState)
	const 更新分组$ = state$
		.sampleWith(点击更新分组$)
		.filter(R.view(State.位置lens))
		.map(state => {
			const 位置 = R.view(State.位置lens, state);
			const 旧分组 = State.选中分组(state);

			const [_, 名字] = GroupState.常用字段(旧分组);

			const lens = R.compose(
				State.分组lens,
				R.lensIndex(位置)
			);

			return GroupFormW(名字)
				.concatMap(State.更新分组(state, 旧分组))
				.map(R.set(lens))
			;
		})
		.switchLatest()
	;

	// 删除分组$ :: Stream (SidebarState -> SidebarState)
	const 删除分组$ = state$
		.sampleWith(点击删除分组$)
		.filter(R.compose(
			R.complement(R.isNil),
			R.view(State.位置lens)
		))
		.map(state => {
			const 位置 = R.view(State.位置lens, state);
			const 旧分组 = State.选中分组(state);
			const [id, _] = GroupState.常用字段(旧分组);

			return State.删除分组(state, id)
				.constant(R.compose(
					R.set(State.位置lens, null),
					R.over(State.分组lens, R.remove(位置, 1))
				))
			;
		})
		.switchLatest()
	;

	return {
		新建分组$,
		更新分组$,
		删除分组$
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

	// dropdown$ :: Stream GroupState
	const dropdown$ = state$
		.map(DropdownState.生于SidebarState)
	;
	const dropdownApp = Isolate(DropdownW)(source, dropdown$);

	// 选中分组$ :: Stream (FetchReader, Maybe Group)
	const group$ = state$
		.map(state => ([
			R.view(State.fetchlens, state),
			State.选中分组(state)
		]))
	;
	const emojiApp = Isolate(EmojiW)(source, group$);

	const DOM$ = Most.combineArray(
		(a, b, c) => ([a, b, c]),
		[state$, dropdownApp.DOM$, emojiApp.DOM$]
	)
		.tap(console.log)
		.map(render)
	;

	// state :: Stream (SidebarState -> SidebarState)
	const state = 初始状态$
		.merge(Action.新建分组$)
		.merge(Action.更新分组$)
		.merge(Action.删除分组$)
		.merge(dropdownApp.选择$
			.map(R.set(State.位置lens))
		)
	;

	return {
		DOM$,
		state
	};
};

module.exports = main;
