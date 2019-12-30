const Most = require("most");
const { run } = require("@cycle/most-run");
const dom = require("@cycle/dom");

const main = source => {
	const DOM$ = Most.of(
		dom.div([
			dom.header(".panel-section.panel-section-header", [
				dom.div(".text-section-header", "小秘密")
			]),

			dom.div(".panel-section.panel-section-formElements", [
				dom.div(".panel-formElements-item", [
					dom.label("服务器地址"),
					dom.input()
				]),

				dom.div(".panel-formElements-item", [
					dom.label("神秘代码"),
					dom.input()
				])
			]),

			dom.button("保存")
		])
	);

	return {
		DOM$
	};
};

const driver = {
	DOM$: dom.makeDOMDriver("#app")
};

run(main, driver);
