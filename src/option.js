const R = require("ramda");
const Most = require("most");
const dom = require("@cycle/dom");
const { render } = require("./lib/ui");

const addrP = browser.storage.local.get("addr");
const tokenP = browser.storage.local.get("toke");

/**
 * state: { addr, token }
 */
const addrLens = R.lensProp("addr");
const tokenLens = R.lensProp("token");

const intent = source => {
    const addrValue$ = source.DOM.select(".addr")
        .events("keyup")
        .map(e => e.target.value.trim())
        .merge(Most.fromPromise(addrP))
    ;

    const tokenValue$ = source.DOM.select(".token")
        .events("keyup")
        .map(e => e.target.value.trim())
        .merge(Most.fromPromise(tokenP))
    ;

    const submitClick$ = source.DOM.select(".submit")
        .events("click")
        .throttle(200)
    ;

    return {
        addrValue$,
        tokenValue$,
        submitClick$
    };
};

const model = (init$, action) => {
    const addrChange$ = action.addrValue$
        .map(R.set(addrLens))
    ;

    const tokenChange$ = action.tokenValue$
        .map(R.set(tokenLens))
    ;

    return {
        update$: addrChange$.merge(tokenChange$),

        submit$: action.submitClick$
    };
};

const view = state$ => state$.map(_ => (
    dom.div(".ui.segment", [
        dom.div(".ui.form", [
            dom.div(".field.required", [
                dom.label("服务地址"),
                dom.input(".addr", { attrs: { placeholder: "毕竟云表情" } })
            ]),
            dom.div(".field.required", [
                dom.label("邀请码"),
                dom.input(".token", { attrs: { placeholder: "为了不必要的安全"} })
            ]),

            dom.button(".ui.blue.button.submit", "提交")
        ])
    ])
));


Promise.all([addrP, tokenP])
    .then(([addr, token]) => {
        const main = source => {
            const state$ = source.state.stream;
            const initState$ = Most.of(R.always({ addr, token }));

            const action = intent(source);
            const { update$, submit$ } = model(initState$, action);

            state$.sampleWith(submit$).observe(state => {
                return browser.storage.local.set(state)
                    .then(console.log)
                    .catch(console.error)
                ;
            });

            return {
                DOM: view(state$),
                state: initState$.merge(update$)
            };
        };

        render(main);
    })
;
