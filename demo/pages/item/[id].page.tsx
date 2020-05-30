import { jsx, page } from '../../../mod.ts';
import Home from '../index.page.tsx';

interface Props {
    id: string;
}

function Item({ id }: Props) {
    return (
        <div>
            <h1>Item {id}</h1>
            <a href={Home.link()}>home</a>
        </div>
    );
}

export default page(
    Item,
    [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
);
