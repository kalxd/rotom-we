const R = require("ramda");
const Eff = require("XGLib/effect");

// clickWith :: Stream [a] -> Stream b -> Stream (Maybe a)
const clickWith = R.curry((state$, sample$) => {
	return sample$
		.combine(R.nth, state$)
		.sampleWith(sample$)
	;
});

// closeCard :: Element -> IO Element
const closeCard = el => el.closest(".ui.card");

// attachWith :: Source -> String -> Stream Element
const attachWith = R.curry((source, selector) => {
	return source.DOM.select(selector)
		.events("click")
		.map(e => e.target)
		.map(closeCard)
	;
});

const intent = source => {
	const copyClick$ = attachWith(source, "._xg_copy_");
	const editClick$ = attachWith(source, "._xg_edit_");
	const deleteClick$ = attachWith(source, "._xg_delete_");

	return {
		copyClick$,
		editClick$,
		deleteClick$
	};
};

const connect = (source, emoji$, change$) => {
	const action = intent(source, change$);

	const copy$ = action.copyClick$
		.map(Eff.nodeIndex)
		.thru(clickWith(emoji$))
	;

	const edit$ = action.editClick$
		.map(Eff.nodeIndex)
		.thru(clickWith(emoji$))
	;

	const delete$ = action.deleteClick$
		.map(Eff.nodeIndex)
		.thru(clickWith(emoji$))
	;

	return {
		copy$,
		edit$,
		delete$
	};
};

module.exports = connect;
