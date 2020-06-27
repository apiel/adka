import { readFileStrSync, readFileStr } from 'https://deno.land/std/fs/read_file_str.ts';

import { jsxHtml } from '../deps.ts';
import { getSrc } from './utils/getSrc.ts';
import { addDeps } from '../watcher.ts';
const { ElementNode } = jsxHtml;

export type CssVar = {[key: string]: string};
export interface CssOptions {
    var?: CssVar;
}

export async function css(src: string, options?: CssOptions) {
    console.log('css src', src);
    // getSrc must stay at this level
    const file = getSrc(src);
    console.log('css getSrc', file);
    if (!file) {
        return null;
    }
    const content = await readFileStr(file);
    return cssRender(file, content, options);
}

export function cssSync(src: string, options?: CssOptions) {
    // getSrc must stay at this level
    const file = getSrc(src);
    if (!file) {
        return null;
    }
    const content = readFileStrSync(file);
    return cssRender(file, content, options);
}

function cssRender(file: string, content: string, options?: CssOptions) {
    addDeps(file);
    return new ElementNode('style', {}, [getVariables(options), content]);
}

function getVariables(options?: CssOptions) {
    if (options?.var) {
        let root = ':root {\n';
        Object.keys(options.var).forEach(key => {
            const value = options.var && options.var[key];
            root += `--${key}: ${value};\n`;
        });
        root += '}\n';
        return root;
    }
}