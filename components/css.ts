import { readFileStrSync } from 'https://deno.land/std/fs/read_file_str.ts';
import { dirname, join } from 'https://deno.land/std/path/mod.ts';
import caller from 'https://raw.githubusercontent.com/apiel/caller/master/caller.ts';

import { jsxHtml } from '../deps.ts';
const { ElementNode } = jsxHtml;

export function css(src: string) {
    if (src.startsWith('.')) {
        // !! caller must stay in this function
        const parentFile = caller();
        if (parentFile) {
            src = join(dirname(parentFile), src)
                .replace('file:///', '/')
                .replace('file:/', '/');
        } else {
            return null;
        }
    }
    if (!src.startsWith('/')) {
        throw new Error(
            `Invalid css file format ${src}. File path must start by '.' or '/'.`,
        );
    }
    const content = readFileStrSync(src);
    return new ElementNode('style', {}, [content]);
}
