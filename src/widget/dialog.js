const R = require("ramda");
const dom = require("@cycle/dom");

const Eff = require("XGLib/effect");
const { fmap } = require("XGLib/ext");

const Modal = require("./modal");

const intent = source => {
	const accept$ = source.DOM.select(".accept")
		.events("click")
	;

	const reject$ = source.DOM.select(".reject")
		.events("click")
	;

	return {
		accept$,
		reject$
	};
};

const render = R.curry((title, appView) => dom.div(".ui.modal.transition.visible", [
	fmap(title => dom.div(".header", title))(title),
	dom.div(".content", appView),
	dom.div(".actions", [
		dom.button(".ui.reject.button", "不好"),
		dom.button(".ui.accept.primary.button", "好")
	])
]));

const main = (App, title) => {
	const modal = Modal(source => {
		const appSink = App(source);
		const { reject$, accept$ } = intent(source);

		const sink = {
			appSink,
			DOM: appSink.DOM.map(render(title)),
			reject$,
			accept$
		};

		return R.unless(
			_ => R.isNil(appSink.state),
			R.assoc("state", appSink.state)
		)(sink);
	});

	// hideDialog :: () -> IO ()
	const hideDialog = R.compose(
		Eff.hideMaskWhen,
		modal.dispose
	);

	modal.sinks.reject$
		.observe(hideDialog)
	;

	return {
		...modal.sinks,
		hideDialog
	};
};

module.exports = main;
