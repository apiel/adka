# adka

Adka is a static site generator using JSX without React.

CSS and VanillaJs become more and more powerful providing a lot of features, slowly the complexity of tools like React and Angular become questionable. Static html pages are as well coming back to trend, with some frameworks like Gatsby or NextJs, mainly to improve SEO and performance. Unfortunately those frameworks are heavily dependent on React. Is React really meant to generate HTML on the server? Why would we have to deal with `useState`, `useEffect` and all those things for state management on the server? Of course, some part of the React logic is also used in the browser, for the dynamic part of the UI but all this logic can easily be done in CSS and VanillaJs, especially since WebComponent is available.

## Install adka

> **Note:** install is not mendatory to use adka, you can also run `deno run --allow-read --allow-write --allow-env --allow-net https://raw.githubusercontent.com/apiel/adka/latest/adka.ts`

Use deno installer: https://deno.land/manual/tools/script_installer

```sh
deno install -f --allow-read --allow-write --allow-env --allow-net https://raw.githubusercontent.com/apiel/adka/latest/adka.ts
```

On linux you might need to specify the deno bin path:

```sh
echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.bashrc
```

## Getting started

Create a folder `src/pages`. This folder will contain the pages. Create a file `src/pages/index.page.tsx`:

```tsx
import {
    React,
    page,
} from 'https://raw.githubusercontent.com/apiel/adka/latest/mod.ts';

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
deno run --allow-read --allow-write --allow-env --allow-net https://raw.githubusercontent.com/apiel/adka/latest/adka.ts
```

This will create a new `site` folder containing the generated html file `/index.html`.

Let's create another page but with dynamic content. Create a file `src/pages/pet/[type].page.jsx`:

```tsx
import {
    React,
    page,
} from 'https://raw.githubusercontent.com/apiel/adka/latest/mod.ts';

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
} from 'https://raw.githubusercontent.com/apiel/adka/latest/mod.ts';
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

Each page returns a link function, providing the url to access the page. So if the page changes its path, the route will be automatically updated.

For pages with dynamic content, you can pass the props with in the link `Pet.link({type: 'dog'})`.

Now, let's create a shared component. Create a file `src/components/Hello.jsx`:

```tsx
import { React } from 'https://raw.githubusercontent.com/apiel/adka/latest/mod.ts';

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
} from 'https://raw.githubusercontent.com/apiel/adka/latest/mod.ts';
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

In case you need fragment like `React.fragment`, you can use `Fragment` from the `adka` module:

```tsx
import {
    React,
    Fragment,
} from 'https://raw.githubusercontent.com/apiel/adka/latest/mod.ts';

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

Unlike React, components can be asynchrone, so you can fetch for data without to handle states.

```tsx
import {
    React,
    Fragment,
} from 'https://raw.githubusercontent.com/apiel/adka/latest/mod.ts';

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
} from 'https://raw.githubusercontent.com/apiel/adka/latest/mod.ts';

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
- site/Product/red/1/index.html
- site/Product/blue/2/index.html
- site/Product/green/3/index.html

## CSS

Css work differently as in React, CSS in JS is not supported ~~`<div style={{ color: 'blue' }}>`~~ instead use normal string as in HTML `<div style="color: blue">`.

For inline style:

```tsx
import {
    React,
    Fragment,
} from 'https://raw.githubusercontent.com/apiel/adka/latest/mod.ts';

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

You can as well, use a CSS file as inline style:

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
} from 'https://raw.githubusercontent.com/apiel/adka/latest/mod.ts';

export function Hello() {
    return (
        <Fragment>
            {css('./hello.css)}
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
} from 'https://raw.githubusercontent.com/apiel/adka/latest/mod.ts';

export function Hello() {
    const color = 'blue';
    return (
        <Fragment>
            <style>{`
            :root {
                --color: ${color};
            }
            `}</style>
            {css('./hello.css)}
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
} from 'https://raw.githubusercontent.com/apiel/adka/latest/mod.ts';

export function Hello() {
    return (
        <Fragment>
            <script>{`
                console.log('hello world');
            `}</script>
            <p>Hello</p>
            <p class="bold">Line 2.</p>
        </Fragment>
    );
}
```

As the previous method is a bit tidious, you can as well embed an external `ts` file. The generator will bundle the file and inject it in the component as inline JavaScript. To bundle the TypeScript file, we use [Deno.bundle](https://deno.land/manual/runtime/compiler_apis#denobundle), right now this deno feature is still work in progress, so you will have to use the parameter `--unstable` when executing adka.

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
} from 'https://raw.githubusercontent.com/apiel/adka/latest/mod.ts';

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

## Folder and file structure

-   pages are in `src/pages`
    -   page file should end by `.page.tsx`
    -   page can be named with `[name]` to create dynamic path e.g. `src/pages/[id].page.tsx`
-   components are in `src/components`

## Troubleshooting

In case you get the following error:

> JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.

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
import { React } from 'https://raw.githubusercontent.com/apiel/adka/latest/mod.ts';

export function Hello() {
    return <p>Hello.</p>;
}
```
