const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");

const { isNotEmpty } = require("XGLib/ext");

const Dialog = require("XGWidget/dialog");
const Alert = require("XGWidget/alert");
const MenuSelect = require("XGWidget/menuselect");

const mkdata = (name, link, item) => ({
	name,
	link,
	group_id: item.id
});

const intent = source => {
	const nameChange$ = source.DOM.select("._xg_name_input_")
		.events("change")
		.map(e => e.target.value.trim())
		.filter(s => s.length)
	;

	const linkChange$ = source.DOM.select("._xg_link_input_")
		.events("change")
		.map(e => e.target.value.trim())
		.filter(s => s.length)
	;

	return {
		nameChange$,
		linkChange$
	};
};

const render = groupView => {
	return dom.div(".ui.form", [
		dom.div(".ui.field", [
			dom.label("名称"),
			dom.input("._xg_name_input_")
		]),
		dom.div(".ui.field.required", [
			dom.label("链接"),
			dom.input("._xg_link_input_")
		]),
		dom.div(".ui.field.required", [
			dom.label("分组"),
			groupView
		])
	]);
};

const app = R.curry((prop, source) => {
	const action = intent(source);

	const menuSelect = MenuSelect(source, prop);

	const change$ = Most.combineArray(
		mkdata,
		[action.nameChange$, action.linkChange$, menuSelect.change$]
	);

	return {
		DOM: menuSelect.DOM.map(render),
		change$
	};
});

const main = prop => {
	const dialog = Dialog(app(prop), "新建");

	return dialog.appSink.change$
		.filter(R.where({
			name: isNotEmpty,
			link: isNotEmpty,
			group_id: R.is(Number)
		}))
		.sampleWith(dialog.accept$)
		.tap(dialog.hideDialog)
	;
};

module.exports = main;
