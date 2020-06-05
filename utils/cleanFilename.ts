export function cleanFilename(file: string) {
    // file = removeCacheSuffix(file);
    return removeCachePrefix(file);
}

function removeCacheSuffix(file: string) {
    // remove string from '?' use for caching in watch mode '?1591131033165.tsx'
    const pos = file.indexOf('?');
    if (pos !== -1) {
        file = file.substr(0, pos);
    }
    return file;
}

function removeCachePrefix(file: string) {
    return file.replace('file:///', '/')
    .replace('file:/', '/');
}
