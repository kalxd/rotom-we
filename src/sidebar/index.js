const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");

const Fetch = require("XGLib/fetch");
const PlaceholderV = require("XGWidget/placeholder");

const Nav = require("./nav");
const EmojiList = require("./emojilist");

const ST = require("./state");

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

	const curGroup$ = state$
		.map(R.view(ST.curGroupLens))
	;

	const fetchEmoji$ = curGroup$
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

	const nav = Nav(source);
	const emojiList = EmojiList(source, fetchEmoji$, curGroup$);

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

	const view = group$
		.concatMap(_ => nav.DOM.combine(
			(navView, emojiListView) => dom.div("abc", [navView, emojiListView]),
			emojiList.DOM
		))
	;

	return {
		DOM: mainView,
		state: init$.merge(nav.state)
	};
};

module.exports = main;
