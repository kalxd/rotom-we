const R = require("ramda");
const dom = require("@cycle/dom");

const State = require("./state");

// render :: OptionState -> Maybe View -> View
const render = R.curry((state, messageDOM) => {
	const addr = R.view(State.addrLens, state);
	const token = R.view(State.tokenLens, state);

	return dom.div([
		dom.header(".panel-section.panel-section-header", [
			dom.div(".text-section-header", "小秘密")
		]),

		messageDOM,

		dom.div([
			dom.div(".field", [
				dom.label(".label", "服务器地址"),
				dom.div(".control", [
					dom.input(
						".input.__addr__",
						{
							props: {
								placeholder: "填写可信服务器地址。",
								value: addr
							}
						}
					)
				])
			]),

			dom.div(".field", [
				dom.label(".label", "神秘代码"),
				dom.div(".control", [
					dom.input(
						".input.__token__",
						{
							props: {
								placeholder: "填写可信人给予的字母代码。",
								value: token
							}
						}
					)
				])
			]),

			dom.div(".field", [
				dom.div(".control", [
					dom.button(".button.is-info.__save__", "保存")
				])
			])
		]),
	]);
});

module.exports = render;
