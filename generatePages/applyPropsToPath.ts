import { Props } from "../mod.ts";

export function applyPropsToPath(path: string, props?: Props) {
    let pathWithProps = path;
    props && Object.keys(props).forEach((key) => {
        pathWithProps = pathWithProps.replace(`[${key}]`, props[key]);
    });
    return pathWithProps;
}