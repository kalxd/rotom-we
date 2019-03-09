const R = require("ramda");
const Fetch = require("XGLib/fetch");

const EmojiNewForm = require("./emoji/newform");
const Alert = require("XGWidget/alert");

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

const intent = source => {
	const createEmojiClick$ = source.DOM.select("._xg_create_emoji_")
		.events("click")
	;

	return {
		createEmojiClick$
	};
};

const connect = (source, input$) => {
	const fetchAction = intentFetch(source, input$);
	const action = intent(source);

	const init$ = fetchAction.showGroup$
		.map(group => ({
			group,
			curGroup: null
		}))
		.map(R.always)
	;

	action.createEmojiClick$
		.chain(EmojiNewForm)
		.observe(console.log)
	;

	return {
		init$,
		group$: fetchAction.showGroup$,
		emoji$: fetchAction.showEmoji$
	};
};

module.exports = connect;
