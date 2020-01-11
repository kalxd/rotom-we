const R = require("ramda");
const dom = require("@cycle/dom");
const { drawDialog } = require("XGWidget/draw");
const State = require("./state");

// render :: String -> State -> View -> View
const render = R.curry((标题, state, dropdownView) => {
	const [名字, 链接] = State.常用字段(state);
	return drawDialog(标题, [
		dom.div(".ui.form", [
			dom.div(".ui.field", [
				dom.label("名称"),
				dom.input(".__name__", {
					attrs: {
						placeholder: "表情名称",
						value: 名字
					}
				})
			]),
			dom.div(".ui.field.required", [
				dom.label("链接"),
				dom.input(".__link__", {
					attrs: {
						placeholder: "表情链接地址",
						value: 链接
					}
				})
			]),
			dom.div(".ui.field.required", [
				dom.label("分组"),
				dropdownView
			])
		])
	]);
});

module.exports = render;
