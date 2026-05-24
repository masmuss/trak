import { $ as clsx, Q as attr, V as snapshot, a as bind_props, c as ensure_array_like, et as escape_html, f as spread_props, i as attributes, l as head, n as attr_class, o as derived, u as props_id } from "../../../../chunks/dev.js";
import { r as SvelteSet } from "../../../../chunks/index-server2.js";
import { $ as attachRef, B as Button, F as CaretDoubleLeftIcon, G as boolToEmptyStrOrUndef, H as Separator, K as boolToStr, M as CaretLeftIcon, P as CaretDoubleRightIcon, Q as getDataTransitionAttrs, R as X, T as CheckIcon, U as cn, V as buttonVariants, W as createId, Y as createBitsAttrs, Z as getDataOpenClosed, _ as MagnifyingGlass, b as CloudArrowDownIcon, ct as boxWith, et as mergeProps, f as PlusCircleIcon, j as CaretRightIcon, l as SlidersHorizontalIcon, w as Check } from "../../../../chunks/navigation.js";
import { t as resolve } from "../../../../chunks/paths.js";
import { t as page } from "../../../../chunks/state.js";
import { A as getFirstNonCommentChild, B as ARROW_LEFT, F as isElement, G as ENTER, H as ARROW_UP, M as noop, N as PresenceManager, Q as DOMContext, R as isTouch, V as ARROW_RIGHT, at as watch, c as useId, et as afterTick, i as Floating_layer, j as Portal, k as isTabbable, n as Popper_layer, o as getFloatingContentCSSVars, ot as Context, q as HOME, r as Floating_layer_anchor, t as Popper_layer_force_mount, tt as afterSleep, z as ARROW_DOWN } from "../../../../chunks/popper-layer-force-mount.js";
import { a as Select_content, c as srOnlyStyles, i as Select_trigger, n as Badge, o as Select_item, s as Select } from "../../../../chunks/status-badge.js";
import { a as Dropdown_menu_group, c as Dropdown_menu, l as SafePolygon, n as Dropdown_menu_separator, o as Dropdown_menu_content, r as Dropdown_menu_label, s as Dropdown_menu_checkbox_item, t as Dropdown_menu_trigger } from "../../../../chunks/dropdown-menu.js";
import { t as Input } from "../../../../chunks/input.js";
import { tv } from "tailwind-variants";
import { createTable, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/table-core";
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/bits/command/utils.js
function findNextSibling(el, selector) {
	let sibling = el.nextElementSibling;
	while (sibling) {
		if (sibling.matches(selector)) return sibling;
		sibling = sibling.nextElementSibling;
	}
}
function findPreviousSibling(el, selector) {
	let sibling = el.previousElementSibling;
	while (sibling) {
		if (sibling.matches(selector)) return sibling;
		sibling = sibling.previousElementSibling;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/internal/css-escape.js
/**
* https://github.com/mathiasbynens/CSS.escape
*
* @param value - The value to escape for use as a CSS identifier
* @returns The escaped CSS identifier string
*/
function cssEscape(value) {
	if (typeof CSS !== "undefined" && typeof CSS.escape === "function") return CSS.escape(value);
	const length = value.length;
	let index = -1;
	let codeUnit;
	let result = "";
	const firstCodeUnit = value.charCodeAt(0);
	if (length === 1 && firstCodeUnit === 45) return "\\" + value;
	while (++index < length) {
		codeUnit = value.charCodeAt(index);
		if (codeUnit === 0) {
			result += "�";
			continue;
		}
		if (codeUnit >= 1 && codeUnit <= 31 || codeUnit === 127 || index === 0 && codeUnit >= 48 && codeUnit <= 57 || index === 1 && codeUnit >= 48 && codeUnit <= 57 && firstCodeUnit === 45) {
			result += "\\" + codeUnit.toString(16) + " ";
			continue;
		}
		if (codeUnit >= 128 || codeUnit === 45 || codeUnit === 95 || codeUnit >= 48 && codeUnit <= 57 || codeUnit >= 65 && codeUnit <= 90 || codeUnit >= 97 && codeUnit <= 122) {
			result += value.charAt(index);
			continue;
		}
		result += "\\" + value.charAt(index);
	}
	return result;
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/bits/command/command.svelte.js
var COMMAND_VALUE_ATTR = "data-value";
var commandAttrs = createBitsAttrs({
	component: "command",
	parts: [
		"root",
		"list",
		"input",
		"separator",
		"loading",
		"empty",
		"group",
		"group-items",
		"group-heading",
		"item",
		"viewport",
		"input-label"
	]
});
var COMMAND_GROUP_SELECTOR = commandAttrs.selector("group");
var COMMAND_GROUP_ITEMS_SELECTOR = commandAttrs.selector("group-items");
var COMMAND_GROUP_HEADING_SELECTOR = commandAttrs.selector("group-heading");
var COMMAND_ITEM_SELECTOR = commandAttrs.selector("item");
var COMMAND_VALID_ITEM_SELECTOR = `${commandAttrs.selector("item")}:not([aria-disabled="true"])`;
var CommandRootContext = new Context("Command.Root");
var CommandListContext = new Context("Command.List");
var CommandGroupContainerContext = new Context("Command.Group");
var defaultState = {
	search: "",
	value: "",
	filtered: {
		count: 0,
		items: /* @__PURE__ */ new Map(),
		groups: /* @__PURE__ */ new Set()
	}
};
var CommandRootState = class CommandRootState {
	static create(opts) {
		return CommandRootContext.set(new CommandRootState(opts));
	}
	opts;
	attachment;
	#updateScheduled = false;
	#isInitialMount = true;
	sortAfterTick = false;
	sortAndFilterAfterTick = false;
	allItems = /* @__PURE__ */ new Set();
	allGroups = /* @__PURE__ */ new Map();
	allIds = /* @__PURE__ */ new Map();
	key = 0;
	viewportNode = null;
	inputNode = null;
	labelNode = null;
	commandState = defaultState;
	_commandState = defaultState;
	#snapshot() {
		return snapshot(this._commandState);
	}
	#scheduleUpdate() {
		if (this.#updateScheduled) return;
		this.#updateScheduled = true;
		afterTick(() => {
			this.#updateScheduled = false;
			const currentState = this.#snapshot();
			if (!Object.is(this.commandState, currentState)) {
				this.commandState = currentState;
				this.opts.onStateChange?.current?.(currentState);
			}
		});
	}
	setState(key, value, preventScroll) {
		if (Object.is(this._commandState[key], value)) return;
		this._commandState[key] = value;
		if (key === "search") {
			this.#filterItems();
			this.#sort();
		} else if (key === "value") {
			if (!preventScroll) this.#scrollSelectedIntoView();
		}
		this.#scheduleUpdate();
	}
	constructor(opts) {
		this.opts = opts;
		this.attachment = attachRef(this.opts.ref);
		const defaults = {
			...this._commandState,
			value: this.opts.value.current ?? ""
		};
		this._commandState = defaults;
		this.commandState = defaults;
		this.onkeydown = this.onkeydown.bind(this);
	}
	/**
	* Calculates score for an item based on search text and keywords.
	* Higher score = better match.
	*
	* @param value - Item's display text
	* @param keywords - Optional keywords to boost scoring
	* @returns Score from 0-1, where 0 = no match
	*/
	#score(value, keywords) {
		const filter = this.opts.filter.current ?? computeCommandScore;
		return value ? filter(value, this._commandState.search, keywords) : 0;
	}
	/**
	* Sorts items and groups based on search scores.
	* Groups are sorted by their highest scoring item.
	* When no search active, selects first item.
	*/
	#sort() {
		if (!this._commandState.search || this.opts.shouldFilter.current === false) {
			if (!this._commandState.value || !this.#isInitialMount) this.#selectFirstItem();
			else if (this.#isInitialMount && this._commandState.value) this.#scrollInitialValue();
			return;
		}
		const scores = this._commandState.filtered.items;
		const groups = [];
		for (const value of this._commandState.filtered.groups) {
			const items = this.allGroups.get(value);
			let max = 0;
			if (!items) {
				groups.push([value, max]);
				continue;
			}
			for (const item of items) {
				const score = scores.get(item);
				max = Math.max(score ?? 0, max);
			}
			groups.push([value, max]);
		}
		const listInsertionElement = this.viewportNode;
		const sorted = this.getValidItems().sort((a, b) => {
			const valueA = a.getAttribute("data-value");
			const valueB = b.getAttribute("data-value");
			const scoresA = scores.get(valueA) ?? 0;
			return (scores.get(valueB) ?? 0) - scoresA;
		});
		for (const item of sorted) {
			const group = item.closest(COMMAND_GROUP_ITEMS_SELECTOR);
			if (group) {
				const itemToAppend = item.parentElement === group ? item : item.closest(`${COMMAND_GROUP_ITEMS_SELECTOR} > *`);
				if (itemToAppend) group.appendChild(itemToAppend);
			} else {
				const itemToAppend = item.parentElement === listInsertionElement ? item : item.closest(`${COMMAND_GROUP_ITEMS_SELECTOR} > *`);
				if (itemToAppend) listInsertionElement?.appendChild(itemToAppend);
			}
		}
		const sortedGroups = groups.sort((a, b) => b[1] - a[1]);
		for (const group of sortedGroups) {
			const element = listInsertionElement?.querySelector(`${COMMAND_GROUP_SELECTOR}[${COMMAND_VALUE_ATTR}="${cssEscape(group[0])}"]`);
			element?.parentElement?.appendChild(element);
		}
		this.#selectFirstItem();
	}
	/**
	* Sets current value and triggers re-render if cleared.
	*
	* @param value - New value to set
	*/
	setValue(value, opts) {
		if (value !== this.opts.value.current && value === "") afterTick(() => {
			this.key++;
		});
		this.setState("value", value, opts);
		this.opts.value.current = value;
	}
	/**
	* Selects first non-disabled item on next tick.
	*/
	#selectFirstItem() {
		afterTick(() => {
			const value = this.getValidItems().find((item) => item.getAttribute("aria-disabled") !== "true")?.getAttribute(COMMAND_VALUE_ATTR);
			const shouldPreventScroll = this.#isInitialMount && this.opts.disableInitialScroll.current;
			this.setValue(value ?? "", shouldPreventScroll);
			this.#isInitialMount = false;
		});
	}
	/**
	* Scrolls the initial value into view if it exists and is not the first item.
	* Called during initial mount when a value is provided.
	*/
	#scrollInitialValue() {
		afterTick(() => {
			if (!this.opts.disableInitialScroll.current) this.#scrollSelectedIntoView();
			this.#isInitialMount = false;
		});
	}
	/**
	* Updates filtered items/groups based on search.
	* Recalculates scores and filtered count.
	*/
	#filterItems() {
		if (!this._commandState.search || this.opts.shouldFilter.current === false) {
			this._commandState.filtered.count = this.allItems.size;
			return;
		}
		this._commandState.filtered.groups = /* @__PURE__ */ new Set();
		let itemCount = 0;
		for (const id of this.allItems) {
			const value = this.allIds.get(id)?.value ?? "";
			const keywords = this.allIds.get(id)?.keywords ?? [];
			const rank = this.#score(value, keywords);
			this._commandState.filtered.items.set(id, rank);
			if (rank > 0) itemCount++;
		}
		for (const [groupId, group] of this.allGroups) for (const itemId of group) {
			const currItem = this._commandState.filtered.items.get(itemId);
			if (currItem && currItem > 0) {
				this._commandState.filtered.groups.add(groupId);
				break;
			}
		}
		this._commandState.filtered.count = itemCount;
	}
	/**
	* Gets all non-disabled, visible command items.
	*
	* @returns Array of valid item elements
	* @remarks Exposed for direct item access and bound checking
	*/
	getValidItems() {
		const node = this.opts.ref.current;
		if (!node) return [];
		return Array.from(node.querySelectorAll(COMMAND_VALID_ITEM_SELECTOR)).filter((el) => !!el);
	}
	/**
	* Gets all visible command items.
	*
	* @returns Array of valid item elements
	* @remarks Exposed for direct item access and bound checking
	*/
	getVisibleItems() {
		const node = this.opts.ref.current;
		if (!node) return [];
		return Array.from(node.querySelectorAll(COMMAND_ITEM_SELECTOR)).filter((el) => !!el);
	}
	/** Returns all visible items in a matrix structure
	*
	* @remarks Returns empty if the command isn't configured as a grid
	*
	* @returns
	*/
	get itemsGrid() {
		if (!this.isGrid) return [];
		const columns = this.opts.columns.current ?? 1;
		const items = this.getVisibleItems();
		const grid = [[]];
		let currentGroup = items[0]?.getAttribute("data-group");
		let column = 0;
		let row = 0;
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			const itemGroup = item?.getAttribute("data-group");
			if (currentGroup !== itemGroup) {
				currentGroup = itemGroup;
				column = 1;
				row++;
				grid.push([{
					index: i,
					firstRowOfGroup: true,
					ref: item
				}]);
			} else {
				column++;
				if (column > columns) {
					row++;
					column = 1;
					grid.push([]);
				}
				grid[row]?.push({
					index: i,
					firstRowOfGroup: grid[row]?.[0]?.firstRowOfGroup ?? i === 0,
					ref: item
				});
			}
		}
		return grid;
	}
	/**
	* Gets currently selected command item.
	*
	* @returns Selected element or undefined
	*/
	#getSelectedItem() {
		const node = this.opts.ref.current;
		if (!node) return;
		const selectedNode = node.querySelector(`${COMMAND_VALID_ITEM_SELECTOR}[data-selected]`);
		if (!selectedNode) return;
		return selectedNode;
	}
	/**
	* Scrolls selected item into view.
	* Special handling for first items in groups.
	*/
	#scrollSelectedIntoView() {
		afterTick(() => {
			const item = this.#getSelectedItem();
			if (!item) return;
			const grandparent = item.parentElement?.parentElement;
			if (!grandparent) return;
			if (this.isGrid) {
				const isFirstRowOfGroup = this.#itemIsFirstRowOfGroup(item);
				item.scrollIntoView({ block: "nearest" });
				if (isFirstRowOfGroup) {
					(item?.closest(COMMAND_GROUP_SELECTOR)?.querySelector(COMMAND_GROUP_HEADING_SELECTOR))?.scrollIntoView({ block: "nearest" });
					return;
				}
			} else {
				const firstChildOfParent = getFirstNonCommentChild(grandparent);
				if (firstChildOfParent && firstChildOfParent.dataset?.value === item.dataset?.value) {
					(item?.closest(COMMAND_GROUP_SELECTOR)?.querySelector(COMMAND_GROUP_HEADING_SELECTOR))?.scrollIntoView({ block: "nearest" });
					return;
				}
			}
			item.scrollIntoView({ block: "nearest" });
		});
	}
	#itemIsFirstRowOfGroup(item) {
		const grid = this.itemsGrid;
		if (grid.length === 0) return false;
		for (let r = 0; r < grid.length; r++) {
			const row = grid[r];
			if (row === void 0) continue;
			for (let c = 0; c < row.length; c++) {
				const column = row[c];
				if (column === void 0 || column.ref !== item) continue;
				return column.firstRowOfGroup;
			}
		}
		return false;
	}
	/**
	* Sets selection to item at specified index in valid items array.
	* If index is out of bounds, does nothing.
	*
	* @param index - Zero-based index of item to select
	* @remarks
	* Uses `getValidItems()` to get selectable items, filtering out disabled/hidden ones.
	* Access valid items directly via `getValidItems()` to check bounds before calling.
	*
	* @example
	* // get valid items length for bounds check
	* const items = getValidItems()
	* if (index < items.length) {
	*   updateSelectedToIndex(index)
	* }
	*/
	updateSelectedToIndex(index) {
		const item = this.getValidItems()[index];
		if (!item) return;
		this.setValue(item.getAttribute(COMMAND_VALUE_ATTR) ?? "");
	}
	/**
	* Updates selected item by moving up/down relative to current selection.
	* Handles wrapping when loop option is enabled.
	*
	* @param change - Direction to move: 1 for next item, -1 for previous item
	* @remarks
	* The loop behavior wraps:
	* - From last item to first when moving next
	* - From first item to last when moving previous
	*
	* Uses `getValidItems()` to get all selectable items, which filters out disabled/hidden items.
	* You can call `getValidItems()` directly to get the current valid items array.
	*
	* @example
	* // select next item
	* updateSelectedByItem(1)
	*
	* // get all valid items
	* const items = getValidItems()
	*/
	updateSelectedByItem(change) {
		const selected = this.#getSelectedItem();
		const items = this.getValidItems();
		const index = items.findIndex((item) => item === selected);
		let newSelected = items[index + change];
		if (this.opts.loop.current) newSelected = index + change < 0 ? items[items.length - 1] : index + change === items.length ? items[0] : items[index + change];
		if (newSelected) this.setValue(newSelected.getAttribute(COMMAND_VALUE_ATTR) ?? "");
	}
	/**
	* Moves selection to the first valid item in the next/previous group.
	* If no group is found, falls back to selecting the next/previous item globally.
	*
	* @param change - Direction to move: 1 for next group, -1 for previous group
	* @example
	* // move to first item in next group
	* updateSelectedByGroup(1)
	*
	* // move to first item in previous group
	* updateSelectedByGroup(-1)
	*/
	updateSelectedByGroup(change) {
		let group = this.#getSelectedItem()?.closest(COMMAND_GROUP_SELECTOR);
		let item;
		while (group && !item) {
			group = change > 0 ? findNextSibling(group, COMMAND_GROUP_SELECTOR) : findPreviousSibling(group, COMMAND_GROUP_SELECTOR);
			item = group?.querySelector(COMMAND_VALID_ITEM_SELECTOR);
		}
		if (item) this.setValue(item.getAttribute(COMMAND_VALUE_ATTR) ?? "");
		else this.updateSelectedByItem(change);
	}
	/**
	* Maps item id to display value and search keywords.
	* Returns cleanup function to remove mapping.
	*
	* @param id - Unique item identifier
	* @param value - Display text
	* @param keywords - Optional search boost terms
	* @returns Cleanup function
	*/
	registerValue(value, keywords) {
		if (!(value && value === this.allIds.get(value)?.value)) this.allIds.set(value, {
			value,
			keywords
		});
		this._commandState.filtered.items.set(value, this.#score(value, keywords));
		if (!this.sortAfterTick) {
			this.sortAfterTick = true;
			afterTick(() => {
				this.#sort();
				this.sortAfterTick = false;
			});
		}
		return () => {
			this.allIds.delete(value);
		};
	}
	/**
	* Registers item in command list and its group.
	* Handles filtering, sorting and selection updates.
	*
	* @param id - Item identifier
	* @param groupId - Optional group to add item to
	* @returns Cleanup function that handles selection
	*/
	registerItem(id, groupId) {
		this.allItems.add(id);
		if (groupId) if (!this.allGroups.has(groupId)) this.allGroups.set(groupId, new Set([id]));
		else this.allGroups.get(groupId).add(id);
		if (!this.sortAndFilterAfterTick) {
			this.sortAndFilterAfterTick = true;
			afterTick(() => {
				this.#filterItems();
				this.#sort();
				this.sortAndFilterAfterTick = false;
			});
		}
		this.#scheduleUpdate();
		return () => {
			const selectedItem = this.#getSelectedItem();
			this.allItems.delete(id);
			this.commandState.filtered.items.delete(id);
			this.#filterItems();
			if (selectedItem?.getAttribute("id") === id) this.#selectFirstItem();
			this.#scheduleUpdate();
		};
	}
	/**
	* Creates empty group if not exists.
	*
	* @param id - Group identifier
	* @returns Cleanup function
	*/
	registerGroup(id) {
		if (!this.allGroups.has(id)) this.allGroups.set(id, /* @__PURE__ */ new Set());
		return () => {
			this.allIds.delete(id);
			this.allGroups.delete(id);
		};
	}
	get isGrid() {
		return this.opts.columns.current !== null;
	}
	/**
	* Selects last valid item.
	*/
	#last() {
		return this.updateSelectedToIndex(this.getValidItems().length - 1);
	}
	/**
	* Handles next item selection:
	* - Meta: Jump to last
	* - Alt: Next group
	* - Default: Next item
	*
	* @param e - Keyboard event
	*/
	#next(e) {
		e.preventDefault();
		if (e.metaKey) this.#last();
		else if (e.altKey) this.updateSelectedByGroup(1);
		else this.updateSelectedByItem(1);
	}
	#down(e) {
		if (this.opts.columns.current === null) return;
		e.preventDefault();
		if (e.metaKey) this.updateSelectedByGroup(1);
		else this.updateSelectedByItem(this.#nextRowColumnOffset(e));
	}
	#getColumn(item, grid) {
		if (grid.length === 0) return null;
		for (let r = 0; r < grid.length; r++) {
			const row = grid[r];
			if (row === void 0) continue;
			for (let c = 0; c < row.length; c++) {
				const column = row[c];
				if (column === void 0 || column.ref !== item) continue;
				return {
					columnIndex: c,
					rowIndex: r
				};
			}
		}
		return null;
	}
	#nextRowColumnOffset(e) {
		const grid = this.itemsGrid;
		const selected = this.#getSelectedItem();
		if (!selected) return 0;
		const column = this.#getColumn(selected, grid);
		if (!column) return 0;
		let newItem = null;
		const skipRows = e.altKey ? 1 : 0;
		if (e.altKey && column.rowIndex === grid.length - 2 && !this.opts.loop.current) newItem = this.#findNextNonDisabledItem({
			start: grid.length - 1,
			end: grid.length,
			expectedColumnIndex: column.columnIndex,
			grid
		});
		else if (column.rowIndex === grid.length - 1) {
			if (!this.opts.loop.current) return 0;
			newItem = this.#findNextNonDisabledItem({
				start: 0 + skipRows,
				end: column.rowIndex,
				expectedColumnIndex: column.columnIndex,
				grid
			});
		} else {
			newItem = this.#findNextNonDisabledItem({
				start: column.rowIndex + 1 + skipRows,
				end: grid.length,
				expectedColumnIndex: column.columnIndex,
				grid
			});
			if (newItem === null && this.opts.loop.current) newItem = this.#findNextNonDisabledItem({
				start: 0,
				end: column.rowIndex,
				expectedColumnIndex: column.columnIndex,
				grid
			});
		}
		return this.#calculateOffset(selected, newItem);
	}
	/** Attempts to find the next non-disabled column that matches the expected column.
	*
	* @remarks
	* - Skips over disabled columns
	* - When a row is shorter than the expected column it defaults to the last item in the row
	*
	* @param param0
	* @returns
	*/
	#findNextNonDisabledItem({ start, end, grid, expectedColumnIndex }) {
		let newItem = null;
		for (let r = start; r < end; r++) {
			const row = grid[r];
			newItem = row[expectedColumnIndex]?.ref ?? null;
			if (newItem !== null && itemIsDisabled(newItem)) {
				newItem = null;
				continue;
			}
			if (newItem === null) for (let i = row.length - 1; i >= 0; i--) {
				const item = row[row.length - 1];
				if (item === void 0 || itemIsDisabled(item.ref)) continue;
				newItem = item.ref;
				break;
			}
			break;
		}
		return newItem;
	}
	#calculateOffset(selected, newSelected) {
		if (newSelected === null) return 0;
		const items = this.getValidItems();
		const ogIndex = items.findIndex((item) => item === selected);
		return items.findIndex((item) => item === newSelected) - ogIndex;
	}
	#up(e) {
		if (this.opts.columns.current === null) return;
		e.preventDefault();
		if (e.metaKey) this.updateSelectedByGroup(-1);
		else this.updateSelectedByItem(this.#previousRowColumnOffset(e));
	}
	#previousRowColumnOffset(e) {
		const grid = this.itemsGrid;
		const selected = this.#getSelectedItem();
		if (selected === void 0) return 0;
		const column = this.#getColumn(selected, grid);
		if (column === null) return 0;
		let newItem = null;
		const skipRows = e.altKey ? 1 : 0;
		if (e.altKey && column.rowIndex === 1 && this.opts.loop.current === false) newItem = this.#findNextNonDisabledItemDesc({
			start: 0,
			end: 0,
			expectedColumnIndex: column.columnIndex,
			grid
		});
		else if (column.rowIndex === 0) {
			if (this.opts.loop.current === false) return 0;
			newItem = this.#findNextNonDisabledItemDesc({
				start: grid.length - 1 - skipRows,
				end: column.rowIndex + 1,
				expectedColumnIndex: column.columnIndex,
				grid
			});
		} else {
			newItem = this.#findNextNonDisabledItemDesc({
				start: column.rowIndex - 1 - skipRows,
				end: 0,
				expectedColumnIndex: column.columnIndex,
				grid
			});
			if (newItem === null && this.opts.loop.current) newItem = this.#findNextNonDisabledItemDesc({
				start: grid.length - 1,
				end: column.rowIndex + 1,
				expectedColumnIndex: column.columnIndex,
				grid
			});
		}
		return this.#calculateOffset(selected, newItem);
	}
	/**
	* Attempts to find the next non-disabled column that matches the expected column.
	*
	* @remarks
	* - Skips over disabled columns
	* - When a row is shorter than the expected column it defaults to the last item in the row
	*/
	#findNextNonDisabledItemDesc({ start, end, grid, expectedColumnIndex }) {
		let newItem = null;
		for (let r = start; r >= end; r--) {
			const row = grid[r];
			if (row === void 0) continue;
			newItem = row[expectedColumnIndex]?.ref ?? null;
			if (newItem !== null && itemIsDisabled(newItem)) {
				newItem = null;
				continue;
			}
			if (newItem === null) for (let i = row.length - 1; i >= 0; i--) {
				const item = row[row.length - 1];
				if (item === void 0 || itemIsDisabled(item.ref)) continue;
				newItem = item.ref;
				break;
			}
			break;
		}
		return newItem;
	}
	/**
	* Handles previous item selection:
	* - Meta: Jump to first
	* - Alt: Previous group
	* - Default: Previous item
	*
	* @param e - Keyboard event
	*/
	#prev(e) {
		e.preventDefault();
		if (e.metaKey) this.updateSelectedToIndex(0);
		else if (e.altKey) this.updateSelectedByGroup(-1);
		else this.updateSelectedByItem(-1);
	}
	onkeydown(e) {
		const isVim = this.opts.vimBindings.current && e.ctrlKey;
		switch (e.key) {
			case "n":
			case "j":
				if (isVim) if (this.isGrid) this.#down(e);
				else this.#next(e);
				break;
			case "l":
				if (isVim) {
					if (this.isGrid) this.#next(e);
				}
				break;
			case ARROW_DOWN:
				if (this.isGrid) this.#down(e);
				else this.#next(e);
				break;
			case ARROW_RIGHT:
				if (!this.isGrid) break;
				this.#next(e);
				break;
			case "p":
			case "k":
				if (isVim) if (this.isGrid) this.#up(e);
				else this.#prev(e);
				break;
			case "h":
				if (isVim && this.isGrid) this.#prev(e);
				break;
			case ARROW_UP:
				if (this.isGrid) this.#up(e);
				else this.#prev(e);
				break;
			case ARROW_LEFT:
				if (!this.isGrid) break;
				this.#prev(e);
				break;
			case HOME:
				e.preventDefault();
				this.updateSelectedToIndex(0);
				break;
			case "End":
				e.preventDefault();
				this.#last();
				break;
			case ENTER:
 /**
			* Check if IME composition is finished before triggering the select event.
			* This prevents unwanted triggering while user is still inputting text with IME.
			* e.keyCode === 229 is for the Japanese IME && Safari as `isComposing` does not
			* work with Japanese IME and Safari in combination.
			*/
			if (!e.isComposing && e.keyCode !== 229) {
				e.preventDefault();
				const item = this.#getSelectedItem();
				if (item) item?.click();
			}
		}
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "application",
		[commandAttrs.root]: "",
		tabindex: -1,
		onkeydown: this.onkeydown,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
function itemIsDisabled(item) {
	return item.getAttribute("aria-disabled") === "true";
}
var CommandEmptyState = class CommandEmptyState {
	static create(opts) {
		return new CommandEmptyState(opts, CommandRootContext.get());
	}
	opts;
	root;
	attachment;
	#shouldRender = derived(() => {
		return this.root._commandState.filtered.count === 0 && this.#isInitialRender === false || this.opts.forceMount.current;
	});
	get shouldRender() {
		return this.#shouldRender();
	}
	set shouldRender($$value) {
		return this.#shouldRender($$value);
	}
	#isInitialRender = true;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "presentation",
		[commandAttrs.empty]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CommandGroupContainerState = class CommandGroupContainerState {
	static create(opts) {
		return CommandGroupContainerContext.set(new CommandGroupContainerState(opts, CommandRootContext.get()));
	}
	opts;
	root;
	attachment;
	#shouldRender = derived(() => {
		if (this.opts.forceMount.current) return true;
		if (this.root.opts.shouldFilter.current === false) return true;
		if (!this.root.commandState.search) return true;
		return this.root._commandState.filtered.groups.has(this.trueValue);
	});
	get shouldRender() {
		return this.#shouldRender();
	}
	set shouldRender($$value) {
		return this.#shouldRender($$value);
	}
	headingNode = null;
	trueValue = "";
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
		this.trueValue = opts.value.current ?? opts.id.current;
		watch(() => this.trueValue, () => {
			return this.root.registerGroup(this.trueValue);
		});
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "presentation",
		hidden: this.shouldRender ? void 0 : true,
		"data-value": this.trueValue,
		[commandAttrs.group]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CommandGroupHeadingState = class CommandGroupHeadingState {
	static create(opts) {
		return new CommandGroupHeadingState(opts, CommandGroupContainerContext.get());
	}
	opts;
	group;
	attachment;
	constructor(opts, group) {
		this.opts = opts;
		this.group = group;
		this.attachment = attachRef(this.opts.ref, (v) => this.group.headingNode = v);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		[commandAttrs["group-heading"]]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CommandGroupItemsState = class CommandGroupItemsState {
	static create(opts) {
		return new CommandGroupItemsState(opts, CommandGroupContainerContext.get());
	}
	opts;
	group;
	attachment;
	constructor(opts, group) {
		this.opts = opts;
		this.group = group;
		this.attachment = attachRef(this.opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "group",
		[commandAttrs["group-items"]]: "",
		"aria-labelledby": this.group.headingNode?.id ?? void 0,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CommandInputState = class CommandInputState {
	static create(opts) {
		return new CommandInputState(opts, CommandRootContext.get());
	}
	opts;
	root;
	attachment;
	#selectedItemId = derived(() => {
		const item = this.root.viewportNode?.querySelector(`${COMMAND_ITEM_SELECTOR}[${COMMAND_VALUE_ATTR}="${cssEscape(this.root.opts.value.current)}"]`);
		if (item === void 0 || item === null) return;
		return item.getAttribute("id") ?? void 0;
	});
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => this.root.inputNode = v);
		watch(() => this.opts.ref.current, () => {
			const node = this.opts.ref.current;
			if (node && this.opts.autofocus.current) afterSleep(10, () => node.focus());
		});
		watch(() => this.opts.value.current, () => {
			if (this.root.commandState.search !== this.opts.value.current) this.root.setState("search", this.opts.value.current);
		});
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		type: "text",
		[commandAttrs.input]: "",
		autocomplete: "off",
		autocorrect: "off",
		spellcheck: false,
		"aria-autocomplete": "list",
		role: "combobox",
		"aria-expanded": boolToStr(true),
		"aria-controls": this.root.viewportNode?.id ?? void 0,
		"aria-labelledby": this.root.labelNode?.id ?? void 0,
		"aria-activedescendant": this.#selectedItemId(),
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CommandItemState = class CommandItemState {
	static create(opts) {
		const group = CommandGroupContainerContext.getOr(null);
		return new CommandItemState({
			...opts,
			group
		}, CommandRootContext.get());
	}
	opts;
	root;
	attachment;
	#group = null;
	#trueForceMount = derived(() => {
		return this.opts.forceMount.current || this.#group?.opts.forceMount.current === true;
	});
	#shouldRender = derived(() => {
		this.opts.ref.current;
		if (this.#trueForceMount() || this.root.opts.shouldFilter.current === false || !this.root.commandState.search) return true;
		const currentScore = this.root.commandState.filtered.items.get(this.trueValue);
		if (currentScore === void 0) return false;
		return currentScore > 0;
	});
	get shouldRender() {
		return this.#shouldRender();
	}
	set shouldRender($$value) {
		return this.#shouldRender($$value);
	}
	#isSelected = derived(() => this.root.opts.value.current === this.trueValue && this.trueValue !== "");
	get isSelected() {
		return this.#isSelected();
	}
	set isSelected($$value) {
		return this.#isSelected($$value);
	}
	trueValue = "";
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.#group = CommandGroupContainerContext.getOr(null);
		this.trueValue = opts.value.current;
		this.attachment = attachRef(this.opts.ref);
		watch([
			() => this.trueValue,
			() => this.#group?.trueValue,
			() => this.opts.forceMount.current
		], () => {
			if (this.opts.forceMount.current || !this.trueValue) return;
			return this.root.registerItem(this.trueValue, this.#group?.trueValue);
		});
		watch([() => this.opts.value.current, () => this.opts.ref.current], () => {
			if (this.opts.value.current) this.trueValue = this.opts.value.current;
			else if (this.opts.ref.current?.textContent) this.trueValue = this.opts.ref.current.textContent.trim();
			if (this.trueValue) {
				this.root.registerValue(this.trueValue, opts.keywords.current.map((kw) => kw.trim()));
				this.opts.ref.current?.setAttribute(COMMAND_VALUE_ATTR, this.trueValue);
			}
		});
		this.onclick = this.onclick.bind(this);
		this.onpointermove = this.onpointermove.bind(this);
	}
	#onSelect() {
		if (this.opts.disabled.current) return;
		this.#select();
		this.opts.onSelect?.current();
	}
	#select() {
		if (this.opts.disabled.current) return;
		this.root.setValue(this.trueValue, true);
	}
	onpointermove(_) {
		if (this.opts.disabled.current || this.root.opts.disablePointerSelection.current) return;
		this.#select();
	}
	onclick(_) {
		if (this.opts.disabled.current) return;
		this.#onSelect();
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"aria-disabled": boolToStr(this.opts.disabled.current),
		"aria-selected": boolToStr(this.isSelected),
		"data-disabled": boolToEmptyStrOrUndef(this.opts.disabled.current),
		"data-selected": boolToEmptyStrOrUndef(this.isSelected),
		"data-value": this.trueValue,
		"data-group": this.#group?.trueValue,
		[commandAttrs.item]: "",
		role: "option",
		onpointermove: this.onpointermove,
		onclick: this.onclick,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CommandSeparatorState = class CommandSeparatorState {
	static create(opts) {
		return new CommandSeparatorState(opts, CommandRootContext.get());
	}
	opts;
	root;
	attachment;
	#shouldRender = derived(() => !this.root._commandState.search || this.opts.forceMount.current);
	get shouldRender() {
		return this.#shouldRender();
	}
	set shouldRender($$value) {
		return this.#shouldRender($$value);
	}
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"aria-hidden": "true",
		[commandAttrs.separator]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CommandListState = class CommandListState {
	static create(opts) {
		return CommandListContext.set(new CommandListState(opts, CommandRootContext.get()));
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		role: "listbox",
		"aria-label": this.opts.ariaLabel.current,
		[commandAttrs.list]: "",
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var CommandLabelState = class CommandLabelState {
	static create(opts) {
		return new CommandLabelState(opts, CommandRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => this.root.labelNode = v);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		[commandAttrs["input-label"]]: "",
		for: this.opts.for?.current,
		style: srOnlyStyles,
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
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/bits/command/components/_command-label.svelte
function _command_label($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, children, $$slots, $$events, ...restProps } = $$props;
		const labelState = CommandLabelState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, labelState.props));
		$$renderer.push(`<label${attributes({ ...mergedProps() })}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></label>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/bits/command/components/command.svelte
function Command$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, value = "", onValueChange = noop, onStateChange = noop, loop = false, shouldFilter = true, filter = computeCommandScore, label = "", vimBindings = true, disablePointerSelection = false, disableInitialScroll = false, columns = null, children, child, $$slots, $$events, ...restProps } = $$props;
		const rootState = CommandRootState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			filter: boxWith(() => filter),
			shouldFilter: boxWith(() => shouldFilter),
			loop: boxWith(() => loop),
			value: boxWith(() => value, (v) => {
				if (value !== v) {
					value = v;
					onValueChange(v);
				}
			}),
			vimBindings: boxWith(() => vimBindings),
			disablePointerSelection: boxWith(() => disablePointerSelection),
			disableInitialScroll: boxWith(() => disableInitialScroll),
			onStateChange: boxWith(() => onStateChange),
			columns: boxWith(() => columns)
		});
		/**
		* Sets selection to item at specified index in valid items array.
		* If index is out of bounds, does nothing.
		*
		* @param index - Zero-based index of item to select
		* @remarks
		* Uses `getValidItems()` to get selectable items, filtering out disabled/hidden ones.
		* Access valid items directly via `getValidItems()` to check bounds before calling.
		*
		* @example
		* // get valid items length for bounds check
		* const items = getValidItems()
		* if (index < items.length) {
		*   updateSelectedToIndex(index)
		* }
		*/
		const updateSelectedToIndex = (i) => rootState.updateSelectedToIndex(i);
		/**
		* Moves selection to the first valid item in the next/previous group.
		* If no group is found, falls back to selecting the next/previous item globally.
		*
		* @param change - Direction to move: 1 for next group, -1 for previous group
		* @example
		* // move to first item in next group
		* updateSelectedByGroup(1)
		*
		* // move to first item in previous group
		* updateSelectedByGroup(-1)
		*/
		const updateSelectedByGroup = (c) => rootState.updateSelectedByGroup(c);
		/**
		* Updates selected item by moving up/down relative to current selection.
		* Handles wrapping when loop option is enabled.
		*
		* @param change - Direction to move: 1 for next item, -1 for previous item
		* @remarks
		* The loop behavior wraps:
		* - From last item to first when moving next
		* - From first item to last when moving previous
		*
		* Uses `getValidItems()` to get all selectable items, which filters out disabled/hidden items.
		* You can call `getValidItems()` directly to get the current valid items array.
		*
		* @example
		* // select next item
		* updateSelectedByItem(1)
		*
		* // get all valid items
		* const items = getValidItems()
		*/
		const updateSelectedByItem = (c) => rootState.updateSelectedByItem(c);
		/**
		* Gets all non-disabled, visible command items.
		*
		* @returns Array of valid item elements
		* @remarks Exposed for direct item access and bound checking
		*/
		const getValidItems = () => rootState.getValidItems();
		const mergedProps = derived(() => mergeProps(restProps, rootState.props));
		function Label($$renderer) {
			_command_label($$renderer, {
				children: ($$renderer) => {
					$$renderer.push(`<!---->${escape_html(label)}`);
				},
				$$slots: { default: true }
			});
		}
		if (child) {
			$$renderer.push("<!--[0-->");
			Label($$renderer);
			$$renderer.push(`<!----> `);
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<div${attributes({ ...mergedProps() })}>`);
			Label($$renderer);
			$$renderer.push(`<!----> `);
			children?.($$renderer);
			$$renderer.push(`<!----></div>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, {
			ref,
			value,
			updateSelectedToIndex,
			updateSelectedByGroup,
			updateSelectedByItem,
			getValidItems
		});
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/bits/command/components/command-empty.svelte
function Command_empty$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, children, child, forceMount = false, $$slots, $$events, ...restProps } = $$props;
		const emptyState = CommandEmptyState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			forceMount: boxWith(() => forceMount)
		});
		const mergedProps = derived(() => mergeProps(emptyState.props, restProps));
		if (emptyState.shouldRender) {
			$$renderer.push("<!--[0-->");
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
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/bits/command/components/command-group.svelte
function Command_group$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, value = "", forceMount = false, children, child, $$slots, $$events, ...restProps } = $$props;
		const groupState = CommandGroupContainerState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			forceMount: boxWith(() => forceMount),
			value: boxWith(() => value)
		});
		const mergedProps = derived(() => mergeProps(restProps, groupState.props));
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
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/bits/command/components/command-group-heading.svelte
function Command_group_heading($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, children, child, $$slots, $$events, ...restProps } = $$props;
		const headingState = CommandGroupHeadingState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, headingState.props));
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
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/bits/command/components/command-group-items.svelte
function Command_group_items($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, children, child, $$slots, $$events, ...restProps } = $$props;
		const groupItemsState = CommandGroupItemsState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v)
		});
		const mergedProps = derived(() => mergeProps(restProps, groupItemsState.props));
		$$renderer.push(`<div style="display: contents;">`);
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
		$$renderer.push(`<!--]--></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/bits/command/components/command-input.svelte
function Command_input$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { value = "", autofocus = false, id = createId(uid), ref = null, child, $$slots, $$events, ...restProps } = $$props;
		const inputState = CommandInputState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			value: boxWith(() => value, (v) => {
				value = v;
			}),
			autofocus: boxWith(() => autofocus ?? false)
		});
		const mergedProps = derived(() => mergeProps(restProps, inputState.props));
		if (child) {
			$$renderer.push("<!--[0-->");
			child($$renderer, { props: mergedProps() });
			$$renderer.push(`<!---->`);
		} else {
			$$renderer.push("<!--[-1-->");
			$$renderer.push(`<input${attributes({
				...mergedProps(),
				value
			}, void 0, void 0, void 0, 4)}/>`);
		}
		$$renderer.push(`<!--]-->`);
		bind_props($$props, {
			value,
			ref
		});
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/bits/command/components/command-item.svelte
function Command_item$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, value = "", disabled = false, children, child, onSelect = noop, forceMount = false, keywords = [], $$slots, $$events, ...restProps } = $$props;
		const itemState = CommandItemState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			value: boxWith(() => value),
			disabled: boxWith(() => disabled),
			onSelect: boxWith(() => onSelect),
			forceMount: boxWith(() => forceMount),
			keywords: boxWith(() => keywords)
		});
		const mergedProps = derived(() => mergeProps(restProps, itemState.props));
		$$renderer.push(`<!---->`);
		$$renderer.push(`<div style="display: contents;" data-item-wrapper=""${attr("data-value", itemState.trueValue)}>`);
		if (itemState.shouldRender) {
			$$renderer.push("<!--[0-->");
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
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
		$$renderer.push(`<!---->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/bits/command/components/command-list.svelte
function Command_list$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, child, children, "aria-label": ariaLabel, $$slots, $$events, ...restProps } = $$props;
		const listState = CommandListState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			ariaLabel: boxWith(() => ariaLabel ?? "Suggestions...")
		});
		const mergedProps = derived(() => mergeProps(restProps, listState.props));
		$$renderer.push(`<!---->`);
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
		$$renderer.push(`<!---->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/bits/command/components/command-separator.svelte
function Command_separator$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { id = createId(uid), ref = null, forceMount = false, children, child, $$slots, $$events, ...restProps } = $$props;
		const separatorState = CommandSeparatorState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			forceMount: boxWith(() => forceMount)
		});
		const mergedProps = derived(() => mergeProps(restProps, separatorState.props));
		if (separatorState.shouldRender) {
			$$renderer.push("<!--[0-->");
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
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/bits/command/compute-command-score.js
var SCORE_CONTINUE_MATCH = 1;
var SCORE_SPACE_WORD_JUMP = .9;
var SCORE_NON_SPACE_WORD_JUMP = .8;
var SCORE_CHARACTER_JUMP = .17;
var SCORE_TRANSPOSITION = .1;
var PENALTY_SKIPPED = .999;
var PENALTY_CASE_MISMATCH = .9999;
var PENALTY_NOT_COMPLETE = .99;
var IS_GAP_REGEXP = /[\\/_+.#"@[({&]/;
var COUNT_GAPS_REGEXP = /[\\/_+.#"@[({&]/g;
var IS_SPACE_REGEXP = /[\s-]/;
var COUNT_SPACE_REGEXP = /[\s-]/g;
function computeCommandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, stringIndex, abbreviationIndex, memoizedResults) {
	if (abbreviationIndex === abbreviation.length) {
		if (stringIndex === string.length) return SCORE_CONTINUE_MATCH;
		return PENALTY_NOT_COMPLETE;
	}
	const memoizeKey = `${stringIndex},${abbreviationIndex}`;
	if (memoizedResults[memoizeKey] !== void 0) return memoizedResults[memoizeKey];
	const abbreviationChar = lowerAbbreviation.charAt(abbreviationIndex);
	let index = lowerString.indexOf(abbreviationChar, stringIndex);
	let highScore = 0;
	let score, transposedScore, wordBreaks, spaceBreaks;
	while (index >= 0) {
		score = computeCommandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, index + 1, abbreviationIndex + 1, memoizedResults);
		if (score > highScore) {
			if (index === stringIndex) score *= SCORE_CONTINUE_MATCH;
			else if (IS_GAP_REGEXP.test(string.charAt(index - 1))) {
				score *= SCORE_NON_SPACE_WORD_JUMP;
				wordBreaks = string.slice(stringIndex, index - 1).match(COUNT_GAPS_REGEXP);
				if (wordBreaks && stringIndex > 0) score *= PENALTY_SKIPPED ** wordBreaks.length;
			} else if (IS_SPACE_REGEXP.test(string.charAt(index - 1))) {
				score *= SCORE_SPACE_WORD_JUMP;
				spaceBreaks = string.slice(stringIndex, index - 1).match(COUNT_SPACE_REGEXP);
				if (spaceBreaks && stringIndex > 0) score *= PENALTY_SKIPPED ** spaceBreaks.length;
			} else {
				score *= SCORE_CHARACTER_JUMP;
				if (stringIndex > 0) score *= PENALTY_SKIPPED ** (index - stringIndex);
			}
			if (string.charAt(index) !== abbreviation.charAt(abbreviationIndex)) score *= PENALTY_CASE_MISMATCH;
		}
		if (score < SCORE_TRANSPOSITION && lowerString.charAt(index - 1) === lowerAbbreviation.charAt(abbreviationIndex + 1) || lowerAbbreviation.charAt(abbreviationIndex + 1) === lowerAbbreviation.charAt(abbreviationIndex) && lowerString.charAt(index - 1) !== lowerAbbreviation.charAt(abbreviationIndex)) {
			transposedScore = computeCommandScoreInner(string, abbreviation, lowerString, lowerAbbreviation, index + 1, abbreviationIndex + 2, memoizedResults);
			if (transposedScore * SCORE_TRANSPOSITION > score) score = transposedScore * SCORE_TRANSPOSITION;
		}
		if (score > highScore) highScore = score;
		index = lowerString.indexOf(abbreviationChar, index + 1);
	}
	memoizedResults[memoizeKey] = highScore;
	return highScore;
}
/**
*
* @param string
* @returns
*/
function formatInput(string) {
	return string.toLowerCase().replace(COUNT_SPACE_REGEXP, " ");
}
/**
* Given a command, a search query, and (optionally) a list of keywords for the command,
* computes a score between 0 and 1 that represents how well the search query matches the
* abbreviation and keywords. 1 is a perfect match, 0 is no match.
*
* The score is calculated based on the following rules:
* - The scores are arranged so that a continuous match of characters will result in a total
* score of 1. The best case, this character is a match, and either this is the start of the string
* or the previous character was also a match.
* - A new match at the start of a word scores better than a new match elsewhere as it's more likely
* that the user will type the starts of fragments.
* - Word jumps between spaces are scored slightly higher than slashes, brackets, hyphens, etc.
* - A continuous match of characters will result in a total score of 1.
* - A new match at the start of a word scores better than a new match elsewhere as it's more likely that the user will type the starts of fragments.
* - Any other match isn't ideal, but we include it for completeness.
* - If the user transposed two letters, it should be significantly penalized.
* - The goodness of a match should decay slightly with each missing character.
* - Match higher for letters closer to the beginning of the word.
*
* @param command - The value to score against the search string (e.g. a command name like "Calculator")
* @param search - The search string to score against the value/aliases
* @param commandKeywords - An optional list of aliases/keywords to score against the search string - e.g. ["math", "add", "divide", "multiply", "subtract"]
* @returns A score between 0 and 1 that represents how well the search string matches the
* command (and keywords)
*/
function computeCommandScore(command, search, commandKeywords) {
	/**
	* NOTE: We used to do lower-casing on each recursive call, but this meant that `toLowerCase()`
	* was the dominating cost in the algorithm. Passing both is a little ugly, but considerably
	* faster.
	*/
	command = commandKeywords && commandKeywords.length > 0 ? `${`${command} ${commandKeywords?.join(" ")}`}` : command;
	return computeCommandScoreInner(command, search, formatInput(command), formatInput(search), 0, 0, {});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/bits/popover/popover.svelte.js
var popoverAttrs = createBitsAttrs({
	component: "popover",
	parts: [
		"root",
		"trigger",
		"content",
		"close",
		"overlay"
	]
});
var PopoverRootContext = new Context("Popover.Root");
var PopoverRootState = class PopoverRootState {
	static create(opts) {
		return PopoverRootContext.set(new PopoverRootState(opts));
	}
	opts;
	contentNode = null;
	contentPresence;
	triggerNode = null;
	overlayNode = null;
	overlayPresence;
	openedViaHover = false;
	hasInteractedWithContent = false;
	hoverCooldown = false;
	closeDelay = 0;
	#closeTimeout = null;
	#domContext = null;
	constructor(opts) {
		this.opts = opts;
		this.contentPresence = new PresenceManager({
			ref: boxWith(() => this.contentNode),
			open: this.opts.open,
			onComplete: () => {
				this.opts.onOpenChangeComplete.current(this.opts.open.current);
			}
		});
		this.overlayPresence = new PresenceManager({
			ref: boxWith(() => this.overlayNode),
			open: this.opts.open
		});
		watch(() => this.opts.open.current, (isOpen) => {
			if (!isOpen) {
				this.openedViaHover = false;
				this.hasInteractedWithContent = false;
				this.#clearCloseTimeout();
			}
		});
	}
	setDomContext(ctx) {
		this.#domContext = ctx;
	}
	#clearCloseTimeout() {
		if (this.#closeTimeout !== null && this.#domContext) {
			this.#domContext.clearTimeout(this.#closeTimeout);
			this.#closeTimeout = null;
		}
	}
	toggleOpen() {
		this.#clearCloseTimeout();
		this.opts.open.current = !this.opts.open.current;
	}
	handleClose() {
		this.#clearCloseTimeout();
		if (!this.opts.open.current) return;
		this.opts.open.current = false;
	}
	handleHoverOpen() {
		this.#clearCloseTimeout();
		if (this.opts.open.current) return;
		this.openedViaHover = true;
		this.opts.open.current = true;
	}
	handleHoverClose() {
		if (!this.opts.open.current) return;
		if (this.openedViaHover && !this.hasInteractedWithContent) this.opts.open.current = false;
	}
	handleDelayedHoverClose() {
		if (!this.opts.open.current) return;
		if (!this.openedViaHover || this.hasInteractedWithContent) return;
		this.#clearCloseTimeout();
		if (this.closeDelay <= 0) this.opts.open.current = false;
		else if (this.#domContext) this.#closeTimeout = this.#domContext.setTimeout(() => {
			if (this.openedViaHover && !this.hasInteractedWithContent) this.opts.open.current = false;
			this.#closeTimeout = null;
		}, this.closeDelay);
	}
	cancelDelayedClose() {
		this.#clearCloseTimeout();
	}
	markInteraction() {
		this.hasInteractedWithContent = true;
		this.#clearCloseTimeout();
	}
};
var PopoverTriggerState = class PopoverTriggerState {
	static create(opts) {
		return new PopoverTriggerState(opts, PopoverRootContext.get());
	}
	opts;
	root;
	attachment;
	domContext;
	#openTimeout = null;
	#closeTimeout = null;
	#isHovering = false;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => this.root.triggerNode = v);
		this.domContext = new DOMContext(opts.ref);
		this.root.setDomContext(this.domContext);
		this.onclick = this.onclick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.onpointerenter = this.onpointerenter.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
		watch(() => this.opts.closeDelay.current, (delay) => {
			this.root.closeDelay = delay;
		});
	}
	#clearOpenTimeout() {
		if (this.#openTimeout !== null) {
			this.domContext.clearTimeout(this.#openTimeout);
			this.#openTimeout = null;
		}
	}
	#clearCloseTimeout() {
		if (this.#closeTimeout !== null) {
			this.domContext.clearTimeout(this.#closeTimeout);
			this.#closeTimeout = null;
		}
	}
	#clearAllTimeouts() {
		this.#clearOpenTimeout();
		this.#clearCloseTimeout();
	}
	onpointerenter(e) {
		if (this.opts.disabled.current) return;
		if (!this.opts.openOnHover.current) return;
		if (isTouch(e)) return;
		this.#isHovering = true;
		this.#clearCloseTimeout();
		this.root.cancelDelayedClose();
		if (this.root.opts.open.current || this.root.hoverCooldown) return;
		const delay = this.opts.openDelay.current;
		if (delay <= 0) this.root.handleHoverOpen();
		else this.#openTimeout = this.domContext.setTimeout(() => {
			this.root.handleHoverOpen();
			this.#openTimeout = null;
		}, delay);
	}
	onpointerleave(e) {
		if (this.opts.disabled.current) return;
		if (!this.opts.openOnHover.current) return;
		if (isTouch(e)) return;
		this.#isHovering = false;
		this.#clearOpenTimeout();
		this.root.hoverCooldown = false;
	}
	onclick(e) {
		if (this.opts.disabled.current) return;
		if (e.button !== 0) return;
		this.#clearAllTimeouts();
		if (this.#isHovering && this.root.opts.open.current && this.root.openedViaHover) {
			this.root.openedViaHover = false;
			this.root.hasInteractedWithContent = true;
			return;
		}
		if (this.#isHovering && this.opts.openOnHover.current && this.root.opts.open.current) this.root.hoverCooldown = true;
		if (this.root.hoverCooldown && !this.root.opts.open.current) this.root.hoverCooldown = false;
		this.root.toggleOpen();
	}
	onkeydown(e) {
		if (this.opts.disabled.current) return;
		if (!(e.key === "Enter" || e.key === " ")) return;
		e.preventDefault();
		this.#clearAllTimeouts();
		this.root.toggleOpen();
	}
	#getAriaControls() {
		if (this.root.opts.open.current && this.root.contentNode?.id) return this.root.contentNode?.id;
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		"aria-haspopup": "dialog",
		"aria-expanded": boolToStr(this.root.opts.open.current),
		"data-state": getDataOpenClosed(this.root.opts.open.current),
		"aria-controls": this.#getAriaControls(),
		[popoverAttrs.trigger]: "",
		disabled: this.opts.disabled.current,
		onkeydown: this.onkeydown,
		onclick: this.onclick,
		onpointerenter: this.onpointerenter,
		onpointerleave: this.onpointerleave,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
};
var PopoverContentState = class PopoverContentState {
	static create(opts) {
		return new PopoverContentState(opts, PopoverRootContext.get());
	}
	opts;
	root;
	attachment;
	constructor(opts, root) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => this.root.contentNode = v);
		this.onpointerdown = this.onpointerdown.bind(this);
		this.onfocusin = this.onfocusin.bind(this);
		this.onpointerenter = this.onpointerenter.bind(this);
		this.onpointerleave = this.onpointerleave.bind(this);
		new SafePolygon({
			triggerNode: () => this.root.triggerNode,
			contentNode: () => this.root.contentNode,
			enabled: () => this.root.opts.open.current && this.root.openedViaHover && !this.root.hasInteractedWithContent,
			onPointerExit: () => {
				this.root.handleDelayedHoverClose();
			}
		});
	}
	onpointerdown(_) {
		this.root.markInteraction();
	}
	onfocusin(e) {
		const target = e.target;
		if (isElement(target) && isTabbable(target)) this.root.markInteraction();
	}
	onpointerenter(e) {
		if (isTouch(e)) return;
		this.root.cancelDelayedClose();
	}
	onpointerleave(e) {
		if (isTouch(e)) return;
	}
	onInteractOutside = (e) => {
		this.opts.onInteractOutside.current(e);
		if (e.defaultPrevented) return;
		if (!isElement(e.target)) return;
		const closestTrigger = e.target.closest(popoverAttrs.selector("trigger"));
		if (closestTrigger && closestTrigger === this.root.triggerNode) return;
		if (this.opts.customAnchor.current) {
			if (isElement(this.opts.customAnchor.current)) {
				if (this.opts.customAnchor.current.contains(e.target)) return;
			} else if (typeof this.opts.customAnchor.current === "string") {
				const el = document.querySelector(this.opts.customAnchor.current);
				if (el && el.contains(e.target)) return;
			}
		}
		this.root.handleClose();
	};
	onEscapeKeydown = (e) => {
		this.opts.onEscapeKeydown.current(e);
		if (e.defaultPrevented) return;
		this.root.handleClose();
	};
	get shouldRender() {
		return this.root.contentPresence.shouldRender;
	}
	get shouldTrapFocus() {
		if (this.root.openedViaHover && !this.root.hasInteractedWithContent) return false;
		return true;
	}
	#snippetProps = derived(() => ({ open: this.root.opts.open.current }));
	get snippetProps() {
		return this.#snippetProps();
	}
	set snippetProps($$value) {
		return this.#snippetProps($$value);
	}
	#props = derived(() => ({
		id: this.opts.id.current,
		tabindex: -1,
		"data-state": getDataOpenClosed(this.root.opts.open.current),
		...getDataTransitionAttrs(this.root.contentPresence.transitionStatus),
		[popoverAttrs.content]: "",
		style: {
			pointerEvents: "auto",
			contain: "layout style"
		},
		onpointerdown: this.onpointerdown,
		onfocusin: this.onfocusin,
		onpointerenter: this.onpointerenter,
		onpointerleave: this.onpointerleave,
		...this.attachment
	}));
	get props() {
		return this.#props();
	}
	set props($$value) {
		return this.#props($$value);
	}
	popperProps = {
		onInteractOutside: this.onInteractOutside,
		onEscapeKeydown: this.onEscapeKeydown
	};
};
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/bits/popover/components/popover-content.svelte
function Popover_content$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { child, children, ref = null, id = createId(uid), forceMount = false, onOpenAutoFocus = noop, onCloseAutoFocus = noop, onEscapeKeydown = noop, onInteractOutside = noop, trapFocus = true, preventScroll = false, customAnchor = null, style, $$slots, $$events, ...restProps } = $$props;
		const contentState = PopoverContentState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			onInteractOutside: boxWith(() => onInteractOutside),
			onEscapeKeydown: boxWith(() => onEscapeKeydown),
			customAnchor: boxWith(() => customAnchor)
		});
		const mergedProps = derived(() => mergeProps(restProps, contentState.props));
		const effectiveTrapFocus = derived(() => trapFocus && contentState.shouldTrapFocus);
		function handleOpenAutoFocus(e) {
			if (!contentState.shouldTrapFocus) e.preventDefault();
			onOpenAutoFocus(e);
		}
		if (forceMount) {
			$$renderer.push("<!--[0-->");
			{
				function popper($$renderer, { props, wrapperProps }) {
					const finalProps = mergeProps(props, { style: getFloatingContentCSSVars("popover") }, { style });
					if (child) {
						$$renderer.push("<!--[0-->");
						child($$renderer, {
							props: finalProps,
							wrapperProps,
							...contentState.snippetProps
						});
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<div${attributes({ ...wrapperProps })}><div${attributes({ ...finalProps })}>`);
						children?.($$renderer);
						$$renderer.push(`<!----></div></div>`);
					}
					$$renderer.push(`<!--]-->`);
				}
				Popper_layer_force_mount($$renderer, spread_props([
					mergedProps(),
					contentState.popperProps,
					{
						ref: contentState.opts.ref,
						enabled: contentState.root.opts.open.current,
						id,
						trapFocus: effectiveTrapFocus(),
						preventScroll,
						loop: true,
						forceMount: true,
						customAnchor,
						onOpenAutoFocus: handleOpenAutoFocus,
						onCloseAutoFocus,
						shouldRender: contentState.shouldRender,
						popper,
						$$slots: { popper: true }
					}
				]));
			}
		} else if (!forceMount) {
			$$renderer.push("<!--[1-->");
			{
				function popper($$renderer, { props, wrapperProps }) {
					const finalProps = mergeProps(props, { style: getFloatingContentCSSVars("popover") }, { style });
					if (child) {
						$$renderer.push("<!--[0-->");
						child($$renderer, {
							props: finalProps,
							wrapperProps,
							...contentState.snippetProps
						});
						$$renderer.push(`<!---->`);
					} else {
						$$renderer.push("<!--[-1-->");
						$$renderer.push(`<div${attributes({ ...wrapperProps })}><div${attributes({ ...finalProps })}>`);
						children?.($$renderer);
						$$renderer.push(`<!----></div></div>`);
					}
					$$renderer.push(`<!--]-->`);
				}
				Popper_layer($$renderer, spread_props([
					mergedProps(),
					contentState.popperProps,
					{
						ref: contentState.opts.ref,
						open: contentState.root.opts.open.current,
						id,
						trapFocus: effectiveTrapFocus(),
						preventScroll,
						loop: true,
						forceMount: false,
						customAnchor,
						onOpenAutoFocus: handleOpenAutoFocus,
						onCloseAutoFocus,
						shouldRender: contentState.shouldRender,
						popper,
						$$slots: { popper: true }
					}
				]));
			}
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/bits/popover/components/popover-trigger.svelte
function Popover_trigger$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const uid = props_id($$renderer);
		let { children, child, id = createId(uid), ref = null, type = "button", disabled = false, openOnHover = false, openDelay = 700, closeDelay = 300, $$slots, $$events, ...restProps } = $$props;
		const triggerState = PopoverTriggerState.create({
			id: boxWith(() => id),
			ref: boxWith(() => ref, (v) => ref = v),
			disabled: boxWith(() => Boolean(disabled)),
			openOnHover: boxWith(() => openOnHover),
			openDelay: boxWith(() => openDelay),
			closeDelay: boxWith(() => closeDelay)
		});
		const mergedProps = derived(() => mergeProps(restProps, triggerState.props, { type }));
		Floating_layer_anchor($$renderer, {
			id,
			ref: triggerState.opts.ref,
			children: ($$renderer) => {
				if (child) {
					$$renderer.push("<!--[0-->");
					child($$renderer, { props: mergedProps() });
					$$renderer.push(`<!---->`);
				} else {
					$$renderer.push("<!--[-1-->");
					$$renderer.push(`<button${attributes({ ...mergedProps() })}>`);
					children?.($$renderer);
					$$renderer.push(`<!----></button>`);
				}
				$$renderer.push(`<!--]-->`);
			},
			$$slots: { default: true }
		});
		bind_props($$props, { ref });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/bits-ui@2.18.1_@internationalized+date@3.12.1_@sveltejs+kit@2.61.0_@sveltejs+vite-plugi_1bd9a6e483b9678b3ff7560f50540ddf/node_modules/bits-ui/dist/bits/popover/components/popover.svelte
function Popover$1($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, onOpenChange = noop, onOpenChangeComplete = noop, children } = $$props;
		PopoverRootState.create({
			open: boxWith(() => open, (v) => {
				open = v;
				onOpenChange(v);
			}),
			onOpenChangeComplete: boxWith(() => onOpenChangeComplete)
		});
		Floating_layer($$renderer, {
			children: ($$renderer) => {
				children?.($$renderer);
				$$renderer.push(`<!---->`);
			},
			$$slots: { default: true }
		});
		bind_props($$props, { open });
	});
}
//#endregion
//#region src/lib/components/shared/heading.svelte
function Heading($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const { title, description, class: cls, variant } = $$props;
		$$renderer.push(`<header${attr_class(clsx(cn(variant === "small" ? "" : "mb-4 space-y-0.5", cls)))}><h2${attr_class(clsx(variant === "small" ? "mb-0.5 text-base font-medium" : "text-xl font-semibold tracking-tight"))}>${escape_html(title)}</h2> `);
		if (description) {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<p class="text-sm text-muted-foreground">${escape_html(description)}</p>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></header>`);
	});
}
//#endregion
//#region src/lib/components/ui/data-table/data-table.svelte.ts
function createSvelteTable(options) {
	const resolvedOptions = mergeObjects({
		state: {},
		onStateChange() {},
		renderFallbackValue: null,
		mergeOptions: (defaultOptions, options) => {
			return mergeObjects(defaultOptions, options);
		}
	}, options);
	const table = createTable(resolvedOptions);
	let state = table.initialState;
	function updateOptions() {
		table.setOptions(() => {
			return mergeObjects(resolvedOptions, options, {
				state: mergeObjects(state, options.state || {}),
				onStateChange: (updater) => {
					if (updater instanceof Function) state = updater(state);
					else state = mergeObjects(state, updater);
					options.onStateChange?.(updater);
				}
			});
		});
	}
	updateOptions();
	return table;
}
/**
* Lazily merges several objects (or thunks) while preserving
* getter semantics from every source.
*
* Proxy-based to avoid known WebKit recursion issue.
*/
function mergeObjects(...sources) {
	const resolve = (src) => typeof src === "function" ? src() ?? void 0 : src;
	const findSourceWithKey = (key) => {
		for (let i = sources.length - 1; i >= 0; i--) {
			const obj = resolve(sources[i]);
			if (obj && key in obj) return obj;
		}
	};
	return new Proxy(Object.create(null), {
		get(_, key) {
			return findSourceWithKey(key)?.[key];
		},
		has(_, key) {
			return !!findSourceWithKey(key);
		},
		ownKeys() {
			const all = /* @__PURE__ */ new Set();
			for (const s of sources) {
				const obj = resolve(s);
				if (obj) for (const k of Reflect.ownKeys(obj)) all.add(k);
			}
			return [...all];
		},
		getOwnPropertyDescriptor(_, key) {
			const src = findSourceWithKey(key);
			if (!src) return void 0;
			return {
				configurable: true,
				enumerable: true,
				value: src[key],
				writable: true
			};
		}
	});
}
//#endregion
//#region src/lib/components/ui/data-table/render-helpers.ts
/**
* A helper class to make it easy to identify Svelte components in
* `columnDef.cell` and `columnDef.header` properties.
*
* > NOTE: This class should only be used internally by the adapter. If you're
* reading this and you don't know what this is for, you probably don't need it.
*
* @example
* ```svelte
* {@const result = content(context as any)}
* {#if result instanceof RenderComponentConfig}
*   {@const { component: Component, props } = result}
*   <Component {...props} />
* {/if}
* ```
*/
var RenderComponentConfig = class {
	component;
	props;
	constructor(component, props = {}) {
		this.component = component;
		this.props = props;
	}
};
/**
* A helper class to make it easy to identify Svelte Snippets in `columnDef.cell` and `columnDef.header` properties.
*
* > NOTE: This class should only be used internally by the adapter. If you're
* reading this and you don't know what this is for, you probably don't need it.
*
* @example
* ```svelte
* {@const result = content(context as any)}
* {#if result instanceof RenderSnippetConfig}
*   {@const { snippet, params } = result}
*   {@render snippet(params)}
* {/if}
* ```
*/
var RenderSnippetConfig = class {
	snippet;
	params;
	constructor(snippet, params) {
		this.snippet = snippet;
		this.params = params;
	}
};
//#endregion
//#region src/lib/components/ui/data-table/flex-render.svelte
function Flex_render($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		/** The cell or header field of the current cell's column definition. */
		/** The cell or header field of the current cell's column definition. */
		/** The result of the `getContext()` function of the header or cell */
		/** Used to pass attachments that can't be gotten through context */
		let { content, context, attach } = $$props;
		if (typeof content === "string") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`${escape_html(content)}`);
		} else if (content instanceof Function) {
			$$renderer.push("<!--[1-->");
			const result = content(context);
			if (result instanceof RenderComponentConfig) {
				$$renderer.push("<!--[0-->");
				const { component: Component, props } = result;
				if (Component) {
					$$renderer.push("<!--[-->");
					Component($$renderer, spread_props([props, { attach }]));
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			} else if (result instanceof RenderSnippetConfig) {
				$$renderer.push("<!--[1-->");
				const { snippet, params } = result;
				snippet($$renderer, {
					...params,
					attach
				});
				$$renderer.push(`<!---->`);
			} else {
				$$renderer.push("<!--[-1-->");
				$$renderer.push(`${escape_html(result)}`);
			}
			$$renderer.push(`<!--]-->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]-->`);
	});
}
//#endregion
//#region src/lib/components/ui/table/table.svelte
function Table($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div data-slot="table-container" class="relative w-full overflow-x-auto"><table${attributes({
			"data-slot": "table",
			class: clsx(cn("w-full caption-bottom text-xs", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></table></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/table/table-body.svelte
function Table_body($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<tbody${attributes({
			"data-slot": "table-body",
			class: clsx(cn("[&_tr:last-child]:border-0", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></tbody>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/table/table-cell.svelte
function Table_cell($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<td${attributes({
			"data-slot": "table-cell",
			class: clsx(cn("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></td>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/table/table-head.svelte
function Table_head($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<th${attributes({
			"data-slot": "table-head",
			class: clsx(cn("h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></th>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/table/table-header.svelte
function Table_header($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<thead${attributes({
			"data-slot": "table-header",
			class: clsx(cn("[&_tr]:border-b", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></thead>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/table/table-row.svelte
function Table_row($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<tr${attributes({
			"data-slot": "table-row",
			class: clsx(cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></tr>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/empty/empty.svelte
function Empty($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "empty",
			class: clsx(cn("flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center text-balance", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/shared/data-table/data-table.svelte
function Pagination($$renderer, { table }) {
	$$renderer.push(`<div class="flex items-center justify-between px-2"><div class="flex-1 text-sm text-muted-foreground">${escape_html(table.getFilteredSelectedRowModel().rows.length)} of
			${escape_html(table.getFilteredRowModel().rows.length)} row(s) selected.</div> <div class="flex items-center space-x-6 lg:space-x-8"><div class="flex items-center space-x-2"><p class="text-sm font-medium">Rows per page</p> `);
	if (Select) {
		$$renderer.push("<!--[-->");
		Select($$renderer, {
			allowDeselect: false,
			type: "single",
			value: `${table.getState().pagination.pageSize}`,
			onValueChange: (value) => {
				table.setPageSize(Number(value));
			},
			children: ($$renderer) => {
				if (Select_trigger) {
					$$renderer.push("<!--[-->");
					Select_trigger($$renderer, {
						class: "h-8 w-[70px]",
						children: ($$renderer) => {
							$$renderer.push(`<!---->${escape_html(String(table.getState().pagination.pageSize))}`);
						},
						$$slots: { default: true }
					});
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
				$$renderer.push(` `);
				if (Select_content) {
					$$renderer.push("<!--[-->");
					Select_content($$renderer, {
						side: "top",
						children: ($$renderer) => {
							$$renderer.push(`<!--[-->`);
							const each_array = ensure_array_like([
								10,
								20,
								30,
								40,
								50
							]);
							for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
								let pageSize = each_array[$$index];
								if (Select_item) {
									$$renderer.push("<!--[-->");
									Select_item($$renderer, {
										value: `${pageSize}`,
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(pageSize)}`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
							}
							$$renderer.push(`<!--]-->`);
						},
						$$slots: { default: true }
					});
					$$renderer.push("<!--]-->");
				} else {
					$$renderer.push("<!--[!-->");
					$$renderer.push("<!--]-->");
				}
			},
			$$slots: { default: true }
		});
		$$renderer.push("<!--]-->");
	} else {
		$$renderer.push("<!--[!-->");
		$$renderer.push("<!--]-->");
	}
	$$renderer.push(`</div> <div class="flex w-[100px] items-center justify-center text-sm font-medium">Page ${escape_html(table.getState().pagination.pageIndex + 1)} of
				${escape_html(table.getPageCount())}</div> <div class="flex items-center space-x-2">`);
	Button($$renderer, {
		variant: "outline",
		class: "hidden size-8 p-0 lg:flex",
		onclick: () => table.setPageIndex(0),
		disabled: !table.getCanPreviousPage(),
		children: ($$renderer) => {
			$$renderer.push(`<span class="sr-only">Go to first page</span> `);
			CaretDoubleLeftIcon($$renderer, {});
			$$renderer.push(`<!---->`);
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----> `);
	Button($$renderer, {
		variant: "outline",
		class: "size-8 p-0",
		onclick: () => table.previousPage(),
		disabled: !table.getCanPreviousPage(),
		children: ($$renderer) => {
			$$renderer.push(`<span class="sr-only">Go to previous page</span> `);
			CaretLeftIcon($$renderer, {});
			$$renderer.push(`<!---->`);
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----> `);
	Button($$renderer, {
		variant: "outline",
		class: "size-8 p-0",
		onclick: () => table.nextPage(),
		disabled: !table.getCanNextPage(),
		children: ($$renderer) => {
			$$renderer.push(`<span class="sr-only">Go to next page</span> `);
			CaretRightIcon($$renderer, {});
			$$renderer.push(`<!---->`);
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----> `);
	Button($$renderer, {
		variant: "outline",
		class: "hidden size-8 p-0 lg:flex",
		onclick: () => table.setPageIndex(table.getPageCount() - 1),
		disabled: !table.getCanNextPage(),
		children: ($$renderer) => {
			$$renderer.push(`<span class="sr-only">Go to last page</span> `);
			CaretDoubleRightIcon($$renderer, {});
			$$renderer.push(`<!---->`);
		},
		$$slots: { default: true }
	});
	$$renderer.push(`<!----></div></div></div>`);
}
function Data_table($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data, columns, toolbar, pageIndex = 0, pageSize = 10, pageCount = 1, manualPagination = false } = $$props;
		let rowSelection = {};
		let columnVisibility = {};
		let columnFilters = [];
		let sorting = [];
		const table = createSvelteTable({
			get data() {
				return data;
			},
			get pageCount() {
				return manualPagination ? pageCount : void 0;
			},
			get manualPagination() {
				return manualPagination;
			},
			state: {
				get sorting() {
					return sorting;
				},
				get columnVisibility() {
					return columnVisibility;
				},
				get rowSelection() {
					return rowSelection;
				},
				get columnFilters() {
					return columnFilters;
				},
				get pagination() {
					return {
						pageIndex,
						pageSize
					};
				}
			},
			get columns() {
				return columns;
			},
			enableRowSelection: true,
			onRowSelectionChange: (updater) => {
				if (typeof updater === "function") rowSelection = updater(rowSelection);
				else rowSelection = updater;
			},
			onSortingChange: (updater) => {
				if (typeof updater === "function") sorting = updater(sorting);
				else sorting = updater;
			},
			onColumnFiltersChange: (updater) => {
				if (typeof updater === "function") columnFilters = updater(columnFilters);
				else columnFilters = updater;
			},
			onColumnVisibilityChange: (updater) => {
				if (typeof updater === "function") columnVisibility = updater(columnVisibility);
				else columnVisibility = updater;
			},
			onPaginationChange: (updater) => {
				if (typeof updater === "function") {
					const next = updater({
						pageIndex,
						pageSize
					});
					pageIndex = next.pageIndex;
					pageSize = next.pageSize;
				} else {
					pageIndex = updater.pageIndex;
					pageSize = updater.pageSize;
				}
			},
			getCoreRowModel: getCoreRowModel(),
			getFilteredRowModel: getFilteredRowModel(),
			getPaginationRowModel: getPaginationRowModel(),
			getSortedRowModel: getSortedRowModel(),
			getFacetedRowModel: getFacetedRowModel(),
			getFacetedUniqueValues: getFacetedUniqueValues()
		});
		$$renderer.push(`<div class="space-y-4">`);
		if (toolbar) {
			$$renderer.push("<!--[0-->");
			toolbar($$renderer, table);
			$$renderer.push(`<!---->`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--> <div class="rounded-md border">`);
		if (Table) {
			$$renderer.push("<!--[-->");
			Table($$renderer, {
				children: ($$renderer) => {
					if (Table_header) {
						$$renderer.push("<!--[-->");
						Table_header($$renderer, {
							children: ($$renderer) => {
								$$renderer.push(`<!--[-->`);
								const each_array_1 = ensure_array_like(table.getHeaderGroups());
								for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
									let headerGroup = each_array_1[$$index_2];
									if (Table_row) {
										$$renderer.push("<!--[-->");
										Table_row($$renderer, {
											children: ($$renderer) => {
												$$renderer.push(`<!--[-->`);
												const each_array_2 = ensure_array_like(headerGroup.headers);
												for (let $$index_1 = 0, $$length = each_array_2.length; $$index_1 < $$length; $$index_1++) {
													let header = each_array_2[$$index_1];
													const meta = header.column.columnDef.meta;
													if (Table_head) {
														$$renderer.push("<!--[-->");
														Table_head($$renderer, {
															colspan: header.colSpan,
															class: meta?.className,
															children: ($$renderer) => {
																if (!header.isPlaceholder) {
																	$$renderer.push("<!--[0-->");
																	Flex_render($$renderer, {
																		content: header.column.columnDef.header,
																		context: header.getContext()
																	});
																} else $$renderer.push("<!--[-1-->");
																$$renderer.push(`<!--]-->`);
															},
															$$slots: { default: true }
														});
														$$renderer.push("<!--]-->");
													} else {
														$$renderer.push("<!--[!-->");
														$$renderer.push("<!--]-->");
													}
												}
												$$renderer.push(`<!--]-->`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
								}
								$$renderer.push(`<!--]-->`);
							},
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
					$$renderer.push(` `);
					if (Table_body) {
						$$renderer.push("<!--[-->");
						Table_body($$renderer, {
							children: ($$renderer) => {
								const each_array_3 = ensure_array_like(table.getRowModel().rows);
								if (each_array_3.length !== 0) {
									$$renderer.push("<!--[-->");
									for (let $$index_4 = 0, $$length = each_array_3.length; $$index_4 < $$length; $$index_4++) {
										let row = each_array_3[$$index_4];
										if (Table_row) {
											$$renderer.push("<!--[-->");
											Table_row($$renderer, {
												"data-state": row.getIsSelected() && "selected",
												children: ($$renderer) => {
													$$renderer.push(`<!--[-->`);
													const each_array_4 = ensure_array_like(row.getVisibleCells());
													for (let $$index_3 = 0, $$length = each_array_4.length; $$index_3 < $$length; $$index_3++) {
														let cell = each_array_4[$$index_3];
														const meta = cell.column.columnDef.meta;
														if (Table_cell) {
															$$renderer.push("<!--[-->");
															Table_cell($$renderer, {
																class: meta?.className,
																children: ($$renderer) => {
																	Flex_render($$renderer, {
																		content: cell.column.columnDef.cell,
																		context: cell.getContext()
																	});
																},
																$$slots: { default: true }
															});
															$$renderer.push("<!--]-->");
														} else {
															$$renderer.push("<!--[!-->");
															$$renderer.push("<!--]-->");
														}
													}
													$$renderer.push(`<!--]-->`);
												},
												$$slots: { default: true }
											});
											$$renderer.push("<!--]-->");
										} else {
											$$renderer.push("<!--[!-->");
											$$renderer.push("<!--]-->");
										}
									}
								} else {
									$$renderer.push("<!--[!-->");
									if (Table_row) {
										$$renderer.push("<!--[-->");
										Table_row($$renderer, {
											children: ($$renderer) => {
												if (Table_cell) {
													$$renderer.push("<!--[-->");
													Table_cell($$renderer, {
														colspan: columns.length,
														class: "p-0",
														children: ($$renderer) => {
															Empty($$renderer, {
																class: "border-0 rounded-none bg-transparent py-16",
																children: ($$renderer) => {
																	$$renderer.push(`<div class="flex flex-col items-center gap-1.5"><p class="text-sm font-semibold">No results found</p> <p class="text-xs text-muted-foreground">Try adjusting your filters or search term.</p></div>`);
																},
																$$slots: { default: true }
															});
														},
														$$slots: { default: true }
													});
													$$renderer.push("<!--]-->");
												} else {
													$$renderer.push("<!--[!-->");
													$$renderer.push("<!--]-->");
												}
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
								}
								$$renderer.push(`<!--]-->`);
							},
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				},
				$$slots: { default: true }
			});
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
		$$renderer.push(`</div> `);
		Pagination($$renderer, { table });
		$$renderer.push(`<!----></div>`);
		bind_props($$props, {
			pageIndex,
			pageSize,
			pageCount
		});
	});
}
//#endregion
//#region src/lib/components/shared/data-table/data-table-view-options.svelte
function Data_table_view_options($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { table } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Dropdown_menu) {
				$$renderer.push("<!--[-->");
				Dropdown_menu($$renderer, {
					children: ($$renderer) => {
						if (Dropdown_menu_trigger) {
							$$renderer.push("<!--[-->");
							Dropdown_menu_trigger($$renderer, {
								class: buttonVariants({
									variant: "outline",
									size: "sm",
									class: "ms-auto hidden h-8 lg:flex"
								}),
								children: ($$renderer) => {
									SlidersHorizontalIcon($$renderer, {});
									$$renderer.push(`<!----> View`);
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
						$$renderer.push(` `);
						if (Dropdown_menu_content) {
							$$renderer.push("<!--[-->");
							Dropdown_menu_content($$renderer, {
								children: ($$renderer) => {
									if (Dropdown_menu_group) {
										$$renderer.push("<!--[-->");
										Dropdown_menu_group($$renderer, {
											children: ($$renderer) => {
												if (Dropdown_menu_label) {
													$$renderer.push("<!--[-->");
													Dropdown_menu_label($$renderer, {
														children: ($$renderer) => {
															$$renderer.push(`<!---->Toggle columns`);
														},
														$$slots: { default: true }
													});
													$$renderer.push("<!--]-->");
												} else {
													$$renderer.push("<!--[!-->");
													$$renderer.push("<!--]-->");
												}
												$$renderer.push(` `);
												if (Dropdown_menu_separator) {
													$$renderer.push("<!--[-->");
													Dropdown_menu_separator($$renderer, {});
													$$renderer.push("<!--]-->");
												} else {
													$$renderer.push("<!--[!-->");
													$$renderer.push("<!--]-->");
												}
												$$renderer.push(` <!--[-->`);
												const each_array = ensure_array_like(table.getAllColumns().filter((col) => typeof col.accessorFn !== "undefined" && col.getCanHide()));
												for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
													let column = each_array[$$index];
													var bind_get = () => column.getIsVisible();
													var bind_set = (v) => column.toggleVisibility(!!v);
													if (Dropdown_menu_checkbox_item) {
														$$renderer.push("<!--[-->");
														Dropdown_menu_checkbox_item($$renderer, {
															get checked() {
																return bind_get();
															},
															set checked($$value) {
																bind_set($$value);
															},
															class: "capitalize",
															children: ($$renderer) => {
																$$renderer.push(`<!---->${escape_html(column.id)}`);
															},
															$$slots: { default: true }
														});
														$$renderer.push("<!--]-->");
													} else {
														$$renderer.push("<!--[!-->");
														$$renderer.push("<!--]-->");
													}
												}
												$$renderer.push(`<!--]-->`);
											},
											$$slots: { default: true }
										});
										$$renderer.push("<!--]-->");
									} else {
										$$renderer.push("<!--[!-->");
										$$renderer.push("<!--]-->");
									}
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					},
					$$slots: { default: true }
				});
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
	});
}
//#endregion
//#region src/lib/components/ui/command/command.svelte
function Command($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { api = null, ref = null, value = "", class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Command$1) {
				$$renderer.push("<!--[-->");
				Command$1($$renderer, spread_props([
					{
						"data-slot": "command",
						class: cn("flex size-full flex-col overflow-hidden rounded-xl bg-popover p-1 text-popover-foreground", className)
					},
					restProps,
					{
						get value() {
							return value;
						},
						set value($$value) {
							value = $$value;
							$$settled = false;
						},
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
		bind_props($$props, {
			api,
			ref,
			value
		});
	});
}
//#endregion
//#region src/lib/components/ui/command/command-empty.svelte
function Command_empty($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Command_empty$1) {
				$$renderer.push("<!--[-->");
				Command_empty$1($$renderer, spread_props([
					{
						"data-slot": "command-empty",
						class: cn("py-6 text-center text-xs/relaxed", className)
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
//#region src/lib/components/ui/command/command-group.svelte
function Command_group($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, heading, value, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Command_group$1) {
				$$renderer.push("<!--[-->");
				Command_group$1($$renderer, spread_props([
					{
						"data-slot": "command-group",
						class: cn("overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2.5 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground", className),
						value: value ?? heading ?? `----${useId()}`
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						},
						children: ($$renderer) => {
							if (heading) {
								$$renderer.push("<!--[0-->");
								if (Command_group_heading) {
									$$renderer.push("<!--[-->");
									Command_group_heading($$renderer, {
										class: "px-2 py-1.5 text-xs font-medium text-muted-foreground",
										children: ($$renderer) => {
											$$renderer.push(`<!---->${escape_html(heading)}`);
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
							} else $$renderer.push("<!--[-1-->");
							$$renderer.push(`<!--]--> `);
							if (Command_group_items) {
								$$renderer.push("<!--[-->");
								Command_group_items($$renderer, { children });
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
						},
						$$slots: { default: true }
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
//#region src/lib/components/ui/command/command-item.svelte
function Command_item($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Command_item$1) {
				$$renderer.push("<!--[-->");
				Command_item$1($$renderer, spread_props([
					{
						"data-slot": "command-item",
						class: cn("group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-selected:bg-muted data-selected:text-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground", className)
					},
					restProps,
					{
						get ref() {
							return ref;
						},
						set ref($$value) {
							ref = $$value;
							$$settled = false;
						},
						children: ($$renderer) => {
							children?.($$renderer);
							$$renderer.push(`<!----> `);
							Check($$renderer, { class: "cn-command-item-indicator ml-auto opacity-0 group-has-[[data-slot=command-shortcut]]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" });
							$$renderer.push(`<!---->`);
						},
						$$slots: { default: true }
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
//#region src/lib/components/ui/input-group/input-group.svelte
function Input_group($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...props } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "input-group",
			role: "group",
			class: clsx(cn("group/input-group relative flex h-7 w-full min-w-0 items-center rounded-md border border-input bg-input/20 transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-data-[align=block-end]:rounded-md has-data-[align=block-start]:rounded-md has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/30 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-2 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[textarea]:rounded-md has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:bg-input/30 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5", className)),
			...props
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/input-group/input-group-addon.svelte
var inputGroupAddonVariants = tv({
	base: "text-muted-foreground **:data-[slot=kbd]:bg-muted-foreground/10 h-auto gap-1 py-2 text-xs/relaxed font-medium group-data-[disabled=true]/input-group:opacity-50 **:data-[slot=kbd]:rounded-[calc(var(--radius-sm)-2px)] **:data-[slot=kbd]:px-1 **:data-[slot=kbd]:text-[0.625rem] [&>svg:not([class*='size-'])]:size-3.5 flex cursor-text items-center justify-center select-none",
	variants: { align: {
		"inline-start": "pl-2 has-[>button]:ml-[-0.275rem] has-[>kbd]:ml-[-0.275rem] order-first",
		"inline-end": "pr-2 has-[>button]:mr-[-0.275rem] has-[>kbd]:mr-[-0.275rem] order-last",
		"block-start": "px-2 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2 order-first w-full justify-start",
		"block-end": "px-2 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2 order-last w-full justify-start"
	} },
	defaultVariants: { align: "inline-start" }
});
function Input_group_addon($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, align = "inline-start", $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			role: "group",
			"data-slot": "input-group-addon",
			"data-align": align,
			class: clsx(cn(inputGroupAddonVariants({ align }), className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
tv({
	base: "gap-2 rounded-md text-xs/relaxed flex items-center shadow-none",
	variants: { size: {
		xs: "h-5 gap-1 rounded-[calc(var(--radius-sm)-2px)] px-1 [&>svg:not([class*='size-'])]:size-3",
		sm: "gap-1",
		"icon-xs": "size-6 p-0 has-[>svg]:p-0",
		"icon-sm": "size-7 p-0 has-[>svg]:p-0"
	} },
	defaultVariants: { size: "xs" }
});
//#endregion
//#region src/lib/components/ui/input-group/input-group-input.svelte
function Input_group_input($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, value = void 0, class: className, $$slots, $$events, ...props } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Input($$renderer, spread_props([
				{
					"data-slot": "input-group-control",
					class: cn("flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent", className)
				},
				props,
				{
					get ref() {
						return ref;
					},
					set ref($$value) {
						ref = $$value;
						$$settled = false;
					},
					get value() {
						return value;
					},
					set value($$value) {
						value = $$value;
						$$settled = false;
					}
				}
			]));
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			ref,
			value
		});
	});
}
//#endregion
//#region src/lib/components/ui/command/command-input.svelte
function Command_input($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, value = "", $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			$$renderer.push(`<div data-slot="command-input-wrapper" class="p-1 pb-0">`);
			if (Input_group) {
				$$renderer.push("<!--[-->");
				Input_group($$renderer, {
					class: "h-8! bg-input/20 dark:bg-input/30",
					children: ($$renderer) => {
						{
							function child($$renderer, { props }) {
								if (Input_group_input) {
									$$renderer.push("<!--[-->");
									Input_group_input($$renderer, spread_props([props, {
										get value() {
											return value;
										},
										set value($$value) {
											value = $$value;
											$$settled = false;
										},
										get ref() {
											return ref;
										},
										set ref($$value) {
											ref = $$value;
											$$settled = false;
										}
									}]));
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
							}
							if (Command_input$1) {
								$$renderer.push("<!--[-->");
								Command_input$1($$renderer, spread_props([
									{
										value,
										"data-slot": "command-input",
										class: cn("w-full text-xs/relaxed outline-hidden disabled:cursor-not-allowed disabled:opacity-50", className)
									},
									restProps,
									{
										child,
										$$slots: { child: true }
									}
								]));
								$$renderer.push("<!--]-->");
							} else {
								$$renderer.push("<!--[!-->");
								$$renderer.push("<!--]-->");
							}
						}
						$$renderer.push(` `);
						if (Input_group_addon) {
							$$renderer.push("<!--[-->");
							Input_group_addon($$renderer, {
								children: ($$renderer) => {
									MagnifyingGlass($$renderer, { class: "size-3.5 shrink-0 opacity-50" });
								},
								$$slots: { default: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					},
					$$slots: { default: true }
				});
				$$renderer.push("<!--]-->");
			} else {
				$$renderer.push("<!--[!-->");
				$$renderer.push("<!--]-->");
			}
			$$renderer.push(`</div>`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
		bind_props($$props, {
			ref,
			value
		});
	});
}
//#endregion
//#region src/lib/components/ui/command/command-list.svelte
function Command_list($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Command_list$1) {
				$$renderer.push("<!--[-->");
				Command_list$1($$renderer, spread_props([
					{
						"data-slot": "command-list",
						class: cn("no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none", className)
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
//#region src/lib/components/ui/command/command-separator.svelte
function Command_separator($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Command_separator$1) {
				$$renderer.push("<!--[-->");
				Command_separator$1($$renderer, spread_props([
					{
						"data-slot": "command-separator",
						class: cn("-mx-1 my-1 h-px bg-border/50", className)
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
//#region src/lib/components/ui/popover/popover.svelte
function Popover($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { open = false, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Popover$1) {
				$$renderer.push("<!--[-->");
				Popover$1($$renderer, spread_props([restProps, {
					get open() {
						return open;
					},
					set open($$value) {
						open = $$value;
						$$settled = false;
					}
				}]));
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
		bind_props($$props, { open });
	});
}
//#endregion
//#region src/lib/components/ui/popover/popover-portal.svelte
function Popover_portal($$renderer, $$props) {
	let { $$slots, $$events, ...restProps } = $$props;
	if (Portal) {
		$$renderer.push("<!--[-->");
		Portal($$renderer, spread_props([restProps]));
		$$renderer.push("<!--]-->");
	} else {
		$$renderer.push("<!--[!-->");
		$$renderer.push("<!--]-->");
	}
}
//#endregion
//#region src/lib/components/ui/popover/popover-content.svelte
function Popover_content($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, sideOffset = 4, align = "center", portalProps, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Popover_portal($$renderer, spread_props([portalProps, {
				children: ($$renderer) => {
					if (Popover_content$1) {
						$$renderer.push("<!--[-->");
						Popover_content$1($$renderer, spread_props([
							{
								"data-slot": "popover-content",
								sideOffset,
								align,
								class: cn("z-50 flex w-72 origin-(--transform-origin) flex-col gap-4 rounded-lg bg-popover p-2.5 text-xs text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className)
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
				},
				$$slots: { default: true }
			}]));
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
//#region src/lib/components/ui/popover/popover-trigger.svelte
function Popover_trigger($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			if (Popover_trigger$1) {
				$$renderer.push("<!--[-->");
				Popover_trigger$1($$renderer, spread_props([
					{
						"data-slot": "popover-trigger",
						class: cn("", className)
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
//#region src/lib/components/shared/data-table/data-table-faceted-filter.svelte
function Data_table_faceted_filter($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { column, title, options } = $$props;
		const facets = derived(() => column?.getFacetedUniqueValues());
		const selectedValues = derived(() => new SvelteSet(column?.getFilterValue()));
		if (Popover) {
			$$renderer.push("<!--[-->");
			Popover($$renderer, {
				children: ($$renderer) => {
					{
						function child($$renderer, { props }) {
							Button($$renderer, spread_props([props, {
								variant: "outline",
								size: "sm",
								class: "h-8 border-dashed",
								children: ($$renderer) => {
									PlusCircleIcon($$renderer, {});
									$$renderer.push(`<!----> ${escape_html(title)} `);
									if (selectedValues().size > 0) {
										$$renderer.push("<!--[0-->");
										Separator($$renderer, {
											orientation: "vertical",
											class: "mx-2 h-4"
										});
										$$renderer.push(`<!----> `);
										Badge($$renderer, {
											variant: "secondary",
											class: "rounded-sm px-1 font-normal lg:hidden",
											children: ($$renderer) => {
												$$renderer.push(`<!---->${escape_html(selectedValues().size)}`);
											},
											$$slots: { default: true }
										});
										$$renderer.push(`<!----> <div class="hidden space-x-1 lg:flex">`);
										if (selectedValues().size > 2) {
											$$renderer.push("<!--[0-->");
											Badge($$renderer, {
												variant: "secondary",
												class: "rounded-sm px-1 font-normal",
												children: ($$renderer) => {
													$$renderer.push(`<!---->${escape_html(selectedValues().size)} selected`);
												},
												$$slots: { default: true }
											});
										} else {
											$$renderer.push("<!--[-1-->");
											$$renderer.push(`<!--[-->`);
											const each_array = ensure_array_like(options.filter((opt) => selectedValues().has(opt.value)));
											for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
												let option = each_array[$$index];
												Badge($$renderer, {
													variant: "secondary",
													class: "rounded-sm px-1 font-normal",
													children: ($$renderer) => {
														$$renderer.push(`<!---->${escape_html(option.label)}`);
													},
													$$slots: { default: true }
												});
											}
											$$renderer.push(`<!--]-->`);
										}
										$$renderer.push(`<!--]--></div>`);
									} else $$renderer.push("<!--[-1-->");
									$$renderer.push(`<!--]-->`);
								},
								$$slots: { default: true }
							}]));
						}
						if (Popover_trigger) {
							$$renderer.push("<!--[-->");
							Popover_trigger($$renderer, {
								child,
								$$slots: { child: true }
							});
							$$renderer.push("<!--]-->");
						} else {
							$$renderer.push("<!--[!-->");
							$$renderer.push("<!--]-->");
						}
					}
					$$renderer.push(` `);
					if (Popover_content) {
						$$renderer.push("<!--[-->");
						Popover_content($$renderer, {
							class: "w-[200px] p-0",
							align: "start",
							children: ($$renderer) => {
								if (Command) {
									$$renderer.push("<!--[-->");
									Command($$renderer, {
										children: ($$renderer) => {
											if (Command_input) {
												$$renderer.push("<!--[-->");
												Command_input($$renderer, { placeholder: title });
												$$renderer.push("<!--]-->");
											} else {
												$$renderer.push("<!--[!-->");
												$$renderer.push("<!--]-->");
											}
											$$renderer.push(` `);
											if (Command_list) {
												$$renderer.push("<!--[-->");
												Command_list($$renderer, {
													children: ($$renderer) => {
														if (Command_empty) {
															$$renderer.push("<!--[-->");
															Command_empty($$renderer, {
																children: ($$renderer) => {
																	$$renderer.push(`<!---->No results found.`);
																},
																$$slots: { default: true }
															});
															$$renderer.push("<!--]-->");
														} else {
															$$renderer.push("<!--[!-->");
															$$renderer.push("<!--]-->");
														}
														$$renderer.push(` `);
														if (Command_group) {
															$$renderer.push("<!--[-->");
															Command_group($$renderer, {
																children: ($$renderer) => {
																	$$renderer.push(`<!--[-->`);
																	const each_array_1 = ensure_array_like(options);
																	for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
																		let option = each_array_1[$$index_1];
																		const isSelected = selectedValues().has(option.value);
																		if (Command_item) {
																			$$renderer.push("<!--[-->");
																			Command_item($$renderer, {
																				onSelect: () => {
																					if (isSelected) selectedValues().delete(option.value);
																					else selectedValues().add(option.value);
																					const filterValues = Array.from(selectedValues());
																					column?.setFilterValue(filterValues.length ? filterValues : void 0);
																				},
																				children: ($$renderer) => {
																					$$renderer.push(`<div${attr_class(clsx(cn("me-2 flex size-4 items-center justify-center rounded-sm border border-primary", isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible")))}>`);
																					CheckIcon($$renderer, { class: "size-4" });
																					$$renderer.push(`<!----></div> `);
																					if (option.icon) {
																						$$renderer.push("<!--[0-->");
																						const Icon = option.icon;
																						if (Icon) {
																							$$renderer.push("<!--[-->");
																							Icon($$renderer, { class: "text-muted-foreground" });
																							$$renderer.push("<!--]-->");
																						} else {
																							$$renderer.push("<!--[!-->");
																							$$renderer.push("<!--]-->");
																						}
																					} else $$renderer.push("<!--[-1-->");
																					$$renderer.push(`<!--]--> <span>${escape_html(option.label)}</span> `);
																					if (facets()?.get(option.value)) {
																						$$renderer.push("<!--[0-->");
																						$$renderer.push(`<span class="ms-auto flex size-4 items-center justify-center font-mono text-xs">${escape_html(facets().get(option.value))}</span>`);
																					} else $$renderer.push("<!--[-1-->");
																					$$renderer.push(`<!--]-->`);
																				},
																				$$slots: { default: true }
																			});
																			$$renderer.push("<!--]-->");
																		} else {
																			$$renderer.push("<!--[!-->");
																			$$renderer.push("<!--]-->");
																		}
																	}
																	$$renderer.push(`<!--]-->`);
																},
																$$slots: { default: true }
															});
															$$renderer.push("<!--]-->");
														} else {
															$$renderer.push("<!--[!-->");
															$$renderer.push("<!--]-->");
														}
														$$renderer.push(` `);
														if (selectedValues().size > 0) {
															$$renderer.push("<!--[0-->");
															if (Command_separator) {
																$$renderer.push("<!--[-->");
																Command_separator($$renderer, {});
																$$renderer.push("<!--]-->");
															} else {
																$$renderer.push("<!--[!-->");
																$$renderer.push("<!--]-->");
															}
															$$renderer.push(` `);
															if (Command_group) {
																$$renderer.push("<!--[-->");
																Command_group($$renderer, {
																	children: ($$renderer) => {
																		if (Command_item) {
																			$$renderer.push("<!--[-->");
																			Command_item($$renderer, {
																				onSelect: () => column?.setFilterValue(void 0),
																				class: "justify-center text-center",
																				children: ($$renderer) => {
																					$$renderer.push(`<!---->Clear filters`);
																				},
																				$$slots: { default: true }
																			});
																			$$renderer.push("<!--]-->");
																		} else {
																			$$renderer.push("<!--[!-->");
																			$$renderer.push("<!--]-->");
																		}
																	},
																	$$slots: { default: true }
																});
																$$renderer.push("<!--]-->");
															} else {
																$$renderer.push("<!--[!-->");
																$$renderer.push("<!--]-->");
															}
														} else $$renderer.push("<!--[-1-->");
														$$renderer.push(`<!--]-->`);
													},
													$$slots: { default: true }
												});
												$$renderer.push("<!--]-->");
											} else {
												$$renderer.push("<!--[!-->");
												$$renderer.push("<!--]-->");
											}
										},
										$$slots: { default: true }
									});
									$$renderer.push("<!--]-->");
								} else {
									$$renderer.push("<!--[!-->");
									$$renderer.push("<!--]-->");
								}
							},
							$$slots: { default: true }
						});
						$$renderer.push("<!--]-->");
					} else {
						$$renderer.push("<!--[!-->");
						$$renderer.push("<!--]-->");
					}
				},
				$$slots: { default: true }
			});
			$$renderer.push("<!--]-->");
		} else {
			$$renderer.push("<!--[!-->");
			$$renderer.push("<!--]-->");
		}
	});
}
//#endregion
//#region src/lib/features/tickets/components/columns.svelte
function Columns($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { columns = void 0 } = $$props;
		bind_props($$props, { columns });
	});
}
//#endregion
//#region src/lib/features/tickets/components/tickets-table.svelte
function Tickets_table($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { tickets = [], totalCount = 0, page: page$1 = 1, limit = 10 } = $$props;
		let columns = [];
		let pageIndex = 0;
		let pageSize = 10;
		const pageCount = derived(() => Math.ceil(totalCount / pageSize));
		const statusOptions = [
			{
				label: "Open",
				value: "open"
			},
			{
				label: "In Progress",
				value: "in_progress"
			},
			{
				label: "Resolved",
				value: "resolved"
			},
			{
				label: "Closed",
				value: "closed"
			}
		];
		let $$settled = true;
		let $$inner_renderer;
		function $$render_inner($$renderer) {
			Columns($$renderer, {
				get columns() {
					return columns;
				},
				set columns($$value) {
					columns = $$value;
					$$settled = false;
				}
			});
			$$renderer.push(`<!----> `);
			{
				function toolbar($$renderer, table) {
					const isFiltered = table.getState().columnFilters.length > 0;
					const statusCol = table.getColumn("status");
					$$renderer.push(`<div class="flex items-center justify-between"><div class="flex flex-1 items-center space-x-2">`);
					Input($$renderer, {
						placeholder: "Filter tickets...",
						value: table.getColumn("title")?.getFilterValue() ?? "",
						oninput: (e) => {
							table.getColumn("title")?.setFilterValue(e.currentTarget.value);
						},
						onchange: (e) => {
							table.getColumn("title")?.setFilterValue(e.currentTarget.value);
						},
						class: "h-8 w-40 lg:w-3xs"
					});
					$$renderer.push(`<!----> `);
					if (statusCol) {
						$$renderer.push("<!--[0-->");
						Data_table_faceted_filter($$renderer, {
							column: statusCol,
							title: "Status",
							options: statusOptions
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--> `);
					if (isFiltered) {
						$$renderer.push("<!--[0-->");
						Button($$renderer, {
							variant: "ghost",
							onclick: () => table.resetColumnFilters(),
							class: "h-8 px-2 lg:px-3",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Reset `);
								X($$renderer, { class: "ms-2 size-4" });
								$$renderer.push(`<!---->`);
							},
							$$slots: { default: true }
						});
					} else $$renderer.push("<!--[-1-->");
					$$renderer.push(`<!--]--></div> <div class="flex items-center gap-2">`);
					Button($$renderer, {
						variant: "outline",
						size: "sm",
						class: "h-8",
						href: resolve("/tickets/export") + page.url.search,
						download: "tickets-export.csv",
						children: ($$renderer) => {
							CloudArrowDownIcon($$renderer, {});
							$$renderer.push(`<!----> Export`);
						},
						$$slots: { default: true }
					});
					$$renderer.push(`<!----> `);
					Data_table_view_options($$renderer, { table });
					$$renderer.push(`<!----></div></div>`);
				}
				Data_table($$renderer, {
					data: tickets,
					columns,
					pageCount: pageCount(),
					manualPagination: true,
					get pageIndex() {
						return pageIndex;
					},
					set pageIndex($$value) {
						pageIndex = $$value;
						$$settled = false;
					},
					get pageSize() {
						return pageSize;
					},
					set pageSize($$value) {
						pageSize = $$value;
						$$settled = false;
					},
					toolbar,
					$$slots: { toolbar: true }
				});
			}
			$$renderer.push(`<!---->`);
		}
		do {
			$$settled = true;
			$$inner_renderer = $$renderer.copy();
			$$render_inner($$inner_renderer);
		} while (!$$settled);
		$$renderer.subsume($$inner_renderer);
	});
}
//#endregion
//#region src/routes/(authenticated)/tickets/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { data } = $$props;
		head("18vlldf", $$renderer, ($$renderer) => {
			$$renderer.title(($$renderer) => {
				$$renderer.push(`<title>Tickets</title>`);
			});
		});
		$$renderer.push(`<div class="flex flex-1 flex-col gap-4 p-4 pt-0"><div class="flex w-full items-center justify-between">`);
		Heading($$renderer, {
			title: "Reports List",
			description: "View and manage all organization-wide support incidents and feedback."
		});
		$$renderer.push(`<!----></div> `);
		Tickets_table($$renderer, {
			tickets: data.tickets,
			totalCount: data.totalCount,
			page: data.page,
			limit: data.limit
		});
		$$renderer.push(`<!----></div>`);
	});
}
//#endregion
export { _page as default };
