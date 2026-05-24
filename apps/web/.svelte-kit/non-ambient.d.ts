
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/(authenticated)" | "/" | "/(authenticated)/dashboard" | "/login" | "/(authenticated)/tickets" | "/(authenticated)/tickets/export" | "/(authenticated)/tickets/[id]";
		RouteParams(): {
			"/(authenticated)/tickets/[id]": { id: string }
		};
		LayoutParams(): {
			"/(authenticated)": { id?: string | undefined };
			"/": { id?: string | undefined };
			"/(authenticated)/dashboard": Record<string, never>;
			"/login": Record<string, never>;
			"/(authenticated)/tickets": { id?: string | undefined };
			"/(authenticated)/tickets/export": Record<string, never>;
			"/(authenticated)/tickets/[id]": { id: string }
		};
		Pathname(): "/" | "/dashboard" | "/login" | "/tickets" | "/tickets/export" | `/tickets/${string}` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/robots.txt" | string & {};
	}
}