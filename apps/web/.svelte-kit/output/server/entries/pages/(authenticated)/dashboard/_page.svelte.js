import { l as head } from "../../../../chunks/dev.js";
//#region src/routes/(authenticated)/dashboard/+page.svelte
function _page($$renderer) {
	head("16kbgpu", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Dashboard</title>`);
		});
	});
	$$renderer.push(`<div class="flex flex-1 flex-col gap-4 p-4 pt-0"><div class="grid auto-rows-min gap-4 md:grid-cols-3"><div class="aspect-video rounded-xl bg-muted/50"></div> <div class="aspect-video rounded-xl bg-muted/50"></div> <div class="aspect-video rounded-xl bg-muted/50"></div></div> <div class="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min"></div></div>`);
}
//#endregion
export { _page as default };
