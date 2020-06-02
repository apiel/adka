import { config, paths } from './config.ts';
import { jsxHtml, caller, urlJoin } from './deps.ts';
import { getRoutePath } from './generatePages/getRoutePath.ts';
import { applyPropsToPath } from './generatePages/applyPropsToPath.ts';

export { asset } from './components/utils/asset.ts';
export { css, cssSync } from './components/css.ts';
export { script } from './components/script.ts';

export {
    NodePropsType,
    ComponentFunctionType,
    NullableChildType,
} from './deps.ts';
export { jsx, React } from './jsx.ts';
const { Fragment } = jsxHtml;
export { Fragment };

export interface Start {
    config: typeof config;
    paths: typeof paths;
}

export type LinkProps = {
    [key: string]: string | number;
};

export type Props = {
    [key: string]: any;
};

type PropsList = Props[] | undefined;

export interface GetterPropsList {
    propsList: PropsList;
    next?: GetPropsList;
}

export type GetPropsList = () => GetterPropsList | Promise<GetterPropsList>;

export interface Page {
    getPropsList: GetPropsList | undefined;
    component: Function;
    file: string;
    url: string;
    link: (props?: LinkProps) => string;
}

export function page(
    component: Function,
    propsList?: GetPropsList | PropsList,
): Page {
    let file = caller.default()!;
    if (file.startsWith('file://')) {
        file = file.substr(7);
    }
    const url =
        config.baseUrl +
            getRoutePath(file, urlJoin).replace(/\/index.html$/g, '') || '/';
    return {
        getPropsList: Array.isArray(propsList)
            ? () => ({ propsList })
            : propsList,
        component,
        file,
        url,
        link: (props?: LinkProps) => applyPropsToPath(url, props),
    };
}

function serialize(props?: LinkProps) {
    if (props) {
        // ToDo: should we remove % from value
        // we would anyway need a central place to generate url values
        // for the applyPropsToHtmlPath in compile.ts
        return Object.keys(props)
            .map((k) => `${k}=${props[k]}`)
            .join(';');
    }
    return '';
}
