const Most = require("most");
const R = require("ramda");
const dom = require("@cycle/dom");

const { runAtApp } = require("XGWidget/run");
const AppState = require("XGState/app");
const LoadState = require("XGState/load");

const SidebarW = require("./sidebar/index");
const LoadV = require("./sidebar/view/load");
const State = require("./sidebar/state");

// renderError :: Error -> View
const renderError = ({ message }) => dom.div(".ui.negative.message", [
	dom.i(".close.icon"),
	dom.div(".header", message),
	dom.div([
		dom.button(".ui.mini.red.button.__go-option__", "马上去登记！")
	])
]);

// main :: Source -> Application
const main = source => {
	// 打开选项页。
	source.DOM$.select(".__go-option__").events("click")
		.observe(_ => browser.runtime.openOptionsPage())
	;

	// appState$ :: Stream AppState
	const appState$ = AppState.读取选项()
		.concatMap(state => {
			if (R.isNil(state)) {
				const e = new Error("信息不完整！");
				return Most.throwError(e);
			}
			else {
				return Most.of(state);
			}
		})
	;

	const sidebarApp = SidebarW(source, appState$);

	const DOM$ = sidebarApp.DOM$
		.map(LoadState.pure)
		.startWith(LoadState.empty)
		.map(LoadV.render)
		.recoverWith(R.compose(
			Most.of,
			renderError
		))
	;

	return {
		DOM$,
		state: sidebarApp.state
	};
};

runAtApp(main);
