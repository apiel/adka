import { dirname, join } from 'https://deno.land/std/path/mod.ts';
import { caller } from '../../deps.ts';

export function getSrc(src: string) {
    if (src.startsWith('.')) {
        // !! caller must stay in this function
        const parentFile = caller.default(caller.up + 1);
        if (parentFile) {
            src = join(dirname(parentFile), src);
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
