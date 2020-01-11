const R = require("ramda");
const LoadW = require("../widget/load");
const EmojiFormW = require("../widget/emojiform");

const State = require("./state");
const LoadState = require("XGState/load");
const render = require("./render");

const intent = source => {
	const 点击新建$ = source.DOM$.select(".__add__")
		.events("click")
	;
};

// main :: Source -> Stream State -> Application
const main = R.curry((source, state$) => {
	const DOM$ = state$
		.concatMap(state => {
			return State.获取表情列表(state)
				.map(xs => R.set(State.表情列表lens, xs, state))
				.map(LoadState.pure)
				.startWith(LoadState.empty)
				.map(R.always)
			;
		})
		.scan((acc, f) => f(acc), LoadState.empty)
		.map(LoadState.fmap(render))
		.map(LoadW.render)
	;

	return {
		DOM$
	};
});

module.exports = main;
