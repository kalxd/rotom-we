const S = require("sanctuary");
const PageS = require("XGState/page");
const OptionS = require("XGState/option");
const ToolS = require("XGState/tool");

const { swapToMaybe } = require("XGLib/ext");

const intent = source => {
	const state$ = source.state.stream;

	const addrChange$ = source.DOM.select(".addr-input")
		.events("change")
		.map(e => e.target.value.trim())
		.merge(state$.map(PageS.viewFormValue(OptionS.addrLens)))
		.skipRepeats()
	;

	const tokenChange$ = source.DOM.select(".token-input")
		.events("change")
		.map(e => e.target.value.trim())
		.merge(state$.map(PageS.viewFormValue(OptionS.tokenLens)))
		.skipRepeats()
	;

	const primaryClick$ = source.DOM.select(".primary.button")
		.events("click")
	;

	return {
		addrChange$,
		tokenChange$,
		primaryClick$
	};
};

const connect = source => {
	const state$ = source.state.stream;

	const action = intent(source);
	const change$ = action.addrChange$
		.map(PageS.setFormValue(OptionS.addrLens))
		.merge(action.tokenChange$
			.map(PageS.setFormValue(OptionS.tokenLens))
		)
	;

	const clear$ = change$
		.constant(PageS.clearError)
	;

	const validate$ = state$
		.sampleWith(action.primaryClick$)
		.map(ToolS.validate)
		.multicast()
	;

	const error$ = validate$
		.map(swapToMaybe)
		.map(PageS.setError)
	;

	const update$ = change$
		.merge(clear$)
		.merge(error$)
	;

	const submit$ = state$
		.sampleWith(validate$.filter(S.isRight))
		.map(PageS.getFormData_)
	;

	return {
		update$,
		submit$
	};
};

module.exports = connect;
