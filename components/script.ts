// import { readFileStrSync } from 'https://deno.land/std/fs/read_file_str.ts';

import { jsxHtml } from '../deps.ts';
import { getSrc } from './utils/getSrc.ts';
const { ElementNode } = jsxHtml;

export async function script(src: string) {
    const file = getSrc(src);
    if (!file) {
        return null;
    }
    const [, emit] = await Deno.bundle(file);
    return new ElementNode('script', { innerHTML: emit }, []);
}
