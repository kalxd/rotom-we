const Most = require("most");
const dom = require("@cycle/dom");
const PlaceholderV = require("XGWidget/placeholder");

const connect = require("./connect");
const render = require("./render");

const main = (source, emoji$, change$) => {
	const view = change$.constant(PlaceholderV.loadingCardView)
		.merge(emoji$.map(render))
	;

	return {
		DOM: view
	};
};

module.exports = main;
