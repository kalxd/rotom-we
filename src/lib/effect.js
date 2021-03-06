const Most = require("most");

const effectElement = document.getElementById("effect");

// maskIORef :: IO Element
let maskIORef = null;

const activeKlass = ["active", "visible"];

// createMask :: () -> Element
const createMask = () => {
	const mask = document.createElement("div");
	mask.classList.add("ui", "page", "modals", "dimmer", "transition");
	return mask;
};

// showMask :: Element -> ()
const showMask = mask => {
	mask.classList.add(...activeKlass);
};

// hideMask :: Element -> ()
const hideMask = mask => {
	mask.classList.remove(...activeKlass);
};

// showMaskWhen :: () -> IO Element
const showMaskWhen = () => {
	if (!maskIORef) {
		maskIORef = createMask();
	}

	showMask(maskIORef);
	if (!effectElement.contains(maskIORef)) {
		effectElement.appendChild(maskIORef);
	}
	return maskIORef;
};

// hideMaskWhen :: () -> IO Element
const hideMaskWhen = () => {
	if (!maskIORef || maskIORef.childNodes.length) {
		return ;
	}

	hideMask(maskIORef);
};

// nodeIndex :: Element -> IO Int
const nodeIndex = node => {
	let index = 0;

	for (const el of node.parentNode.childNodes) {
		if (node === el) {
			return index;
		}
		++index;
	}

	return 0;
};

// bodyClick$ :: Stream Event
const bodyClick$ = Most.fromEvent("click", document)
	.multicast()
;

module.exports = {
	showMaskWhen,
	hideMaskWhen,
	nodeIndex,
	bodyClick$
};
