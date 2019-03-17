const dom = require("@cycle/dom");
const { drawError } = require("XGWidget/draw");

const render = ({ form, error }) => dom.div(".ui.form", [
	dom.div(".field.required", [
		dom.label("地址"),
		dom.input(".addr-input", {
			attrs: {
				placeholder: "毕竟云表情"
			},
			props: {
				value: form.addr
			}
		})
	]),

	dom.div(".field.required", [
		dom.label("验证码"),
		dom.input(".token-input", {
			attrs: {
				placeholder: "路边帅哥送你的一串神秘代码"
			},
			props: {
				value: form.token
			}
		})
	]),

	dom.button(".ui.primary.button", "保存"),

	drawError(error),
]);

module.exports = render;
