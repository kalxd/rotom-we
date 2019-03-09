const R = require("ramda");
const Most = require("most");
const Fetch = require("XGLib/fetch");

const ST = require("./state");

const Nav = require("./nav");

const main = (source, input$) => {
	const state$ = source.state.stream;
	const { send_$ } = Fetch(input$)

	const group$ = send_$("/group/show")
		.multicast()
	;

	const init$ = group$
		.map(group => ({
			group,
			curGroup: null
		}))
		.map(R.always)
	;

	const emoji$ = state$
		.map(R.view(ST.curGroupLens))
		.skipRepeats()
		.map(item => {
			if (R.isNil(item)) {
				return "/emoji/show";
			}
			else {
				return `/emoji/show/${item.id}`;
			}
		})
		.concatMap(url => send_$(url))
	;

	const nav = Nav(source);

	emoji$.observe(console.log);

	return {
		DOM: group$.concatMap(_ => nav.DOM),
		state: init$.merge(nav.state)
	};
};

module.exports = main;
