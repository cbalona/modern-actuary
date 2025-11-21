import { PUBLIC_SITE_URL } from "$env/static/public";
import type { LayoutServerLoad } from "./$types";

export const prerender = true;

export const load: LayoutServerLoad = () => {
	return {
		siteUrl: PUBLIC_SITE_URL,
	};
};
