# Adka

Adka is a static site generator using JSX without React.

CSS and VanillaJs become more and more powerful providing a lot of features, slowly the complexity of tools like React and Angular become questionable. Static html pages are as well coming back to trend, with some frameworks like Gatsby or NextJs, mainly to improve SEO and performance. Unfortunately those frameworks are heavily dependent on React. Is React really meant to generate HTML on the server? Why would we have to deal with `useState`, `useEffect` and all those things for state management on the server? Of course, some part of the React logic is also used in the browser, for the dynamic part of the UI but all this logic can easily be done in CSS and VanillaJs, especially since WebComponent is available.

Even if Adka is first intended to do SSG, you can use it as well for [server side rendering](https://github.com/apiel/adka#server-side-rendering).

## Install Adka

Use deno installer: https://deno.land/manual/tools/script_installer

```sh
deno install -f --allow-read --allow-write --allow-env --allow-net --unstable https://raw.githubusercontent.com/apiel/adka/master/adka.ts
```

On linux you might need to specify the deno bin path:

```sh
echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.bashrc
```

> **Note:** it is not mandatory to install Adka, you can also run `deno run --allow-read --allow-write --allow-env --allow-net --unstable https://raw.githubusercontent.com/apiel/adka/master/adka.ts`

> **Note:** to speed up compilation, use the `--no-check` option from deno https://deno.land/manual/getting_started/typescript#--no-check-option

## Getting started

Create a folder `src/pages`. This folder will contain the pages. Create a file `src/pages/index.page.tsx`:

```tsx
import {
    React,
    page,
} from 'https://raw.githubusercontent.com/apiel/adka/master/mod.ts';

function Main() {
    return (
        <div>
            <h1>Main page</h1>
            <p>This is an example</p>
        </div>
    );
}

export default page(Main);
```

Every jsx file should import `React` from `adka` module, like you would do with React.

Now you can transpile the jsx file, run:

```sh
adka
# or
deno run --allow-read --allow-write --allow-env --allow-net https://raw.githubusercontent.com/apiel/adka/master/adka.ts
```

This will create a new `site` folder containing the generated html file `/index.html`.

> In case you get the error "JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.", see [troubleshooting](https://github.com/apiel/adka#troubleshooting).

### Dynamic pages

Let's create another page but with dynamic content. Create a file `src/pages/pet/[type].page.jsx`:

```tsx
import {
    React,
    page,
} from 'https://raw.githubusercontent.com/apiel/adka/master/mod.ts';

interface Props {
    type: string;
    description: string;
}

function Pet({ type, description }) {
    return (
        <div>
            <h1>Pet {type}</h1>
            <p>{description}</p>
        </div>
    );
}

export default page(Pet, [
    {
        type: 'dog',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
        type: 'cat',
        description: 'Excepteur sint occaecat cupidatat non proident.',
    },
]);
```

This file will generate 2 pages, `/pet/dog.html` and `/pet/cat.html`.

We can add a link to the homepage:

```tsx
import {
    React,
    page,
} from 'https://raw.githubusercontent.com/apiel/adka/master/mod.ts';
import Main from '../index.page.tsx';

interface Props {
    type: string;
    description: string;
}

function Pet({ type, description }: Props) {
   return (
       <div>
           <h1>Pet {type}</h1>
           <p>{description}</p>
           <p><a href={Main.link()}>Go to homepage</a></p>
       </div>
   );
}
...
```

Each page returns a link function, providing the url to access the page. So if the page changes of path, the route will be automatically updated.

For pages with dynamic content, you can pass the props with in the link `Pet.link({type: 'dog'})`.

### Shared component

Now, let's create a shared component. Create a file `src/components/Hello.jsx`:

```tsx
import { React } from 'https://raw.githubusercontent.com/apiel/adka/master/mod.ts';

interface Props {
    name: string;
}

export function Hello({ name }: Props) {
    return <p>Hello {name}.</p>;
}
```

Import this component in a page:

```tsx
import {
    React,
    page,
} from 'https://raw.githubusercontent.com/apiel/adka/master/mod.ts';
import { Hello } from '../components/Hello';

function Main() {
    return (
        <div>
            <h1>Main page</h1>
            <p>This is an example</p>
            <Hello name="Alex" />
        </div>
    );
}

export default page(Main);
```

### Fragment

In case you need fragment like `React.fragment`, you can use `Fragment` from the `adka` module:

```tsx
import {
    React,
    Fragment,
} from 'https://raw.githubusercontent.com/apiel/adka/master/mod.ts';

interface Props {
    name: string;
}

export function Hello({ name }: Props) {
    return (
        <Fragment>
            <p>Hello {name}.</p>
            <p>Line 2.</p>
        </Fragment>
    );
}
```

## Async component

Unlike React, components can be asynchrone, so you can fetch data without to handle states.

```tsx
import {
    React,
    Fragment,
} from 'https://raw.githubusercontent.com/apiel/adka/master/mod.ts';

export const Data = async () => {
    const res = await fetch('http://example.com/some/api');
    const content = new Uint8Array(await res.arrayBuffer());

    return <div>{content}</div>;
};
```

Dynamic pages, can also be fetched asynchrounously. In the follwing example, see the second parameter of `page()`. Instead to be an array, it is an async function. This function return an object containing the list of props `propsList` and a `next` function. The `next` function is called when the first sets of pages is generated, this allow you to generate pages by chunks.

```tsx
// pages/Product/[color]/[id].page.tsx
import {
    React,
    Fragment,
} from 'https://raw.githubusercontent.com/apiel/adka/master/mod.ts';

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
```

This will generate:

-   site/Product/red/1/index.html
-   site/Product/blue/2/index.html
-   site/Product/green/3/index.html

## CSS

Css work differently as in React, CSS in JS is not supported ~~`<div style={{ color: 'blue' }}>`~~ instead use normal string as in HTML `<div style="color: blue">`.

For inline style:

```tsx
import {
    React,
    Fragment,
} from 'https://raw.githubusercontent.com/apiel/adka/master/mod.ts';

export function Hello() {
    return (
        <Fragment>
            <style>{`
                p {
                    color: blue;
                }
                .bold {
                    font-weight: bold;
                }
            `}</style>
            <p>Hello</p>
            <p class="bold">Line 2.</p>
        </Fragment>
    );
}
```

You can as well embed a CSS file:

```css
/* hello.css */
p {
    color: blue;
}
.bold {
    font-weight: bold;
}
```

```tsx
import {
    React,
    Fragment,
    css,
} from 'https://raw.githubusercontent.com/apiel/adka/master/mod.ts';

export async function Hello() {
    return (
        <Fragment>
            {await css('./hello.css)}
            <p>Hello</p>
            <p class="bold">Line 2.</p>
        </Fragment>
    );
}
```

To pass variables to the CSS, use the [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties):

```css
/* hello.css */
p {
    color: --color;
}
```

```tsx
import {
    React,
    Fragment,
    css,
} from 'https://raw.githubusercontent.com/apiel/adka/master/mod.ts';

export async function Hello() {
    const color = 'blue';
    return (
        <Fragment>
            <style>{`
            :root {
                --color: ${color};
            }
            `}</style>
            {await css('./hello.css')}
            <p>Hello</p>
        </Fragment>
    );
}
```

or

```tsx
import {
    React,
    Fragment,
    css,
} from 'https://raw.githubusercontent.com/apiel/adka/master/mod.ts';

export async function Hello() {
    const color = 'blue';
    return (
        <Fragment>
            {await css('./hello.css', { var: { color } })}
            <p>Hello</p>
        </Fragment>
    );
}
```

## Inline JS

As for CSS, you can embed some JavaScript into component:

```tsx
import {
    React,
    Fragment,
} from 'https://raw.githubusercontent.com/apiel/adka/master/mod.ts';

export function Hello() {
    return (
        <Fragment>
            <script
                innerHTML={`
                console.log('hello world');
            `}
            ></script>
            <p>Hello</p>
            <p class="bold">Line 2.</p>
        </Fragment>
    );
}
```

As the previous method is a bit tidious, you can as well embed an external `ts` file. The generator will bundle the file and inject it in the component as inline JavaScript. To bundle the TypeScript file, we use [Deno.bundle](https://deno.land/manual/runtime/compiler_apis#denobundle), right now this deno feature is still unstable, so you will have to use the parameter `--unstable` when executing Adka.

Now, let's create our script `src/components/hello.script.ts`:

```ts
console.log('hello world');
```

And in our component, we embed it:

```tsx
import {
    React,
    Fragment,
    script,
} from 'https://raw.githubusercontent.com/apiel/adka/master/mod.ts';

export async function Hello() {
    return (
        <Fragment>
            {await script('./hello.script.ts')}
            <p>Hello</p>
            <p class="bold">Line 2.</p>
        </Fragment>
    );
}
```

> **Note**: now our component is asynchrone.

## Assets

Put your assets in the folder `src/assets`, it will be copied to the generated site folder. For example, add an image `src/assets/image.png`. To use this file in your component, use the `asset` function:

```tsx
import {
    React,
    Fragment,
    asset,
} from 'https://raw.githubusercontent.com/apiel/adka/master/mod.ts';

export function Hello() {
    return (
        <Fragment>
            <p>Hello</p>
            <p>
                <img src={asset('/image.png')} alt="" />
            </p>
        </Fragment>
    );
}
```

> **Note:** `src/assets` is omited from the path of the file.

## Startup script

Before to start generating the pages, it might be necessary to setup a working environment, either to bundle some SCSS file or some TS file for the assets, or to initiate a connection to a database. To do this, you can use the startup script: `src/start.ts`.

If your startup script return a default function, this one will be executed asynchrounsly and wait the end of the function before to start generating the pages:

```ts
import { delay } from 'https://deno.land/std/async/delay.ts';

console.log('Example of script executed when generator start.');

export default async function () {
    await delay(3000);
    console.log('wait a bit before to start');
}
```

### JavaScript bundle

Generating bundle is right now not part of Adka generator since the [Deno.bundle](https://deno.land/manual/runtime/compiler_apis#denobundle) API is still unstable. But you can generate the bundle from the startup script:

```ts
// src/bundles/main.ts
console.log('Hello, I am the main bundle.');
```

```ts
// src/start.ts
import { Start } from 'https://raw.githubusercontent.com/apiel/adka/master/mod.ts';
import { join } from 'https://deno.land/std/path/mod.ts';
import { writeFileStr } from 'https://deno.land/std/fs/write_file_str.ts';
import { ensureFile } from 'https://deno.land/std/fs/ensure_file.ts';

export default async function ({ paths }: Start) {
    const [, emit] = await Deno.bundle(join(paths.srcBundles, 'main.ts'));
    const dest = join(paths.distAssets, 'bundle.js');
    await ensureFile(dest);
    await writeFileStr(dest, emit);
}
```

Finally in your layout:

```tsx
import {
    React,
    asset,
} from 'https://raw.githubusercontent.com/apiel/adka/master/mod.ts';

export function Layout({ children }) {
    return (
        <html>
            <head></head>
            <body>
                {children}
                <script
                    type="module"
                    innerHTML={`import '${asset('/bundle.js')}'`}
                ></script>
            </body>
        </html>
    );
}
```

## Dev

### Watch mode

During development, it is more convenient to re-generate the site as soon as a file changes. Instead to generate all the pages again, Adka will only generate the necessary ones. So if a page change, only this page will be generated, if a child component change, only the pages using this component will be generated. To use the watch mode run Adka like this:

```sh
adka watch
# or (if adka is not installed)
deno run --allow-read --allow-write --allow-env --allow-net https://raw.githubusercontent.com/apiel/adka/master/adka.ts watch
```

### Server

The server option, will combine the watch mode with an http server to serve your site. As soon as a change is detected, the server will trigger the browser to reload the corresponding page.

```sh
adka serve
# or (if adka is not installed)
deno run --allow-read --allow-write --allow-env --allow-net https://raw.githubusercontent.com/apiel/adka/master/adka.ts serve
```

> **Note:** this server is only for development purpose and should not be used it in production. In production, try to use a CDN server if possible, this will boost the performance of your website.

## Folder and file structure

-   pages are in `src/pages`
    -   page file should end by `.page.tsx`
    -   page can be named with `[var]` to create dynamic path e.g. `src/pages/[id].page.tsx`
-   components are in `src/components`
-   assets are in `src/assets`
-   startup script is `src/start.ts`
-   bundles are in `src/bundles`

## Server side rendering

Adka is first intended to do static site generation, but you can use it as well for SSR.
Following is an example:

```ts
// server.ts
import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
import { Item } from './Item.tsx';

const items = new Map<string, any>();
items.set('a', {
    id: 'a',
    description: 'This item "a".',
});
items.set('b', {
    id: 'b',
    description: 'This item "b".',
});

const router = new Router();
router
    .get('/', (context: any) => {
        context.response.body = 'Hello world!';
    })
    .get('/item/:id', async (context: any) => {
        if (context?.params?.id && items.has(context.params.id)) {
            const item = items.get(context.params.id);
            const content = await Item(item).render();
            context.response.type = 'text/html';
            context.response.body = content;
        }
    });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
```

```tsx
// Item.tsx

import { React } from 'https://raw.githubusercontent.com/apiel/adka/master/mod.ts';

interface Props {
    id: string;
    description: string;
}

export function Item({ id, description }: Props) {
    return (
        <div>
            <h1>Item "{id}"</h1>
            <p>{description}</p>
        </div>
    );
}
```

Now run the server:

```sh
deno run --allow-read --allow-net server.ts
```

In your browser open the url http://127.0.0.1:8000/item/a

> For hot reloading consider using https://deno.land/x/denon

## Troubleshooting

In case you get the following error:

> JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.

To fix this include in the top of the jsx file the refrence to `jsx.d.ts`:

```tsx
/// <reference path="https://raw.githubusercontent.com/apiel/adka/master/jsx.d.ts" />
import { React } from 'https://raw.githubusercontent.com/apiel/adka/master/mod.ts';

export function Hello() {
    return <p>Hello.</p>;
}
```

Or

Create the following file `src/jsx.d.ts`:

```ts
declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
    }
}
```

And include the reference in every jsx file, e.g.:

```tsx
/// <reference path="../jsx.d.ts" />
import { React } from 'https://raw.githubusercontent.com/apiel/adka/master/mod.ts';

export function Hello() {
    return <p>Hello.</p>;
}
```
