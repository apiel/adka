/// <reference path="../jsx.d.ts" />

import { jsx, page, css, script, asset } from '/home/alex/dev/deno/pkg/adka/mod.ts';
import { Hello } from '../components/Hello.tsx';
import Item from './item/[id].page.tsx';

console.log('load nb 5');

async function Home() {
    const color = 'green';
    return (
        <section>
            {await css('./index.css', { var: { color } })}
            <h1>Homepage 5</h1>
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
            <ul>
                <li>
                    <a href={Item.link({ id: 3 })}>link 3</a>
                </li>
                <li>
                    <a href={Item.link({ id: 2 })}>link 2</a>
                </li>
                <li>
                    <a href="/item/1">link manual</a>
                </li>
            </ul>
            <p>
                <img src={asset('/radka.jpg')} alt="" />
            </p>

            {await script('./index.script.ts')}
            <script type="module" innerHTML={`import '${asset('/bundle.js')}'`}></script>
        </section>
    );
}

export default page(Home);
