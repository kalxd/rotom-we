const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");
const Modal = require("./modal");
const Eff = require("./effect");

// show :: String -> Stream Element
const show = msg => {
	const modal = Modal(source => {
		const state$ = source.state.stream;
		const init$ = Most.of(R.always(0));

		const view = state$.map(n => dom.div(".ui.modal.transition.visible", [
			dom.div(".header", msg),
			dom.div(".content", [
				dom.button(".ui.play.button", n)
			]),
			dom.div(".actions", [
				dom.button(".ui.accept.primary.button", "OK")
			])
		]));

		const accept$ = source.DOM.select(".ui.accept.button")
			.events("click")
		;

		const play$ = source.DOM.select(".play")
			.events("click")
			.constant(R.inc)
		;

		return {
			accept$: state$.sampleWith(accept$),
			DOM: view,
			state: init$.merge(play$)
		};
	});

	return modal.sinks.accept$
		.tap(console.info)
		.tap(modal.dispose)
		.tap(Eff.hideMaskWhen)
	;
};

exports.show = show;
