import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { promises as fs } from 'fs';

const usersPath = path.resolve('static/data/users.json');

const itemPrices: Record<string, number> = {
	food: 5,
	toy: 10,
	treat: 15
};

export const POST: RequestHandler = async ({ request }) => {
	const { item, userId } = await request.json();

	if (!item || !userId || !(item in itemPrices)) {
		return new Response('Invalid request.', { status: 400 });
	}

	try {
		const usersData = await fs.readFile(usersPath, 'utf-8');
		const users = JSON.parse(usersData);
		const user = users.find((u: any) => u.id === userId);

		if (!user) {
			return new Response('User not found.', { status: 404 });
		}

		const cost = itemPrices[item];

		if (user.budget < cost) {
			return new Response('Not enough budget.', { status: 400 });
		}

		user.inventory = user.inventory || { food: 0, toy: 0, treat: 0 };
		user.inventory[item]++;
		user.budget -= cost;

		await fs.writeFile(usersPath, JSON.stringify(users, null, 2));

		return new Response(
			JSON.stringify({ user, message: `You bought one ${item}.` }),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	} catch (err) {
		console.error('Shop error:', err);
		return new Response('Internal server error.', { status: 500 });
	}
};
