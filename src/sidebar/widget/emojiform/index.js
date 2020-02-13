const R = require("ramda");
const Most = require("most");
const Isolate = require("@cycle/isolate").default;
const Modal = require("XGWidget/modal");
const EmojiState = require("XGState/emoji");
const DropdownW = require("../dropdown");
const DropdownState = require("../dropdown/state");

const State = require("./state");
const render = require("./render");

const intent = source => {
	const state$ = source.state.stream;

	const 点击确定$ = source.DOM$.select(".accept")
		.events("click")
	;

	const 取消$ = source.DOM$.select(".reject")
		.events("click")
	;

	// 名字$ :: Stream (State -> State)
	const 名字$ = source.DOM$.select(".__name__")
		.events("change")
		.map(e => e.target.value.trim())
		.map(R.set(State.名字lens))
	;

	// 链接$ :: Stream (State -> State)
	const 链接$ = source.DOM$.select(".__link__")
		.events("change")
		.map(e => e.target.value.trim())
		.map(R.set(State.链接lens))
	;

	// 确定$ :: Stream EmojiForm
	const 确定$ = state$
		.sampleWith(点击确定$)
		.map(State.生成EmojiForm)
		.filter(R.complement(R.isNil))
	;

	return {
		确定$,
		取消$,

		名字$,
		链接$
	};
};

// app :: Maybe Emoji -> DropdownState -> Source -> Application
const app = R.curry((表情, dropdownState, source) => {
	const Action = intent(source, 表情);
	const state$ = source.state.stream;

	const 标题 = (x => {
		if (R.isNil(x)) {
			return "新建表情";
		}
		else {
			return "编辑表情";
		}
	})(表情);

	const 初始$ = Most.of(dropdownState)
		.map(State.生成(表情))
		.map(R.always)
	;

	// dropdownState$ :: Stream DropdownState
	const dropdownState$ = state$
		.map(R.view(State.dropdownlens))
	;
	const dropdownApp = Isolate(DropdownW)(source, dropdownState$);

	const 选择分组$ = dropdownApp.选择$
		.map(index => {
			const lens = R.compose(
				State.dropdownlens,
				DropdownState.当前选择lens
			);

			return R.set(lens, index);
		})
	;

	const state = 初始$
		.merge(选择分组$)
		.merge(Action.名字$)
		.merge(Action.链接$)
	;

	const DOM$ = state$
		.combine(
			render(标题),
			dropdownApp.DOM$
		)
	;

	return {
		DOM$,
		state,
		accept$: Action.确定$,
		reject$: Action.取消$
	};
});

// main :: Maybe Emoji -> DropdownState -> Stream EmojiForm
const main = R.curry((表情, dropdownState) => {
	const modal = Modal(app(表情, dropdownState));

	modal.reject$.observe(modal.hideModal);

	return modal.accept$
		.tap(modal.hideModal)
	;
});

module.exports = main;
