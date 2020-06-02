import {
    join,
    basename,
    extname,
    dirname,
} from 'https://deno.land/std/path/mod.ts';

import { config, paths } from '../config.ts';

export function removeCacheSuffix(file: string) {
    // remove string from '?' use for caching in watch mode '?1591131033165.tsx'
    const pos = file.indexOf('?');
    if (pos !== -1) {
        file = file.substr(0, pos);
    }
    return file;
}

export function getRoutePath(file: string, glue = join) {
    file = removeCacheSuffix(file);
    const filename = basename(file, `${config.pagesSuffix}${extname(file)}`);
    const path = glue(
        dirname(file),
        filename === 'index' ? '' : filename,
        'index.html',
    ).substr(paths.srcPages.length);

    return path;
}
