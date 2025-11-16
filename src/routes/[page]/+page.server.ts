import { error } from "@sveltejs/kit";
import { getPage } from "$lib/server/content";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	const page = await getPage(params.page);

	if (!page) {
		throw error(404, "Not found");
	}

	return { page };
};
