import { saveComponentToHtml } from './saveComponentToHtml.ts';
import { applyPropsToPath } from './applyPropsToPath.ts';
import { GetPropsList, Page } from '../mod.ts';

export async function generateDynamicPage(
    page: Page,
    htmlPath: string,
    getPropsList: GetPropsList,
) {
    const { propsList, next } = await getPropsList();
    if (propsList) {
        for (const props of propsList) {
            await saveComponentToHtml(
                page,
                applyPropsToPath(htmlPath, props),
                props,
            );
        }
    }
    if (next) {
        await generateDynamicPage(page, htmlPath, next);
    }
}
