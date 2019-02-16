const { render } = require("./lib/ui");
const App = require("./sidebar/app");
const dom = require("@cycle/dom");

const main = source => {
	const app = App(source);
	return {
		DOM: app.DOM.map(appView => dom.div(".ui.container", appView)),
		state: app.state
	};
};

render(main);
