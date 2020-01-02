const R = require("ramda");
const dom = require("@cycle/dom");

// repeatCard :: Int -> [View]
const repeatCard = R.repeat(
	dom.div(".ui.card", [
		dom.div(".content", [
			dom.div(".ui.placeholder", [
				dom.div(".square.image")
			])
		])
	])
);

// loadinCardView :: View
const loadingCardView = dom.div(".ui.three.cards", repeatCard(3));

// repeatLine :: Int -> [View]
const repeatLine = R.repeat(dom.div(".line"));

// loadingView :: View
const loadingView = dom.div(".ui.placeholder", [
	dom.div(".image.header", repeatLine(2)),
	dom.div(".paragraph", repeatLine(5))
]);

module.exports = {
	loadingCardView,
	loadingView
};
