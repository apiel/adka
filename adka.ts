/// <reference path="./jsx.d.ts" />

import { copy, exists } from 'https://deno.land/std/fs/mod.ts';

import { generatePages } from './generatePages/generatePages.ts';
import { config, paths } from './config.ts';

export async function adka() {
    console.log('Run adka', { config, paths });

    if (await exists(paths.distStatic)) {
        await Deno.remove(paths.distStatic, { recursive: true });
    }
    await copy(paths.srcAssets, paths.distAssets);
    await generatePages();
}

if (import.meta.main) {
    adka();
}
