import { config } from './config.ts';

const fileDeps = new Set<string>();
const tree: { [file: string]: string[] } = {};

export function addDeps(file?: string) {
    file && config.watch && fileDeps.add(file);
}

export function buildToTree(parent: string) {
    [...fileDeps].forEach(
        (child) => (tree[child] = [...(tree[child] || []), parent]),
    );
    fileDeps.clear();
    console.log('tree', tree);
}

