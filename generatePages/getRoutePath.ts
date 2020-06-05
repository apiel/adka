import {
    join,
    basename,
    extname,
    dirname,
} from 'https://deno.land/std/path/mod.ts';

import { config, paths, tmpFolder } from '../config.ts';

export function getRoutePath(file: string, glue = join) {
    const filename = basename(file, `${config.pagesSuffix}${extname(file)}`);
    const path = glue(
        dirname(file),
        filename === 'index' ? '' : filename,
        'index.html',
    ).substr(tmpFolder.length + paths.srcPages.length);

    return path;
}
