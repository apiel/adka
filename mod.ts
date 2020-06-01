import { config, paths } from './config.ts';
import { jsxHtml } from './deps.ts';

const { jsx, React, Fragment } = jsxHtml;

export { asset } from './components/utils/asset.ts';
export { css, cssSync } from './components/css.ts';
export { script } from './components/script.ts';
export { jsx, React, Fragment };

export interface Start {
    config: typeof config,
    paths: typeof paths,
}

let linkIdSeq = 0;

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
    linkId: string;
    link: (props?: LinkProps) => string;
}

export function page(
    component: Function,
    propsList?: GetPropsList | PropsList,
    linkId = `page-${linkIdSeq++}`,
): Page {
    return {
        getPropsList: Array.isArray(propsList)
            ? () => ({ propsList })
            : propsList,
        component,
        linkId,
        link: (props?: LinkProps) => `%link%${linkId}%${serialize(props)}%`,
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
