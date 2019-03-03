const R = require("ramda");
const Eff = require("../../lib/effect");
const ST = require("./state");

const intent = source => {
	const selfClick$ = source.DOM.select(".ui.pointing.link.menu")
		.events("click")
	;

	const itemClick$ = source.DOM.select(".menu > .item")
		.events("click")
	;

	return {
		selfClick$,
		itemClick$
	};
};

const connect = source => {
	const action = intent(source);

	const visible$ = action.selfClick$.constant(R.over(ST.visibleLens, R.not))
		.merge(Eff.bodyClick$.constant(R.set(ST.visibleLens, false)))
	;

	return {
		visible$,
		change: action.itemClick$
	};
};

module.exports = connect;
