const S = require("sanctuary");
const R = require("ramda");

const errorLens = R.lensProp("error");
const formLens = R.lensProp("form");

// setError :: a -> State -> State
const setError = R.set(errorLens);

// clearError :: State -> State
const clearError = setError(S.Nothing);

// setFormValue :: Lens State a -> a -> State -> State
const setFormValue = R.curry((lens, a, state) => {
	const lens_ = R.compose(
		formLens,
		lens
	);

	return R.set(lens_, a, state);
});

// viewFormValue :: Lens State a -> State -> a
const viewFormValue = R.curry((lens, state) => {
	const lens_ = R.compose(
		formLens,
		lens
	);

	return R.view(lens_, state);
});

// overFormValue :: Lens State a -> (a -> a) -> State -> State
const overFormValue = R.curry((lens, f, state) => {
	const lens_ = R.compose(
		formLens,
		lens
	);

	return R.over(lens_, f, state);
});

// getFormData :: State -> Maybe Object
const getFormData = R.compose(
	S.toMaybe,
	R.view(formLens)
);

// getFormData_ :: State -> Object
const getFormData_ = R.view(formLens);

// setFormData :: Object -> State -> State
const setFormData = R.set(formLens);

// selectValidForm :: Stream State -> Stream Form
const selectValidForm = stream$ => {
	return stream$
		.filter(R.where({
			error: S.isNothing
		}))
		.map(getFormData_)
	;
};

exports.errorLens = errorLens;
exports.setError = setError;
exports.clearError = clearError;

exports.formLens = formLens;
exports.viewFormValue = viewFormValue;
exports.setFormValue = setFormValue;
exports.overFormValue = overFormValue;

exports.getFormData = getFormData;
exports.getFormData_ = getFormData_;
exports.setFormData = setFormData;
exports.selectValidForm = selectValidForm;
