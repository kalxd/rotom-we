const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");

const Modal = require("XGWidget/modal");
const { drawDialog, drawError } = require("XGWidget/draw");

/**
 * type FormState = { 名字 :: String }
 */

// 新建表单 :: String -> FormState
const 新建表单 = 名字 => ({ 名字 });

// 名字lens :: Lens FormState String
const 名字lens = R.lensProp("名字");

const intent = source => {
	const state$ = source.state.stream;

	const name$ = source.DOM$.select(".__name__")
		.events("change")
		.map(e => e.target.value.trim())
	;

	const accept$ = source.DOM$.select(".accept")
		.events("click")
		.debounce(200)
	;

	const reject$ = source.DOM$.select(".reject")
		.events("click")
		.debounce(200)
	;

	return {
		name$,
		accept$,
		reject$
	};
};

// render :: String -> FormState -> View
const render = R.curry((标题, state) => {
	const 分组名字 = R.view(名字lens, state);

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
		.map(新建表单)
		.map(R.always)
	;

	const Action = intent(source);

	const state = 初始$;

	const DOM$ = state$.map(render(标题));

	return {
		DOM$,
		state,
		accept$: Action.accept$,
		reject$: Action.reject$
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
