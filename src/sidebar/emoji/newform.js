const Dialog = require("XGWidget/dialog");

const render = state => {
	return dom.div(".ui.form", [
		dom.div(".ui.field", [
			dom.label("名称"),
			dom.input("._xg_name_input_")
		]),
		dom.div(".ui.field.required", [
			dom.label("链接"),
			dom.input("._xg_link_input_")
		])
	]);
};

const app = source => {
	const view = render(source);

	return {
		DOM: view
	};
};

const main = () => {
	const dialog = Dialog(app);
	console.log(dialog);
};

module.exports = main;
