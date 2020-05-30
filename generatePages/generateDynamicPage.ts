import { saveComponentToHtml } from './saveComponentToHtml.ts';
import { applyPropsToPath } from './applyPropsToPath.ts';
import { PagePath, PagePaths } from './generatePages.ts';
import { GetPropsList } from '../mod.ts';

export async function generateDynamicPage(
    pagePath: PagePath,
    pagePaths: PagePaths,
    htmlPath: string,
    getPropsList: GetPropsList,
) {
    const { propsList, next } = getPropsList();
    if (propsList) {
        for (const props of propsList) {
            await saveComponentToHtml(
                pagePath,
                pagePaths,
                applyPropsToPath(htmlPath, props),
                props,
            );
        }
    }
    if (next) {
        await generateDynamicPage(pagePath, pagePaths, htmlPath, next);
    }
}
