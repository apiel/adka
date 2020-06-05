import { join, globToRegExp } from 'https://deno.land/std/path/mod.ts';
import { walk } from 'https://deno.land/std/fs/walk.ts';

import { log } from '../deps.ts';
import { Page } from '../mod.ts';
import { getRoutePath } from './getRoutePath.ts';
import { config, paths } from '../config.ts';
import { saveComponentToHtml } from './saveComponentToHtml.ts';
import { generateDynamicPage } from './generateDynamicPage.ts';
import { buildTree } from '../watcher.ts';
import { reloadPage } from '../server.ts';

export interface PagePath {
    file: string;
    page: Page;
}

export async function generatePages() {
    for await (const entry of walk(paths.srcPages, {
        match: [
            globToRegExp(
                join(paths.srcPages, '**', `*${config.pagesSuffix}.tsx`),
            ),
        ],
    })) {
        await generatePage(entry.path);
    }
}

export async function generatePage(file: string) {
    const { default: page } = await import(`file://${file}`);
    const htmlPath = join(paths.distStatic, getRoutePath(file));
    log('Load page component', file);
    if (page.getPropsList) {
        await generateDynamicPage(page, htmlPath, page.getPropsList);
    } else {
        await saveComponentToHtml(page, htmlPath);
    }
    buildTree(file);
    reloadPage(page);
}
