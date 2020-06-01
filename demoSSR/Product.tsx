/// <reference path="../jsx.d.ts" />

import { jsx, css } from '../mod.ts';

interface Props {
    id: string;
    description: string;
}

async function Product({ id, description }: Props) {
    const color = 'blue';
    return (
        <div>
            {await css('./product.css', { var: { color } })}
            <h1>Product "{id}"</h1>
            <p class="product">{description}</p>
        </div>
    );
}

export default (props: Props) => (<Product {...props} />);
