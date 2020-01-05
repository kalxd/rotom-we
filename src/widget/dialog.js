const R = require("ramda");
const dom = require("@cycle/dom");

const Eff = require("XGLib/effect");
const { fmap } = require("XGLib/ext");

const Modal = require("./modal");

const modalStyle = {
	transition: "opacity .3s, transform .3s",
	opacity: 0,
	transform: "translateX(+20px) rotateY(-60deg)",
	delayed: {
		opacity: 1,
		transform: "translateX(0) rotateY(0)"
	}
};

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

// render :: String -> View -> View
const render = R.curry((title, appView) => (
	dom.div(".ui.modal.transition.visible", { style: modalStyle }, [
		fmap(title => dom.div(".header", title))(title),
		dom.div(".content", appView),
		dom.div(".actions", [
			dom.button(".ui.reject.button", "不好"),
			dom.button(".ui.accept.primary.button", "好")
		])
	])
));

// main :: (Source -> Application) -> String -> Application
const main = R.curry((App, title) => {
	const modal = Modal(source => {
		const appSink = App(source);
		const { reject$, accept$ } = intent(source);

		const sink = {
			appSink,
			DOM$: appSink.DOM$.map(render(title)),
			reject$: reject$.take(1),
			accept$: accept$.take(1)
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
});

module.exports = main;
