import { jsxHtml } from '../deps.ts';
import { getSrc } from './utils/getSrc.ts';
const { ElementNode } = jsxHtml;

export async function script(src: string) {
    // getSrc must stay at this level
    const file = getSrc(src);
    if (!file) {
        return null;
    }
    const [, emit] = await Deno.bundle(file);
    return new ElementNode('script', { innerHTML: emit }, []);
}
