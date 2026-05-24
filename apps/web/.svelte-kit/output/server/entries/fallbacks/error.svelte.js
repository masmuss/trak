import { et as escape_html } from "../../chunks/dev.js";
import { t as page } from "../../chunks/state.js";
//#region ../../node_modules/.pnpm/@sveltejs+kit@2.61.0_@sveltejs+vite-plugin-svelte@7.1.2_svelte@5.55.9_@typescript-eslin_5822561d7327efcbe1f28b5e1e275c46/node_modules/@sveltejs/kit/src/runtime/components/svelte-5/error.svelte
function Error($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		$$renderer.push(`<h1>${escape_html(page.status)}</h1> <p>${escape_html(page.error?.message)}</p>`);
	});
}
//#endregion
export { Error as default };
