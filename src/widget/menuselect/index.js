const R = require("ramda");

const connect = require("./connect");
const render = require("./render");
const ST = require("./state");

// main :: Source -> String -> [(String, a)] -> Maybe Int -> Sink
const main = R.curry((source, klass, itemVec, select) => {
	const { visible$, change$ } = connect(source, itemVec);

	const state$ = visible$
		.combine(
			(visible, select) => ({
				visible,
				itemVec,
				klass,
				select
			}),
			change$.startWith(select)
		);
	;

	return {
		DOM: state$.map(render),
		change$
	};
});

module.exports = main;
