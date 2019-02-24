const R = require("ramda");
const { run } = require("@cycle/most-run");
const { withState } = require("@cycle/state");
const dom = require("@cycle/dom");

const runAt = R.curry((where, app) => {
	const driver = {
		DOM: dom.makeDOMDriver(where)
	};

	const main = withState(app);
	return run(main, driver);
});

const render = runAt("#app");

exports.runAt = runAt;
exports.render = render;
