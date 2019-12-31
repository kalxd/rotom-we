const R = require("ramda");
const Most = require("most");

const AppState = require("XGState");
const State = require("./state");
const render = require("./render");

const MessageW = require("XGWidget/message");

const intent = source => {
	const addr更新$ = source.DOM$.select(".__addr__")
		.events("change")
		.map(e => e.target.value.trim())
		.map(R.set(State.addrLens))
	;

	const token更新$ = source.DOM$.select(".__token__")
		.events("change")
		.map(e => e.target.value.trim())
		.map(R.set(State.tokenLens))
	;

	const 保存$ = source.DOM$.select(".__save__")
		.events("click")
	;

	return {
		addr更新$,
		token更新$,
		保存$
	};
};

// main :: Source -> Application
const main = source => {
	const Action = intent(source);

	const 初始状态$ = Most.fromPromise(AppState.读取选项())
		.map(State.生于AppState)
		.map(s => R.always(s))
	;

	const 更新$ = 初始状态$
		.merge(Action.addr更新$)
		.merge(Action.token更新$)
		.scan((acc, f) => f(acc), State.默认状态)
		.skip(1)
	;

	更新$.sampleWith(Action.保存$)
		.tap(console.info)
		.drain()
	;

	return {
		DOM$: 更新$.map(render)
	};
};

module.exports = main;
