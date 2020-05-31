import { dirname, join } from 'https://deno.land/std/path/mod.ts';
import { up } from 'https://raw.githubusercontent.com/apiel/caller/master/caller.ts';
import caller from 'https://raw.githubusercontent.com/apiel/caller/master/caller.ts';

export function getSrc(src: string) {
    if (src.startsWith('.')) {
        // !! caller must stay in this function
        const parentFile = caller(up + 1);
        console.log('parentFile', parentFile);
        if (parentFile) {
            src = join(dirname(parentFile), src)
                .replace('file:///', '/')
                .replace('file:/', '/');
        } else {
            return;
        }
    }
    if (!src.startsWith('/')) {
        throw new Error(
            `Invalid file format ${src}. File path must start by '.' or '/'.`,
        );
    }
    return src;
}
