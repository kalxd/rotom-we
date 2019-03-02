const Most = require("most");
const R = require("ramda");
const isolate = require("@cycle/isolate").default;

const OptionS = require("./state/option");
const PageS = require("./state/page");

const Store = require("./lib/store");

const { render } = require("./widget/render");
const PlaceholderV = require("./widget/placeholder");

const OptionApp = require("./option/app");

const intent = _ => {
	const readOption$ = Most.fromPromise(Store.getOption())
		.map(R.defaultTo({}))
		.multicast()
	;

	return {
		readOption$
	};
};

const model = action => {
	const readFinish$ = action.readOption$
		.constant(R.set(PageS, false))
	;

	return {
		readFinish$
	};
};

const main = source => {
	const state$ = source.state.stream;

	const action = intent(source);
	const state = model(action);

	const optionApp = isolate(OptionApp)(source, action.readOption$);

	const loadingView = Most.of(PlaceholderV.loadingView);
	const appView = optionApp.DOM;

	optionApp.submit$.observe(Store.saveOption);

	return {
		DOM: loadingView.merge(appView),
		state: optionApp.state
	};
};

render(main);
