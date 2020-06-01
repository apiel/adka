/// <reference path="../jsx.d.ts" />

import { jsx } from '../mod.ts';
import { Hello } from './components/Hello.tsx';

interface Props {
    id: string;
    description: string;
}

export function Item({ id, description }: Props) {
    return (
        <div>
            <h1>Item "{id}"</h1>
            <p>{description}</p>
            <Hello />
        </div>
    );
}
