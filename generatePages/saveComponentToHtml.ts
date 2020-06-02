import { ensureFile } from 'https://deno.land/std/fs/ensure_file.ts';
import { writeFileStr } from 'https://deno.land/std/fs/write_file_str.ts';

import { Props } from '../mod.ts';
import { PagePath, PagePaths } from './generatePages.ts';
import { getRoutePath } from './getRoutePath.ts';
import { config } from '../config.ts';
import { applyPropsToPath } from './applyPropsToPath.ts';
import { urlJoin, info } from '../deps.ts';

export async function saveComponentToHtml(
    { page }: PagePath,
    links: PagePaths,
    htmlPath: string,
    props?: Props,
) {
    info('Generate page', htmlPath);
    let source = await (await page.component(props)).render();
    source = applyPropsToLinks(source, links);

    await ensureFile(htmlPath);
    await writeFileStr(htmlPath, source);
}

function applyPropsToLinks(source: string, links: PagePaths) {
    return source.replace(
        /%link%([^%]+)%([^%]*)%/g, // [^%] = all exepct %
        (match, linkId, propsStr) => {
            const props: Props = {};
            propsStr.split(';').forEach((prop: string) => {
                const p = prop.split('=');
                props[p[0]] = p[1];
            });
            // console.log('links[linkId].file', links[linkId].file);
            return (
                config.baseUrl +
                applyPropsToPath(
                    getRoutePath(links[linkId].file, urlJoin).replace(
                        /\/index.html$/g,
                        '',
                    ) || '/',
                    props,
                )
            );
        },
    );
}
