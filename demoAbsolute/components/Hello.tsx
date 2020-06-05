import { jsx, Fragment } from '/home/alex/dev/deno/pkg/adka/mod.ts';

interface Props {
    name: string;
    num: { count: number };
}

export function Hello({ name, num }: Props) {
    return (
        <Fragment>
            <p>
                Hello world {name} {num.count}
            </p>
        </Fragment>
    );
}
