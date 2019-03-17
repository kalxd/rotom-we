const R = require("ramda");
const Most = require("most");
const S = require("sanctuary");
const dom = require("@cycle/dom");

const OptionS = require("XGState/option");
const PageS = require("XGState/page");

const V = require("XGLib/validate");
const Store = require("XGLib/store");

const Alert = require("XGWidget/alert");

const connect = require("./connect");
const render = require("./render");

// mkinit :: Option -> State
const mkinit = option => ({
	form: option,
	validate: {
		addr: V.notEmpty("地址"),
		token: V.notEmpty("验证码")
	},
	error: S.Nothing
});

// main :: Source -> Stream Option -> Sink
const main = (source, input$) => {
	const state$ = source.state.stream;
	const init$ = input$.map(mkinit).map(R.always);

	const { submit$, update$ } = connect(source);

	submit$
		.map(Store.saveOption)
		.awaitPromises()
		.chain(_ => Alert.show_("保存成功"))
		.observe(R.identity)
	;

	return {
		DOM: state$.map(render),
		state: init$.merge(update$)
	};
};

module.exports = main;
