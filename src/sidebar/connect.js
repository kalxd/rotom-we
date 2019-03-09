const R = require("ramda");
const Fetch = require("XGLib/fetch");

const EmojiForm = require("./emoji/form");
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

	const createEmoji$ = send$("/emoji/create");
	const updateEmoji$ = send$("/emoji/update");

	return {
		showGroup$,
		showEmoji$,
		createEmoji$,
		updateEmoji$
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

const update = (source, action, fetchAction) => {
	const state$ = source.state.stream;

	const createEmoji$ = state$
		.map(state => {
			const select = R.view(ST.curGroupLens)(state);
			const group = R.pipe(
				R.view(ST.groupLens),
				R.map(item => ([item.name, item]))
			)(state);

			return [group, select];
		})
		.sampleWith(action.createEmojiClick$)
		.map(([itemVec, select]) => ({
			itemVec,
			select,
			class: ".fluid.selection"
		}))
		.chain(EmojiForm)
		.chain(fetchAction.createEmoji$)
		.map(a => R.over(ST.groupLens, R.append(a)))
	;

	const update$ = createEmoji$;

	return update$;
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

	const update$ = update(source, action, fetchAction);

	return {
		init$,
		group$: fetchAction.showGroup$,
		emoji$: fetchAction.showEmoji$,
		update$
	};
};

module.exports = connect;
