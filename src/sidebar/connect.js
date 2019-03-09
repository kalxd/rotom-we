const R = require("ramda");
const Fetch = require("XGLib/fetch");

const EmojiForm = require("./form/emoji");
const Alert = require("XGWidget/alert");

const ST = require("./state");

const intentFetch = (source, input$) => {
	const state$ = source.state.stream;
	const { send$, send_$ } = Fetch(input$);

	const groupChange$ = state$
		.map(R.view(ST.curGroupLens))
		.skipRepeats()
	;

	const showGroup$ = send_$("/group/show");

	const showEmoji$ = groupChange$
		.map(item => {
			if (R.isNil(item)) {
				return "/emoji/show";
			}
			else {
				return `/emoji/show/${item.id}`;
			}
		})
		.concatMap(send_$)
		.multicast()
	;

	const createEmoji$ = send$("/emoji/create");
	const updateEmoji$ = send$("/emoji/update");

	return {
		groupChange$,

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
		.map(a => R.over(ST.emojiVecLens, R.append(a)))
	;

	const update$ = fetchAction.showEmoji$
		.map(R.set(ST.emojiVecLens))
		.merge(createEmoji$)
	;

	return update$;
};

const connect = (source, input$) => {
	const state$ = source.state.stream;
	const fetchAction = intentFetch(source, input$);
	const action = intent(source);

	const curGroup$ = state$
		.map(R.view(ST.curGroupLens))
	;

	const init$ = fetchAction.showGroup$
		.map(group => ({
			group,
			curGroup: null,
			emojiVec: null 
		}))
		.map(R.always)
	;

	const update$ = update(source, action, fetchAction);

	const emoji$ = state$
		.map(R.view(ST.emojiVecLens))
		.filter(R.complement(R.isNil))
	;

	const updateEmoji$ = emoji => {
		return state$
			.map(R.view(ST.groupLens))
			.chain(groupVec => {
				const index = R.findIndex(
					group => group.group_id === emoji.id,
					groupVec
				);
				const lens = R.lensIndex(index);
				const itemVec = R.map(group => ([group.name, group]))(groupVec);

				const prop = {
					name: emoji.name,
					link: emoji.link,
					itemVec,
					select: R.view(lens, groupVec),
					class: ".fluid.selection"
				};

				console.info(prop);

				return EmojiForm(prop)
					.chain(fetchAction.updateEmoji$)
					.map(R.set(lens))
				;
			})
		;
	};

	return {
		init$,
		curGroup$,
		group$: fetchAction.showGroup$,
		emoji$,
		updateEmoji$,
		update$
	};
};

module.exports = connect;
