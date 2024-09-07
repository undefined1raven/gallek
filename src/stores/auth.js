import { writable } from 'svelte/store';

let isLoggedIn = writable(false);

export default isLoggedIn;
