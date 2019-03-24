const R = require("ramda");
const S = require("sanctuary");
const Most = require("most");
const dom = require("@cycle/dom");

const V = require("XGLib/validate");
const { swapToMaybe, orEmpty } = require("XGLib/ext");

const PageS = require("XGState/page");
const ToolS = require("XGState/tool");

const Modal = require("XGWidget/modal");
const MenuSelect = require("XGWidget/menuselect");
const { drawDialog, drawError } = require("XGWidget/draw");

// nameLens :: Lens Form String
const nameLens = R.lensProp("name");

// linkLens :: Lens Form String
const linkLens = R.lensProp("link");

// selectLens :: Lens Form (Maybe Object)
const selectLens = R.lensProp("select");

// mkinit :: Maybe String -> Maybe String -> Maybe Object -> State
const mkinit = (name, link, select) => ({
	form: {
		// name :: String
		name: orEmpty(name),
		// link :: String
		link: orEmpty(link),
		// group_id :: Maybe Object
		select: select
	},

	validate: {
		link: V.notEmpty("链接"),
		select: S.maybeToEither("选择分组")
	},

	error: S.Nothing
});

const intent = source => {
	const state$ = source.state.stream;

	const nameChange$ = source.DOM.select("._xg_name_input_")
		.events("change")
		.map(e => e.target.value.trim())
		.merge(state$.map(PageS.viewFormValue(nameLens)))
		.skipRepeats()
	;

	const linkChange$ = source.DOM.select("._xg_link_input_")
		.events("change")
		.map(e => e.target.value.trim())
		.merge(state$.map(PageS.viewFormValue(linkLens)))
		.skipRepeats()
	;

	const accept$ = source.DOM.select(".accept")
		.events("click")
	;

	const reject$ = source.DOM.select(".reject")
		.events("click")
	;

	return {
		nameChange$,
		linkChange$,

		accept$,
		reject$
	};
};

// render :: String -> (State, View) -> View
const render = R.curry((title, [{ form, error }, selectView]) => (
	drawDialog(S.Just(title), [
		dom.div(".ui.form", [
			dom.div(".ui.field", [
				dom.label("名称"),
				dom.input("._xg_name_input_", {
					attrs: {
						placeholder: "表情名称",
						value: form.name
					}
				})
			]),
			dom.div(".ui.field.required", [
				dom.label("链接"),
				dom.input("._xg_link_input_", {
					attrs: {
						placeholder: "表情链接地址",
						value: form.link
					}
				})
			]),
			dom.div(".ui.field.required", [
				dom.label("分组"),
				selectView
			])
		]),

		drawError(error)
	])
));

// app :: String -> Maybe String -> Maybe String -> [Object] -> Maybe Object -> Source -> Sink
const app = R.curry((klass, name, link, groupVec, select, source) => {
	const modalTitle = S.maybe("添加新表情")(S.K("编辑表情"))(select);

	const state$ = source.state.stream;
	const action = intent(source);

	const init$ = Most.of(mkinit(name, link, select))
		.map(R.always)
	;

	const itemVec = R.map(group => ([group.name, group]))(groupVec);
	const menuSelect = MenuSelect(
		source,
		klass,
		itemVec,
		select
	);

	const view$ = state$
		.combine(R.pair, menuSelect.DOM)
	;

	const validate$ = state$
		.sampleWith(action.accept$)
		.map(ToolS.validate)
	;

	const error$ = validate$
		.map(swapToMaybe)
		.map(PageS.setError)
	;

	const clear$ = state$
		.sampleWith(action.nameChange$
			.merge(action.linkChange$)
			.merge(menuSelect.change$)
		)
		.constant(PageS.clearError)
	;

	const update$ = action.nameChange$
		.map(PageS.setFormValue(nameLens))
		.merge(action.linkChange$.map(PageS.setFormValue(linkLens)))
		.merge(menuSelect.change$.map(PageS.setFormValue(selectLens)))
		.merge(error$)
		.merge(clear$)
	;

	const accept$ = state$
		.sampleWith(validate$.filter(S.isRight))
		.map(PageS.getFormData_)
	;

	return {
		DOM: view$.map(render(modalTitle)),
		state: init$.merge(update$),
		reject$: action.reject$,
		accept$
	};
});

const main = R.curry((klass, name, link, groupVec, select) => {
	const modal = Modal(app(klass, name, link, groupVec, select));

	modal.reject$.observe(modal.hideModal);

	return modal.accept$
		.map(R.evolve({
			select: S.maybeToNullable
		}))
		.map(form => ({
			name: form.name,
			link: form.link,
			group_id: form.select.id
		}))
		.tap(modal.hideModal)
	;
});

module.exports = main;
