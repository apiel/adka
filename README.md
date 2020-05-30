# adka

Adka is a transpiler to generate static html websites using JSX without React.

CSS and VanillaJs become more and more powerful providing a lot of features, slowly the complexity of tools like React and Angular become questionable. Static html pages are as well coming back to trend, with some frameworks like Gatsby or NextJs, mainly to improve SEO and performance. Unfortunately those frameworks are heavily dependent on React. Is React really meant to generate HTML on the server? Why would we have to deal with `useState`, `useEffect` and all those things for state management on the server? Of course, some part of the React logic is also used in the browser, for the dynamic part of the UI but all this logic can easily be done in CSS and VanillaJs, especially since WebComponent is available.

## Install adka

> **Note:** install is not mendatory to use adka, you can also run `deno run --allow-read --allow-write --allow-env --allow-net https://raw.githubusercontent.com/apiel/adka/latest/adka.ts`

Use deno install: https://deno.land/manual/tools/script_installer

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

This will create a new `site` folder containing the generated html files.

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

In case you need fragment like `React.fragment`, you can use `Fragment` from the `radka` library:

```jsx
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

## Folder and file structure

-   pages are in `src/pages`
    -   page file should end by `.page.jsx`
    -   page can be named with `[name]` to create dynamic path e.g. `src/pages/[id].page.jsx`
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
