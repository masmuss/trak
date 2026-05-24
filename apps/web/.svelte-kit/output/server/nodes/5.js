import * as server from '../entries/pages/(authenticated)/tickets/_id_/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(authenticated)/tickets/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(authenticated)/tickets/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/5.udQNWvz8.js","_app/immutable/chunks/B0eP-YxG.js","_app/immutable/chunks/B-xRrbko.js","_app/immutable/chunks/CUlT3XNp.js","_app/immutable/chunks/c2Auunn8.js","_app/immutable/chunks/DzXZ1SpF.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/iu45dLlh.js","_app/immutable/chunks/BiVvE5do.js","_app/immutable/chunks/ICLE2CPc.js","_app/immutable/chunks/Nr95Q4dU.js"];
export const stylesheets = ["_app/immutable/assets/status-badge.CV-KWLNP.css"];
export const fonts = [];
