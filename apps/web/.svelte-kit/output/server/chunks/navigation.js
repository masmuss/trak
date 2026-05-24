import { $ as clsx$1, a as bind_props, et as escape_html, f as spread_props, i as attributes, o as derived, pt as run, tt as ATTACHMENT_KEY, u as props_id } from "./dev.js";
import "./index-server.js";
import "./internal.js";
import "./events.js";
import { o as getIconContext } from "./Warning.js";
import "./client.js";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
//#region ../../node_modules/.pnpm/inline-style-parser@0.2.7/node_modules/inline-style-parser/esm/index.mjs
var COMMENT_REGEX = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
var NEWLINE_REGEX = /\n/g;
var WHITESPACE_REGEX = /^\s*/;
var PROPERTY_REGEX = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/;
var COLON_REGEX = /^:\s*/;
var VALUE_REGEX = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/;
var SEMICOLON_REGEX = /^[;\s]*/;
var TRIM_REGEX = /^\s+|\s+$/g;
var NEWLINE = "\n";
var FORWARD_SLASH = "/";
var ASTERISK = "*";
var EMPTY_STRING = "";
var TYPE_COMMENT = "comment";
var TYPE_DECLARATION = "declaration";
/**
* @param {String} style
* @param {Object} [options]
* @return {Object[]}
* @throws {TypeError}
* @throws {Error}
*/
function index(style, options) {
	if (typeof style !== "string") throw new TypeError("First argument must be a string");
	if (!style) return [];
	options = options || {};
	/**
	* Positional.
	*/
	var lineno = 1;
	var column = 1;
	/**
	* Update lineno and column based on `str`.
	*
	* @param {String} str
	*/
	function updatePosition(str) {
		var lines = str.match(NEWLINE_REGEX);
		if (lines) lineno += lines.length;
		var i = str.lastIndexOf(NEWLINE);
		column = ~i ? str.length - i : column + str.length;
	}
	/**
	* Mark position and patch `node.position`.
	*
	* @return {Function}
	*/
	function position() {
		var start = {
			line: lineno,
			column
		};
		return function(node) {
			node.position = new Position(start);
			whitespace();
			return node;
		};
	}
	/**
	* Store position information for a node.
	*
	* @constructor
	* @property {Object} start
	* @property {Object} end
	* @property {undefined|String} source
	*/
	function Position(start) {
		this.start = start;
		this.end = {
			line: lineno,
			column
		};
		this.source = options.source;
	}
	/**
	* Non-enumerable source string.
	*/
	Position.prototype.content = style;
	/**
	* Error `msg`.
	*
	* @param {String} msg
	* @throws {Error}
	*/
	function error(msg) {
		var err = /* @__PURE__ */ new Error(options.source + ":" + lineno + ":" + column + ": " + msg);
		err.reason = msg;
		err.filename = options.source;
		err.line = lineno;
		err.column = column;
		err.source = style;
		if (options.silent);
		else throw err;
	}
	/**
	* Match `re` and return captures.
	*
	* @param {RegExp} re
	* @return {undefined|Array}
	*/
	function match(re) {
		var m = re.exec(style);
		if (!m) return;
		var str = m[0];
		updatePosition(str);
		style = style.slice(str.length);
		return m;
	}
	/**
	* Parse whitespace.
	*/
	function whitespace() {
		match(WHITESPACE_REGEX);
	}
	/**
	* Parse comments.
	*
	* @param {Object[]} [rules]
	* @return {Object[]}
	*/
	function comments(rules) {
		var c;
		rules = rules || [];
		while (c = comment()) if (c !== false) rules.push(c);
		return rules;
	}
	/**
	* Parse comment.
	*
	* @return {Object}
	* @throws {Error}
	*/
	function comment() {
		var pos = position();
		if (FORWARD_SLASH != style.charAt(0) || ASTERISK != style.charAt(1)) return;
		var i = 2;
		while (EMPTY_STRING != style.charAt(i) && (ASTERISK != style.charAt(i) || FORWARD_SLASH != style.charAt(i + 1))) ++i;
		i += 2;
		if (EMPTY_STRING === style.charAt(i - 1)) return error("End of comment missing");
		var str = style.slice(2, i - 2);
		column += 2;
		updatePosition(str);
		style = style.slice(i);
		column += 2;
		return pos({
			type: TYPE_COMMENT,
			comment: str
		});
	}
	/**
	* Parse declaration.
	*
	* @return {Object}
	* @throws {Error}
	*/
	function declaration() {
		var pos = position();
		var prop = match(PROPERTY_REGEX);
		if (!prop) return;
		comment();
		if (!match(COLON_REGEX)) return error("property missing ':'");
		var val = match(VALUE_REGEX);
		var ret = pos({
			type: TYPE_DECLARATION,
			property: trim(prop[0].replace(COMMENT_REGEX, EMPTY_STRING)),
			value: val ? trim(val[0].replace(COMMENT_REGEX, EMPTY_STRING)) : EMPTY_STRING
		});
		match(SEMICOLON_REGEX);
		return ret;
	}
	/**
	* Parse declarations.
	*
	* @return {Object[]}
	*/
	function declarations() {
		var decls = [];
		comments(decls);
		var decl;
		while (decl = declaration()) if (decl !== false) {
			decls.push(decl);
			comments(decls);
		}
		return decls;
	}
	whitespace();
	return declarations();
}
/**
* Trim `str`.
*
* @param {String} str
* @return {String}
*/
function trim(str) {
	return str ? str.replace(TRIM_REGEX, EMPTY_STRING) : EMPTY_STRING;
}
//#endregion
//#region ../../node_modules/.pnpm/style-to-object@1.0.14/node_modules/style-to-object/esm/index.mjs
/**
* Parses inline style to object.
*
* @param style - Inline style.
* @param iterator - Iterator.
* @returns - Style object or null.
*
* @example Parsing inline style to object:
*
* ```js
* import parse from 'style-to-object';
* parse('line-height: 42;'); // { 'line-height': '42' }
* ```
*/
function StyleToObject(style, iterator) {
	let styleObject = null;
	if (!style || typeof style !== "string") return styleObject;
	const declarations = index(style);
	const hasIterator = typeof iterator === "function";
	declarations.forEach((declaration) => {
		if (declaration.type !== "declaration") return;
		const { property, value } = declaration;
		if (hasIterator) iterator(property, value, declaration);
		else if (value) {
			styleObject = styleObject || {};
			styleObject[property] = value;
		}
	});
	return styleObject;
}
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.61.0_@sveltejs+vite-plugin-svelte@7.1.2_svelte@5_2f32e24d733d77d2b62f80d031f1fcc4/node_modules/svelte-toolbelt/dist/utils/is.js
function isFunction(value) {
	return typeof value === "function";
}
function isObject(value) {
	return value !== null && typeof value === "object";
}
var CLASS_VALUE_PRIMITIVE_TYPES = [
	"string",
	"number",
	"bigint",
	"boolean"
];
function isClassValue(value) {
	if (value === null || value === void 0) return true;
	if (CLASS_VALUE_PRIMITIVE_TYPES.includes(typeof value)) return true;
	if (Array.isArray(value)) return value.every((item) => isClassValue(item));
	if (typeof value === "object") {
		if (Object.getPrototypeOf(value) !== Object.prototype) return false;
		return true;
	}
	return false;
}
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.61.0_@sveltejs+vite-plugin-svelte@7.1.2_svelte@5_2f32e24d733d77d2b62f80d031f1fcc4/node_modules/svelte-toolbelt/dist/box/box-extras.svelte.js
var BoxSymbol = Symbol("box");
var isWritableSymbol = Symbol("is-writable");
function boxWith(getter, setter) {
	const derived$1 = derived(getter);
	if (setter) return {
		[BoxSymbol]: true,
		[isWritableSymbol]: true,
		get current() {
			return derived$1();
		},
		set current(v) {
			setter(v);
		}
	};
	return {
		[BoxSymbol]: true,
		get current() {
			return getter();
		}
	};
}
/**
* @returns Whether the value is a Box
*
* @see {@link https://runed.dev/docs/functions/box}
*/
function isBox(value) {
	return isObject(value) && BoxSymbol in value;
}
/**
* @returns Whether the value is a WritableBox
*
* @see {@link https://runed.dev/docs/functions/box}
*/
function isWritableBox(value) {
	return isBox(value) && isWritableSymbol in value;
}
function boxFrom(value) {
	if (isBox(value)) return value;
	if (isFunction(value)) return boxWith(value);
	return simpleBox(value);
}
/**
* Function that gets an object of boxes, and returns an object of reactive values
*
* @example
* const count = box(0)
* const flat = box.flatten({ count, double: box.with(() => count.current) })
* // type of flat is { count: number, readonly double: number }
*
* @see {@link https://runed.dev/docs/functions/box}
*/
function boxFlatten(boxes) {
	return Object.entries(boxes).reduce((acc, [key, b]) => {
		if (!isBox(b)) return Object.assign(acc, { [key]: b });
		if (isWritableBox(b)) Object.defineProperty(acc, key, {
			get() {
				return b.current;
			},
			set(v) {
				b.current = v;
			}
		});
		else Object.defineProperty(acc, key, { get() {
			return b.current;
		} });
		return acc;
	}, {});
}
/**
* Function that converts a box to a readonly box.
*
* @example
* const count = box(0) // WritableBox<number>
* const countReadonly = box.readonly(count) // ReadableBox<number>
*
* @see {@link https://runed.dev/docs/functions/box}
*/
function toReadonlyBox(b) {
	if (!isWritableBox(b)) return b;
	return {
		[BoxSymbol]: true,
		get current() {
			return b.current;
		}
	};
}
function simpleBox(initialValue) {
	let current = initialValue;
	return {
		[BoxSymbol]: true,
		[isWritableSymbol]: true,
		get current() {
			return current;
		},
		set current(v) {
			current = v;
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.61.0_@sveltejs+vite-plugin-svelte@7.1.2_svelte@5_2f32e24d733d77d2b62f80d031f1fcc4/node_modules/svelte-toolbelt/dist/utils/compose-handlers.js
/**
* Composes event handlers into a single function that can be called with an event.
* If the previous handler cancels the event using `event.preventDefault()`, the handlers
* that follow will not be called.
*/
function composeHandlers(...handlers) {
	return function(e) {
		for (const handler of handlers) {
			if (!handler) continue;
			if (e.defaultPrevented) return;
			if (typeof handler === "function") handler.call(this, e);
			else handler.current?.call(this, e);
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.61.0_@sveltejs+vite-plugin-svelte@7.1.2_svelte@5_2f32e24d733d77d2b62f80d031f1fcc4/node_modules/svelte-toolbelt/dist/utils/strings.js
var NUMBER_CHAR_RE = /\d/;
var STR_SPLITTERS = [
	"-",
	"_",
	"/",
	"."
];
function isUppercase(char = "") {
	if (NUMBER_CHAR_RE.test(char)) return void 0;
	return char !== char.toLowerCase();
}
function splitByCase(str) {
	const parts = [];
	let buff = "";
	let previousUpper;
	let previousSplitter;
	for (const char of str) {
		const isSplitter = STR_SPLITTERS.includes(char);
		if (isSplitter === true) {
			parts.push(buff);
			buff = "";
			previousUpper = void 0;
			continue;
		}
		const isUpper = isUppercase(char);
		if (previousSplitter === false) {
			if (previousUpper === false && isUpper === true) {
				parts.push(buff);
				buff = char;
				previousUpper = isUpper;
				continue;
			}
			if (previousUpper === true && isUpper === false && buff.length > 1) {
				const lastChar = buff.at(-1);
				parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
				buff = lastChar + char;
				previousUpper = isUpper;
				continue;
			}
		}
		buff += char;
		previousUpper = isUpper;
		previousSplitter = isSplitter;
	}
	parts.push(buff);
	return parts;
}
function pascalCase(str) {
	if (!str) return "";
	return splitByCase(str).map((p) => upperFirst(p)).join("");
}
function camelCase(str) {
	return lowerFirst(pascalCase(str || ""));
}
function upperFirst(str) {
	return str ? str[0].toUpperCase() + str.slice(1) : "";
}
function lowerFirst(str) {
	return str ? str[0].toLowerCase() + str.slice(1) : "";
}
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.61.0_@sveltejs+vite-plugin-svelte@7.1.2_svelte@5_2f32e24d733d77d2b62f80d031f1fcc4/node_modules/svelte-toolbelt/dist/utils/css-to-style-obj.js
function cssToStyleObj(css) {
	if (!css) return {};
	const styleObj = {};
	function iterator(name, value) {
		if (name.startsWith("-moz-") || name.startsWith("-webkit-") || name.startsWith("-ms-") || name.startsWith("-o-")) {
			styleObj[pascalCase(name)] = value;
			return;
		}
		if (name.startsWith("--")) {
			styleObj[name] = value;
			return;
		}
		styleObj[camelCase(name)] = value;
	}
	StyleToObject(css, iterator);
	return styleObj;
}
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.61.0_@sveltejs+vite-plugin-svelte@7.1.2_svelte@5_2f32e24d733d77d2b62f80d031f1fcc4/node_modules/svelte-toolbelt/dist/utils/execute-callbacks.js
/**
* Executes an array of callback functions with the same arguments.
* @template T The types of the arguments that the callback functions take.
* @param callbacks array of callback functions to execute.
* @returns A new function that executes all of the original callback functions with the same arguments.
*/
function executeCallbacks(...callbacks) {
	return (...args) => {
		for (const callback of callbacks) if (typeof callback === "function") callback(...args);
	};
}
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.61.0_@sveltejs+vite-plugin-svelte@7.1.2_svelte@5_2f32e24d733d77d2b62f80d031f1fcc4/node_modules/svelte-toolbelt/dist/utils/style-to-css.js
function createParser(matcher, replacer) {
	const regex = RegExp(matcher, "g");
	return (str) => {
		if (typeof str !== "string") throw new TypeError(`expected an argument of type string, but got ${typeof str}`);
		if (!str.match(regex)) return str;
		return str.replace(regex, replacer);
	};
}
var camelToKebab = createParser(/[A-Z]/, (match) => `-${match.toLowerCase()}`);
function styleToCSS(styleObj) {
	if (!styleObj || typeof styleObj !== "object" || Array.isArray(styleObj)) throw new TypeError(`expected an argument of type object, but got ${typeof styleObj}`);
	return Object.keys(styleObj).map((property) => `${camelToKebab(property)}: ${styleObj[property]};`).join("\n");
}
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.61.0_@sveltejs+vite-plugin-svelte@7.1.2_svelte@5_2f32e24d733d77d2b62f80d031f1fcc4/node_modules/svelte-toolbelt/dist/utils/style.js
function styleToString(style = {}) {
	return styleToCSS(style).replace("\n", " ");
}
var EVENT_LIST_SET = new Set([
	"onabort",
	"onanimationcancel",
	"onanimationend",
	"onanimationiteration",
	"onanimationstart",
	"onauxclick",
	"onbeforeinput",
	"onbeforetoggle",
	"onblur",
	"oncancel",
	"oncanplay",
	"oncanplaythrough",
	"onchange",
	"onclick",
	"onclose",
	"oncompositionend",
	"oncompositionstart",
	"oncompositionupdate",
	"oncontextlost",
	"oncontextmenu",
	"oncontextrestored",
	"oncopy",
	"oncuechange",
	"oncut",
	"ondblclick",
	"ondrag",
	"ondragend",
	"ondragenter",
	"ondragleave",
	"ondragover",
	"ondragstart",
	"ondrop",
	"ondurationchange",
	"onemptied",
	"onended",
	"onerror",
	"onfocus",
	"onfocusin",
	"onfocusout",
	"onformdata",
	"ongotpointercapture",
	"oninput",
	"oninvalid",
	"onkeydown",
	"onkeypress",
	"onkeyup",
	"onload",
	"onloadeddata",
	"onloadedmetadata",
	"onloadstart",
	"onlostpointercapture",
	"onmousedown",
	"onmouseenter",
	"onmouseleave",
	"onmousemove",
	"onmouseout",
	"onmouseover",
	"onmouseup",
	"onpaste",
	"onpause",
	"onplay",
	"onplaying",
	"onpointercancel",
	"onpointerdown",
	"onpointerenter",
	"onpointerleave",
	"onpointermove",
	"onpointerout",
	"onpointerover",
	"onpointerup",
	"onprogress",
	"onratechange",
	"onreset",
	"onresize",
	"onscroll",
	"onscrollend",
	"onsecuritypolicyviolation",
	"onseeked",
	"onseeking",
	"onselect",
	"onselectionchange",
	"onselectstart",
	"onslotchange",
	"onstalled",
	"onsubmit",
	"onsuspend",
	"ontimeupdate",
	"ontoggle",
	"ontouchcancel",
	"ontouchend",
	"ontouchmove",
	"ontouchstart",
	"ontransitioncancel",
	"ontransitionend",
	"ontransitionrun",
	"ontransitionstart",
	"onvolumechange",
	"onwaiting",
	"onwebkitanimationend",
	"onwebkitanimationiteration",
	"onwebkitanimationstart",
	"onwebkittransitionend",
	"onwheel"
]);
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.61.0_@sveltejs+vite-plugin-svelte@7.1.2_svelte@5_2f32e24d733d77d2b62f80d031f1fcc4/node_modules/svelte-toolbelt/dist/utils/merge-props.js
/**
* Modified from https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/utils/src/mergeProps.ts (see NOTICE.txt for source)
*/
function isEventHandler(key) {
	return EVENT_LIST_SET.has(key);
}
/**
* Given a list of prop objects, merges them into a single object.
* - Automatically composes event handlers (e.g. `onclick`, `oninput`, etc.)
* - Chains regular functions with the same name so they are called in order
* - Merges class strings with `clsx`
* - Merges style objects and converts them to strings
* - Handles a bug with Svelte where setting the `hidden` attribute to `false` doesn't remove it
* - Overrides other values with the last one
*/
function mergeProps(...args) {
	const result = { ...args[0] };
	for (let i = 1; i < args.length; i++) {
		const props = args[i];
		if (!props) continue;
		for (const key of Object.keys(props)) {
			const a = result[key];
			const b = props[key];
			const aIsFunction = typeof a === "function";
			const bIsFunction = typeof b === "function";
			if (aIsFunction && typeof bIsFunction && isEventHandler(key)) result[key] = composeHandlers(a, b);
			else if (aIsFunction && bIsFunction) result[key] = executeCallbacks(a, b);
			else if (key === "class") {
				const aIsClassValue = isClassValue(a);
				const bIsClassValue = isClassValue(b);
				if (aIsClassValue && bIsClassValue) result[key] = clsx(a, b);
				else if (aIsClassValue) result[key] = clsx(a);
				else if (bIsClassValue) result[key] = clsx(b);
			} else if (key === "style") {
				const aIsObject = typeof a === "object";
				const bIsObject = typeof b === "object";
				const aIsString = typeof a === "string";
				const bIsString = typeof b === "string";
				if (aIsObject && bIsObject) result[key] = {
					...a,
					...b
				};
				else if (aIsObject && bIsString) {
					const parsedStyle = cssToStyleObj(b);
					result[key] = {
						...a,
						...parsedStyle
					};
				} else if (aIsString && bIsObject) result[key] = {
					...cssToStyleObj(a),
					...b
				};
				else if (aIsString && bIsString) {
					const parsedStyleA = cssToStyleObj(a);
					const parsedStyleB = cssToStyleObj(b);
					result[key] = {
						...parsedStyleA,
						...parsedStyleB
					};
				} else if (aIsObject) result[key] = a;
				else if (bIsObject) result[key] = b;
				else if (aIsString) result[key] = a;
				else if (bIsString) result[key] = b;
			} else result[key] = b !== void 0 ? b : a;
		}
		for (const key of Object.getOwnPropertySymbols(props)) {
			const a = result[key];
			const b = props[key];
			result[key] = b !== void 0 ? b : a;
		}
	}
	if (typeof result.style === "object") result.style = styleToString(result.style).replaceAll("\n", " ");
	if (result.hidden === false) {
		result.hidden = void 0;
		delete result.hidden;
	}
	if (result.disabled === false) {
		result.disabled = void 0;
		delete result.disabled;
	}
	return result;
}
if (typeof HTMLElement === "function");
//#endregion
//#region ../../node_modules/.pnpm/svelte@5.55.9_@typescript-eslint+types@8.59.4/node_modules/svelte/src/attachments/index.js
/**
* Creates an object key that will be recognised as an attachment when the object is spread onto an element,
* as a programmatic alternative to using `{@attach ...}`. This can be useful for library authors, though
* is generally not needed when building an app.
*
* ```svelte
* <script>
* 	import { createAttachmentKey } from 'svelte/attachments';
*
* 	const props = {
* 		class: 'cool',
* 		onclick: () => alert('clicked'),
* 		[createAttachmentKey()]: (node) => {
* 			node.textContent = 'attached!';
* 		}
* 	};
* <\/script>
*
* <button {...props}>click me</button>
* ```
* @since 5.29
*/
function createAttachmentKey() {
	return Symbol(ATTACHMENT_KEY);
}
//#endregion
//#region ../../node_modules/.pnpm/svelte-toolbelt@0.10.6_@sveltejs+kit@2.61.0_@sveltejs+vite-plugin-svelte@7.1.2_svelte@5_2f32e24d733d77d2b62f80d031f1fcc4/node_modules/svelte-toolbelt/dist/utils/attach-ref.js
/**
* Creates a Svelte Attachment that attaches a DOM element to a ref.
* The ref can be either a WritableBox or a callback function.
*
* @param ref - Either a WritableBox to store the element in, or a callback function that receives the element
* @param onChange - Optional callback that fires when the ref changes
* @returns An object with a spreadable attachment key that should be spread onto the element
*
* @example
* // Using with WritableBox
* const ref = box<HTMLDivElement | null>(null);
* <div {...attachRef(ref)}>Content</div>
*
* @example
* // Using with callback
* <div {...attachRef((node) => myNode = node)}>Content</div>
*
* @example
* // Using with onChange
* <div {...attachRef(ref, (node) => console.log(node))}>Content</div>
*/
function attachRef(ref, onChange) {
	return { [createAttachmentKey()]: (node) => {
		if (isBox(ref)) {
			ref.current = node;
			run(() => onChange?.(node));
			return () => {
				if ("isConnected" in node && node.isConnected) return;
				ref.current = null;
				onChange?.(null);
			};
		}
		ref(node);
		run(() => onChange?.(node));
		return () => {
			if ("isConnected" in node && node.isConnected) return;
			ref(null);
			onChange?.(null);
		};
	} };
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/internal/attrs.js
function boolToStr(condition) {
	return condition ? "true" : "false";
}
function boolToStrTrueOrUndef(condition) {
	return condition ? "true" : void 0;
}
function boolToEmptyStrOrUndef(condition) {
	return condition ? "" : void 0;
}
function boolToTrueOrUndef(condition) {
	return condition ? true : void 0;
}
function getDataOpenClosed(condition) {
	return condition ? "open" : "closed";
}
function getDataTransitionAttrs(state) {
	if (state === "starting") return { "data-starting-style": "" };
	if (state === "ending") return { "data-ending-style": "" };
	return {};
}
function getAriaChecked(checked, indeterminate) {
	if (indeterminate) return "mixed";
	return checked ? "true" : "false";
}
var BitsAttrs = class {
	#variant;
	#prefix;
	attrs;
	constructor(config) {
		this.#variant = config.getVariant ? config.getVariant() : null;
		this.#prefix = this.#variant ? `data-${this.#variant}-` : `data-${config.component}-`;
		this.getAttr = this.getAttr.bind(this);
		this.selector = this.selector.bind(this);
		this.attrs = Object.fromEntries(config.parts.map((part) => [part, this.getAttr(part)]));
	}
	getAttr(part, variantOverride) {
		if (variantOverride) return `data-${variantOverride}-${part}`;
		return `${this.#prefix}${part}`;
	}
	selector(part, variantOverride) {
		return `[${this.getAttr(part, variantOverride)}]`;
	}
};
function createBitsAttrs(config) {
	const bitsAttrs = new BitsAttrs(config);
	return {
		...bitsAttrs.attrs,
		selector: bitsAttrs.selector,
		getAttr: bitsAttrs.getAttr
	};
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/internal/create-id.js
function createId(prefixOrUid, uid) {
	if (uid === void 0) return `bits-${prefixOrUid}`;
	return `bits-${prefixOrUid}-${uid}`;
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/bits/separator/separator.svelte.js
var separatorAttrs = createBitsAttrs({
	component: "separator",
	parts: ["root"]
});
var SeparatorRootState = class SeparatorRootState {
	static create(opts) {
		return new SeparatorRootState(opts);
	}
	opts;
	attachment;
	constructor(opts) {
		this.opts = opts;
		this.attachment = attachRef(opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: this.opts.decorative.current ? "none" : "separator",
		"aria-orientation": this.opts.orientation.current,
		"aria-hidden": boolToStrTrueOrUndef(this.opts.decorative.current),
		"data-orientation": this.opts.orientation.current,
		[separatorAttrs.root]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/bits/separator/components/separator.svelte
function Separator$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, child, children, decorative = false, orientation = "horizontal", $$slots, $$events, ...restProps } = $$props;
		const rootState = SeparatorRootState.create({
			ref: boxWith(() => ref, (v) => ref = v),
			id: boxWith(() => id),
			decorative: boxWith(() => decorative),
			orientation: boxWith(() => orientation)
		});
		const mergedProps = derived(() => mergeProps(restProps, rootState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region src/lib/components/ui/separator/separator.svelte
function Separator($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, "data-slot": dataSlot = "separator", $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Separator$1) {
				$$renderer.push("<!--[-->");
				Separator$1($$renderer, spread_props([
					{
						"data-slot": dataSlot,
						class: cn("shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px", "data-[orientation=vertical]:h-full", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						}
					}
				]));
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/button/button.svelte
var buttonVariants = tv({
	base: "focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 rounded-md border border-transparent bg-clip-padding text-xs/relaxed font-medium focus-visible:ring-2 active:not-aria-[haspopup]:translate-y-px aria-invalid:ring-2 [&_svg:not([class*='size-'])]:size-4 group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/80",
			outline: "border-border dark:bg-input/30 hover:bg-input/50 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
			ghost: "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground",
			destructive: "bg-destructive/10 hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/20 text-destructive focus-visible:border-destructive/40 dark:hover:bg-destructive/30",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-7 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
			xs: "h-5 gap-1 rounded-sm px-2 text-[0.625rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-2.5",
			sm: "h-6 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
			lg: "h-8 gap-1 px-2.5 text-xs/relaxed has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4",
			icon: "size-7 [&_svg:not([class*='size-'])]:size-3.5",
			"icon-xs": "size-5 rounded-sm [&_svg:not([class*='size-'])]:size-2.5",
			"icon-sm": "size-6 [&_svg:not([class*='size-'])]:size-3",
			"icon-lg": "size-8 [&_svg:not([class*='size-'])]:size-4"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { class: className, variant = "default", size = "default", ref = null, href = void 0, type = "button", disabled, children, $$slots, $$events, ...restProps } = $$props;
		if (href) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<a${attributes({
				"data-slot": "button",
				class: clsx$1(cn(buttonVariants({
					variant,
					size
				}), className)),
				href: disabled ? void 0 : href,
				"aria-disabled": disabled,
				role: disabled ? "link" : void 0,
				tabindex: disabled ? -1 : void 0,
				...restProps
			})}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></a>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<button${attributes({
				"data-slot": "button",
				class: clsx$1(cn(buttonVariants({
					variant,
					size
				}), className)),
				type,
				disabled,
				...restProps
			})}>`);
			children?.($$renderer);
			$$renderer.push(`<!----></button>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/Sidebar.svelte
function Sidebar($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M216,36H40A20,20,0,0,0,20,56V200a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V56A20,20,0,0,0,216,36ZM44,104H72v20H44ZM72,60V80H44V60ZM44,148H72v48H44Zm168,48H96V60H212Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M88,48V208H40a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8Z" opacity="0.2"></path><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,152H56a8,8,0,0,0,0-16H40V120H56a8,8,0,0,0,0-16H40V88H56a8,8,0,0,0,0-16H40V56H80V200H40Zm176,48H96V56H216V200Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM64,152H48a8,8,0,0,1,0-16H64a8,8,0,0,1,0,16Zm0-32H48a8,8,0,0,1,0-16H64a8,8,0,0,1,0,16Zm0-32H48a8,8,0,0,1,0-16H64a8,8,0,0,1,0,16ZM216,200H88V56H216V200Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M216,42H40A14,14,0,0,0,26,56V200a14,14,0,0,0,14,14H216a14,14,0,0,0,14-14V56A14,14,0,0,0,216,42ZM38,200V150H56a6,6,0,0,0,0-12H38V118H56a6,6,0,0,0,0-12H38V86H56a6,6,0,0,0,0-12H38V56a2,2,0,0,1,2-2H82V202H40A2,2,0,0,1,38,200Zm180,0a2,2,0,0,1-2,2H94V54H216a2,2,0,0,1,2,2Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,152H56a8,8,0,0,0,0-16H40V120H56a8,8,0,0,0,0-16H40V88H56a8,8,0,0,0,0-16H40V56H80V200H40Zm176,48H96V56H216V200Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M216,44H40A12,12,0,0,0,28,56V200a12,12,0,0,0,12,12H216a12,12,0,0,0,12-12V56A12,12,0,0,0,216,44ZM36,200V148H56a4,4,0,0,0,0-8H36V116H56a4,4,0,0,0,0-8H36V84H56a4,4,0,0,0,0-8H36V56a4,4,0,0,1,4-4H84V204H40A4,4,0,0,1,36,200Zm184,0a4,4,0,0,1-4,4H92V52H216a4,4,0,0,1,4,4Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/X.svelte
function X($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z" opacity="0.2"></path><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM181.66,170.34a8,8,0,0,1-11.32,11.32L128,139.31,85.66,181.66a8,8,0,0,1-11.32-11.32L116.69,128,74.34,85.66A8,8,0,0,1,85.66,74.34L128,116.69l42.34-42.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M204.24,195.76a6,6,0,1,1-8.48,8.48L128,136.49,60.24,204.24a6,6,0,0,1-8.48-8.48L119.51,128,51.76,60.24a6,6,0,0,1,8.48-8.48L128,119.51l67.76-67.75a6,6,0,0,1,8.48,8.48L136.49,128Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M202.83,197.17a4,4,0,0,1-5.66,5.66L128,133.66,58.83,202.83a4,4,0,0,1-5.66-5.66L122.34,128,53.17,58.83a4,4,0,0,1,5.66-5.66L128,122.34l69.17-69.17a4,4,0,1,1,5.66,5.66L133.66,128Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/ArchiveIcon.svelte
function ArchiveIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M224,44H32A20,20,0,0,0,12,64V88a20,20,0,0,0,16,19.6V192a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V107.6A20,20,0,0,0,244,88V64A20,20,0,0,0,224,44ZM36,68H220V84H36ZM52,188V108H204v80Zm112-52a12,12,0,0,1-12,12H104a12,12,0,0,1,0-24h48A12,12,0,0,1,164,136Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M216,96v96a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V96Z" opacity="0.2"></path><path d="M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM208,192H48V104H208ZM224,88H32V64H224V88ZM96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48Zm-72,96H104a8,8,0,0,1,0-16h48a8,8,0,0,1,0,16Zm72-56H32V64H224V88Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M224,50H32A14,14,0,0,0,18,64V88a14,14,0,0,0,14,14h2v90a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V102h2a14,14,0,0,0,14-14V64A14,14,0,0,0,224,50ZM210,192a2,2,0,0,1-2,2H48a2,2,0,0,1-2-2V102H210ZM226,88a2,2,0,0,1-2,2H32a2,2,0,0,1-2-2V64a2,2,0,0,1,2-2H224a2,2,0,0,1,2,2ZM98,136a6,6,0,0,1,6-6h48a6,6,0,0,1,0,12H104A6,6,0,0,1,98,136Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM208,192H48V104H208ZM224,88H32V64H224V88ZM96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M224,52H32A12,12,0,0,0,20,64V88a12,12,0,0,0,12,12h4v92a12,12,0,0,0,12,12H208a12,12,0,0,0,12-12V100h4a12,12,0,0,0,12-12V64A12,12,0,0,0,224,52ZM212,192a4,4,0,0,1-4,4H48a4,4,0,0,1-4-4V100H212ZM228,88a4,4,0,0,1-4,4H32a4,4,0,0,1-4-4V64a4,4,0,0,1,4-4H224a4,4,0,0,1,4,4ZM100,136a4,4,0,0,1,4-4h48a4,4,0,0,1,0,8H104A4,4,0,0,1,100,136Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/CalendarIcon.svelte
function CalendarIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M208,28H188V24a12,12,0,0,0-24,0v4H92V24a12,12,0,0,0-24,0v4H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28ZM68,52a12,12,0,0,0,24,0h72a12,12,0,0,0,24,0h16V76H52V52ZM52,204V100H204V204Zm60-80v56a12,12,0,0,1-24,0V143.32a12,12,0,0,1-9.37-22l16-8A12,12,0,0,1,112,124Zm61.49,33.88L163.9,168H168a12,12,0,0,1,0,24H136a12,12,0,0,1-8.71-20.25L155.45,142a4,4,0,0,0,.55-2,4,4,0,0,0-7.47-2,12,12,0,0,1-20.78-12A28,28,0,0,1,180,140a27.77,27.77,0,0,1-5.64,16.86A10.63,10.63,0,0,1,173.49,157.88Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M216,48V88H40V48a8,8,0,0,1,8-8H208A8,8,0,0,1,216,48Z" opacity="0.2"></path><path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-96-88v64a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm59.16,30.45L152,176h16a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136,23.76,23.76,0,0,1,171.16,150.45Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM112,184a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm56-8a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136a23.76,23.76,0,0,1-4.84,14.45L152,176ZM48,80V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M208,34H182V24a6,6,0,0,0-12,0V34H86V24a6,6,0,0,0-12,0V34H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V48A14,14,0,0,0,208,34ZM48,46H74V56a6,6,0,0,0,12,0V46h84V56a6,6,0,0,0,12,0V46h26a2,2,0,0,1,2,2V82H46V48A2,2,0,0,1,48,46ZM208,210H48a2,2,0,0,1-2-2V94H210V208A2,2,0,0,1,208,210Zm-98-90v64a6,6,0,0,1-12,0V129.71l-7.32,3.66a6,6,0,1,1-5.36-10.74l16-8A6,6,0,0,1,110,120Zm59.57,29.25L148,178h20a6,6,0,0,1,0,12H136a6,6,0,0,1-4.8-9.6L160,142a10,10,0,1,0-16.65-11A6,6,0,1,1,133,125a22,22,0,1,1,36.62,24.26Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-96-88v64a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm59.16,30.45L152,176h16a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136,23.76,23.76,0,0,1,171.16,150.45Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M208,36H180V24a4,4,0,0,0-8,0V36H84V24a4,4,0,0,0-8,0V36H48A12,12,0,0,0,36,48V208a12,12,0,0,0,12,12H208a12,12,0,0,0,12-12V48A12,12,0,0,0,208,36ZM48,44H76V56a4,4,0,0,0,8,0V44h88V56a4,4,0,0,0,8,0V44h28a4,4,0,0,1,4,4V84H44V48A4,4,0,0,1,48,44ZM208,212H48a4,4,0,0,1-4-4V92H212V208A4,4,0,0,1,208,212ZM108,120v64a4,4,0,0,1-8,0V126.47l-10.21,5.11a4,4,0,0,1-3.58-7.16l16-8A4,4,0,0,1,108,120Zm60,28-24,32h24a4,4,0,0,1,0,8H136a4,4,0,0,1-3.2-6.4l28.78-38.37A11.88,11.88,0,0,0,164,136a12,12,0,0,0-22.4-6,4,4,0,0,1-6.92-4A20,20,0,0,1,172,136,19.79,19.79,0,0,1,168,148Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/CaretDoubleLeftIcon.svelte
function CaretDoubleLeftIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M208.49,199.51a12,12,0,0,1-17,17l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,0,1,17,17L137,128ZM57,128l71.52-71.51a12,12,0,0,0-17-17l-80,80a12,12,0,0,0,0,17l80,80a12,12,0,0,0,17-17Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M200,48V208l-80-80Z" opacity="0.2"></path><path d="M203.06,40.61a8,8,0,0,0-8.72,1.73l-80,80a8,8,0,0,0,0,11.32l80,80A8,8,0,0,0,208,208V48A8,8,0,0,0,203.06,40.61ZM192,188.69,131.31,128,192,67.31Zm-66.34,13.65a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L51.31,128Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M208,48V208a8,8,0,0,1-13.66,5.66L128,147.31V208a8,8,0,0,1-13.66,5.66l-80-80a8,8,0,0,1,0-11.32l80-80A8,8,0,0,1,128,48v60.69l66.34-66.35A8,8,0,0,1,208,48Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M204.24,203.76a6,6,0,1,1-8.48,8.48l-80-80a6,6,0,0,1,0-8.48l80-80a6,6,0,0,1,8.48,8.48L128.49,128ZM48.49,128l75.75-75.76a6,6,0,0,0-8.48-8.48l-80,80a6,6,0,0,0,0,8.48l80,80a6,6,0,1,0,8.48-8.48Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M205.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L131.31,128ZM51.31,128l74.35-74.34a8,8,0,0,0-11.32-11.32l-80,80a8,8,0,0,0,0,11.32l80,80a8,8,0,0,0,11.32-11.32Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M202.83,205.17a4,4,0,0,1-5.66,5.66l-80-80a4,4,0,0,1,0-5.66l80-80a4,4,0,1,1,5.66,5.66L125.66,128ZM45.66,128l77.17-77.17a4,4,0,0,0-5.66-5.66l-80,80a4,4,0,0,0,0,5.66l80,80a4,4,0,1,0,5.66-5.66Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/CaretDoubleRightIcon.svelte
function CaretDoubleRightIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M144.49,136.49l-80,80a12,12,0,0,1-17-17L119,128,47.51,56.49a12,12,0,0,1,17-17l80,80A12,12,0,0,1,144.49,136.49Zm80-17-80-80a12,12,0,1,0-17,17L199,128l-71.52,71.51a12,12,0,0,0,17,17l80-80A12,12,0,0,0,224.49,119.51Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M136,128,56,208V48Z" opacity="0.2"></path><path d="M141.66,122.34l-80-80A8,8,0,0,0,48,48V208a8,8,0,0,0,13.66,5.66l80-80A8,8,0,0,0,141.66,122.34ZM64,188.69V67.31L124.69,128Zm157.66-55-80,80a8,8,0,0,1-11.32-11.32L204.69,128,130.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,221.66,133.66Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M221.66,133.66l-80,80A8,8,0,0,1,128,208V147.31L61.66,213.66A8,8,0,0,1,48,208V48a8,8,0,0,1,13.66-5.66L128,108.69V48a8,8,0,0,1,13.66-5.66l80,80A8,8,0,0,1,221.66,133.66Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M140.24,132.24l-80,80a6,6,0,0,1-8.48-8.48L127.51,128,51.76,52.24a6,6,0,0,1,8.48-8.48l80,80A6,6,0,0,1,140.24,132.24Zm80-8.48-80-80a6,6,0,0,0-8.48,8.48L207.51,128l-75.75,75.76a6,6,0,1,0,8.48,8.48l80-80A6,6,0,0,0,220.24,123.76Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M141.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L124.69,128,50.34,53.66A8,8,0,0,1,61.66,42.34l80,80A8,8,0,0,1,141.66,133.66Zm80-11.32-80-80a8,8,0,0,0-11.32,11.32L204.69,128l-74.35,74.34a8,8,0,0,0,11.32,11.32l80-80A8,8,0,0,0,221.66,122.34Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M138.83,130.83l-80,80a4,4,0,0,1-5.66-5.66L130.34,128,53.17,50.83a4,4,0,0,1,5.66-5.66l80,80A4,4,0,0,1,138.83,130.83Zm80-5.66-80-80a4,4,0,0,0-5.66,5.66L210.34,128l-77.17,77.17a4,4,0,0,0,5.66,5.66l80-80A4,4,0,0,0,218.83,125.17Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/CaretDown.svelte
function CaretDown($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M208,96l-80,80L48,96Z" opacity="0.2"></path><path d="M215.39,92.94A8,8,0,0,0,208,88H48a8,8,0,0,0-5.66,13.66l80,80a8,8,0,0,0,11.32,0l80-80A8,8,0,0,0,215.39,92.94ZM128,164.69,67.31,104H188.69Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,48,88H208a8,8,0,0,1,5.66,13.66Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M212.24,100.24l-80,80a6,6,0,0,1-8.48,0l-80-80a6,6,0,0,1,8.48-8.48L128,167.51l75.76-75.75a6,6,0,0,1,8.48,8.48Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M210.83,98.83l-80,80a4,4,0,0,1-5.66,0l-80-80a4,4,0,0,1,5.66-5.66L128,170.34l77.17-77.17a4,4,0,1,1,5.66,5.66Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/CaretLeftIcon.svelte
function CaretLeftIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M168.49,199.51a12,12,0,0,1-17,17l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,0,1,17,17L97,128Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M160,48V208L80,128Z" opacity="0.2"></path><path d="M163.06,40.61a8,8,0,0,0-8.72,1.73l-80,80a8,8,0,0,0,0,11.32l80,80A8,8,0,0,0,168,208V48A8,8,0,0,0,163.06,40.61ZM152,188.69,91.31,128,152,67.31Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M168,48V208a8,8,0,0,1-13.66,5.66l-80-80a8,8,0,0,1,0-11.32l80-80A8,8,0,0,1,168,48Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M164.24,203.76a6,6,0,1,1-8.48,8.48l-80-80a6,6,0,0,1,0-8.48l80-80a6,6,0,0,1,8.48,8.48L88.49,128Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M162.83,205.17a4,4,0,0,1-5.66,5.66l-80-80a4,4,0,0,1,0-5.66l80-80a4,4,0,1,1,5.66,5.66L85.66,128Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/CaretRightIcon.svelte
function CaretRightIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M176,128,96,208V48Z" opacity="0.2"></path><path d="M181.66,122.34l-80-80A8,8,0,0,0,88,48V208a8,8,0,0,0,13.66,5.66l80-80A8,8,0,0,0,181.66,122.34ZM104,188.69V67.31L164.69,128Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M181.66,133.66l-80,80A8,8,0,0,1,88,208V48a8,8,0,0,1,13.66-5.66l80,80A8,8,0,0,1,181.66,133.66Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M180.24,132.24l-80,80a6,6,0,0,1-8.48-8.48L167.51,128,91.76,52.24a6,6,0,0,1,8.48-8.48l80,80A6,6,0,0,1,180.24,132.24Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M178.83,130.83l-80,80a4,4,0,0,1-5.66-5.66L170.34,128,93.17,50.83a4,4,0,0,1,5.66-5.66l80,80A4,4,0,0,1,178.83,130.83Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/CaretRight.svelte
function CaretRight($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M176,128,96,208V48Z" opacity="0.2"></path><path d="M181.66,122.34l-80-80A8,8,0,0,0,88,48V208a8,8,0,0,0,13.66,5.66l80-80A8,8,0,0,0,181.66,122.34ZM104,188.69V67.31L164.69,128Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M181.66,133.66l-80,80A8,8,0,0,1,88,208V48a8,8,0,0,1,13.66-5.66l80,80A8,8,0,0,1,181.66,133.66Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M180.24,132.24l-80,80a6,6,0,0,1-8.48-8.48L167.51,128,91.76,52.24a6,6,0,0,1,8.48-8.48l80,80A6,6,0,0,1,180.24,132.24Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M178.83,130.83l-80,80a4,4,0,0,1-5.66-5.66L170.34,128,93.17,50.83a4,4,0,0,1,5.66-5.66l80,80A4,4,0,0,1,178.83,130.83Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/CaretUpDownIcon.svelte
function CaretUpDownIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M184.49,167.51a12,12,0,0,1,0,17l-48,48a12,12,0,0,1-17,0l-48-48a12,12,0,0,1,17-17L128,207l39.51-39.52A12,12,0,0,1,184.49,167.51Zm-96-79L128,49l39.51,39.52a12,12,0,0,0,17-17l-48-48a12,12,0,0,0-17,0l-48,48a12,12,0,0,0,17,17Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M80,176h96l-48,48ZM128,32,80,80h96Z" opacity="0.2"></path><path d="M176,168H80a8,8,0,0,0-5.66,13.66l48,48a8,8,0,0,0,11.32,0l48-48A8,8,0,0,0,176,168Zm-48,44.69L99.31,184h57.38ZM80,88h96a8,8,0,0,0,5.66-13.66l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,80,88Zm48-44.69L156.69,72H99.31Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M72.61,83.06a8,8,0,0,1,1.73-8.72l48-48a8,8,0,0,1,11.32,0l48,48A8,8,0,0,1,176,88H80A8,8,0,0,1,72.61,83.06ZM176,168H80a8,8,0,0,0-5.66,13.66l48,48a8,8,0,0,0,11.32,0l48-48A8,8,0,0,0,176,168Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M180.24,171.76a6,6,0,0,1,0,8.48l-48,48a6,6,0,0,1-8.48,0l-48-48a6,6,0,0,1,8.48-8.48L128,215.51l43.76-43.75A6,6,0,0,1,180.24,171.76Zm-96-87.52L128,40.49l43.76,43.75a6,6,0,0,0,8.48-8.48l-48-48a6,6,0,0,0-8.48,0l-48,48a6,6,0,0,0,8.48,8.48Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M178.83,173.17a4,4,0,0,1,0,5.66l-48,48a4,4,0,0,1-5.66,0l-48-48a4,4,0,0,1,5.66-5.66L128,218.34l45.17-45.17A4,4,0,0,1,178.83,173.17Zm-96-90.34L128,37.66l45.17,45.17a4,4,0,1,0,5.66-5.66l-48-48a4,4,0,0,0-5.66,0l-48,48a4,4,0,0,0,5.66,5.66Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/CaretUp.svelte
function CaretUp($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M216.49,168.49a12,12,0,0,1-17,0L128,97,56.49,168.49a12,12,0,0,1-17-17l80-80a12,12,0,0,1,17,0l80,80A12,12,0,0,1,216.49,168.49Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M208,160H48l80-80Z" opacity="0.2"></path><path d="M213.66,154.34l-80-80a8,8,0,0,0-11.32,0l-80,80A8,8,0,0,0,48,168H208a8,8,0,0,0,5.66-13.66ZM67.31,152,128,91.31,188.69,152Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M215.39,163.06A8,8,0,0,1,208,168H48a8,8,0,0,1-5.66-13.66l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,215.39,163.06Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M212.24,164.24a6,6,0,0,1-8.48,0L128,88.49,52.24,164.24a6,6,0,0,1-8.48-8.48l80-80a6,6,0,0,1,8.48,0l80,80A6,6,0,0,1,212.24,164.24Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M213.66,165.66a8,8,0,0,1-11.32,0L128,91.31,53.66,165.66a8,8,0,0,1-11.32-11.32l80-80a8,8,0,0,1,11.32,0l80,80A8,8,0,0,1,213.66,165.66Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M210.83,162.83a4,4,0,0,1-5.66,0L128,85.66,50.83,162.83a4,4,0,0,1-5.66-5.66l80-80a4,4,0,0,1,5.66,0l80,80A4,4,0,0,1,210.83,162.83Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/ChartPieIcon.svelte
function ChartPieIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm12,24.87A84,84,0,0,1,194,76.07L140,107.22ZM50,159.17a83.94,83.94,0,0,1,66-114.3v76.2ZM128,212a83.88,83.88,0,0,1-65.95-32.07L206,96.83A84,84,0,0,1,128,212Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M128,32v96L44.86,176h0A96,96,0,0,1,128,32Z" opacity="0.2"></path><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm71.87,53.27L136,114.14V40.37A88,88,0,0,1,199.87,77.27ZM120,40.37v83l-71.89,41.5A88,88,0,0,1,120,40.37ZM128,216a88,88,0,0,1-71.87-37.27L207.89,91.12A88,88,0,0,1,128,216Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,16a88,88,0,0,1,71.87,37.27L128,118.76Zm0,176a88,88,0,0,1-71.87-37.27L207.89,91.12A88,88,0,0,1,128,216Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm74.74,51.92L134,117.61V38.2A90,90,0,0,1,202.74,77.92ZM122,38.2v86.34L47.24,167.7A90,90,0,0,1,122,38.2ZM128,218a90,90,0,0,1-74.74-39.92L208.76,88.3A90,90,0,0,1,128,218Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm71.87,53.27L136,114.14V40.37A88,88,0,0,1,199.87,77.27ZM120,40.37v83l-71.89,41.5A88,88,0,0,1,120,40.37ZM128,216a88,88,0,0,1-71.87-37.27L207.89,91.12A88,88,0,0,1,128,216Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28Zm77.58,50.59L132,121.07v-85A92.07,92.07,0,0,1,205.58,78.59ZM124,36.09v89.6L46.42,170.48A92,92,0,0,1,124,36.09ZM128,220a92,92,0,0,1-77.58-42.59L209.58,85.52A92,92,0,0,1,128,220Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/CheckCircleIcon.svelte
function CheckCircleIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M176.49,95.51a12,12,0,0,1,0,17l-56,56a12,12,0,0,1-17,0l-24-24a12,12,0,1,1,17-17L112,143l47.51-47.52A12,12,0,0,1,176.49,95.51ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path><path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M172.24,99.76a6,6,0,0,1,0,8.48l-56,56a6,6,0,0,1-8.48,0l-24-24a6,6,0,0,1,8.48-8.48L112,151.51l51.76-51.75A6,6,0,0,1,172.24,99.76ZM230,128A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90,90,0,1,0-90,90A90.1,90.1,0,0,0,218,128Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M170.83,101.17a4,4,0,0,1,0,5.66l-56,56a4,4,0,0,1-5.66,0l-24-24a4,4,0,0,1,5.66-5.66L112,154.34l53.17-53.17A4,4,0,0,1,170.83,101.17ZM228,128A100,100,0,1,1,128,28,100.11,100.11,0,0,1,228,128Zm-8,0a92,92,0,1,0-92,92A92.1,92.1,0,0,0,220,128Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/CheckIcon.svelte
function CheckIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M232,56V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56Z" opacity="0.2"></path><path d="M205.66,85.66l-96,96a8,8,0,0,1-11.32,0l-40-40a8,8,0,0,1,11.32-11.32L104,164.69l90.34-90.35a8,8,0,0,1,11.32,11.32Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM205.66,85.66l-96,96a8,8,0,0,1-11.32,0l-40-40a8,8,0,0,1,11.32-11.32L104,164.69l90.34-90.35a8,8,0,0,1,11.32,11.32Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M228.24,76.24l-128,128a6,6,0,0,1-8.48,0l-56-56a6,6,0,0,1,8.48-8.48L96,191.51,219.76,67.76a6,6,0,0,1,8.48,8.48Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M226.83,74.83l-128,128a4,4,0,0,1-5.66,0l-56-56a4,4,0,0,1,5.66-5.66L96,194.34,221.17,69.17a4,4,0,1,1,5.66,5.66Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/Check.svelte
function Check($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M232,56V200a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56Z" opacity="0.2"></path><path d="M205.66,85.66l-96,96a8,8,0,0,1-11.32,0l-40-40a8,8,0,0,1,11.32-11.32L104,164.69l90.34-90.35a8,8,0,0,1,11.32,11.32Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM205.66,85.66l-96,96a8,8,0,0,1-11.32,0l-40-40a8,8,0,0,1,11.32-11.32L104,164.69l90.34-90.35a8,8,0,0,1,11.32,11.32Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M228.24,76.24l-128,128a6,6,0,0,1-8.48,0l-56-56a6,6,0,0,1,8.48-8.48L96,191.51,219.76,67.76a6,6,0,0,1,8.48,8.48Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M226.83,74.83l-128,128a4,4,0,0,1-5.66,0l-56-56a4,4,0,0,1,5.66-5.66L96,194.34,221.17,69.17a4,4,0,1,1,5.66,5.66Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/CircleIcon.svelte
function CircleIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M232,128A104,104,0,1,1,128,24,104.13,104.13,0,0,1,232,128Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm0,192a90,90,0,1,1,90-90A90.1,90.1,0,0,1,128,218Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.1,92.1,0,0,1,128,220Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/ClockClockwiseIcon.svelte
function ClockClockwiseIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M140,80v41.21l34.17,20.5a12,12,0,1,1-12.34,20.58l-40-24A12,12,0,0,1,116,128V80a12,12,0,0,1,24,0Zm84-28a12,12,0,0,0-12,12v7.37c-4.21-4.67-8.58-9.31-13.29-14.08a100,100,0,1,0-2.07,143.44,12,12,0,0,0-16.48-17.46,76,76,0,1,1,1.53-109.06C187.61,80.2,193,86,198.23,92H184a12,12,0,0,0,0,24h40a12,12,0,0,0,12-12V64A12,12,0,0,0,224,52Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M216,128a88,88,0,1,1-88-88A88,88,0,0,1,216,128Z" opacity="0.2"></path><path d="M136,80v43.47l36.12,21.67a8,8,0,0,1-8.24,13.72l-40-24A8,8,0,0,1,120,128V80a8,8,0,0,1,16,0Zm88-24a8,8,0,0,0-8,8V82c-6.35-7.36-12.83-14.45-20.12-21.83a96,96,0,1,0-2,137.7,8,8,0,0,0-11-11.64A80,80,0,1,1,184.54,71.4C192.68,79.64,199.81,87.58,207,96H184a8,8,0,0,0,0,16h40a8,8,0,0,0,8-8V64A8,8,0,0,0,224,56Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M136,80v43.47l36.12,21.67a8,8,0,0,1-8.24,13.72l-40-24A8,8,0,0,1,120,128V80a8,8,0,0,1,16,0Zm91.06-23.39a8,8,0,0,0-8.72,1.73L206,70.71c-3.23-3.51-6.56-7-10.1-10.59a96,96,0,1,0-2,137.7,8,8,0,0,0-11-11.64A80,80,0,1,1,184.54,71.4c3.54,3.58,6.87,7.1,10.11,10.63L178.34,98.34A8,8,0,0,0,184,112h40a8,8,0,0,0,8-8V64A8,8,0,0,0,227.06,56.61Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M134,80v44.6l37.09,22.25a6,6,0,0,1-6.18,10.3l-40-24A6,6,0,0,1,122,128V80a6,6,0,0,1,12,0Zm90-22a6,6,0,0,0-6,6V87.36c-7.48-8.83-14.94-17.13-23.53-25.83a94,94,0,1,0-1.95,134.83,6,6,0,0,0-8.24-8.72A82,82,0,1,1,186,70c9.24,9.36,17.18,18.3,25.31,28H184a6,6,0,0,0,0,12h40a6,6,0,0,0,6-6V64A6,6,0,0,0,224,58Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M136,80v43.47l36.12,21.67a8,8,0,0,1-8.24,13.72l-40-24A8,8,0,0,1,120,128V80a8,8,0,0,1,16,0Zm88-24a8,8,0,0,0-8,8V82c-6.35-7.36-12.83-14.45-20.12-21.83a96,96,0,1,0-2,137.7,8,8,0,0,0-11-11.64A80,80,0,1,1,184.54,71.4C192.68,79.64,199.81,87.58,207,96H184a8,8,0,0,0,0,16h40a8,8,0,0,0,8-8V64A8,8,0,0,0,224,56Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M132,80v45.74l38.06,22.83a4,4,0,0,1-4.12,6.86l-40-24A4,4,0,0,1,124,128V80a4,4,0,0,1,8,0Zm92-20a4,4,0,0,0-4,4V92.85C211.33,82.46,203,73,193.05,63a92,92,0,1,0-1.9,132,4,4,0,0,0-5.5-5.82,84,84,0,1,1,1.73-120.5C197.7,79,206.39,89,215.53,100H184a4,4,0,0,0,0,8h40a4,4,0,0,0,4-4V64A4,4,0,0,0,224,60Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/ClockIcon.svelte
function ClockIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm68-84a12,12,0,0,1-12,12H128a12,12,0,0,1-12-12V72a12,12,0,0,1,24,0v44h44A12,12,0,0,1,196,128Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm56,112H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm0,192a90,90,0,1,1,90-90A90.1,90.1,0,0,1,128,218Zm62-90a6,6,0,0,1-6,6H128a6,6,0,0,1-6-6V72a6,6,0,0,1,12,0v50h50A6,6,0,0,1,190,128Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.1,92.1,0,0,1,128,220Zm60-92a4,4,0,0,1-4,4H128a4,4,0,0,1-4-4V72a4,4,0,0,1,8,0v52h52A4,4,0,0,1,188,128Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/CloudArrowDownIcon.svelte
function CloudArrowDownIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M192.49,167.51a12,12,0,0,1,0,17l-32,32a12,12,0,0,1-17,0l-32-32a12,12,0,1,1,17-17L140,179V128a12,12,0,0,1,24,0v51l11.51-11.52A12,12,0,0,1,192.49,167.51ZM160,36A92.08,92.08,0,0,0,79,84.37,68,68,0,1,0,72,220H84a12,12,0,0,0,0-24H72a44,44,0,0,1-1.81-87.95A91.7,91.7,0,0,0,68,128a12,12,0,0,0,24,0,68,68,0,0,1,136,0,67.27,67.27,0,0,1-7.25,30.59,12,12,0,1,0,21.42,10.82A91.08,91.08,0,0,0,252,128,92.1,92.1,0,0,0,160,36Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M240,128a80,80,0,0,1-80,80H72A56,56,0,1,1,85.92,97.74l0,.1A80,80,0,0,1,240,128Z" opacity="0.2"></path><path d="M248,128a87.34,87.34,0,0,1-17.6,52.81,8,8,0,1,1-12.8-9.62A71.34,71.34,0,0,0,232,128a72,72,0,0,0-144,0,8,8,0,0,1-16,0,88,88,0,0,1,3.29-23.88C74.2,104,73.1,104,72,104a48,48,0,0,0,0,96H96a8,8,0,0,1,0,16H72A64,64,0,1,1,81.29,88.68,88,88,0,0,1,248,128Zm-69.66,42.34L160,188.69V128a8,8,0,0,0-16,0v60.69l-18.34-18.35a8,8,0,0,0-11.32,11.32l32,32a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M247.93,124.52C246.11,77.54,207.07,40,160.06,40A88.1,88.1,0,0,0,81.29,88.67h0A87.48,87.48,0,0,0,72,127.73,8.18,8.18,0,0,1,64.57,136,8,8,0,0,1,56,128a103.66,103.66,0,0,1,5.34-32.92,4,4,0,0,0-4.75-5.18A64.09,64.09,0,0,0,8,152c0,35.19,29.75,64,65,64H160A88.09,88.09,0,0,0,247.93,124.52Zm-50.27,25.14-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L152,156.69V96a8,8,0,0,1,16,0v60.69l18.34-18.35a8,8,0,0,1,11.32,11.32Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M246,128a85.27,85.27,0,0,1-17.2,51.6,6,6,0,1,1-9.6-7.2A74,74,0,1,0,86,128a6,6,0,0,1-12,0,85.54,85.54,0,0,1,3.91-25.64A50.68,50.68,0,0,0,72,102a50,50,0,0,0,0,100H96a6,6,0,0,1,0,12H72A62,62,0,1,1,82.43,90.88,86,86,0,0,1,246,128Zm-66.24,43.76L158,193.51V128a6,6,0,0,0-12,0v65.51l-21.76-21.75a6,6,0,0,0-8.48,8.48l32,32a6,6,0,0,0,8.48,0l32-32a6,6,0,0,0-8.48-8.48Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M248,128a87.34,87.34,0,0,1-17.6,52.81,8,8,0,1,1-12.8-9.62A71.34,71.34,0,0,0,232,128a72,72,0,0,0-144,0,8,8,0,0,1-16,0,88,88,0,0,1,3.29-23.88C74.2,104,73.1,104,72,104a48,48,0,0,0,0,96H96a8,8,0,0,1,0,16H72A64,64,0,1,1,81.29,88.68,88,88,0,0,1,248,128Zm-69.66,42.34L160,188.69V128a8,8,0,0,0-16,0v60.69l-18.34-18.35a8,8,0,0,0-11.32,11.32l32,32a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M244,128a83.28,83.28,0,0,1-16.8,50.4,4,4,0,1,1-6.4-4.8A76,76,0,1,0,84,128a4,4,0,0,1-8,0,83.45,83.45,0,0,1,4.57-27.27A52,52,0,1,0,72,204H96a4,4,0,0,1,0,8H72A60,60,0,1,1,83.61,93.13,84,84,0,0,1,244,128Zm-62.83,45.17L156,198.34V128a4,4,0,0,0-8,0v70.34l-25.17-25.17a4,4,0,0,0-5.66,5.66l32,32a4,4,0,0,0,5.66,0l32-32a4,4,0,0,0-5.66-5.66Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/GearSixIcon.svelte
function GearSixIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M128,76a52,52,0,1,0,52,52A52.06,52.06,0,0,0,128,76Zm0,80a28,28,0,1,1,28-28A28,28,0,0,1,128,156Zm113.86-49.57A12,12,0,0,0,236,98.34L208.21,82.49l-.11-31.31a12,12,0,0,0-4.25-9.12,116,116,0,0,0-38-21.41,12,12,0,0,0-9.68.89L128,37.27,99.83,21.53a12,12,0,0,0-9.7-.9,116.06,116.06,0,0,0-38,21.47,12,12,0,0,0-4.24,9.1l-.14,31.34L20,98.35a12,12,0,0,0-5.85,8.11,110.7,110.7,0,0,0,0,43.11A12,12,0,0,0,20,157.66l27.82,15.85.11,31.31a12,12,0,0,0,4.25,9.12,116,116,0,0,0,38,21.41,12,12,0,0,0,9.68-.89L128,218.73l28.14,15.74a12,12,0,0,0,9.7.9,116.06,116.06,0,0,0,38-21.47,12,12,0,0,0,4.24-9.1l.14-31.34,27.81-15.81a12,12,0,0,0,5.85-8.11A110.7,110.7,0,0,0,241.86,106.43Zm-22.63,33.18-26.88,15.28a11.94,11.94,0,0,0-4.55,4.59c-.54,1-1.11,1.93-1.7,2.88a12,12,0,0,0-1.83,6.31L184.13,199a91.83,91.83,0,0,1-21.07,11.87l-27.15-15.19a12,12,0,0,0-5.86-1.53h-.29c-1.14,0-2.3,0-3.44,0a12.08,12.08,0,0,0-6.14,1.51L93,210.82A92.27,92.27,0,0,1,71.88,199l-.11-30.24a12,12,0,0,0-1.83-6.32c-.58-.94-1.16-1.91-1.7-2.88A11.92,11.92,0,0,0,63.7,155L36.8,139.63a86.53,86.53,0,0,1,0-23.24l26.88-15.28a12,12,0,0,0,4.55-4.58c.54-1,1.11-1.94,1.7-2.89a12,12,0,0,0,1.83-6.31L71.87,57A91.83,91.83,0,0,1,92.94,45.17l27.15,15.19a11.92,11.92,0,0,0,6.15,1.52c1.14,0,2.3,0,3.44,0a12.08,12.08,0,0,0,6.14-1.51L163,45.18A92.27,92.27,0,0,1,184.12,57l.11,30.24a12,12,0,0,0,1.83,6.32c.58.94,1.16,1.91,1.7,2.88A11.92,11.92,0,0,0,192.3,101l26.9,15.33A86.53,86.53,0,0,1,219.23,139.61Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M230.1,108.76,198.25,90.62c-.64-1.16-1.31-2.29-2-3.41l-.12-36A104.61,104.61,0,0,0,162,32L130,49.89c-1.34,0-2.69,0-4,0L94,32A104.58,104.58,0,0,0,59.89,51.25l-.16,36c-.7,1.12-1.37,2.26-2,3.41l-31.84,18.1a99.15,99.15,0,0,0,0,38.46l31.85,18.14c.64,1.16,1.31,2.29,2,3.41l.12,36A104.61,104.61,0,0,0,94,224l32-17.87c1.34,0,2.69,0,4,0L162,224a104.58,104.58,0,0,0,34.08-19.25l.16-36c.7-1.12,1.37-2.26,2-3.41l31.84-18.1A99.15,99.15,0,0,0,230.1,108.76ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z" opacity="0.2"></path><path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm109.94-52.79a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A111.92,111.92,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.63a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21Zm-15,34.91-28.57,16.25a8,8,0,0,0-3,3c-.58,1-1.19,2.06-1.81,3.06a7.94,7.94,0,0,0-1.22,4.21l-.15,32.25a95.89,95.89,0,0,1-25.37,14.3L134,199.13a8,8,0,0,0-3.91-1h-.19c-1.21,0-2.43,0-3.64,0a8.1,8.1,0,0,0-4.1,1l-28.84,16.1A96,96,0,0,1,67.88,201l-.11-32.2a8,8,0,0,0-1.22-4.22c-.62-1-1.23-2-1.8-3.06a8.09,8.09,0,0,0-3-3.06l-28.6-16.29a90.49,90.49,0,0,1,0-28.26L61.67,97.63a8,8,0,0,0,3-3c.58-1,1.19-2.06,1.81-3.06a7.94,7.94,0,0,0,1.22-4.21l.15-32.25a95.89,95.89,0,0,1,25.37-14.3L122,56.87a8,8,0,0,0,4.1,1c1.21,0,2.43,0,3.64,0a8,8,0,0,0,4.1-1l28.84-16.1A96,96,0,0,1,188.12,55l.11,32.2a8,8,0,0,0,1.22,4.22c.62,1,1.23,2,1.8,3.06a8.09,8.09,0,0,0,3,3.06l28.6,16.29A90.49,90.49,0,0,1,222.9,142.12Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M237.94,107.21a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A111.92,111.92,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.63a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M128,82a46,46,0,1,0,46,46A46.06,46.06,0,0,0,128,82Zm0,80a34,34,0,1,1,34-34A34,34,0,0,1,128,162Zm108-54.4a6,6,0,0,0-2.92-4L202.64,86.22l-.42-.71L202.1,51.2A6,6,0,0,0,200,46.64a110.12,110.12,0,0,0-36.07-20.31,6,6,0,0,0-4.84.45L128.46,43.86h-1L96.91,26.76a6,6,0,0,0-4.86-.44A109.92,109.92,0,0,0,56,46.68a6,6,0,0,0-2.12,4.55l-.16,34.34c-.14.23-.28.47-.41.71L22.91,103.57A6,6,0,0,0,20,107.62a104.81,104.81,0,0,0,0,40.78,6,6,0,0,0,2.92,4l30.42,17.33.42.71.12,34.31A6,6,0,0,0,56,209.36a110.12,110.12,0,0,0,36.07,20.31,6,6,0,0,0,4.84-.45l30.61-17.08h1l30.56,17.1A6.09,6.09,0,0,0,162,230a5.83,5.83,0,0,0,1.93-.32,109.92,109.92,0,0,0,36-20.36,6,6,0,0,0,2.12-4.55l.16-34.34c.14-.23.28-.47.41-.71l30.42-17.29a6,6,0,0,0,2.92-4.05A104.81,104.81,0,0,0,236,107.6Zm-11.25,35.79L195.32,160.1a6.07,6.07,0,0,0-2.28,2.3c-.59,1-1.21,2.11-1.86,3.14a6,6,0,0,0-.91,3.16l-.16,33.21a98.15,98.15,0,0,1-27.52,15.53L133,200.88a6,6,0,0,0-2.93-.77h-.14c-1.24,0-2.5,0-3.74,0a6,6,0,0,0-3.07.76L93.45,217.43a98,98,0,0,1-27.56-15.49l-.12-33.17a6,6,0,0,0-.91-3.16c-.64-1-1.27-2.08-1.86-3.14a6,6,0,0,0-2.27-2.3L31.3,143.4a93,93,0,0,1,0-30.79L60.68,95.9A6.07,6.07,0,0,0,63,93.6c.59-1,1.21-2.11,1.86-3.14a6,6,0,0,0,.91-3.16l.16-33.21A98.15,98.15,0,0,1,93.41,38.56L123,55.12a5.81,5.81,0,0,0,3.07.76c1.24,0,2.5,0,3.74,0a6,6,0,0,0,3.07-.76l29.65-16.56a98,98,0,0,1,27.56,15.49l.12,33.17a6,6,0,0,0,.91,3.16c.64,1,1.27,2.08,1.86,3.14a6,6,0,0,0,2.27,2.3L224.7,112.6A93,93,0,0,1,224.73,143.39Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm109.94-52.79a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A112.1,112.1,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.62a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21Zm-15,34.91-28.57,16.25a8,8,0,0,0-3,3c-.58,1-1.19,2.06-1.81,3.06a7.94,7.94,0,0,0-1.22,4.21l-.15,32.25a95.89,95.89,0,0,1-25.37,14.3L134,199.13a8,8,0,0,0-3.91-1h-.19c-1.21,0-2.43,0-3.64,0a8.08,8.08,0,0,0-4.1,1l-28.84,16.1A96,96,0,0,1,67.88,201l-.11-32.2a8,8,0,0,0-1.22-4.22c-.62-1-1.23-2-1.8-3.06a8.09,8.09,0,0,0-3-3.06l-28.6-16.29a90.49,90.49,0,0,1,0-28.26L61.67,97.63a8,8,0,0,0,3-3c.58-1,1.19-2.06,1.81-3.06a7.94,7.94,0,0,0,1.22-4.21l.15-32.25a95.89,95.89,0,0,1,25.37-14.3L122,56.87a8,8,0,0,0,4.1,1c1.21,0,2.43,0,3.64,0a8.08,8.08,0,0,0,4.1-1l28.84-16.1A96,96,0,0,1,188.12,55l.11,32.2a8,8,0,0,0,1.22,4.22c.62,1,1.23,2,1.8,3.06a8.09,8.09,0,0,0,3,3.06l28.6,16.29A90.49,90.49,0,0,1,222.9,142.12Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M128,84a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,84Zm0,80a36,36,0,1,1,36-36A36,36,0,0,1,128,164Zm106-56a4,4,0,0,0-2-2.7l-30.89-17.6q-.47-.82-1-1.62L200.1,51.2a3.94,3.94,0,0,0-1.42-3,107.8,107.8,0,0,0-35.41-19.94,4,4,0,0,0-3.23.29L129,45.87h-2l-31-17.36a4,4,0,0,0-3.23-.3,108.05,108.05,0,0,0-35.39,20,4,4,0,0,0-1.41,3l-.16,34.9-1,1.62L23.9,105.3A4,4,0,0,0,22,108a102.76,102.76,0,0,0,0,40,4,4,0,0,0,1.95,2.7l30.89,17.6q.47.83,1,1.62l.12,34.87a3.94,3.94,0,0,0,1.42,3,107.8,107.8,0,0,0,35.41,19.94,4,4,0,0,0,3.23-.29L127,210.13h2l31,17.36a4,4,0,0,0,3.23.3,108.05,108.05,0,0,0,35.39-20,4,4,0,0,0,1.41-3l.16-34.9,1-1.62L232.1,150.7a4,4,0,0,0,2-2.71A102.76,102.76,0,0,0,234,108Zm-7.48,36.67L196.3,161.84a4,4,0,0,0-1.51,1.53c-.61,1.09-1.25,2.17-1.91,3.24a3.92,3.92,0,0,0-.61,2.1l-.16,34.15a99.8,99.8,0,0,1-29.7,16.77l-30.4-17a4.06,4.06,0,0,0-2-.51H130c-1.28,0-2.57,0-3.84,0a4.1,4.1,0,0,0-2.05.51l-30.45,17A100.23,100.23,0,0,1,63.89,202.9l-.12-34.12a3.93,3.93,0,0,0-.61-2.11c-.66-1-1.3-2.14-1.91-3.23a4,4,0,0,0-1.51-1.53L29.49,144.68a94.78,94.78,0,0,1,0-33.34L59.7,94.16a4,4,0,0,0,1.51-1.53c.61-1.09,1.25-2.17,1.91-3.23a4,4,0,0,0,.61-2.11l.16-34.15a99.8,99.8,0,0,1,29.7-16.77l30.4,17a4.1,4.1,0,0,0,2.05.51c1.28,0,2.57,0,3.84,0a4,4,0,0,0,2.05-.51l30.45-17A100.23,100.23,0,0,1,192.11,53.1l.12,34.12a3.93,3.93,0,0,0,.61,2.11c.66,1,1.3,2.14,1.91,3.23a4,4,0,0,0,1.51,1.53l30.25,17.23A94.78,94.78,0,0,1,226.54,144.66Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/KeyIcon.svelte
function KeyIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M196,76a16,16,0,1,1-16-16A16,16,0,0,1,196,76Zm48,22.74A84.3,84.3,0,0,1,160.11,180H160a83.52,83.52,0,0,1-23.65-3.38l-7.86,7.87A12,12,0,0,1,120,188H108v12a12,12,0,0,1-12,12H84v12a12,12,0,0,1-12,12H40a20,20,0,0,1-20-20V187.31a19.86,19.86,0,0,1,5.86-14.14l53.52-53.52A84,84,0,1,1,244,98.74ZM202.43,53.57A59.48,59.48,0,0,0,158,36c-32,1-58,27.89-58,59.89a59.69,59.69,0,0,0,4.2,22.19,12,12,0,0,1-2.55,13.21L44,189v23H60V200a12,12,0,0,1,12-12H84V176a12,12,0,0,1,12-12h19l9.65-9.65a12,12,0,0,1,13.22-2.55A59.58,59.58,0,0,0,160,156h.08c32,0,58.87-26.07,59.89-58A59.55,59.55,0,0,0,202.43,53.57Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M232,98.36C230.73,136.92,198.67,168,160.09,168a71.68,71.68,0,0,1-26.92-5.17h0L120,176H96v24H72v24H40a8,8,0,0,1-8-8V187.31a8,8,0,0,1,2.34-5.65l58.83-58.83h0A71.68,71.68,0,0,1,88,95.91c0-38.58,31.08-70.64,69.64-71.87A72,72,0,0,1,232,98.36Z" opacity="0.2"></path><path d="M216.57,39.43A80,80,0,0,0,83.91,120.78L28.69,176A15.86,15.86,0,0,0,24,187.31V216a16,16,0,0,0,16,16H72a8,8,0,0,0,8-8V208H96a8,8,0,0,0,8-8V184h16a8,8,0,0,0,5.66-2.34l9.56-9.57A79.73,79.73,0,0,0,160,176h.1A80,80,0,0,0,216.57,39.43ZM224,98.1c-1.09,34.09-29.75,61.86-63.89,61.9H160a63.7,63.7,0,0,1-23.65-4.51,8,8,0,0,0-8.84,1.68L116.69,168H96a8,8,0,0,0-8,8v16H72a8,8,0,0,0-8,8v16H40V187.31l58.83-58.82a8,8,0,0,0,1.68-8.84A63.72,63.72,0,0,1,96,95.92c0-34.14,27.81-62.8,61.9-63.89A64,64,0,0,1,224,98.1ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M216.57,39.43A80,80,0,0,0,83.91,120.78L28.69,176A15.86,15.86,0,0,0,24,187.31V216a16,16,0,0,0,16,16H72a8,8,0,0,0,8-8V208H96a8,8,0,0,0,8-8V184h16a8,8,0,0,0,5.66-2.34l9.56-9.57A79.73,79.73,0,0,0,160,176h.1A80,80,0,0,0,216.57,39.43ZM180,92a16,16,0,1,1,16-16A16,16,0,0,1,180,92Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M215.15,40.85A78,78,0,0,0,86.2,121.31l-56.1,56.1a13.94,13.94,0,0,0-4.1,9.9V216a14,14,0,0,0,14,14H72a6,6,0,0,0,6-6V206H96a6,6,0,0,0,6-6V182h18a6,6,0,0,0,4.24-1.76l10.45-10.44A77.59,77.59,0,0,0,160,174h.1A78,78,0,0,0,215.15,40.85ZM226,98.16c-1.12,35.16-30.67,63.8-65.88,63.84a65.93,65.93,0,0,1-24.51-4.67,6,6,0,0,0-6.64,1.26L117.51,170H96a6,6,0,0,0-6,6v18H72a6,6,0,0,0-6,6v18H40a2,2,0,0,1-2-2V187.31a2,2,0,0,1,.58-1.41l58.83-58.83a6,6,0,0,0,1.26-6.64A65.61,65.61,0,0,1,94,95.92C94,60.71,122.68,31.16,157.83,30A66,66,0,0,1,226,98.16ZM190,76a10,10,0,1,1-10-10A10,10,0,0,1,190,76Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M216.57,39.43A80,80,0,0,0,83.91,120.78L28.69,176A15.86,15.86,0,0,0,24,187.31V216a16,16,0,0,0,16,16H72a8,8,0,0,0,8-8V208H96a8,8,0,0,0,8-8V184h16a8,8,0,0,0,5.66-2.34l9.56-9.57A79.73,79.73,0,0,0,160,176h.1A80,80,0,0,0,216.57,39.43ZM224,98.1c-1.09,34.09-29.75,61.86-63.89,61.9H160a63.7,63.7,0,0,1-23.65-4.51,8,8,0,0,0-8.84,1.68L116.69,168H96a8,8,0,0,0-8,8v16H72a8,8,0,0,0-8,8v16H40V187.31l58.83-58.82a8,8,0,0,0,1.68-8.84A63.72,63.72,0,0,1,96,95.92c0-34.14,27.81-62.8,61.9-63.89A64,64,0,0,1,224,98.1ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M213.74,42.26A76,76,0,0,0,88.51,121.84l-57,57A11.93,11.93,0,0,0,28,187.31V216a12,12,0,0,0,12,12H72a4,4,0,0,0,4-4V204H96a4,4,0,0,0,4-4V180h20a4,4,0,0,0,2.83-1.17l11.33-11.34A75.72,75.72,0,0,0,160,172h.1A76,76,0,0,0,213.74,42.26Zm14.22,56c-1.15,36.22-31.6,65.72-67.87,65.77H160a67.52,67.52,0,0,1-25.21-4.83,4,4,0,0,0-4.45.83l-12,12H96a4,4,0,0,0-4,4v20H72a4,4,0,0,0-4,4v20H40a4,4,0,0,1-4-4V187.31a4.06,4.06,0,0,1,1.17-2.83L96,125.66a4,4,0,0,0,.83-4.45A67.51,67.51,0,0,1,92,95.91C92,59.64,121.55,29.19,157.77,28A68,68,0,0,1,228,98.23ZM188,76a8,8,0,1,1-8-8A8,8,0,0,1,188,76Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/MagnifyingGlass.svelte
function MagnifyingGlass($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M192,112a80,80,0,1,1-80-80A80,80,0,0,1,192,112Z" opacity="0.2"></path><path d="M229.66,218.34,179.6,168.28a88.21,88.21,0,1,0-11.32,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M168,112a56,56,0,1,1-56-56A56,56,0,0,1,168,112Zm61.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88,88,0,1,1,11.32-11.31l50.06,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M228.24,219.76l-51.38-51.38a86.15,86.15,0,1,0-8.48,8.48l51.38,51.38a6,6,0,0,0,8.48-8.48ZM38,112a74,74,0,1,1,74,74A74.09,74.09,0,0,1,38,112Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M226.83,221.17l-52.7-52.7a84.1,84.1,0,1,0-5.66,5.66l52.7,52.7a4,4,0,0,0,5.66-5.66ZM36,112a76,76,0,1,1,76,76A76.08,76.08,0,0,1,36,112Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/Minus.svelte
function Minus($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M228,128a12,12,0,0,1-12,12H40a12,12,0,0,1,0-24H216A12,12,0,0,1,228,128Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z" opacity="0.2"></path><path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM184,136H72a8,8,0,0,1,0-16H184a8,8,0,0,1,0,16Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M222,128a6,6,0,0,1-6,6H40a6,6,0,0,1,0-12H216A6,6,0,0,1,222,128Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M220,128a4,4,0,0,1-4,4H40a4,4,0,0,1,0-8H216A4,4,0,0,1,220,128Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/MonitorIcon.svelte
function MonitorIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M208,36H48A28,28,0,0,0,20,64V176a28,28,0,0,0,28,28H208a28,28,0,0,0,28-28V64A28,28,0,0,0,208,36Zm4,140a4,4,0,0,1-4,4H48a4,4,0,0,1-4-4V64a4,4,0,0,1,4-4H208a4,4,0,0,1,4,4Zm-40,52a12,12,0,0,1-12,12H96a12,12,0,0,1,0-24h64A12,12,0,0,1,172,228Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M224,64V176a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V64A16,16,0,0,1,48,48H208A16,16,0,0,1,224,64Z" opacity="0.2"></path><path d="M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8Zm-48,48a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,224Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M232,64V176a24,24,0,0,1-24,24H48a24,24,0,0,1-24-24V64A24,24,0,0,1,48,40H208A24,24,0,0,1,232,64ZM160,216H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M208,42H48A22,22,0,0,0,26,64V176a22,22,0,0,0,22,22H208a22,22,0,0,0,22-22V64A22,22,0,0,0,208,42Zm10,134a10,10,0,0,1-10,10H48a10,10,0,0,1-10-10V64A10,10,0,0,1,48,54H208a10,10,0,0,1,10,10Zm-52,48a6,6,0,0,1-6,6H96a6,6,0,0,1,0-12h64A6,6,0,0,1,166,224Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8Zm-48,48a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,224Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M208,44H48A20,20,0,0,0,28,64V176a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V64A20,20,0,0,0,208,44Zm12,132a12,12,0,0,1-12,12H48a12,12,0,0,1-12-12V64A12,12,0,0,1,48,52H208a12,12,0,0,1,12,12Zm-56,48a4,4,0,0,1-4,4H96a4,4,0,0,1,0-8h64A4,4,0,0,1,164,224Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/MoonIcon.svelte
function MoonIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M236.37,139.4a12,12,0,0,0-12-3A84.07,84.07,0,0,1,119.6,31.59a12,12,0,0,0-15-15A108.86,108.86,0,0,0,49.69,55.07,108,108,0,0,0,136,228a107.09,107.09,0,0,0,64.93-21.69,108.86,108.86,0,0,0,38.44-54.94A12,12,0,0,0,236.37,139.4Zm-49.88,47.74A84,84,0,0,1,68.86,69.51,84.93,84.93,0,0,1,92.27,48.29Q92,52.13,92,56A108.12,108.12,0,0,0,200,164q3.87,0,7.71-.27A84.79,84.79,0,0,1,186.49,187.14Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M227.89,147.89A96,96,0,1,1,108.11,28.11,96.09,96.09,0,0,0,227.89,147.89Z" opacity="0.2"></path><path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M235.54,150.21a104.84,104.84,0,0,1-37,52.91A104,104,0,0,1,32,120,103.09,103.09,0,0,1,52.88,57.48a104.84,104.84,0,0,1,52.91-37,8,8,0,0,1,10,10,88.08,88.08,0,0,0,109.8,109.8,8,8,0,0,1,10,10Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M232.13,143.64a6,6,0,0,0-6-1.49A90.07,90.07,0,0,1,113.86,29.85a6,6,0,0,0-7.49-7.48A102.88,102.88,0,0,0,54.48,58.68,102,102,0,0,0,197.32,201.52a102.88,102.88,0,0,0,36.31-51.89A6,6,0,0,0,232.13,143.64Zm-42,48.29a90,90,0,0,1-126-126A90.9,90.9,0,0,1,99.65,37.66,102.06,102.06,0,0,0,218.34,156.35,90.9,90.9,0,0,1,190.1,191.93Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M230.72,145.06a4,4,0,0,0-4-1A92.08,92.08,0,0,1,111.94,29.27a4,4,0,0,0-5-5A100.78,100.78,0,0,0,56.08,59.88a100,100,0,0,0,140,140,100.78,100.78,0,0,0,35.59-50.87A4,4,0,0,0,230.72,145.06ZM191.3,193.53A92,92,0,0,1,62.47,64.7a93,93,0,0,1,39.88-30.35,100.09,100.09,0,0,0,119.3,119.3A93,93,0,0,1,191.3,193.53Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/PaperclipIcon.svelte
function PaperclipIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M212.48,136.49l-82.06,82a60,60,0,0,1-84.85-84.88l98.16-97.89a40,40,0,0,1,56.56,56.59l-.17.16-95.8,92.22a12,12,0,1,1-16.64-17.3l95.71-92.12a16,16,0,0,0-22.7-22.56L62.53,150.57a36,36,0,0,0,50.93,50.91l82.06-82a12,12,0,0,1,17,17Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M180.75,104.75,204,128l-82.06,81.94a48,48,0,0,1-67.88-67.88L153.37,41.37a32,32,0,0,1,45.26,45.26Z" opacity="0.2"></path><path d="M209.66,122.34a8,8,0,0,1,0,11.32l-82.05,82a56,56,0,0,1-79.2-79.21L147.67,35.73a40,40,0,1,1,56.61,56.55L105,193A24,24,0,1,1,71,159L154.3,74.38A8,8,0,1,1,165.7,85.6L82.39,170.31a8,8,0,1,0,11.27,11.36L192.93,81A24,24,0,1,0,159,47L59.76,147.68a40,40,0,1,0,56.53,56.62l82.06-82A8,8,0,0,1,209.66,122.34Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm37.66,50.34a8,8,0,0,0-11.32,0L87.09,143A24,24,0,1,0,121,177l49.32-50.32a8,8,0,1,1,11.42,11.2l-49.37,50.38a40,40,0,1,1-56.62-56.51L143,63.09A24,24,0,1,1,177,97L109.71,165.6a8,8,0,1,1-11.42-11.2L165.6,85.71a8,8,0,0,0,.06-11.37Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M208.25,123.76a6,6,0,0,1,0,8.49l-82.06,82a54,54,0,0,1-76.36-76.39L149.1,37.14a38,38,0,1,1,53.77,53.72L103.59,191.54a22,22,0,1,1-31.15-31.09l83.28-84.67a6,6,0,0,1,8.56,8.42L81,168.91a10,10,0,1,0,14.11,14.18L194.35,82.4a26,26,0,1,0-36.74-36.8L58.33,146.28a42,42,0,1,0,59.37,59.44l82.06-82A6,6,0,0,1,208.25,123.76Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M209.66,122.34a8,8,0,0,1,0,11.32l-82.05,82a56,56,0,0,1-79.2-79.21L147.67,35.73a40,40,0,1,1,56.61,56.55L105,193A24,24,0,1,1,71,159L154.3,74.38A8,8,0,1,1,165.7,85.6L82.39,170.31a8,8,0,1,0,11.27,11.36L192.93,81A24,24,0,1,0,159,47L59.76,147.68a40,40,0,1,0,56.53,56.62l82.06-82A8,8,0,0,1,209.66,122.34Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M206.83,125.17a4,4,0,0,1,0,5.66l-82.06,82a52,52,0,0,1-73.54-73.55L150.52,38.55a36,36,0,1,1,50.94,50.9l-99.3,100.69a20,20,0,1,1-28.3-28.27l83.29-84.68a4,4,0,1,1,5.7,5.61L79.54,167.5a12,12,0,1,0,16.95,17L195.78,83.81A28,28,0,1,0,156.2,44.18L56.91,144.87a44,44,0,1,0,62.21,62.26l82-82A4,4,0,0,1,206.83,125.17Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/PlusCircleIcon.svelte
function PlusCircleIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm52-84a12,12,0,0,1-12,12H140v28a12,12,0,0,1-24,0V140H88a12,12,0,0,1,0-24h28V88a12,12,0,0,1,24,0v28h28A12,12,0,0,1,180,128Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M128,24A104,104,0,1,0,232,128,104.13,104.13,0,0,0,128,24Zm40,112H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32a8,8,0,0,1,0,16Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm0,192a90,90,0,1,1,90-90A90.1,90.1,0,0,1,128,218Zm46-90a6,6,0,0,1-6,6H134v34a6,6,0,0,1-12,0V134H88a6,6,0,0,1,0-12h34V88a6,6,0,0,1,12,0v34h34A6,6,0,0,1,174,128Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32A8,8,0,0,1,176,128Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.1,92.1,0,0,1,128,220Zm44-92a4,4,0,0,1-4,4H132v36a4,4,0,0,1-8,0V132H88a4,4,0,0,1,0-8h36V88a4,4,0,0,1,8,0v36h36A4,4,0,0,1,172,128Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/ShieldIcon.svelte
function ShieldIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M208,36H48A20,20,0,0,0,28,56v56c0,54.29,26.32,87.22,48.4,105.29,23.71,19.39,47.44,26,48.44,26.29a12.1,12.1,0,0,0,6.32,0c1-.28,24.73-6.9,48.44-26.29,22.08-18.07,48.4-51,48.4-105.29V56A20,20,0,0,0,208,36Zm-4,76c0,35.71-13.09,64.69-38.91,86.15A126.28,126.28,0,0,1,128,219.38a126.14,126.14,0,0,1-37.09-21.23C65.09,176.69,52,147.71,52,112V60H204Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M216,56v56c0,96-88,120-88,120S40,208,40,112V56a8,8,0,0,1,8-8H208A8,8,0,0,1,216,56Z" opacity="0.2"></path><path d="M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.27,47,25.53a8,8,0,0,0,4.2,0c1-.26,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M224,56v56c0,52.72-25.52,84.67-46.93,102.19-23.06,18.86-46,25.27-47,25.53a8,8,0,0,1-4.2,0c-1-.26-23.91-6.67-47-25.53C57.52,196.67,32,164.72,32,112V56A16,16,0,0,1,48,40H208A16,16,0,0,1,224,56Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M208,42H48A14,14,0,0,0,34,56v56c0,51.94,25.12,83.4,46.2,100.64,22.73,18.6,45.27,24.89,46.22,25.15a6,6,0,0,0,3.16,0c.95-.26,23.49-6.55,46.22-25.15C196.88,195.4,222,163.94,222,112V56A14,14,0,0,0,208,42Zm2,70c0,37.76-13.94,68.39-41.44,91.06A131.17,131.17,0,0,1,128,225.72a130.94,130.94,0,0,1-40.56-22.66C59.94,180.39,46,149.76,46,112V56a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.27,47,25.53a8,8,0,0,0,4.2,0c1-.26,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M208,44H48A12,12,0,0,0,36,56v56c0,51.16,24.73,82.12,45.47,99.1,22.4,18.32,44.55,24.5,45.48,24.76a4,4,0,0,0,2.1,0c.93-.26,23.08-6.44,45.48-24.76,20.74-17,45.47-47.94,45.47-99.1V56A12,12,0,0,0,208,44Zm4,68c0,38.44-14.23,69.63-42.29,92.71A132.45,132.45,0,0,1,128,227.82a132.23,132.23,0,0,1-41.71-23.11C58.23,181.63,44,150.44,44,112V56a4,4,0,0,1,4-4H208a4,4,0,0,1,4,4Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/SignOutIcon.svelte
function SignOutIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M124,216a12,12,0,0,1-12,12H48a12,12,0,0,1-12-12V40A12,12,0,0,1,48,28h64a12,12,0,0,1,0,24H60V204h52A12,12,0,0,1,124,216Zm108.49-96.49-40-40a12,12,0,0,0-17,17L195,116H112a12,12,0,0,0,0,24h83l-19.52,19.51a12,12,0,0,0,17,17l40-40A12,12,0,0,0,232.49,119.51Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M224,56V200a16,16,0,0,1-16,16H48V40H208A16,16,0,0,1,224,56Z" opacity="0.2"></path><path d="M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40A8,8,0,0,0,176,88v32H112a8,8,0,0,0,0,16h64v32a8,8,0,0,0,13.66,5.66l40-40A8,8,0,0,0,229.66,122.34Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M118,216a6,6,0,0,1-6,6H48a6,6,0,0,1-6-6V40a6,6,0,0,1,6-6h64a6,6,0,0,1,0,12H54V210h58A6,6,0,0,1,118,216Zm110.24-92.24-40-40a6,6,0,0,0-8.48,8.48L209.51,122H112a6,6,0,0,0,0,12h97.51l-29.75,29.76a6,6,0,1,0,8.48,8.48l40-40A6,6,0,0,0,228.24,123.76Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M116,216a4,4,0,0,1-4,4H48a4,4,0,0,1-4-4V40a4,4,0,0,1,4-4h64a4,4,0,0,1,0,8H52V212h60A4,4,0,0,1,116,216Zm110.83-90.83-40-40a4,4,0,0,0-5.66,5.66L214.34,124H112a4,4,0,0,0,0,8H214.34l-33.17,33.17a4,4,0,0,0,5.66,5.66l40-40A4,4,0,0,0,226.83,125.17Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/SlidersHorizontalIcon.svelte
function SlidersHorizontalIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M40,92H70.06a36,36,0,0,0,67.88,0H216a12,12,0,0,0,0-24H137.94a36,36,0,0,0-67.88,0H40a12,12,0,0,0,0,24Zm64-24A12,12,0,1,1,92,80,12,12,0,0,1,104,68Zm112,96H201.94a36,36,0,0,0-67.88,0H40a12,12,0,0,0,0,24h94.06a36,36,0,0,0,67.88,0H216a12,12,0,0,0,0-24Zm-48,24a12,12,0,1,1,12-12A12,12,0,0,1,168,188Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M128,80a24,24,0,1,1-24-24A24,24,0,0,1,128,80Zm40,72a24,24,0,1,0,24,24A24,24,0,0,0,168,152Z" opacity="0.2"></path><path d="M40,88H73a32,32,0,0,0,62,0h81a8,8,0,0,0,0-16H135a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16Zm64-24A16,16,0,1,1,88,80,16,16,0,0,1,104,64ZM216,168H199a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16h97a32,32,0,0,0,62,0h17a8,8,0,0,0,0-16Zm-48,24a16,16,0,1,1,16-16A16,16,0,0,1,168,192Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M32,80a8,8,0,0,1,8-8H77.17a28,28,0,0,1,53.66,0H216a8,8,0,0,1,0,16H130.83a28,28,0,0,1-53.66,0H40A8,8,0,0,1,32,80Zm184,88H194.83a28,28,0,0,0-53.66,0H40a8,8,0,0,0,0,16H141.17a28,28,0,0,0,53.66,0H216a8,8,0,0,0,0-16Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M40,86H74.6a30,30,0,0,0,58.8,0H216a6,6,0,0,0,0-12H133.4a30,30,0,0,0-58.8,0H40a6,6,0,0,0,0,12Zm64-24A18,18,0,1,1,86,80,18,18,0,0,1,104,62ZM216,170H197.4a30,30,0,0,0-58.8,0H40a6,6,0,0,0,0,12h98.6a30,30,0,0,0,58.8,0H216a6,6,0,0,0,0-12Zm-48,24a18,18,0,1,1,18-18A18,18,0,0,1,168,194Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M40,88H73a32,32,0,0,0,62,0h81a8,8,0,0,0,0-16H135a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16Zm64-24A16,16,0,1,1,88,80,16,16,0,0,1,104,64ZM216,168H199a32,32,0,0,0-62,0H40a8,8,0,0,0,0,16h97a32,32,0,0,0,62,0h17a8,8,0,0,0,0-16Zm-48,24a16,16,0,1,1,16-16A16,16,0,0,1,168,192Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M40,84H76.29a28,28,0,0,0,55.42,0H216a4,4,0,0,0,0-8H131.71a28,28,0,0,0-55.42,0H40a4,4,0,0,0,0,8Zm64-24A20,20,0,1,1,84,80,20,20,0,0,1,104,60ZM216,172H195.71a28,28,0,0,0-55.42,0H40a4,4,0,0,0,0,8H140.29a28,28,0,0,0,55.42,0H216a4,4,0,0,0,0-8Zm-48,24a20,20,0,1,1,20-20A20,20,0,0,1,168,196Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/SmileyIcon.svelte
function SmileyIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M178.39,158c-11,19.06-29.39,30-50.39,30s-39.36-10.93-50.39-30a12,12,0,0,1,20.78-12c3.89,6.73,12.91,18,29.61,18s25.72-11.28,29.61-18a12,12,0,1,1,20.78,12ZM236,128A108,108,0,1,1,128,20,108.12,108.12,0,0,1,236,128Zm-24,0a84,84,0,1,0-84,84A84.09,84.09,0,0,0,212,128ZM92,124a16,16,0,1,0-16-16A16,16,0,0,0,92,124Zm72-32a16,16,0,1,0,16,16A16,16,0,0,0,164,92Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.08,48c-10.29,17.79-27.39,28-46.92,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.08-20a8,8,0,1,1,13.84,8Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM92,96a12,12,0,1,1-12,12A12,12,0,0,1,92,96Zm82.92,60c-10.29,17.79-27.39,28-46.92,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.08-20a8,8,0,1,1,13.84,8ZM164,120a12,12,0,1,1,12-12A12,12,0,0,1,164,120Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M173.19,155c-9.92,17.16-26.39,27-45.19,27s-35.27-9.84-45.19-27a6,6,0,0,1,10.38-6c7.84,13.54,20.2,21,34.81,21s27-7.46,34.81-21a6,6,0,1,1,10.38,6ZM230,128A102,102,0,1,1,128,26,102.12,102.12,0,0,1,230,128Zm-12,0a90,90,0,1,0-90,90A90.1,90.1,0,0,0,218,128ZM92,118a10,10,0,1,0-10-10A10,10,0,0,0,92,118Zm72-20a10,10,0,1,0,10,10A10,10,0,0,0,164,98Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M171.46,154c-9.55,16.52-25.39,26-43.46,26s-33.91-9.48-43.46-26a4,4,0,0,1,6.92-4c8.21,14.19,21.19,22,36.54,22s28.33-7.81,36.54-22a4,4,0,1,1,6.92,4ZM228,128A100,100,0,1,1,128,28,100.11,100.11,0,0,1,228,128Zm-8,0a92,92,0,1,0-92,92A92.1,92.1,0,0,0,220,128ZM92,116a8,8,0,1,0-8-8A8,8,0,0,0,92,116Zm72-16a8,8,0,1,0,8,8A8,8,0,0,0,164,100Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/SunIcon.svelte
function SunIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M116,36V20a12,12,0,0,1,24,0V36a12,12,0,0,1-24,0Zm80,92a68,68,0,1,1-68-68A68.07,68.07,0,0,1,196,128Zm-24,0a44,44,0,1,0-44,44A44.05,44.05,0,0,0,172,128ZM51.51,68.49a12,12,0,1,0,17-17l-12-12a12,12,0,0,0-17,17Zm0,119-12,12a12,12,0,0,0,17,17l12-12a12,12,0,1,0-17-17ZM196,72a12,12,0,0,0,8.49-3.51l12-12a12,12,0,0,0-17-17l-12,12A12,12,0,0,0,196,72Zm8.49,115.51a12,12,0,0,0-17,17l12,12a12,12,0,0,0,17-17ZM48,128a12,12,0,0,0-12-12H20a12,12,0,0,0,0,24H36A12,12,0,0,0,48,128Zm80,80a12,12,0,0,0-12,12v16a12,12,0,0,0,24,0V220A12,12,0,0,0,128,208Zm108-92H220a12,12,0,0,0,0,24h16a12,12,0,0,0,0-24Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M184,128a56,56,0,1,1-56-56A56,56,0,0,1,184,128Z" opacity="0.2"></path><path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm8,24a64,64,0,1,0,64,64A64.07,64.07,0,0,0,128,64ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M122,40V16a6,6,0,0,1,12,0V40a6,6,0,0,1-12,0Zm68,88a62,62,0,1,1-62-62A62.07,62.07,0,0,1,190,128Zm-12,0a50,50,0,1,0-50,50A50.06,50.06,0,0,0,178,128ZM59.76,68.24a6,6,0,1,0,8.48-8.48l-16-16a6,6,0,0,0-8.48,8.48Zm0,119.52-16,16a6,6,0,1,0,8.48,8.48l16-16a6,6,0,1,0-8.48-8.48ZM192,70a6,6,0,0,0,4.24-1.76l16-16a6,6,0,0,0-8.48-8.48l-16,16A6,6,0,0,0,192,70Zm4.24,117.76a6,6,0,0,0-8.48,8.48l16,16a6,6,0,0,0,8.48-8.48ZM46,128a6,6,0,0,0-6-6H16a6,6,0,0,0,0,12H40A6,6,0,0,0,46,128Zm82,82a6,6,0,0,0-6,6v24a6,6,0,0,0,12,0V216A6,6,0,0,0,128,210Zm112-88H216a6,6,0,0,0,0,12h24a6,6,0,0,0,0-12Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M124,40V16a4,4,0,0,1,8,0V40a4,4,0,0,1-8,0Zm64,88a60,60,0,1,1-60-60A60.07,60.07,0,0,1,188,128Zm-8,0a52,52,0,1,0-52,52A52.06,52.06,0,0,0,180,128ZM61.17,66.83a4,4,0,0,0,5.66-5.66l-16-16a4,4,0,0,0-5.66,5.66Zm0,122.34-16,16a4,4,0,0,0,5.66,5.66l16-16a4,4,0,0,0-5.66-5.66ZM192,68a4,4,0,0,0,2.83-1.17l16-16a4,4,0,1,0-5.66-5.66l-16,16A4,4,0,0,0,192,68Zm2.83,121.17a4,4,0,0,0-5.66,5.66l16,16a4,4,0,0,0,5.66-5.66ZM40,124H16a4,4,0,0,0,0,8H40a4,4,0,0,0,0-8Zm88,88a4,4,0,0,0-4,4v24a4,4,0,0,0,8,0V216A4,4,0,0,0,128,212Zm112-88H216a4,4,0,0,0,0,8h24a4,4,0,0,0,0-8Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/TagIcon.svelte
function TagIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M246.15,133.18,146.83,33.86A19.85,19.85,0,0,0,132.69,28H40A12,12,0,0,0,28,40v92.69a19.85,19.85,0,0,0,5.86,14.14l99.32,99.32a20,20,0,0,0,28.28,0l84.69-84.69A20,20,0,0,0,246.15,133.18Zm-98.83,93.17L52,131V52h79l95.32,95.32ZM104,88A16,16,0,1,1,88,72,16,16,0,0,1,104,88Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M237.66,153,153,237.66a8,8,0,0,1-11.31,0L42.34,138.34A8,8,0,0,1,40,132.69V40h92.69a8,8,0,0,1,5.65,2.34l99.32,99.32A8,8,0,0,1,237.66,153Z" opacity="0.2"></path><path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63ZM84,96A12,12,0,1,1,96,84,12,12,0,0,1,84,96Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M241.91,137.42,142.59,38.1a13.94,13.94,0,0,0-9.9-4.1H40a6,6,0,0,0-6,6v92.69a13.94,13.94,0,0,0,4.1,9.9l99.32,99.32a14,14,0,0,0,19.8,0l84.69-84.69A14,14,0,0,0,241.91,137.42Zm-8.49,11.31-84.69,84.69a2,2,0,0,1-2.83,0L46.59,134.1a2,2,0,0,1-.59-1.41V46h86.69a2,2,0,0,1,1.41.59l99.32,99.31A2,2,0,0,1,233.42,148.73ZM94,84A10,10,0,1,1,84,74,10,10,0,0,1,94,84Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M243.31,136,144,36.69A15.86,15.86,0,0,0,132.69,32H40a8,8,0,0,0-8,8v92.69A15.86,15.86,0,0,0,36.69,144L136,243.31a16,16,0,0,0,22.63,0l84.68-84.68a16,16,0,0,0,0-22.63Zm-96,96L48,132.69V48h84.69L232,147.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M240.49,138.83,141.17,39.51A11.93,11.93,0,0,0,132.69,36H40a4,4,0,0,0-4,4v92.69a11.93,11.93,0,0,0,3.51,8.48l99.32,99.32a12,12,0,0,0,17,0l84.69-84.69a12,12,0,0,0,0-17Zm-5.66,11.31-84.69,84.69a4,4,0,0,1-5.65,0L45.17,135.51A4,4,0,0,1,44,132.69V44h88.69a4,4,0,0,1,2.82,1.17l99.32,99.32A4,4,0,0,1,234.83,150.14ZM92,84a8,8,0,1,1-8-8A8,8,0,0,1,92,84Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/TelegramLogoIcon.svelte
function TelegramLogoIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M231.49,23.16a13,13,0,0,0-13.23-2.26L15.6,100.21a18.22,18.22,0,0,0,3.12,34.86L68,144.74V200a20,20,0,0,0,34.4,13.88l22.67-23.51L162.35,223a20,20,0,0,0,32.7-10.54L235.67,35.91A13,13,0,0,0,231.49,23.16ZM139.41,77.52,77.22,122.09l-34.43-6.75ZM92,190.06V161.35l15,13.15Zm81.16,10.52L99.28,135.81,205.59,59.63Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M223.41,32.09,80,134.87,21,123.3A6.23,6.23,0,0,1,20,111.38L222.63,32.07A1,1,0,0,1,223.41,32.09ZM80,200a8,8,0,0,0,13.76,5.56l30.61-31.76L80,134.87Z" opacity="0.2"></path><path d="M228.88,26.19a9,9,0,0,0-9.16-1.57L17.06,103.93a14.22,14.22,0,0,0,2.43,27.21L72,141.45V200a15.92,15.92,0,0,0,10,14.83,15.91,15.91,0,0,0,17.51-3.73l25.32-26.26L165,220a15.88,15.88,0,0,0,10.51,4,16.3,16.3,0,0,0,5-.79,15.85,15.85,0,0,0,10.67-11.63L231.77,35A9,9,0,0,0,228.88,26.19ZM78.15,126.35l-49.61-9.73,139.2-54.48ZM88,200V152.52l24.79,21.74Zm87.53,8L92.85,135.5l119-85.29Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M228.88,26.19a9,9,0,0,0-9.16-1.57L17.06,103.93a14.22,14.22,0,0,0,2.43,27.21L72,141.45V200a15.92,15.92,0,0,0,10,14.83,15.91,15.91,0,0,0,17.51-3.73l25.32-26.26L165,220a15.88,15.88,0,0,0,10.51,4,16.3,16.3,0,0,0,5-.79,15.85,15.85,0,0,0,10.67-11.63L231.77,35A9,9,0,0,0,228.88,26.19ZM175.53,208,92.85,135.5l119-85.29Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M227.57,27.7a7,7,0,0,0-7.13-1.22L17.78,105.79a12.23,12.23,0,0,0,2.1,23.39L74,139.81V200a14,14,0,0,0,24.08,9.71l26.64-27.63,41.58,36.45a13.9,13.9,0,0,0,9.2,3.49,14.33,14.33,0,0,0,4.36-.69,13.86,13.86,0,0,0,9.34-10.17L229.82,34.57A7,7,0,0,0,227.57,27.7ZM22.05,117.37h0a.46.46,0,0,1,0-.32.51.51,0,0,1,.15-.08L181.91,54.45l-103.3,74L22.2,117.41Zm67.39,84A2,2,0,0,1,86,200V148.11l29.69,26Zm88.07,7.08a1.93,1.93,0,0,1-1.34,1.44,2,2,0,0,1-2-.4L89.64,135.34,215,45.5Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M228.88,26.19a9,9,0,0,0-9.16-1.57L17.06,103.93a14.22,14.22,0,0,0,2.43,27.21L72,141.45V200a15.92,15.92,0,0,0,10,14.83,15.91,15.91,0,0,0,17.51-3.73l25.32-26.26L165,220a15.88,15.88,0,0,0,10.51,4,16.3,16.3,0,0,0,5-.79,15.85,15.85,0,0,0,10.67-11.63L231.77,35A9,9,0,0,0,228.88,26.19Zm-61.14,36L78.15,126.35l-49.6-9.73ZM88,200V152.52l24.79,21.74Zm87.53,8L92.85,135.5l119-85.29Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M226.27,29.22a5,5,0,0,0-5.1-.87L18.51,107.66a10.22,10.22,0,0,0,1.75,19.56L76,138.16V200a12,12,0,0,0,7.51,11.13A12.1,12.1,0,0,0,88,212a12,12,0,0,0,8.62-3.68l28-29,43,37.71a12,12,0,0,0,7.89,3,12.47,12.47,0,0,0,3.74-.59,11.87,11.87,0,0,0,8-8.72L227.87,34.12A5,5,0,0,0,226.27,29.22ZM20,117.38a2.13,2.13,0,0,1,1.42-2.27L196.07,46.76l-117,83.85L21.81,119.37A2.12,2.12,0,0,1,20,117.38Zm70.87,85.38A4,4,0,0,1,84,200V143.7L118.58,174Zm88.58,6.14a4,4,0,0,1-6.57,2.09L86.43,135.18,218.13,40.8Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/TicketIcon.svelte
function TicketIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M232,108a12,12,0,0,0,12-12V64a20,20,0,0,0-20-20H32A20,20,0,0,0,12,64V96a12,12,0,0,0,12,12,20,20,0,0,1,0,40,12,12,0,0,0-12,12v32a20,20,0,0,0,20,20H224a20,20,0,0,0,20-20V160a12,12,0,0,0-12-12,20,20,0,0,1,0-40ZM36,170.34a44,44,0,0,0,0-84.68V68H88V188H36Zm184,0V188H112V68H220V85.66a44,44,0,0,0,0,84.68Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M200,128a32,32,0,0,0,32,32v32a8,8,0,0,1-8,8H96V56H224a8,8,0,0,1,8,8V96A32,32,0,0,0,200,128Z" opacity="0.2"></path><path d="M232,104a8,8,0,0,0,8-8V64a16,16,0,0,0-16-16H32A16,16,0,0,0,16,64V96a8,8,0,0,0,8,8,24,24,0,0,1,0,48,8,8,0,0,0-8,8v32a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V160a8,8,0,0,0-8-8,24,24,0,0,1,0-48ZM32,167.2a40,40,0,0,0,0-78.4V64H88V192H32Zm192,0V192H104V64H224V88.8a40,40,0,0,0,0,78.4Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M232,104a8,8,0,0,0,8-8V64a16,16,0,0,0-16-16H32A16,16,0,0,0,16,64V96a8,8,0,0,0,8,8,24,24,0,0,1,0,48,8,8,0,0,0-8,8v32a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V160a8,8,0,0,0-8-8,24,24,0,0,1,0-48ZM32,167.2a40,40,0,0,0,0-78.4V64H88V192H32Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M232,102a6,6,0,0,0,6-6V64a14,14,0,0,0-14-14H32A14,14,0,0,0,18,64V96a6,6,0,0,0,6,6,26,26,0,0,1,0,52,6,6,0,0,0-6,6v32a14,14,0,0,0,14,14H224a14,14,0,0,0,14-14V160a6,6,0,0,0-6-6,26,26,0,0,1,0-52ZM30,192V165.53a38,38,0,0,0,0-75.06V64a2,2,0,0,1,2-2H90V194H32A2,2,0,0,1,30,192Zm196-26.47V192a2,2,0,0,1-2,2H102V62H224a2,2,0,0,1,2,2V90.47a38,38,0,0,0,0,75.06Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M232,104a8,8,0,0,0,8-8V64a16,16,0,0,0-16-16H32A16,16,0,0,0,16,64V96a8,8,0,0,0,8,8,24,24,0,0,1,0,48,8,8,0,0,0-8,8v32a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V160a8,8,0,0,0-8-8,24,24,0,0,1,0-48ZM32,167.2a40,40,0,0,0,0-78.4V64H88V192H32Zm192,0V192H104V64H224V88.8a40,40,0,0,0,0,78.4Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M232,100a4,4,0,0,0,4-4V64a12,12,0,0,0-12-12H32A12,12,0,0,0,20,64V96a4,4,0,0,0,4,4,28,28,0,0,1,0,56,4,4,0,0,0-4,4v32a12,12,0,0,0,12,12H224a12,12,0,0,0,12-12V160a4,4,0,0,0-4-4,28,28,0,0,1,0-56ZM28,192V163.78a36,36,0,0,0,0-71.56V64a4,4,0,0,1,4-4H92V196H32A4,4,0,0,1,28,192Zm168-64a36.06,36.06,0,0,0,32,35.78V192a4,4,0,0,1-4,4H100V60H224a4,4,0,0,1,4,4V92.22A36.06,36.06,0,0,0,196,128Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/UserIcon.svelte
function UserIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M234.38,210a123.36,123.36,0,0,0-60.78-53.23,76,76,0,1,0-91.2,0A123.36,123.36,0,0,0,21.62,210a12,12,0,1,0,20.77,12c18.12-31.32,50.12-50,85.61-50s67.49,18.69,85.61,50a12,12,0,0,0,20.77-12ZM76,96a52,52,0,1,1,52,52A52.06,52.06,0,0,1,76,96Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M192,96a64,64,0,1,1-64-64A64,64,0,0,1,192,96Z" opacity="0.2"></path><path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M230.93,220a8,8,0,0,1-6.93,4H32a8,8,0,0,1-6.92-12c15.23-26.33,38.7-45.21,66.09-54.16a72,72,0,1,1,73.66,0c27.39,8.95,50.86,27.83,66.09,54.16A8,8,0,0,1,230.93,220Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M229.19,213c-15.81-27.32-40.63-46.49-69.47-54.62a70,70,0,1,0-63.44,0C67.44,166.5,42.62,185.67,26.81,213a6,6,0,1,0,10.38,6C56.4,185.81,90.34,166,128,166s71.6,19.81,90.81,53a6,6,0,1,0,10.38-6ZM70,96a58,58,0,1,1,58,58A58.07,58.07,0,0,1,70,96Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M227.46,214c-16.52-28.56-43-48.06-73.68-55.09a68,68,0,1,0-51.56,0c-30.64,7-57.16,26.53-73.68,55.09a4,4,0,0,0,6.92,4C55,184.19,89.62,164,128,164s73,20.19,92.54,54a4,4,0,0,0,3.46,2,3.93,3.93,0,0,0,2-.54A4,4,0,0,0,227.46,214ZM68,96a60,60,0,1,1,60,60A60.07,60.07,0,0,1,68,96Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/UsersIcon.svelte
function UsersIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M125.18,156.94a64,64,0,1,0-82.36,0,100.23,100.23,0,0,0-39.49,32,12,12,0,0,0,19.35,14.2,76,76,0,0,1,122.64,0,12,12,0,0,0,19.36-14.2A100.33,100.33,0,0,0,125.18,156.94ZM44,108a40,40,0,1,1,40,40A40,40,0,0,1,44,108Zm206.1,97.67a12,12,0,0,1-16.78-2.57A76.31,76.31,0,0,0,172,172a12,12,0,0,1,0-24,40,40,0,1,0-10.3-78.67,12,12,0,1,1-6.16-23.19,64,64,0,0,1,57.64,110.8,100.23,100.23,0,0,1,39.49,32A12,12,0,0,1,250.1,205.67Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M136,108A52,52,0,1,1,84,56,52,52,0,0,1,136,108Z" opacity="0.2"></path><path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M164.47,195.63a8,8,0,0,1-6.7,12.37H10.23a8,8,0,0,1-6.7-12.37,95.83,95.83,0,0,1,47.22-37.71,60,60,0,1,1,66.5,0A95.83,95.83,0,0,1,164.47,195.63Zm87.91-.15a95.87,95.87,0,0,0-47.13-37.56A60,60,0,0,0,144.7,54.59a4,4,0,0,0-1.33,6A75.83,75.83,0,0,1,147,150.53a4,4,0,0,0,1.07,5.53,112.32,112.32,0,0,1,29.85,30.83,23.92,23.92,0,0,1,3.65,16.47,4,4,0,0,0,3.95,4.64h60.3a8,8,0,0,0,7.73-5.93A8.22,8.22,0,0,0,252.38,195.48Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M112.6,158.43a58,58,0,1,0-57.2,0A93.83,93.83,0,0,0,5.21,196.72a6,6,0,0,0,10.05,6.56,82,82,0,0,1,137.48,0,6,6,0,0,0,10-6.56A93.83,93.83,0,0,0,112.6,158.43ZM38,108a46,46,0,1,1,46,46A46.06,46.06,0,0,1,38,108Zm211,97a6,6,0,0,1-8.3-1.74A81.8,81.8,0,0,0,172,166a6,6,0,0,1,0-12,46,46,0,1,0-17.08-88.73,6,6,0,1,1-4.46-11.14,58,58,0,0,1,50.14,104.3,93.83,93.83,0,0,1,50.19,38.29A6,6,0,0,1,249,205Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M107.19,159a56,56,0,1,0-46.38,0A91.83,91.83,0,0,0,6.88,197.81a4,4,0,1,0,6.7,4.37,84,84,0,0,1,140.84,0,4,4,0,1,0,6.7-4.37A91.83,91.83,0,0,0,107.19,159ZM36,108a48,48,0,1,1,48,48A48.05,48.05,0,0,1,36,108Zm212,95.35a4,4,0,0,1-5.53-1.17A83.81,83.81,0,0,0,172,164a4,4,0,0,1,0-8,48,48,0,1,0-17.82-92.58,4,4,0,1,1-3-7.43,56,56,0,0,1,44,103,91.83,91.83,0,0,1,53.93,38.86A4,4,0,0,1,248,203.35Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/phosphor-svelte@3.1.0_svelte@5.55.9_@typescript-eslint+types@8.59.4__vite@8.0.14_@types_2de2a9fc0666f26d42961ff9ad08226f/node_modules/phosphor-svelte/lib/WarningCircleIcon.svelte
function WarningCircleIcon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const ctx = getIconContext();
		let { children, $$slots, $$events, ...props } = $$props;
		let weight = derived(() => props.weight ?? ctx.weight ?? "regular");
		let color = derived(() => props.color ?? ctx.color ?? "currentColor");
		let size = derived(() => props.size ?? ctx.size ?? "1em");
		let mirrored = derived(() => props.mirrored ?? ctx.mirrored ?? false);
		function svgAttr(obj) {
			let { weight, color, size, mirrored, ...attrs } = obj;
			return attrs;
		}
		$$renderer.push(`<svg${attributes({
			xmlns: "http://www.w3.org/2000/svg",
			role: "img",
			width: size(),
			height: size(),
			fill: color(),
			transform: mirrored() ? "scale(-1, 1)" : void 0,
			viewBox: "0 0 256 256",
			...svgAttr(ctx),
			...svgAttr(props)
		}, void 0, void 0, void 0, 3)}>`);
		if (children) {
			$$renderer.push("<!--[0-->");
			children($$renderer);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--><rect width="256" height="256" fill="none"></rect>`);
		if (weight() === "bold") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<path d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm-12-80V80a12,12,0,0,1,24,0v52a12,12,0,0,1-24,0Zm28,40a16,16,0,1,1-16-16A16,16,0,0,1,144,172Z"></path>`);
		} else if (weight() === "duotone") {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path>`);
		} else if (weight() === "fill") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"></path>`);
		} else if (weight() === "light") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<path d="M128,26A102,102,0,1,0,230,128,102.12,102.12,0,0,0,128,26Zm0,192a90,90,0,1,1,90-90A90.1,90.1,0,0,1,128,218Zm-6-82V80a6,6,0,0,1,12,0v56a6,6,0,0,1-12,0Zm16,36a10,10,0,1,1-10-10A10,10,0,0,1,138,172Z"></path>`);
		} else if (weight() === "regular") {
			$$renderer.push("<!--[4-->");
			$$renderer.push(`<path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z"></path>`);
		} else if (weight() === "thin") {
			$$renderer.push("<!--[5-->");
			$$renderer.push(`<path d="M128,28A100,100,0,1,0,228,128,100.11,100.11,0,0,0,128,28Zm0,192a92,92,0,1,1,92-92A92.1,92.1,0,0,1,128,220Zm-4-84V80a4,4,0,0,1,8,0v56a4,4,0,0,1-8,0Zm12,36a8,8,0,1,1-8-8A8,8,0,0,1,136,172Z"></path>`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`${escape_html((console.error("Unsupported icon weight. Choose from \"thin\", \"light\", \"regular\", \"bold\", \"fill\", or \"duotone\"."), ""))}`);
		}
		$$renderer.push(`<!--]--></svg>`);
	});
}
//#endregion
export { attachRef as $, CaretRight as A, Button as B, CircleIcon as C, ChartPieIcon as D, CheckCircleIcon as E, CaretDoubleLeftIcon as F, boolToEmptyStrOrUndef as G, Separator as H, CalendarIcon as I, boolToTrueOrUndef as J, boolToStr as K, ArchiveIcon as L, CaretLeftIcon as M, CaretDown as N, CaretUp as O, CaretDoubleRightIcon as P, getDataTransitionAttrs as Q, X as R, ClockClockwiseIcon as S, CheckIcon as T, cn as U, buttonVariants as V, createId as W, getAriaChecked as X, createBitsAttrs as Y, getDataOpenClosed as Z, MagnifyingGlass as _, TelegramLogoIcon as a, BoxSymbol as at, CloudArrowDownIcon as b, SmileyIcon as c, boxWith as ct, ShieldIcon as d, isWritableSymbol as dt, mergeProps as et, PlusCircleIcon as f, simpleBox as ft, Minus as g, MonitorIcon as h, TicketIcon as i, composeHandlers as it, CaretRightIcon as j, CaretUpDownIcon as k, SlidersHorizontalIcon as l, isBox as lt, MoonIcon as m, isObject as mt, UsersIcon as n, executeCallbacks as nt, TagIcon as o, boxFlatten as ot, PaperclipIcon as p, toReadonlyBox as pt, boolToStrTrueOrUndef as q, UserIcon as r, cssToStyleObj as rt, SunIcon as s, boxFrom as st, WarningCircleIcon as t, styleToString as tt, SignOutIcon as u, isWritableBox as ut, KeyIcon as v, Check as w, ClockIcon as x, GearSixIcon as y, Sidebar as z };
