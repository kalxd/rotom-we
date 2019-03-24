const R = require("ramda");
const S = require("sanctuary");
const Most = require("most");
const dom = require("@cycle/dom");

const PageS = require("XGState/page");
const ToolS = require("XGState/tool");

const V = require("XGLib/validate");
const Modal = require("XGWidget/modal");
const { drawDialog, drawError } = require("XGWidget/draw");

const { swapToMaybe } = require("XGLib/ext");

// nameLens :: Lens Form String
const nameLens = R.lensProp("name");

// mkinit :: Maybe String -> State
const mkinit = name => ({
	form: {
		name: S.fromMaybe("")(name)
	},
	validate: {
		name: V.notEmpty("名称")
	},
	error: S.Nothing
});

const intent = source => {
	const state$ = source.state.stream;

	const name$ = source.DOM.select("._xg_name_")
		.events("change")
		.map(e => e.target.value.trim())
		.merge(state$.map(PageS.viewFormValue(nameLens)))
		.skipRepeats()
	;

	const accept$ = source.DOM.select(".accept")
		.events("click")
		.debounce(200)
	;

	const reject$ = source.DOM.select(".reject")
		.events("click")
		.debounce(200)
	;

	return {
		name$,
		accept$,
		reject$
	};
};

// render :: String -> String -> View
const render = R.curry((title, { form, error }) => (
	drawDialog(S.Just(title), [
		dom.div(".ui.form", [
			dom.div(".ui.field.required", [
				dom.label("分组名称"),
				dom.input("._xg_name_", {
					props: {
						value: form.name
					}
				})
			])
		]),
		drawError(error)
	])
));

// app :: Maybe String -> Source -> Sink
const app = R.curry((name, source) => {
	const modalTitle = S.maybe("新建分组")(S.K("编辑分组"))(name);

	const state$ = source.state.stream;
	const init$ = Most.of(name)
		.map(mkinit)
		.map(R.always)
	;

	const action = intent(source);

	const clear$ = state$
		.sampleWith(action.name$.debounce(200))
		.skipRepeats()
		.constant(PageS.clearError)
	;

	const validate$ = state$
		.sampleWith(action.accept$)
		.map(ToolS.validate)
	;

	const error$ = validate$
		.map(swapToMaybe)
		.map(PageS.setError)
	;

	const update$ = action.name$
		.map(PageS.setFormValue(nameLens))
		.merge(error$)
		.merge(clear$)
	;

	const accept$ = validate$
		.filter(S.isRight)
		.map(x => x.value)
	;

	return {
		DOM: state$.map(render(modalTitle)),
		state: init$.merge(update$),
		accept$,
		reject$: action.reject$
	};
});

// main :: Maybe String -> Stream String
const main = name => {
	const modal = Modal(app(name));

	modal.reject$.observe(modal.hideModal);

	return modal.accept$
		.tap(modal.hideModal)
	;
};

module.exports = main;
