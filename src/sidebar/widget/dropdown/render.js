const R = require("ramda");
const dom = require("@cycle/dom");
const State = require("./state");

const 生成样式 = state => {
	const 显示 = R.view(State.显示lens, state);

	const 菜单 = (b => {
		const base = ".ui.selection.dropdown.__self__";
		if (b) {
			return `${base}.active`;
		}
		else {
			return base;
		}
	})(显示);

	const 下拉菜单 = (b => {
		const base = ".menu.transition";
		if (b) {
			return `${base}.visible.active`;
		}
		else {
			return base;
		}
	})(显示);

	return {
		菜单,
		下拉菜单
	};
};

// 显示文本 :: State -> View
const 显示文本 = state => {
	const 选择分组 = R.view(State.当前选择lens, state);
	if (R.isNil(选择分组)) {
		return dom.div(".default.text", "未选择");
	}
	else {
		return dom.div(".text", 选择分组.名称);
	}
};

// render :: State -> View
const render = state => {
	const 样式 = 生成样式(state);

	return dom.div(样式.菜单, [
		dom.i(".dropdown.icon"),
		显示文本(state),
		dom.div(样式.下拉菜单, [
			dom.div(".item", "item 1"),
			dom.div(".item", "item 2")
		])
	]);
};

module.exports = render;
