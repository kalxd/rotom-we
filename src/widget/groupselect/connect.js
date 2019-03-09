const R = require("ramda");
const Eff = require("XGLib/effect");
const ST = require("./state");

const intent = source => {
	const selfClick$ = source.DOM.select(".ui.dropdown.item")
		.events("click")
	;

	const itemClick$ = source.DOM.select("._xg_item_")
		.events("click")
		.debounce(200)
	;

	const newClick$ = source.DOM.select("._xg_new_")
		.events("click")
	;

	const editClick$ = source.DOM.select("._xg_edit_")
		.events("click")
	;

	return {
		selfClick$,
		itemClick$,

		newClick$,
		editClick$
	};
};

const connect = source => {
	const action = intent(source);

	const visible$ = action.selfClick$.constant(R.not)
		.scan(R.applyTo, false)
		.skipRepeats()
	;

	const change$ = action.itemClick$
		.map(e => e.originalTarget)
		.map(el => {
			let i = 0;
			for (const node of el.parentNode.querySelectorAll("._xg_item_")) {
				if (el === node) {
					return i;
				}
				++i;
			}

			return i;
		})
		.skipRepeats()
	;

	return {
		visible$,
		change$,
		new$: action.newClick$,
		editClick$: action.editClick$
	};
};

module.exports = connect;
