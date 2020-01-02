const R = require("ramda");
const dom = require("@cycle/dom");
const LoadState = require("XGState/load");

const 占位卡片 = dom.div(".ui.card", [

]);

// 几张卡片 :: Int -> [View]
const 几张卡片 = R.repeat(占位卡片);

// render :: LoadState View -> View
const render = state => {
	if (R.view(LoadState.已完成lens, state)) {
		return R.view(LoadState.内容lens, state);
	}
	else {
		return "加载中";
	}
};

module.exports = {
	render
};
