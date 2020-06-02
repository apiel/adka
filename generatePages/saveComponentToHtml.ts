import { ensureFile } from 'https://deno.land/std/fs/ensure_file.ts';
import { writeFileStr } from 'https://deno.land/std/fs/write_file_str.ts';

import { Props, Page } from '../mod.ts';
import { info } from '../deps.ts';

export async function saveComponentToHtml(
    page: Page,
    htmlPath: string,
    props?: Props,
) {
    info('Generate page', htmlPath);
    let source = await (await page.component(props)).render();

    await ensureFile(htmlPath);
    await writeFileStr(htmlPath, source);
}
