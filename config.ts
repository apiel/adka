import { config as dotenv } from 'https://deno.land/x/dotenv/mod.ts';
import { existsSync } from 'https://deno.land/std/fs/exists.ts';
import { join, resolve } from 'https://deno.land/std/path/mod.ts';

import { log } from './deps.ts';

// ADKA_ROOT_FOLDER cannot be part of .env file
export const ROOT_FOLDER = Deno.env.get('ADKA_ROOT_FOLDER')
    ? resolve(Deno.env.get('ADKA_ROOT_FOLDER')!)
    : Deno.cwd();

if (existsSync(join(Deno.cwd(), '.env'))) {
    dotenv({ export: true });
}
log('ROOT_FOLDER', ROOT_FOLDER);

if (Deno.args.includes('dev')) {
    Deno.env.set('ADKA_DEV', 'true');
}
if (Deno.args.includes('watch')) {
    Deno.env.set('ADKA_WATCH', 'true');
}
if (Deno.args.includes('serve')) {
    Deno.env.set('ADKA_SERVE', 'true');
}
if (Deno.args.includes('--debug')) {
    Deno.env.set('ADKA_DEBUG', 'true');
}

const env = Deno.env.toObject();

const serve = env.ADKA_SERVE === 'true';
const watch = serve || env.ADKA_WATCH === 'true';
export let config = {
    srcFolder: (env.ADKA_SRC_FOLDER || 'src') as string,
    distStatic: (env.ADKA_DIST_FOLDER || 'site') as string,
    assetsFolder: (env.ADKA_ASSETS_FOLDER || 'assets') as string,
    bundlesFolder: (env.ADKA_BUNDLES_FOLDER || 'bundles') as string,
    pagesFolder: (env.ADKA_PAGES_FOLDER || 'pages') as string,
    pagesSuffix: (env.ADKA_PAGES_SUFFIX || '.page') as string,
    baseUrl: (env.ADKA_BASE_URL || '/') as string,
    startScript: (env.ADKA_START_SCRIPT || 'start.ts') as string,
    debug: env.ADKA_DEBUG === 'true',
    dev: watch || env.ADKA_DEV === 'true',
    watch,
    serve,
    port: (env.ADKA_PORT ? Number(env.ADKA_PORT) : 8080) as number,

    // This is used when we copy the file to skip cache of dyn import
    // this options define the max size of a file to copy
    clearCacheFileSize: (env.ADKA_CLEAR_CACHE_FILE_SIZE
        ? Number(env.ADKA_CLEAR_CACHE_FILE_SIZE)
        : 2000000) as number, // 2mb
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

export let tmpFolder = '';

export function setTmpFolder() {
    tmpFolder = join(Deno.dir('tmp')!, `adka-${+new Date()}`);
}

export async function rmTmpFolder() {
    await Deno.remove(tmpFolder, { recursive: true });
    tmpFolder = '';
}
