const R = require("ramda");

const connect = require("./connect");
const render = require("./render");
const ST = require("./state");

// prop:
// select :: Maybe a
// itemVec :: [(String, a)]
// class :: String
const main = (source, prop) => {
	const { visible$, change$ } = connect(source, prop);

	const state$ = visible$
		.combine(
			(visible, select) => ({
				visible,
				itemVec: prop.itemVec,
				class: prop.class,
				select
			}),
			change$.startWith(prop.select)
		);
	;

	return {
		DOM: state$.map(render),
		change$
	};
};

module.exports = main;
