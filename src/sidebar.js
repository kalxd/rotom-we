const { runAtApp } = require("XGWidget/run");
const AppState = require("XGState/app");

const SidebarW = require("./sidebar/index");

// main :: Source -> Application
const main = source => {
	return SidebarW(source, AppState.读取选项());
};

runAtApp(main);
