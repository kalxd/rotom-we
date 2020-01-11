const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");

const LoadW = require("../widget/load");

const State = require("./state");
const render = require("./render");

const Self = require("./emoji");

// main :: Source -> Stream (FetchReader, Maybe Group) -> Application
const main = R.curry((source, group$) => {
	const input$ = group$.multicast();

	// state$ :: Stream State
	const state$ = input$
		.filter(R.nth(1))
		.map(R.apply(State.生成))
	;
	const selfApp = Self(source, state$);

	// 未选择$ :: Stream View
	const 未选择$ = input$
		.filter(R.compose(
			R.isNil,
			R.nth(1)
		))
		.constant(null)
	;

	const DOM$ = selfApp.DOM$
		.merge(未选择$)
	;

	return {
		DOM$
	};
});

module.exports = main;
