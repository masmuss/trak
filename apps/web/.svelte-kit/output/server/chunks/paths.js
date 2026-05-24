import { f as base, p as initial_base } from "./environment.js";
import { n as resolve_route } from "./routing.js";
import "./internal.js";
import { try_get_request_store } from "@sveltejs/kit/internal/server";
//#region ../../node_modules/.pnpm/@sveltejs+kit@2.61.0_@sveltejs+vite-plugin-svelte@7.1.2_svelte@5.55.9_@typescript-eslin_5822561d7327efcbe1f28b5e1e275c46/node_modules/@sveltejs/kit/src/runtime/app/paths/server.js
/** @type {import('./client.js').resolve} */
function resolve(id, params) {
	if (!id.startsWith("/")) throw new Error(`Cannot use \`resolve(...)\` with a non-absolute pathname or route ID (got "${id}"). \`resolve\` is only for internal pathnames and route IDs; external URLs should be used directly.`);
	const resolved = resolve_route(id, params);
	{
		const store = try_get_request_store();
		if (store && !store.state.prerendering?.fallback) return (store.event.url.pathname.slice(initial_base.length).split("/").slice(2).map(() => "..").join("/") || ".") + resolved;
	}
	return base + resolved;
}
//#endregion
export { resolve as t };
