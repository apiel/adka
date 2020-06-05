import { jsx, Fragment } from '../deps.ts';

interface Props {
    name: string;
    num: { count: number };
}

export function Hello({ name, num }: Props) {
    return (
        <Fragment>
            <p>
                Hello {name} {num.count}
            </p>
        </Fragment>
    );
}
