const R = require("ramda");
const S = require("sanctuary");
const Most = require("most");
const dom = require("@cycle/dom");
const isolate = require("@cycle/isolate").default;

const Store = require("./lib/store");
const { guardMaybe } = require("./lib/ext");

const { render, alertError } = require("XGWidget/render");
const PlaceholderV = require("XGWidget/placeholder");

const App = require("./sidebar/index");

const main = source => {
	const option$ = Most.fromPromise(Store.getOption())
		.flatMap(guardMaybe("信息不完整"))
	;

	const sidebarApp = isolate(App)(source, option$);

	const view = Most.of(PlaceholderV.loadingView)
		.merge(sidebarApp.DOM)
		.recoverWith(alertError)
	;

	return {
		DOM: view,
		state: sidebarApp.state
	};
};

render(main);
