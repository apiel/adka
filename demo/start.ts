// import { delay } from 'https://deno.land/std/async/delay.ts';
import { Start } from '../mod.ts';
import { log } from '../deps.ts';

log('Example of script executed when generator start.');

export default async function ({ config, paths }: Start) {
    log('Configs', config, paths);
    // await delay(3000);
    // log('wait a bit before to start');
}
