const R = require("ramda");
const S = require("sanctuary");

// notEmpty :: String -> String -> Either String String
const notEmpty = R.curry((name, s) => {
	const str = R.trim(s);

	if (R.isEmpty(s)) {
		return S.Left(`${name}不能为空`);
	}
	else {
		return S.Right(str);
	}
});

exports.notEmpty = notEmpty;
