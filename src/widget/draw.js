const R = require("ramda");
const dom = require("@cycle/dom");

const { fmap } = require("XGLib/ext");

const dialogStyle = {
	transition: "opacity .3s, transform .3s",
	opacity: 0,
	transform: "translateX(+20px) rotateY(-60deg)",
	delayed: {
		opacity: 1,
		transform: "translateX(0) rotateY(0)"
	}
};

// renderError :: String -> View
const renderError = msg => dom.div(".ui.red.message", msg);

// drawError :: Maybe String -> View
const drawError = fmap(s => (
	dom.div(".ui.red.message", s)
));

// drawModal :: View -> View
const drawModal = view => (
	dom.div(".ui.modal.transition.visible", { style: dialogStyle }, view)
);

// drawDialog :: Maybe title -> View -> View
const drawDialog = R.curry((title, view) => (
	drawModal([
		fmap(title => dom.div(".header", title))(title),
		dom.div(".content", view),
		dom.div(".actions", [
			dom.button(".ui.reject.button", "不好"),
			dom.button(".ui.accept.primary.button", "好")
		])
	])
));

module.exports = {
	drawError,
	drawModal,
	drawDialog
};
