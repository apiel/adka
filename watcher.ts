import { join } from 'https://deno.land/std/path/mod.ts';
import { copy } from 'https://deno.land/std/fs/mod.ts';

import {
    config,
    paths,
    setTmpFolder,
    tmpFolder,
    rmTmpFolder,
} from './config.ts';
import { generatePage } from './generatePages/generatePages.ts';
import { info } from './deps.ts';

const CONSUME_INTERVAL = 250;

interface FsEvent {
    kind: string;
    paths: string[];
}

const events: FsEvent[] = [];
const fileDeps = new Set<string>();
const tree: { [file: string]: Set<string> } = {};
let timer: number;

export function addDeps(file?: string) {
    if (file && config.watch) {
        fileDeps.add(file);
    }
}

export function buildTree(parent: string) {
    [...fileDeps].forEach((child) => {
        if (!tree[child]) {
            tree[child] = new Set([parent]);
        } else {
            tree[child].add(parent);
        }
    });
    fileDeps.clear();
}

export async function watch() {
    if (config.watch) {
        info('Watch for file change in', paths.src);
        const watcher = Deno.watchFs(paths.src, { recursive: true });
        for await (const event of watcher) {
            clearTimeout(timer);
            events.push({ ...event });
            timer = setTimeout(consumeEvents, CONSUME_INTERVAL);
        }
    }
}

async function consumeEvents() {
    const myEvents: FsEvent[] = [...events];
    events.length = 0; // = []; // clear arrays

    const createEvents = new Set<string>(); // should we track new files?
    const modifyEvents = new Set<string>();
    myEvents.forEach((event) => {
        if (event.kind === 'modify') {
            event.paths.forEach((f) => modifyEvents.add(f));
        } else if (event.kind === 'create') {
            event.paths.forEach((f) => createEvents.add(f));
        }
    });

    const genFiles = new Set<string>();
    [...modifyEvents].forEach((file) => {
        if (tree[file]) {
            [...tree[file]].forEach((f) => genFiles.add(f));
        }
    });
    [...createEvents].forEach((file) => {
        if (file.endsWith(`${config.pagesSuffix}.tsx`)) {
            genFiles.add(file);
        }
    });

    // use the following when Deno will support to dynamic import without cache
    // for (const file of genFiles) {
    //     await generatePage(file);
    // }

    // Because Deno doesn't allow us to clear the cache on dynamic import
    // We have to copy the files in a different folder to trick Deno
    setTmpFolder();
    // we should only copy the file necessary using the tree
    // cause assets folder can be huge
    await copy(paths.src, tmpJoin(paths.src));

    for (const file of genFiles) {
        await generatePage(tmpJoin(file));
    }
    await rmTmpFolder();
}

function tmpJoin(path: string) {
    return fixWin(join(tmpFolder, path));
}

// ToDo: test
function fixWin(path: string) {
    // on windows C:\ we cant create a folder C:\tmp\adka-1234\C:\path\src...
    // so we change the ':' to 'h' and we get C:\tmp\adka-1234\Ch\path\src...
    return (
        path.substr(0, tmpFolder.length + 1) +
        'h' +
        path.substr(tmpFolder.length + 2)
    );
}
