/// <reference path="../../../../jsx.d.ts" />

import { jsx, page } from '../../../../mod.ts';

interface Props {
    id: string;
    color: string;
}

function Product({ id, color }: Props) {
    return (
        <div>
            <h1>
                Product {color} {id}
            </h1>
        </div>
    );
}

export default page(Product, async () => ({
    propsList: [
        { id: '1', color: 'red' },
        { id: '2', color: 'blue' },
    ],
    next: async () => ({ propsList: [{ id: '3', color: 'green' }] }),
}));
