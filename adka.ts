/// <reference path="./jsx.d.ts" />

import { copy, exists } from 'https://deno.land/std/fs/mod.ts';

import { generatePages } from './generatePages/generatePages.ts';
import { config, paths } from './config.ts';
import { info } from './deps.ts';
import { watch } from './watcher.ts';
import { serve } from './server.ts';

export async function adka() {
    info('Run adka');

    if (await exists(paths.distStatic)) {
        await Deno.remove(paths.distStatic, { recursive: true });
    }
    if (await exists(paths.srcAssets)) {
        await copy(paths.srcAssets, paths.distAssets);
    }
    if (await exists(paths.startScript)) {
        info('Execute start script.');
        const start = await import(`file://${paths.startScript}`);
        if (start?.default) {
            await start.default({ config, paths });
        }
    }
    await generatePages();
    watch();
    serve();
}

if (import.meta.main) {
    adka();
}
