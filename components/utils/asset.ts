import { config } from '../../config.ts';
import { urlJoin } from '../../deps.ts';

export function asset(src: string) {
    return urlJoin(config.baseUrl, config.assetsFolder, src);
}
