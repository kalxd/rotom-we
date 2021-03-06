const R = require("ramda");
const Most = require("most");

const connect = require("./connect");
const render = require("./render");
const ST = require("./state");

const main = (source, itemVec$, selectItem$) => {
	const {
		visible$,
		change$,
		new$,
		editClick$
	} = connect(source);

	const input$ = itemVec$.combine(
		(itemVec, select) => R.compose(
			R.set(ST.itemVecLens, itemVec),
			R.set(ST.selectLens, select)
		),
		selectItem$
	);

	const state$ = Most.combineArray(
		(itemVec, select, visible) => ({
			itemVec,
			select,
			visible
		}),
		[itemVec$, selectItem$, visible$]
	);

	const itemChange$ = change$
		.combine(R.nth, itemVec$)
		.map(R.last)
		.sampleWith(change$)
	;

	const edit$ = selectItem$
		.sampleWith(editClick$)
	;

	return {
		DOM: state$.map(render),
		change$: itemChange$,
		new$,
		edit$
	};
};

module.exports = main;
