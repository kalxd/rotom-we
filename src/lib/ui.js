const { run } = require("@cycle/most-run");
const { withState } = require("@cycle/state");
const dom = require("@cycle/dom");

const driver = {
	DOM: dom.makeDOMDriver("#app")
};

const render = f => {
	const main = withState(f);
	return run(main, driver);
};

exports.render = render;
