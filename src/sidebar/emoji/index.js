const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");

const LoadW = require("../widget/load");

const State = require("./state");
const SidebarState = require("../state");
const render = require("./render");

const Self = require("./emoji");

// main :: Source -> Stream SidebarState -> Application
const main = R.curry((source, sidebarState$) => {
	const input$ = sidebarState$.multicast();

	// state$ :: Stream State
	const state$ = input$
		.filter(R.compose(
			R.not,
			R.isNil,
			R.view(SidebarState.位置lens)
		))
		.map(state => ([
			R.view(SidebarState.fetchlens, state),
			SidebarState.选中分组(state)
		]))
		.map(R.apply(State.生成))
	;
	const selfApp = Self(source, state$);

	// 未选择$ :: Stream View
	const 未选择$ = input$
		.map(R.view(SidebarState.位置lens))
		.filter(R.isNil)
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
