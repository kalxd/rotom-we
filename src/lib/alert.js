const Most = require("most");
const Eff = require("./effect");
const { setup } = require("@cycle/most-run");
const dom = require("@cycle/dom");
const { withState } = require("@cycle/state");

const mkDriver = node => ({
	DOM: dom.makeDOMDriver(node)
});

// show :: String -> Stream Element
const show = msg => {
	const mask = Eff.showMaskWhen();

	const main = source => {
		const accept$ = source.DOM.select(".accept")
			.events("click")
		;

		return {
			accept$,

			DOM: Most.of(dom.div(".ui.modal.active.transition.visible", [
				dom.div(".header", ""),
				dom.div(".content", msg),
				dom.div(".actions", [
					dom.button(".ui.accept.primary.button", "OK")
				])
			]))
		};
	};

	const driver = mkDriver(mask);

	const { run, sinks } = setup(withState(main), driver);
	const dispose = run();

	return sinks.accept$
		.tap(dispose)
		.tap(Eff.hideMaskWhen)
	;
};

exports.show = show;
