import { redirect } from "@sveltejs/kit";
//#region src/routes/+layout.server.ts
var load = async (event) => {
	if (event.url.pathname !== "/login" && !event.locals.user) return redirect(302, "/login");
	if (event.url.pathname === "/login" && event.locals.user) return redirect(302, "/dashboard");
	return { user: event.locals.user };
};
//#endregion
export { load };
