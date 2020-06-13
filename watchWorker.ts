import { generatePage } from './generatePages/generatePages.ts';

console.log('start watchWorker');

self.addEventListener("message", async ({ data }: any) => {
    for (const file of data) {
        await generatePage(file);
    }
    self.close();
}, false);
