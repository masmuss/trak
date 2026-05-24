import * as server from '../entries/pages/(authenticated)/tickets/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(authenticated)/tickets/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(authenticated)/tickets/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.wrfcIIg8.js","_app/immutable/chunks/B0eP-YxG.js","_app/immutable/chunks/B_Ppu-tB.js","_app/immutable/chunks/BqtpgTXZ.js","_app/immutable/chunks/DgZpP9yD.js","_app/immutable/chunks/DzXZ1SpF.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/Cwoi5uts.js","_app/immutable/chunks/BiVvE5do.js","_app/immutable/chunks/DAhLJ8F9.js","_app/immutable/chunks/CCSrm3d5.js","_app/immutable/chunks/CuuOdmKh.js"];
export const stylesheets = ["_app/immutable/assets/status-badge.CV-KWLNP.css"];
export const fonts = [];
