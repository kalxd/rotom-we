const R = require("ramda");
const { run } = require("@cycle/most-run");
const { withState } = require("@cycle/state");
const dom = require("@cycle/dom");

const Alert = require("XGWidget/alert");

const runAt = R.curry((where, app) => {
	const driver = {
		DOM: dom.makeDOMDriver(where)
	};

	const main = withState(app);
	return run(main, driver);
});

const render = runAt("#app");

const alertError = e => {
	const show = R.flip(Alert.show)("出错啦！");
	const msg = (() => {
		if (e instanceof Error) {
			console.error(e);
			return e.message;
		}
		else {
			return e.value;
		}
	})(e);

	return show(msg)
		.map(_ => dom.div(".ui.red.message", msg))
	;
};

exports.runAt = runAt;
exports.render = render;
exports.alertError = alertError;
