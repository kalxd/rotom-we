const R = require("ramda");
const Most = require("most");
const isolate = require("@cycle/isolate").default;

const render = require("./render");

const GroupSelect = require("XGWidget/groupselect");

const main = source => {
	const state$ = source.state.stream;
	const group$ = state$
		.map(state => state.group)
		.map(R.compose(
			R.prepend(["全部", null]),
			R.map(R.converge(R.pair, [R.prop("name"), R.identity]))
		))
	;

	const select$ = state$
		.map(state => state.curGroup)
	;

	const groupSelect = isolate(GroupSelect)(source, group$, select$);

	return {
		DOM: groupSelect.DOM.map(render),
		change$: groupSelect.change$
	};
};

module.exports = main;
