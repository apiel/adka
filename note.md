deno run -c tsconfig.json --allow-read --allow-write --allow-env --allow-net --unstable adka.ts

deno run -c tsconfig.json --allow-read --allow-write --allow-env --reload https://raw.githubusercontent.com/apiel/adka/master/adka.ts

## ToDo

- cache > tmp
    // we should only copy the file necessary using the tree
    // cause assets folder can be huge

- fix <li><a href="&#x2F;&#x2F;item&#x2F;3">link 3</a></li><li><a href="&#x2F;&#x2F;item&#x2F;2">

- find a way to speed up watch mode
- write test

- turbolinks?
