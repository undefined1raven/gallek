import { writable } from 'svelte/store';

const nameFromStorage = localStorage.getItem('name');
let displayName = writable(nameFromStorage === null ? ':)' : nameFromStorage);

export default displayName;
