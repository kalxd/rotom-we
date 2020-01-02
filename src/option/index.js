const R = require("ramda");
const Most = require("most");

const AppState = require("XGState/app");
const State = require("./state");
const render = require("./render");

const MessageW = require("./widget/message");

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

// main :: Source -> Steam (Maybe AppState) -> Application
const main = R.curry((source, appState$) => {
	const Action = intent(source);
	const state$ = source.state.stream;

	const 错误信息$ = state$
		.map(R.view(State.errLens))
	;

	const messageApp = MessageW(source, 错误信息$);

	const 保存结果$ = state$
		.sampleWith(Action.保存$)
		.map(State.validate)
		.map(R.set(State.errLens))
	;

	const 初始状态$ = appState$
		.take(1)
		.map(State.生于AppState)
		.map(R.always)
	;

	const state = 初始状态$
		.merge(保存结果$)
		.merge(Action.addr更新$)
		.merge(Action.token更新$)
	;

	const DOM$ = state$.combine(
		R.pair,
		messageApp.DOM$.startWith(null)
	)
		.map(R.apply(render))
	;

	// 保存下来
	state$
		.sampleWith(Action.保存$)
		.filter(R.compose(
			R.isNil,
			R.view(State.errLens)
		))
		.map(State.还于AppState)
		.observe(AppState.保存选项)
	;

	return {
		DOM$,
		state
	};
});

module.exports = main;
