const R = require("ramda");
const S = require("sanctuary");
const Most = require("most");
const dom = require("@cycle/dom");

const { fmap } = require("XGLib/ext");

const drawError = msg => dom.div(".ui.negative.message", [
	dom.div(".header", "出现可怕的错误！"),
	dom.p(msg)
]);

// errorMsg:: Error -> Stream View
const errorMsg = e => {
	console.error(e);
	return Most.of(drawError(e.message));
};

// renderMaybe :: Maybe View -> View
const renderMaybe = S.maybeToNullable;

// renderEither :: Either String View -> View
const renderEither = S.either(
	msg => dom.div(".ui.red.message", dom.p(msg)),
)(S.I);

exports.errorMsg = errorMsg;
exports.renderMaybe = renderMaybe;
exports.renderEither = renderEither;
