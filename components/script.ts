// import { readFileStrSync } from 'https://deno.land/std/fs/read_file_str.ts';

import { jsxHtml } from '../deps.ts';
import { getSrc } from './utils/getSrc.ts';
const { ElementNode } = jsxHtml;

export function script(src: string) {
    const file = getSrc(src);
    if (!file) {
        return null;
    }
    // Deno.bundle(file).then(([, emit]) => {
    //     console.log('res bundle', emit);
    // });
    return new ElementNode('style', {}, ['content']);
}
