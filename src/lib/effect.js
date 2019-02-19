const effectElement = document.getElementById("effect");

// maskIORef :: IO Element
let maskIORef = null;

const activeKlass = ["active", "visible"];

// createMask :: () -> Element
const createMask = () => {
	const mask = document.createElement("div");
	mask.classList.add("ui", "page", "dimmer", "transition");
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
		effectElement.appendChild(maskIORef);
	}

	showMask(maskIORef);
	return maskIORef;
};

// hideMaskWhen :: () -> IO Element
const hideMaskWhen = () => {
	if (!maskIORef || maskIORef.childNodes.length) {
		return ;
	}

	hideMask(maskIORef);
};

exports.showMaskWhen = showMaskWhen;
exports.hideMaskWhen = hideMaskWhen;
