const R = require("ramda");
const Modal = require("XGWidget/modal");

const State = require("./state");
const render = require("./render");

const intent = source => {
	const state$ = source.state.stream;

	const nameChange$ = source.DOM.select("._xg_name_input_")
		.events("change")
		.map(e => e.target.value.trim())
		.merge(state$.map(PageS.viewFormValue(nameLens)))
		.skipRepeats()
	;

	const linkChange$ = source.DOM.select("._xg_link_input_")
		.events("change")
		.map(e => e.target.value.trim())
		.merge(state$.map(PageS.viewFormValue(linkLens)))
		.skipRepeats()
	;

	const accept$ = source.DOM.select(".accept")
		.events("click")
	;

	const reject$ = source.DOM.select(".reject")
		.events("click")
	;

	return {
		nameChange$,
		linkChange$,

		accept$,
		reject$
	};
};

// app :: [Group] -> Group-> Maybe Emoji -> Source -> Application
const app = R.curry((分组, 选中, 表情, source) => {
	const 标题 = (x => {
		if (R.isNil(x)) {
			return "新建表情";
		}
		else {
			return "编辑表情";
		}
	})(表情);

	const state = State.生成(分组, 选中, 表情);

	const DOM$ = 初始$
		.map(state => render(标题, state, null))
	;

	return {
		DOM$
	};
});

// main :: [Group] -> Group -> Maybe Emoji -> Stream State
const main = R.curry((分组, 选中, 表情) => {
	const modal = Modal(app(分组, 选中, 表情));

	modal.reject$.observe(modal.hideModal);

	return modal.accept$
		.tap(modal.hideModal)
	;
});

module.exports = main;
