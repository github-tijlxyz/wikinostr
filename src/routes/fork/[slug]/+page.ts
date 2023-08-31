import { error } from '@sveltejs/kit';

export function load({ params }) {
    return { slug: params.slug };
}