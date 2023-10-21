import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const { id } = params;
	if (!id) throw redirect(303, '/');

	return { id: parseInt(id) };
};
