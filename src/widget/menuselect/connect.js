const R = require("ramda");
const Eff = require("XGLib/effect");
const ST = require("./state");

const intent = source => {
	const selfClick$ = source.DOM.select("._xg_menuselect_")
		.events("click")
	;

	const itemClick$ = source.DOM.select("._xg_item_")
		.events("click")
	;

	return {
		selfClick$,
		itemClick$
	};
};

const connect = (source, prop) => {
	const action = intent(source);

	const visible$ = action.selfClick$
		.constant(R.not)
		.scan(R.applyTo, false)
		.skipRepeats()
	;

	const change$ = action.itemClick$
		.map(e => e.target)
		.map(Eff.nodeIndex)
		.skipRepeats()
		.map(index => prop.itemVec[index])
		.map(R.last)
	;

	return {
		visible$,
		change$
	};
};

module.exports = connect;
