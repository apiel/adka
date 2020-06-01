import { config as dotenv } from 'https://deno.land/x/dotenv/mod.ts';
import { existsSync } from 'https://deno.land/std/fs/exists.ts';
import { join, resolve } from 'https://deno.land/std/path/mod.ts';

import { log } from './deps.ts';

if (existsSync(`${Deno.cwd()}/.env`)) {
    dotenv({ export: true });
}

const env = Deno.env.toObject();
export const ROOT_FOLDER = env.ADKA_ROOT_FOLDER
    ? resolve(env.ADKA_ROOT_FOLDER)
    : Deno.cwd();

log('ROOT_FOLDER', ROOT_FOLDER);

export let config = {
    srcFolder: env.ADKA_SRC_FOLDER || 'src',
    distStatic: env.ADKA_DIST_FOLDER || 'site',
    assetsFolder: env.ADKA_ASSETS_FOLDER || 'assets',
    bundlesFolder: env.ADKA_BUNDLES_FOLDER || 'bundles',
    pagesFolder: env.ADKA_PAGES_FOLDER || 'pages',
    pagesSuffix: env.ADKA_PAGES_SUFFIX || '.page',
    baseUrl: env.ADKA_BASE_URL || '',
    startScript: env.ADKA_START_SCRIPT || 'start.ts',
};

export let paths = {
    distStatic: '',
    src: '',
    srcPages: '',
    srcAssets: '',
    distAssets: '',
    startScript: '',
    srcBundles: '',
};
initPaths();

export function setConfig(newConfig = {}) {
    config = { ...config, ...newConfig };
    initPaths();
}

function initPaths() {
    const src = join(ROOT_FOLDER, config.srcFolder);
    const distStatic = join(ROOT_FOLDER, config.distStatic);
    paths = {
        src,
        distStatic,
        srcPages: join(src, config.pagesFolder),
        srcAssets: join(src, config.assetsFolder),
        distAssets: join(distStatic, config.assetsFolder),
        startScript: join(src, config.startScript),
        srcBundles: join(src, config.bundlesFolder),
    };
}
