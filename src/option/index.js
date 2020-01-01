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

// main :: Source -> AppState -> Application
const main = R.curry((source, appState) => {
	const Action = intent(source);

	const 更新$ = Action.addr更新$
		.merge(Action.token更新$)
		.scan((acc, f) => f(acc), State.生于AppState(appState))
	;

	更新$.sampleWith(Action.保存$)
		.tap(console.info)
		.drain()
	;

	return {
		DOM$: 更新$.map(render)
	};
});

module.exports = main;
