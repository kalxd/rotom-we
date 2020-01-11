const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");

const LoadW = require("../widget/load");

const State = require("./state");
const LoadState = require("XGState/load");
const render = require("./render");

// main :: Source -> Stream (FetchReader, Maybe Group) -> Application
const main = R.curry((source, group$) => {
	// 选择分组$ :: Stream (LoadState (Maybe State) -> LoadState (Maybe State))
	const 选择分组$ = group$
		.concatMap(([fetch, group]) => {
			if (R.isNil(group)) {
				return Most.of(null);
			}
			else {
				const state = State.生成(fetch, group);
				return State.获取表情列表(state, group)
					.map(xs => R.set(State.表情列表lens, xs, state))
					.map(LoadState.pure)
					.startWith(LoadState.empty)
				;
			}
		})
		.tap(console.info)
		.map(R.always)
	;

	const DOM$ = 选择分组$
		.scan((acc, f) => LoadState.fmap(f, acc), LoadState.pure(null))
		.tap(console.info)
		.map(LoadState.fmap(render))
		.map(LoadW.render)
	;

	return {
		DOM$
	};
});

module.exports = main;
