const PlaceholderV = require("XGWidget/placeholder");

const connect = require("./connect");
const render = require("./render");

const main = (source, emoji$, change$) => {
	const action = connect(source, emoji$, change$);

	const view = change$.constant(PlaceholderV.loadingCardView)
		.merge(emoji$.map(render))
	;

	action.copy$.observe(emoji => {
		const { link } = emoji;

		navigator.clipboard.writeText(link);
	});

	return {
		DOM: view
	};
};

module.exports = main;
