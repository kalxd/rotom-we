const Eff = require("./effect");
const { setup } = require("@cycle/most-run");
const dom = require("@cycle/dom");
const { withState } = require("@cycle/state");
const isolate = require("@cycle/isolate").default;

const mkDriver = node => ({
	DOM: dom.makeDOMDriver(node)
});

const app = main => {
	const mask = Eff.showMaskWhen();

	const driver = mkDriver(mask);
	const { run, sinks } = setup(withState(isolate(main)), driver);
	const dispose = run();

	return {
		dispose,
		sinks
	};
};

module.exports = app;
