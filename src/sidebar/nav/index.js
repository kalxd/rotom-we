const R = require("ramda");
const Most = require("most");
const isolate = require("@cycle/isolate").default;

const render = require("./render");
const ST = require("../state");

const GroupSelect = require("XGWidget/groupselect");

const main = source => {
	const state$ = source.state.stream;
	const group$ = state$
		.map(R.view(ST.groupLens))
		.map(R.compose(
			R.prepend(["全部", null]),
			R.map(R.converge(R.pair, [R.prop("name"), R.identity]))
		))
	;

	const select$ = state$
		.map(R.view(ST.curGroupLens))
	;

	const groupSelect = isolate(GroupSelect)(source, group$, select$);

	const update$ = groupSelect.change$
		.map(R.compose(
			R.set(ST.curGroupLens),
			R.prop("id")
		))
	;

	return {
		DOM: groupSelect.DOM.map(render),
		state: update$
	};
};

module.exports = main;
