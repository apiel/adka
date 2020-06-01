/// <reference path="../../jsx.d.ts" />

import { jsx, page, css, script } from '../../mod.ts';
import { Hello } from '../components/Hello.tsx';
import Item from './item/[id].page.tsx';

async function Home() {
    const color = 'green';
    return (
        <section>
            {await css('./index.css', { var: { color } })}
            <h1>Homepage</h1>
            <Hello name="abc" num={{ count: 123 }} />
            <input type="text" placeholder="email" />
            <input type="password" placeholder="password" />
            <style>{`
                #login-btn {
                    border-color: blue;
                }
            `}</style>
            <button id="login-btn" style="color: red">
                Log In
            </button>
            <a href={Item.link({ id: 3 })}>link</a>
            <a href={Item.link({ id: 2 })}>link</a>
            <p id="counter">none</p>
            {/* <img src={import('../assets/radka.jpg')} alt=""/> */}

            {await script('./index.script.ts')}
        </section>
    );
}

export default page(Home);
