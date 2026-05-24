//#region ../../node_modules/.pnpm/@sveltejs+kit@2.61.0_@sveltejs+vite-plugin-svelte@7.1.2_svelte@5.55.9_@typescript-eslin_5822561d7327efcbe1f28b5e1e275c46/node_modules/@sveltejs/kit/src/runtime/app/paths/internal/server.js
var base = "";
var assets = base;
var app_dir = "_app";
var initial = {
	base,
	assets
};
/**
* `base` could be overridden during rendering to be relative;
* this one's the original non-relative base path
*/
var initial_base = initial.base;
/**
* @param {{ base: string, assets: string }} paths
*/
function override(paths) {
	base = paths.base;
	assets = paths.assets;
}
function reset() {
	base = initial.base;
	assets = initial.assets;
}
/** @param {string} path */
function set_assets(path) {
	assets = initial.assets = path;
}
//#endregion
//#region ../../node_modules/.pnpm/@sveltejs+kit@2.61.0_@sveltejs+vite-plugin-svelte@7.1.2_svelte@5.55.9_@typescript-eslin_5822561d7327efcbe1f28b5e1e275c46/node_modules/@sveltejs/kit/src/runtime/shared-server.js
/**
* `$env/dynamic/private`
* @type {Record<string, string>}
*/
var private_env = {};
/**
* `$env/dynamic/public`
* @type {Record<string, string>}
*/
var public_env = {};
/** @type {(environment: Record<string, string>) => void} */
function set_private_env(environment) {
	private_env = environment;
}
/** @type {(environment: Record<string, string>) => void} */
function set_public_env(environment) {
	public_env = environment;
}
//#endregion
//#region \0virtual:__sveltekit/environment
var version = "1779618543092";
var building = false;
var prerendering = false;
function set_building() {
	building = true;
}
function set_prerendering() {
	prerendering = true;
}
//#endregion
export { version as a, set_private_env as c, assets as d, base as f, set_assets as g, reset as h, set_prerendering as i, set_public_env as l, override as m, prerendering as n, private_env as o, initial_base as p, set_building as r, public_env as s, building as t, app_dir as u };
