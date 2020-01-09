const R = require("ramda");
const dom = require("@cycle/dom");
const LoadState = require("XGState/load");

const 加载中 = dom.div(".ui.segment", [
	dom.div(".ui.active.inverted.dimmer", [
		dom.div(".ui.text.loader", "加载中……")
	]),
	dom.div(".ui.placeholder", R.repeat(dom.div(".line"), 5))
]);

// render :: LoadState View -> View
const render = state => {
	if (R.view(LoadState.已完成lens, state)) {
		return R.view(LoadState.内容lens, state);
	}
	else {
		return 加载中;
	}
};

module.exports = {
	render
};
