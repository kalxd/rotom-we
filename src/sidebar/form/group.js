const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");

const Dialog = require("XGWidget/dialog");

const intent = (source, prop) => {
	const name$ = source.DOM.select("._xg_name_")
		.events("change")
		.map(e => e.target.value.trim())
		.startWith(prop.name)
	;

	return {
		name$
	};
};

const render = prop => dom.div(".ui.form", [
	dom.div(".ui.field.required", [
		dom.label("分组名称"),
		dom.input("._xg_name_", {
			attrs: {
				value: prop.name
			}
		})
	])
]);

// prop
// name :: Maybe String
const app = R.curry((prop, source) => {
	const action = intent(source, prop);

	return {
		DOM: Most.of(prop).map(render),
		change$: action.name$
	};
});

const main = prop => {
	const dialog = Dialog(app(prop), "编辑分组")

	return dialog.appSink.change$
		.filter(s => s && s.length)
		.sampleWith(dialog.accept$)
		.tap(dialog.hideDialog)
	;
};

module.exports = main;
