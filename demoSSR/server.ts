import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
import { Item } from './Item.tsx';
import Product from './Product.tsx';

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
    })
    .get('/product/:id', async (context: any) => {
        if (context?.params?.id && items.has(context.params.id)) {
            const item = items.get(context.params.id);
            const content = await Product(item).render();
            context.response.type = 'text/html';
            context.response.body = content;
        }
    });

const app = new Application();
app.addEventListener('error', (evt) => {
    console.error(evt.error);
});
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
