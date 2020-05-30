import 'https://deno.land/x/dotenv/load.ts';
import { join, resolve } from 'https://deno.land/std/path/mod.ts';

const env = Deno.env.toObject();
export const ROOT_FOLDER = env.ADKA_ROOT_FOLDER
    ? resolve(env.ADKA_ROOT_FOLDER)
    : Deno.cwd();

export let config = {
    srcFolder: env.ADKA_SRC_FOLDER || 'src',
    distStatic: env.ADKA_DIST_FOLDER || 'site',
    pagesFolder: env.ADKA_PAGES_FOLDER || 'pages',
    pagesSuffix: env.ADKA_PAGES_SUFFIX || '.page',
    baseUrl: env.ADKA_BASE_URL || '',
};

export let paths = {
    distStatic: '',
    src: '',
    srcPages: '',
};
initPaths();

export function setConfig(newConfig = {}) {
    config = { ...config, ...newConfig };
    initPaths();
}

function initPaths() {
    const src = join(ROOT_FOLDER, config.srcFolder);
    paths = {
        src,
        distStatic: join(ROOT_FOLDER, config.distStatic),
        srcPages: join(src, config.pagesFolder),
    };
}
