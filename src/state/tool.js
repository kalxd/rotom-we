/* 一些辅助函数 */
const Most = require("most");
const R = require("ramda");
const S = require("sanctuary");

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

// validate :: State -> Either [String] Object
const validate = state => {
	const { form, validate } = state;

	// vs :: [(String, Either String String)]
	const vs = R.pipe(
		R.toPairs,
		R.map(([key, f]) => f(form[key]))
	)(validate);

	// es :: [String]
	const es = S.lefts(vs);

	if (R.isEmpty(es)) {
		return S.Right(form);
	}
	else {
		return S.Left(es);
	}
};

exports.init = init;
exports.initWith = initWith;
exports.validate = validate;
