const R = require("ramda");
const dom = require("@cycle/dom");
const { fmap } = require("XGLib/ext");
const State = require("./state");

const renderCard = emoji => dom.div(".ui.raised.card", [
	dom.div(".image", [
		dom.img({ attrs: { src: emoji.link } })
	]),

	dom.div(".content", emoji.name),

	dom.div(".extra.content", [
		dom.div(".ui.two.mini.buttons", [
			dom.button(".ui.green.basic._xg_edit_.button", "编辑"),
			dom.button(".ui.red.basic._xg_delete_.button", "删除")
		])
	])
]);

// render :: Maybe State -> View
const render = fmap(state => {
	return dom.div(".ui.head", "hello world");
});

module.exports = render;
