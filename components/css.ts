import { readFileStrSync, readFileStr } from 'https://deno.land/std/fs/read_file_str.ts';

import { jsxHtml } from '../deps.ts';
import { getSrc } from './utils/getSrc.ts';
const { ElementNode } = jsxHtml;

export async function css(src: string) {
    const file = getSrc(src);
    if (!file) {
        return null;
    }
    const content = await readFileStr(file);
    return new ElementNode('style', {}, [content]);
}

export function cssSync(src: string) {
    const file = getSrc(src);
    if (!file) {
        return null;
    }
    const content = readFileStrSync(file);
    return new ElementNode('style', {}, [content]);
}
