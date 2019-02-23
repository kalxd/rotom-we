const dom = require("@cycle/dom");

const drawError = msg => dom.div(".ui.negative.message", [
	dom.div(".header", "出现可怕的错误！"),
	dom.p(msg)
]);

const errorView = e => drawError(e.message);

exports.errorView = errorView;
