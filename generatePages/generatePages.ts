import {
    join,
    SEP,
    globToRegExp,
    // normalize,
    basename,
    extname,
    dirname,
} from 'https://deno.land/std/path/mod.ts';
import { walk } from 'https://deno.land/std/fs/walk.ts';
import { Page } from '../mod.ts';
import { getRoutePath } from './getRoutePath.ts';
import paths from '../paths.ts';
import config from '../config.ts';
import { saveComponentToHtml } from './saveComponentToHtml.ts';

const { info } = console;

export interface PagePath {
    file: string;
    page: Page;
}
export type PagePaths = { [pathId: string]: PagePath };

generatePages();

export async function generatePages() {
    const pagePaths: PagePaths = {};
    for await (const entry of walk(paths.srcPages, {
        match: [globToRegExp(`${paths.srcPages}/**/*${config.pagesSuffix}.tsx`)],
    })) {
        const file = entry.path;
        const { default: page } = await import(join(Deno.cwd(), file));
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
    info('Load page component', file);
    if (page.getPropsList) {
        console.log('should generateDynamicPage');
        // await generateDynamicPage(
        //     pagePath,
        //     pagePaths,
        //     htmlPath,
        //     page.getPropsList,
        // );
    } else {
        await saveComponentToHtml(pagePath, pagePaths, htmlPath);
    }
}

// export async function generateDynamicPage(
//     pagePath: PagePath,
//     pagePaths: PagePaths,
//     htmlPath: string,
//     getPropsList: GetPropsList,
// ) {
//     const { propsList, next } = getPropsList();
//     for (const props of propsList) {
//         await saveComponentToHtml(
//             pagePath,
//             pagePaths,
//             applyPropsToPath(htmlPath, props),
//             props,
//         );
//     }
//     if (next) {
//         await generateDynamicPage(pagePath, pagePaths, htmlPath, next);
//     }
// }
