export interface Pet {
	id: number;
	name: string;
	type: string;
	adopted: boolean;
	ownerId?: number;
	hunger: number;
	happiness: number;
}

export interface User {
	id: number;
	name: string;
	budget: number;
	passwordHash: string;
	role?: 'admin' | 'user';
}

export type SafeUser = Omit<User, 'passwordHash'>;
