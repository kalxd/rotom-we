const R = require("ramda");
const { setup } = require("@cycle/most-run");
const dom = require("@cycle/dom");
const { withState } = require("@cycle/state");
const isolate = require("@cycle/isolate").default;

const Eff = require("XGLib/effect");

const mkDriver = node => ({
	DOM: dom.makeDOMDriver(node)
});

const app = main => {
	const mask = Eff.showMaskWhen();

	const driver = mkDriver(mask);
	const { run, sinks } = setup(withState(isolate(main)), driver);
	const dispose = run();

	// hideModal :: () -> IO ()
	const hideModal = R.compose(
		Eff.hideMaskWhen,
		dispose
	);

	return {
		...sinks,
		hideModal
	};
};

module.exports = app;
