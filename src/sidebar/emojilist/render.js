const dom = require("@cycle/dom");

const renderCard = emoji => dom.div(".ui.raised.card", [
	dom.div(".image", [
		dom.img({ attrs: { src: emoji.link } })
	]),

	dom.div(".content", emoji.name),

	dom.div(".extra.content", [
		dom.div(".left.floated", [
			dom.div(".ui.basic.mini.buttons", [
				dom.button(".ui.button", "编辑"),
				dom.button(".ui.button", "删除")
			])
		]),

		dom.div(".right.floated", [
			dom.button(".ui.mini.button", "复制")
		])
	])
]);

const render = emojiVec => {
	return dom.div(".ui.two.cards", emojiVec.map(renderCard));
};

module.exports = render;
