import { writable } from 'svelte/store';

let collectionCache = writable([]);

export default collectionCache;
