import { config } from './config.ts';
import { generatePage } from './generatePages/generatePages.ts';

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
        if (file.startsWith('file://')) {
            file = file.substr(7);
        }
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
        const watcher = Deno.watchFs(config.srcFolder, { recursive: true });
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

    for (const file of genFiles) {
        await generatePage(file);
    }
}
