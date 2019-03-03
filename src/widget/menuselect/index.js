const R = require("ramda");

const connect = require("./connect");
const render = require("./render");
const ST = require("./state");

const main = (source, itemVec$, selectItem$) => {
	const { visible$, change$ } = connect(source);

	const input$ = itemVec$.combine(
		(itemVec, select) => R.compose(
			R.set(ST.itemVecLens, itemVec),
			R.set(ST.selectLens, select)
		),
		selectItem$
	);

	const state$ = input$.merge(visible$)
		.scan(R.applyTo, ST.INIT)
		.tap(console.log)
	;

	return {
		DOM: state$.map(render),
		change$
	};
};

module.exports = main;
