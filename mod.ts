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
    const file = caller.default()!;
    const url = urlJoin(
        config.baseUrl,
        getRoutePath(file, urlJoin).replace(/\/index.html$/g, '') || '/',
    );
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
