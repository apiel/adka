// do not include in deps till https://github.com/oakserver/oak/issues/165
// import { server } from './deps.ts';
import * as server from 'https://raw.githubusercontent.com/apiel/adka_server/0.1.3/mod.ts';
import { config } from './config.ts';
import { Page } from './mod.ts';

export async function serve() {
    if (config.serve) {
        const options = {
            port: config.port,
            root: config.distStatic,
            watcher: null,
            debug: config.debug,
        };
        await server.server(options);
    }
}

// need to write test for that
export function reloadPage({ url }: Page) {
    if (config.serve) {
        const urlPieces = url.match(RegExp('/([^/?&#]+)', 'g'));
        const regexUrl = `^${urlPieces
            ?.map((p) =>
                p[1] === '[' && p[p.length - 1] === ']' ? '/[^/?&#]+' : p,
            )
            .join('') || '/'}$`;
        return server.reloadAll(regexUrl);
    }
}
