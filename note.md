deno run -c tsconfig.json --allow-read --allow-write --allow-env --allow-net --unstable adka.ts

deno run -c tsconfig.json --allow-read --allow-write --allow-env --reload https://raw.githubusercontent.com/apiel/adka/master/adka.ts

## ToDo

- watch mode
  - ~~try worker~~ doesnt seem to work. Need to wait that bug get fixed https://github.com/denoland/deno/issues/6116
  - we could also instanciate a adka again to generate only the given files
    or find a way to compile and evaluate the code.
    But all in all, using web worker will be better option

- debug fn

- think about a way to split site in multiple isolated part
  for faster compilation

- find a way to speed up watch mode
    - cache > tmp (think for improvement)
- write test

- turbolinks?
