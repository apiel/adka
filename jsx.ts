import {
    jsxHtml,
    caller,
    NodePropsType,
    ComponentFunctionType,
    NullableChildType,
} from './deps.ts';
import { addDeps } from './watcher.ts';

/**
 * Here we overwrite jsx and React from jsx-html to track which file
 * is calling jsx. This will allow us to track the file dependency
 * for watch mode.
 */

export const jsx = <P extends NodePropsType = NodePropsType>(
    element: string | ComponentFunctionType,
    props: P | null,
    ...children: NullableChildType[]
) => {
    addDeps(caller.default());
    return jsxHtml.jsx(element, props, ...children);
};

export const React = {
    ...jsxHtml.React,
    createElement<P extends NodePropsType = NodePropsType>(
        element: string | ComponentFunctionType,
        props: P | null,
        ...children: NullableChildType[]
    ) {
        addDeps(caller.default());
        return jsxHtml.jsx(element, props, ...children);
    },
};
