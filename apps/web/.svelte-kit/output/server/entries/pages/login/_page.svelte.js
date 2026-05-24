import { $ as clsx, a as bind_props, et as escape_html, i as attributes, l as head, u as props_id } from "../../../chunks/dev.js";
import { B as Button, U as cn, i as TicketIcon, t as WarningCircleIcon } from "../../../chunks/navigation.js";
import { a as Field, n as Field_label, r as Field_group } from "../../../chunks/field.js";
import { t as Input } from "../../../chunks/input.js";
import { tv } from "tailwind-variants";
//#region src/lib/components/ui/alert/alert.svelte
var alertVariants = tv({
	base: "grid gap-0.5 rounded-lg border px-2 py-1.5 text-left text-xs/relaxed has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-1.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-3.5 group/alert relative w-full",
	variants: { variant: {
		default: "bg-card text-card-foreground",
		destructive: "text-destructive bg-card *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current"
	} },
	defaultVariants: { variant: "default" }
});
function Alert($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, variant = "default", children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "alert",
			role: "alert",
			class: clsx(cn(alertVariants({ variant }), className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/alert/alert-description.svelte
function Alert_description($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "alert-description",
			class: clsx(cn("text-xs/relaxed text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/components/ui/alert/alert-title.svelte
function Alert_title($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, children, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "alert-title",
			class: clsx(cn("font-heading font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground", className)),
			...restProps
		})}>`);
		children?.($$renderer);
		$$renderer.push(`<!----></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/lib/features/auth/login-form.svelte
function Login_form($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		const id = props_id($$renderer);
		let { form, ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<form${attributes({
			method: "POST",
			action: "?/signInEmail",
			class: clsx(cn("flex flex-col gap-6", className)),
			...restProps
		})}>`);
		Field_group($$renderer, {
			children: ($$renderer) => {
				$$renderer.push(`<div class="flex flex-col items-center gap-1 text-center"><h1 class="text-2xl font-bold">Login to your account</h1> <p class="text-sm text-balance text-muted-foreground">Enter your email below to login to your account</p></div> `);
				if (form?.message) {
					$$renderer.push("<!--[0-->");
					Alert($$renderer, {
						variant: "destructive",
						children: ($$renderer) => {
							WarningCircleIcon($$renderer, {});
							$$renderer.push(`<!----> `);
							Alert_title($$renderer, {
								children: ($$renderer) => {
									$$renderer.push(`<!---->Error`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!----> `);
							Alert_description($$renderer, {
								children: ($$renderer) => {
									$$renderer.push(`<!---->${escape_html(form?.message)}`);
								},
								$$slots: { default: true }
							});
							$$renderer.push(`<!---->`);
						},
						$$slots: { default: true }
					});
				} else $$renderer.push("<!--[-1-->");
				$$renderer.push(`<!--]--> `);
				Field($$renderer, {
					children: ($$renderer) => {
						Field_label($$renderer, {
							for: `email-${id}`,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Email`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> `);
						Input($$renderer, {
							id: `email-${id}`,
							name: "email",
							type: "email",
							placeholder: "m@example.com",
							required: true
						});
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Field($$renderer, {
					children: ($$renderer) => {
						$$renderer.push(`<div class="flex items-center">`);
						Field_label($$renderer, {
							for: `password-${id}`,
							children: ($$renderer) => {
								$$renderer.push(`<!---->Password`);
							},
							$$slots: { default: true }
						});
						$$renderer.push(`<!----> <a href="##" class="ms-auto text-sm underline-offset-4 hover:underline">Forgot your password?</a></div> `);
						Input($$renderer, {
							id: `password-${id}`,
							name: "password",
							type: "password",
							required: true
						});
						$$renderer.push(`<!---->`);
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!----> `);
				Field($$renderer, {
					children: ($$renderer) => {
						Button($$renderer, {
							type: "submit",
							children: ($$renderer) => {
								$$renderer.push(`<!---->Login`);
							},
							$$slots: { default: true }
						});
					},
					$$slots: { default: true }
				});
				$$renderer.push(`<!---->`);
			},
			$$slots: { default: true }
		});
		$$renderer.push(`<!----></form>`);
		bind_props($$props, { ref });
	});
}
//#endregion
//#region src/routes/login/+page.svelte
function _page($$renderer, $$props) {
	let { form } = $$props;
	head("1x05zx6", $$renderer, ($$renderer) => {
		$$renderer.title(($$renderer) => {
			$$renderer.push(`<title>Login</title>`);
		});
	});
	$$renderer.push(`<div class="grid min-h-svh"><div class="flex flex-col gap-4 p-6 md:p-10"><div class="flex justify-center gap-2 md:justify-start"><a href="##" class="flex items-center gap-2 font-medium"><div class="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">`);
	TicketIcon($$renderer, { class: "size-4" });
	$$renderer.push(`<!----></div> Acme Inc.</a></div> <div class="flex flex-1 items-center justify-center"><div class="w-full max-w-xs">`);
	Login_form($$renderer, { form });
	$$renderer.push(`<!----></div></div></div></div>`);
}
//#endregion
export { _page as default };
