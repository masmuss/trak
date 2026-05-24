import * as server from '../entries/pages/(authenticated)/tickets/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(authenticated)/tickets/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(authenticated)/tickets/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.CMAyw3t8.js","_app/immutable/chunks/B0eP-YxG.js","_app/immutable/chunks/c2Auunn8.js","_app/immutable/chunks/B-xRrbko.js","_app/immutable/chunks/CUlT3XNp.js","_app/immutable/chunks/DzXZ1SpF.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/iu45dLlh.js","_app/immutable/chunks/BiVvE5do.js","_app/immutable/chunks/C-IMjg9h.js","_app/immutable/chunks/BYKXP3OR.js","_app/immutable/chunks/DngJM9IF.js"];
export const stylesheets = ["_app/immutable/assets/status-badge.CV-KWLNP.css"];
export const fonts = [];
