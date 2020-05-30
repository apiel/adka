deno run -c tsconfig.json --allow-read --allow-write --allow-env adka.ts

deno run -c tsconfig.json --allow-read --allow-write --allow-env --reload https://raw.githubusercontent.com/apiel/adka/master/adka.ts


instead of deps
https://deno.land/manual/linking_to_external_code/import_maps


git tag --delete latest
git push --delete origin latest
git tag latest
git push --tags

## ToDo

- asset
- load bundle and js file
    https://aralroca.com/blog/from-node-to-deno#webpack-parcel-rollup
- load css
- turbolinks?
