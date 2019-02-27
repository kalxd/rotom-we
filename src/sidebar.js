const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");
const isolate = require("@cycle/isolate").default;

const { render } = require("./lib/ui");
const Store = require("./lib/store");
const { throwWith } = require("./lib/ext");
const Fetch = require("./lib/fetch");

const ToolS = require("./state/tool");
const PageS = require("./state/page");

const PlaceholderV = require("./widget/placeholder");
const ErrorV = require("./widget/error");

const App = require("./sidebar/app");

// isExist :: a -> Bool
const isExist = R.complement(R.isNil);

// validateOption :: Maybe Object -> Bool
const validateOption = R.where({
	addr: isExist,
	token: isExist
});

const intent = _ => {
	const readOption$ = Most.fromPromise(Store.getOption())
		.chain(option => {
			if (isExist(option) && R.where(option)) {
				return Most.of(option);
			}
			else {
				return throwWith("信息不完整");
			}
		})
		.tap(Fetch.setup)
		.multicast()
	;

	return {
		readOption$
	};
};

const main = source => {
	const init$ = ToolS.init({ loading: true });

	const action = intent(source);

	const sidebarApp = isolate(App, "app")(source, action.readOption$);

	const view = init$.constant(PlaceholderV.loadingView)
		.merge(sidebarApp.DOM)
		.recoverWith(ErrorV.errorMsg)
	;

	return {
		DOM: view,
		state: sidebarApp.state
	};
};

render(main);
