const R = require("ramda");
const Eff = require("XGLib/effect");
const ST = require("./state");

const intent = source => {
	const selfClick$ = source.DOM.select(".ui.pointing.link.item")
		.events("click")
	;

	const itemClick$ = source.DOM.select(".menu > .item:not(.pointing)")
		.events("click")
		.debounce(200)
	;

	return {
		selfClick$,
		itemClick$
	};
};

const connect = source => {
	const action = intent(source);

	const visible$ = action.selfClick$.constant(R.over(ST.visibleLens, R.not))
		// .merge(Eff.bodyClick$.constant(R.set(ST.visibleLens, false)))
	;

	const change$ = action.itemClick$
		.map(e => e.originalTarget)
		.map(Eff.nodeIndex)
		.skipRepeats()
	;

	return {
		visible$,
		change$
	};
};

module.exports = connect;
