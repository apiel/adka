import { generatePages } from './generatePages/generatePages.ts';
import { config, paths } from './config.ts';

console.log('Run adka', { config, paths });
generatePages();
