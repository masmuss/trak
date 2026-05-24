import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.CyYxCsYz.js","_app/immutable/chunks/B0eP-YxG.js","_app/immutable/chunks/Dwcv5469.js","_app/immutable/chunks/BiVvE5do.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/DzXZ1SpF.js","_app/immutable/chunks/Nr95Q4dU.js"];
export const stylesheets = ["_app/immutable/assets/0.BkmOdSOJ.css"];
export const fonts = ["_app/immutable/assets/manrope-cyrillic-wght-normal.Dvxsihut.woff2","_app/immutable/assets/manrope-greek-wght-normal.DL7QRZyv.woff2","_app/immutable/assets/manrope-vietnamese-wght-normal.usUDDRr7.woff2","_app/immutable/assets/manrope-latin-ext-wght-normal.Ch3YOpNY.woff2","_app/immutable/assets/manrope-latin-wght-normal.DHIcAJRg.woff2","_app/immutable/assets/geist-cyrillic-ext-wght-normal.DjL33-gN.woff2","_app/immutable/assets/geist-cyrillic-wght-normal.BEAKL7Jp.woff2","_app/immutable/assets/geist-vietnamese-wght-normal.6IgcOCM7.woff2","_app/immutable/assets/geist-latin-ext-wght-normal.DC-KSUi6.woff2","_app/immutable/assets/geist-latin-wght-normal.BgDaEnEv.woff2"];
