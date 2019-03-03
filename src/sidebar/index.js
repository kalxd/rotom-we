const R = require("ramda");
const Most = require("most");
const Fetch = require("XGLib/fetch");

const ST = require("./state");

const Nav = require("./nav");

const main = (source, input$) => {
	const { send_$ } = Fetch(input$)

	const group$ = send_$("/show/all/group")
		.multicast()
	;

	const init$ = group$
		.map(group => ({
			group,
			curGroup: null
		}))
		.map(R.always)
	;

	const nav = Nav(source);

	return {
		DOM: nav.DOM,
		state: init$.merge(nav.state)
	};
};

module.exports = main;
