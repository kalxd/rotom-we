const R = require("ramda");

const State = require("./state");
const render = require("./render");

const intent = source => {
	const 选择$ = source.DOM$.select(".__item__")
		.events("click")
		.map(e => e.target.dataset.index)
		.map(Number)
		.skipRepeats()
	;

	return {
		选择$
	};
};

// main :: Source -> Stream State -> Application
const main = R.curry((source, input$) => {
	const Action = intent(source);

	const 外部点击$ = source.DOM$.select(":root")
		.events("click")
	;

	const 内部点击$ = source.DOM$.select(".__self__")
		.events("click")
	;

	const state$ = input$.map(R.always)
		.merge(外部点击$.constant(
			R.set(State.显示lens, false)
		))
		.merge(内部点击$.constant(
			R.over(State.显示lens, R.not)
		))
		.scan((acc, f) => f(acc), null)
		.skip(1)
	;

	const DOM$ = state$.map(render);

	return {
		DOM$,
		选择$: Action.选择$
	};
});

module.exports = main;
