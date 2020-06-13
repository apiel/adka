export * as jsxHtml from 'https://raw.githubusercontent.com/apiel/jsx-html/1.2.0/mod.ts';
export {
    NodePropsType,
    NullableChildType,
    ComponentFunctionType,
} from 'https://raw.githubusercontent.com/apiel/jsx-html/1.1.1/mod.ts';
export { urlJoin } from 'https://deno.land/x/url_join/mod.ts';

export {
    info,
    log,
    success,
    debug,
    warn,
    error,
} from 'https://raw.githubusercontent.com/apiel/logol/master/mod.ts';

import { cleanFilename } from './utils/cleanFilename.ts';
import * as callerOrigin from 'https://raw.githubusercontent.com/apiel/caller/0.1.3/caller.ts';
const caller = {
    ...callerOrigin,
    default: callerOrigin.default.bind({ cb: cleanFilename }),
};
export { caller };

// export * as server from 'https://raw.githubusercontent.com/apiel/adka_server/0.1.3/mod.ts';
