import { server } from './deps.ts';
import { config } from './config.ts';

export async function serve() {
    if (config.serve) {
        const options = {
            port: config.port,
            root: config.distStatic,
        };
        await server.server(options);
    }
}
