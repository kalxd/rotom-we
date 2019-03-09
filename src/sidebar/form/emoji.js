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

const intent = (source, prop) => {
	const nameChange$ = source.DOM.select("._xg_name_input_")
		.events("change")
		.map(e => e.target.value.trim())
		.startWith(prop.name)
		.filter(s => s && s.length)
	;

	const linkChange$ = source.DOM.select("._xg_link_input_")
		.events("change")
		.map(e => e.target.value.trim())
		.startWith(prop.link)
		.filter(s => s && s.length)
	;

	return {
		nameChange$,
		linkChange$
	};
};

const render = R.curry((prop, groupView) => {
	return dom.div(".ui.form", [
		dom.div(".ui.field", [
			dom.label("名称"),
			dom.input("._xg_name_input_", {
				attrs: {
					placeholder: "表情名称",
					value: prop.name
				}
			})
		]),
		dom.div(".ui.field.required", [
			dom.label("链接"),
			dom.input("._xg_link_input_", {
				attrs: {
					placeholder: "表情链接地址",
					value: prop.link
				}
			})
		]),
		dom.div(".ui.field.required", [
			dom.label("分组"),
			groupView
		])
	]);
});

// prop:
// groupVec :: [(String, a)]
// select :: Maybe a
// class :: String
// name :: Maybe String
// link :: Maybe String
const app = R.curry((prop, source) => {
	const action = intent(source, prop);

	const menuSelect = MenuSelect(source, prop);

	const groupChange$ = menuSelect.change$
		.startWith(prop.select)
		.filter(R.complement(R.isNil))
	;

	const change$ = Most.combineArray(
		mkdata,
		[
			action.nameChange$,
			action.linkChange$,
			groupChange$
		]
	);

	return {
		DOM: menuSelect.DOM.map(render(prop)),
		change$
	};
});

const main = prop => {
	const dialog = Dialog(app(prop), "编辑表情");

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
