deno run -c tsconfig.json --allow-read --allow-write --allow-env --allow-net --unstable adka.ts

deno run -c tsconfig.json --allow-read --allow-write --allow-env --reload https://raw.githubusercontent.com/apiel/adka/master/adka.ts

## ToDo

- fix <li><a href="&#x2F;&#x2F;item&#x2F;3">link 3</a></li><li><a href="&#x2F;&#x2F;item&#x2F;2">

- debug fn

- think about a way to split site in multiple isolated part
  for faster compilation

- find a way to speed up watch mode
    - cache > tmp (think for improvement)
- write test

- turbolinks?
