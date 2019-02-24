/* 一些辅助函数 */
const Most = require("most");
const R = require("ramda");

// init :: a -> Stream (b -> a)
const init = R.compose(
	Most.of,
	R.always
);

// initWith :: a -> Maybe a -> Stream (b -> a)
const initWith = R.curry((x, a) => {
	return init(a)
		.map(R.defaultTo(x))
	;
});

exports.init = init;
exports.initWith = initWith;
