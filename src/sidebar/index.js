const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");

const PlaceholderV = require("XGWidget/placeholder");

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

	const emoji$ = action.emoji$
		.multicast()
	;

	const curGroup$ = state$
		.map(R.view(ST.curGroupLens))
	;

	const nav = Nav(source);
	const emojiList = EmojiList(
		source,
		emoji$,
		curGroup$
	);

	const mainView = Most.combine(
		(navView, emojiListView) => {
			return dom.div([
				navView,
				emojiListView
			]);
		},
		nav.DOM,
		emojiList.DOM
	);

	return {
		DOM: mainView,
		state: action.init$
			.merge(action.update$)
			.merge(nav.state)
	};
};

module.exports = main;
