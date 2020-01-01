const R = require("ramda");
const dom = require("@cycle/dom");
const { withState } = require("@cycle/state");
const { run } = require("@cycle/most-run");

// mkdriver :: Element -> Driver
const mkdriver = node => ({
	DOM$: dom.makeDOMDriver(node)
});

// runAt :: String -> Application -> IO ()
const runAt = R.curry((where, application) => {
	const driver = mkdriver(where);
	const main = withState(application);
	return run(main, driver);
});

// runAtApp :: Application -> IO ()
const runAtApp = runAt("#app");

module.exports = {
	runAt,
	runAtApp
};
