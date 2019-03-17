const Most = require("most");
const S = require("sanctuary");
const isolate = require("@cycle/isolate").default;

const OptionS = require("XGState/option");

const Store = require("XGLib/store");

const { render } = require("XGWidget/render");
const PlaceholderV = require("XGWidget/placeholder");

const OptionApp = require("./option/app");

const main = source => {
	const state$ = source.state.stream;
	const option$ = Most.fromPromise(Store.getOption())
		.map(S.fromMaybe({
			addr: "",
			token: ""
		}))
		.multicast()
	;

	const optionApp = isolate(OptionApp)(source, option$);

	const loadingView = Most.of(PlaceholderV.loadingView);
	const appView = optionApp.DOM;

	return {
		DOM: loadingView.merge(appView),
		state: optionApp.state
	};
};

render(main);
