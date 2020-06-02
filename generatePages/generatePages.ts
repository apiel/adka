import { join, globToRegExp } from 'https://deno.land/std/path/mod.ts';
import { walk } from 'https://deno.land/std/fs/walk.ts';

import { log } from '../deps.ts';
import { Page } from '../mod.ts';
import { getRoutePath } from './getRoutePath.ts';
import { config, paths } from '../config.ts';
import { saveComponentToHtml } from './saveComponentToHtml.ts';
import { generateDynamicPage } from './generateDynamicPage.ts';
import { buildTree } from '../watcher.ts';

export interface PagePath {
    file: string;
    page: Page;
}
export type PagePaths = { [pathId: string]: PagePath };

export async function generatePages() {
    const pagePaths: PagePaths = {};
    for await (const entry of walk(paths.srcPages, {
        match: [
            globToRegExp(
                join(paths.srcPages, '**', `*${config.pagesSuffix}.tsx`),
            ),
        ],
    })) {
        const file = entry.path;
        const { default: page } = await import(`file://${file}`);
        pagePaths[page.linkId] = {
            file,
            page,
        };
    }

    for (const pagePath of Object.values(pagePaths)) {
        await generatePage(pagePath, pagePaths);
    }
}

export async function generatePage(pagePath: PagePath, pagePaths: PagePaths) {
    const { file, page } = pagePath;
    const htmlPath = join(paths.distStatic, getRoutePath(file));
    log('Load page component', file);
    if (page.getPropsList) {
        await generateDynamicPage(
            pagePath,
            pagePaths,
            htmlPath,
            page.getPropsList,
        );
    } else {
        await saveComponentToHtml(pagePath, pagePaths, htmlPath);
    }
    buildTree(file);
}
