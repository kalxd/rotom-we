const R = require("ramda");
const dom = require("@cycle/dom");
const GroupState = require("XGState/group");
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
		下拉菜单,
		菜单动画: {
			zIndex: 200,
			transition: "opacity .3s, transform .3s",
			opacity: 0,
			transform: "rotateX(-90deg)",
			delayed: {
				opacity: 1,
				transform: "rotateY(0)"
			}
		}
	};
};

// 显示文本 :: State -> View
const 显示文本 = state => {
	const 选择分组 = State.当前分组(state);

	if (R.isNil(选择分组)) {
		return dom.div(".default.text", "未选择");
	}
	else {
		const [_, 名字] = GroupState.常用字段(选择分组);
		return dom.span(".ui.grey.text", 名字);
	}
};

// 显示分组 :: Group -> Int -> View
const 显示分组 = R.curry((分组, index) => {
	const [_, 名字, __, 数量] = GroupState.常用字段(分组);
	const o = {
		dataset: {
			index
		}
	};

	return dom.div(".item.__item__", o, [
		dom.div(".description", 数量),
		dom.div(".text", 名字)
	]);
});

// render :: State -> View
const render = state => {
	const 样式 = 生成样式(state);
	const 分组列表 = R.view(State.列表元素lens, state);

	return dom.div(样式.菜单, { style: 样式.菜单动画 }, [
		dom.i(".dropdown.icon"),
		显示文本(state),
		dom.div(
			样式.下拉菜单,
			R.addIndex(R.map)(显示分组, 分组列表)
		)
	]);
};

module.exports = render;
