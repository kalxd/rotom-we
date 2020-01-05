const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");

const Modal = require("XGWidget/modal");
const { drawDialog } = require("XGWidget/draw");

const State = require("./state");

const intent = source => {
	const state$ = source.state.stream;

	const 名字$ = source.DOM$.select(".__name__")
		.events("change")
		.map(e => e.target.value.trim())
	;

	const 确定$ = source.DOM$.select(".accept")
		.events("click")
		.debounce(200)
	;

	const 取消$ = source.DOM$.select(".reject")
		.events("click")
		.debounce(200)
	;

	return {
		确定$: 名字$.sampleWith(确定$),
		取消$
	};
};

// render :: String -> FormState -> View
const render = R.curry((标题, state) => {
	const 分组名字 = R.view(State.名字lens, state);

	return drawDialog(标题, [
		dom.div(".ui.form", [
			dom.div(".ui.field.required", [
				dom.label("分组名称"),
				dom.input(".__name__", {
					props: {
						value: 分组名字
					}
				})
			])
		]),
	]);
});

// app :: Maybe String -> Source -> Application
const app = R.curry((分组名字, source) => {
	const 标题 = (s => {
		if (R.isNil(s)) {
			return "新建分组";
		}
		else {
			return "编辑分组";
		}
	})(分组名字);

	const state$ = source.state.stream;

	const 初始$ = Most.of(分组名字)
		.map(State.新建表单)
		.map(R.always)
	;

	const Action = intent(source);

	const state = 初始$;

	const DOM$ = state$.map(render(标题));

	return {
		DOM$,
		state,
		accept$: Action.确定$,
		reject$: Action.取消$
	};
});

// main :: Maybe String -> Stream String
const main = 分组名字 => {
	const modal = Modal(app(分组名字));

	modal.reject$.observe(modal.hideModal);

	return modal.accept$
		.tap(modal.hideModal)
	;
};

module.exports = main;
