const R = require("ramda");
const Most = require("most");
const Isolate = require("@cycle/isolate").default;
const Modal = require("XGWidget/modal");
const DropdownW = require("../dropdown");
const DropdownState = require("../dropdown/state");

const State = require("./state");
const render = require("./render");

const intent = source => {
	const 确定$ = source.DOM$.select(".accept")
		.events("click")
	;

	const 取消$ = source.DOM$.select(".reject")
		.events("click")
	;

	return {
		确定$,
		取消$
	};
};

// app :: Maybe Emoji -> DropdownState -> Source -> Application
const app = R.curry((表情, dropdownState, source) => {
	const Action = intent(source);

	const 标题 = (x => {
		if (R.isNil(x)) {
			return "新建表情";
		}
		else {
			return "编辑表情";
		}
	})(表情);

	const 初始$ = Most.of(dropdownState)
		.map(R.view(DropdownState.当前选择lens))
		.map(State.生成(表情))
	;

	// dropdownState$ :: Stream DropdownState
	const dropdownState$ = Most.of(dropdownState);
	const dropdownApp = Isolate(DropdownW)(source, dropdownState$);

	const DOM$ = 初始$
		.combine(
			render(标题),
			dropdownApp.DOM$
		)
	;

	return {
		DOM$,
		accept$: Action.确定$,
		reject$: Action.取消$
	};
});

// main :: Maybe Emoji -> DropdownState -> Stream State
const main = R.curry((表情, dropdownState) => {
	const modal = Modal(app(表情, dropdownState));

	modal.reject$.observe(modal.hideModal);

	return modal.accept$
		.tap(modal.hideModal)
	;
});

module.exports = main;
