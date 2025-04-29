import { writable } from 'svelte/store';
import type { User } from './types';

const isBrowser = typeof window !== 'undefined';

const storedUser = isBrowser ? localStorage.getItem('currentUser') : null;
const parsedUser: User | null = storedUser ? JSON.parse(storedUser) : null;

export const currentUser = writable<User | null>(parsedUser);

// Save to localStorage only in browser
if (isBrowser) {
	currentUser.subscribe((value) => {
		if (value) {
			localStorage.setItem('currentUser', JSON.stringify(value));
		} else {
			localStorage.removeItem('currentUser');
		}
	});
}
