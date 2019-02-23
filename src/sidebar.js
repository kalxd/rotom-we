const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");

const { render } = require("./lib/ui");
const App = require("./sidebar/app");
const Store = require("./lib/store");
const Ext = require("./lib/ext");
const Err = require("./widget/error");

// repeatLine :: Int -> [View]
const repeatLine = R.repeat(dom.div(".line"));

const loadingLens = R.lensProp("loading");

// placeholderView :: View
const placeholderView = dom.div(".ui.placeholder", [
	dom.div(".image.header", repeatLine(2)),
	dom.div(".paragraph", repeatLine(5))
]);

const main = source => {
	const state$ = source.state.stream;
	const app = App(source);

	const readOption$ = Most.fromPromise(Store.getOption())
		.tap(option => {
			if (!option || !option.token || !option.host) {
				const e = new Error("少东西了");
				return Most.throwError(e);
			}
		})
		.constant(R.set(loadingLens, false))
	;

	const init$ = Ext.init({ loading: true });

	const loading$ = state$.filter(s => s.loading)
		.constant(placeholderView)
	;

	const finish$ = state$.filter(s => !s.loading)
		.combine((_, b) => b, app.DOM)
		.map(appView => dom.div(".ui.container", appView))
	;

	return {
		DOM: loading$.merge(finish$).recoverWith(Err.errorView),
		state: init$.merge(readOption$).merge(app.state)
	};
};

render(main);
