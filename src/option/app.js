const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");

const OptionS = require("../state/option");

const intent = (source, option$) => {
	const addrChange$ = source.DOM.select(".addr-input")
		.events("change")
		.map(e => e.target.value.trim())
		.merge(option$.map(R.view(OptionS.addrLens)))
	;

	const tokenChange$ = source.DOM.select(".token-input")
		.events("change")
		.map(e => e.target.value.trim())
		.merge(option$.map(R.view(OptionS.tokenLens)))
	;

	const primaryClick$ = source.DOM.select(".primary.button")
		.events("click")
	;

	return {
		addrChange$,
		tokenChange$,
		primaryClick$
	};
};

const view = state => dom.div(".ui.segment", [
	dom.div(".ui.form", [
		dom.div(".field.required", [
			dom.label("地址"),
			dom.input(".addr-input", {
				attrs: {
					placeholder: "毕竟云表情",
					value: state.addr
				}
			})
		]),

		dom.div(".field.required", [
			dom.label("验证码"),
			dom.input(".token-input", {
				attrs: {
					placeholder: "路边帅哥送你的一串神秘代码",
					value: state.token
				}
			})
		]),
		dom.button(".ui.primary.button", "保存")
	])
])

// main :: Source -> Stream Option -> Sink
const main = (source, option$) => {
	const state$ = source.state.stream;
	const action = intent(source, option$);

	const update$ = action.addrChange$.map(R.set(OptionS.addrLens))
		.merge(action.tokenChange$.map(R.set(OptionS.tokenLens)))
	;

	const submit$ = state$
		.sampleWith(action.primaryClick$)
	;

	return {
		DOM: state$.map(view),
		state: update$,
		submit$
	};
};

module.exports = main;
