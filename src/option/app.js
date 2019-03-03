const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");

const OptionS = require("../state/option");

const { fmap } = require("../lib/ext");

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

const renderError = msg => dom.div(".ui.error.message", [
	dom.div(".header", "提交信息不完整"),
	dom.p(msg)
]);

const render = state => dom.div(".ui.segment", [
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
]);

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

	// errorState$ :: Stream Maybe String
	const errorState$ = submit$
		.map(s => {
			if (R.isNil(s.addr) || R.isEmpty(s.addr)) {
				return R.always("服务地址不能为空。");
			}
			if (R.isNil(s.token) || R.isEmpty(s.token)) {
				return R.always("邀请码不能为空");
			}
			else {
				return R.always(null);
			}
		})
		.merge(action.addrChange$.constant(R.always(null)))
		.merge(action.tokenChange$.constant(R.always(null)))
		.scan(R.applyTo, null)
	;

	const view = state$.map(render)
		.combine(
			(mainView, errorView) => dom.div(".ui.segment", [
				errorView,
				mainView
			]),
			errorState$.map(fmap(renderError))
		)
	;

	return {
		DOM: view,
		state: update$,
		submit$
	};
};

module.exports = main;
