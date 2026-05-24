import { t as APIError } from "../../../chunks/error.js";
import { t as auth } from "../../../chunks/auth.js";
import { fail, redirect } from "@sveltejs/kit";
//#region src/routes/login/+page.server.ts
var load = (event) => {
	if (event.locals.user) return redirect(302, "/dashboard");
	return {};
};
var actions = { signInEmail: async (event) => {
	const formData = await event.request.formData();
	const email = formData.get("email")?.toString() ?? "";
	const password = formData.get("password")?.toString() ?? "";
	try {
		await auth.api.signInEmail({ body: {
			email,
			password,
			callbackURL: "/auth/verification-success"
		} });
	} catch (error) {
		if (error instanceof APIError) return fail(400, { message: error.message || "Signin failed" });
		return fail(500, { message: "Internal server error" });
	}
	return redirect(302, "/dashboard");
} };
//#endregion
export { actions, load };
