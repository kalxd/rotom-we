const R = require("ramda");
const S = require("sanctuary");
const Fetch = require("XGLib/fetch");

const EmojiForm = require("./form/emoji");
const GroupForm = require("./form/group");
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

	const createGroup$ = send$("/group/create");
	const updateGroup$ = R.curry((id, data) => send$(`/group/${id}/update`, data));

	const createEmoji$ = send$("/emoji/create");
	const updateEmoji$ = R.curry((id, data) => send$(`/emoji/${id}/update`, data));

	return {
		groupChange$,

		showGroup$,
		showEmoji$,

		createGroup$,
		updateGroup$,
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
			return [R.view(ST.groupLens, state), select];
		})
		.sampleWith(action.createEmojiClick$)
		.chain(([groupVec, select]) => EmojiForm(
			".fuild.selection",
			S.Nothing,
			S.Nothing,
			groupVec,
			S.toMaybe(select),
		))
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

	const updateEmoji = emoji => {
		return state$
			.map(state => ([
				R.view(ST.groupLens, state),
				R.view(ST.emojiVecLens, state)
			]))
			.chain(([groupVec, emojiVec]) => {
				const select = R.find(
					group => emoji.group_id === group.id,
					groupVec
				);

				const emojiIndex = R.findIndex(R.propEq("id", emoji))(emojiVec);

				return EmojiForm(
					".fluid.selection",
					S.Just(emoji.name),
					S.Just(emoji.link),
					groupVec,
					S.toMaybe(select)
				)
					.chain(fetchAction.updateEmoji$(emoji.id))
					.map(R.set(R.lensIndex(emojiIndex)))
					.map(R.over(ST.emojiVecLens))
				;
			})
			.take(1)
		;
	};

	const createGroup = () => {
		return GroupForm(S.Nothing)
			.chain(fetchAction.createGroup$)
			.map(a => R.over(ST.groupLens, R.append(a)))
		;
	};

	const updateGroup = ([groupVec, group]) => {
		const index = R.findIndex(R.equals(group), groupVec);
		const lens = R.lensIndex(index);

		const groupLens = R.compose(
			ST.groupLens,
			lens,
		);

		return GroupForm(S.Just(group.name))
			.chain(fetchAction.updateGroup$(group.id))
			.map(a => R.compose(
				R.set(ST.curGroupLens, a),
				R.set(groupLens, a)
			))
		;
	};

	return {
		init$,
		curGroup$,
		group$: fetchAction.showGroup$,
		emoji$,
		update$,

		createGroup,
		updateGroup,
		updateEmoji
	};
};

module.exports = connect;
