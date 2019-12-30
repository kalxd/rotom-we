const Most = require("most");
const { run } = require("@cycle/most-run");
const dom = require("@cycle/dom");

const OptionW = require("./option/index");

const main = source => {
	const optionApp = OptionW(source);

	return {
		DOM$: optionApp.DOM$
	};
};

const driver = {
	DOM$: dom.makeDOMDriver("#app")
};

run(main, driver);
