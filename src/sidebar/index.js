const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");

const Nav = require("./nav");
const EmojiList = require("./emojilist");

const connect = require("./connect");
const ST = require("./state");

const main = (source, input$) => {
	const state$ = source.state.stream;
	const action = connect(source, input$);

	const group$ = action.group$
		.multicast()
	;

	const nav = Nav(source);
	const emojiList = EmojiList(
		source,
		action.emoji$,
		action.curGroup$
	);

	const mainView = Most.combine(
		(navView, emojiListView) => dom.div([
			navView,
			emojiListView
		]),
		nav.DOM,
		emojiList.DOM
	);

	const updateEmoji$ = emojiList.edit$
		.chain(action.updateEmoji$)
	;

	const update$ = nav.change$
		.map(R.set(ST.curGroupLens))
		.merge(nav.change$.constant(R.set(ST.emojiVecLens, null)))
		.merge(updateEmoji$)
	;

	return {
		DOM: mainView,
		state: action.init$
			.merge(action.update$)
			.merge(update$)
	};
};

module.exports = main;
