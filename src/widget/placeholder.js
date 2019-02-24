const R = require("ramda");
const dom = require("@cycle/dom");

// repeatLine :: Int -> [View]
const repeatLine = R.repeat(dom.div(".line"));

// loadingView :: View
const loadingView = dom.div(".ui.placeholder", [
	dom.div(".image.header", repeatLine(2)),
	dom.div(".paragraph", repeatLine(5))
]);

exports.loadingView = loadingView;
