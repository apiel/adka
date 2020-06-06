deno run -c tsconfig.json --allow-read --allow-write --allow-env --allow-net --unstable adka.ts

deno run -c tsconfig.json --allow-read --allow-write --allow-env --reload https://raw.githubusercontent.com/apiel/adka/master/adka.ts

## ToDo

- debug fn

- think about a way to split site in multiple isolated part
  for faster compilation

- find a way to speed up watch mode
    - cache > tmp (think for improvement)
- write test

- turbolinks?
