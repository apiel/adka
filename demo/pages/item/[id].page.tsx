import { jsx, page } from '../../deps.ts';
import Home from '../index.page.tsx';
import { Hello } from '../../components/Hello.tsx';

interface Props {
    id: string;
}

function Item({ id }: Props) {
    return (
        <div>
            <h1>Item {id}</h1>
            <a href={Home.link()}>home</a>
            <Hello name="hello item" num={{ count: 123 }} />
        </div>
    );
}

export default page(Item, [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
