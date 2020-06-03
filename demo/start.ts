import { join } from 'https://deno.land/std/path/mod.ts';
import { writeFileStr } from 'https://deno.land/std/fs/write_file_str.ts';
import { ensureFile } from 'https://deno.land/std/fs/ensure_file.ts';

import { Start } from '../mod.ts';
import { log } from '../deps.ts';

log('Example of script executed when generator start.');

export default async function ({ config, paths }: Start) {
    log('Configs', config, paths);

    const [, emit] = await Deno.bundle(join(paths.srcBundles, 'main.ts'));
    const dest = join(paths.distAssets, 'bundle.js');
    await ensureFile(dest);
    await writeFileStr(dest, emit);
}
