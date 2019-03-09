const R = require("ramda");
const Fetch = require("XGLib/fetch");

const ST = require("./state");

const intentFetch = (source, input$) => {
	const state$ = source.state.stream;
	const { send$, send_$ } = Fetch(input$);

	const showGroup$ = send_$("/group/show");

	const showEmoji$ = state$
		.map(R.view(ST.curGroupLens))
		.map(item => {
			if (R.isNil(item)) {
				return "/emoji/show";
			}
			else {
				return `/emoji/show/${item.id}`;
			}
		})
		.concatMap(send_$)
	;

	return {
		showGroup$,
		showEmoji$
	};
};

const connect = (source, input$) => {
	const fetchAction = intentFetch(source, input$);

	const init$ = fetchAction.showGroup$
		.map(group => ({
			group,
			curGroup: null
		}))
		.map(R.always)
	;


	return {
		init$,
		group$: fetchAction.showGroup$,
		emoji$: fetchAction.showEmoji$
	};
};

module.exports = connect;
