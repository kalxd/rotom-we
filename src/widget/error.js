const Most = require("most");
const dom = require("@cycle/dom");

const drawError = msg => dom.div(".ui.negative.message", [
	dom.div(".header", "出现可怕的错误！"),
	dom.p(msg)
]);

// errorMsg:: Error -> Stream View
const errorMsg = e => {
	console.error(e);
	return Most.of(drawError(e.message));
};

exports.errorMsg = errorMsg;
