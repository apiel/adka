// import { delay } from 'https://deno.land/std/async/delay.ts';
import { Start } from '../mod.ts';

console.log('Example of script executed when generator start.');

export default async function ({ config, paths }: Start) {
    console.log('Configs', config, paths);
    // await delay(3000);
    // console.log('wait a bit before to start');
}
