const dom = require("@cycle/dom");

// render :: () -> View
const render = () => dom.div([
	dom.header(".panel-section.panel-section-header", [
		dom.div(".text-section-header", "小秘密")
	]),

	dom.div(".notification.is-danger", [
		dom.button(".delete"),
		"出错啦！"
	]),

	dom.div([
		dom.div(".field", [
			dom.label(".label", "服务器地址"),
			dom.div(".control", [
				dom.input(".input")
			])
		]),

		dom.div(".field", [
			dom.label(".label", "神秘代码"),
			dom.div(".control", [
				dom.input(".input")
			])
		]),

		dom.div(".field", [
			dom.div(".control", [
				dom.button(".button.is-info", "保存")
			])
		])
	]),
]);

module.exports = render;
