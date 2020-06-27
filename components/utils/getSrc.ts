import { dirname, join } from 'https://deno.land/std/path/mod.ts';
import { caller } from '../../deps.ts';

export function getSrc(src: string) {
    if (src.startsWith('.')) {
        // !! caller must stay in this function
        const parentFile = caller.default(caller.up + 1);
        // const parentFile = caller(3 + 1);
        console.log('parentFile in getSrc', parentFile);
        if (parentFile) {
            src = join(dirname(parentFile), src);
        } else {
            return;
        }
    }
    console.log('src in getSrc', src);
    if (!src.startsWith('/')) {
        throw new Error(
            `Invalid file format ${src}. File path must start by '.' or '/'.`,
        );
    }
    return src;
}

// export const up = 3;

// export interface Bind {
//     cb?: (file: string) => string;
// }

// export default function caller(this: Bind | any, levelUp = up) {
//     const err = new Error();
//     const stack = err.stack?.split('\n')[levelUp];
//     if (stack) {
//         return getFile.bind(this)(stack);
//     }
// }

// export function getFile(this: Bind | any, stack: string) {
//     stack = stack.substr(stack.lastIndexOf('(') + 1);

//     let [file] = stack.split(':');

//     if ((this as Bind)?.cb) {
//         const cb = (this as Bind).cb as any;
//         file = cb(file);
//     }
//     console.log('file', file);
//     return file;
// }
