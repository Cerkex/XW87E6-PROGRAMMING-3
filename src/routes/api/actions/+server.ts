import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { logAction } from '$lib/log';
import { promises as fs } from 'fs';

const usersPath = path.resolve('static/data/users.json');
const petsPath = path.resolve('static/data/pets.json');
const logPath = path.resolve('static/data/log.json');

export const POST: RequestHandler = async ({ request }) => {
	// TODO: Handle pet actions using inventory or budget, with fallback redirect
	const { petId, action, userId } = await request.json();

	try {
		const petsData = await fs.readFile(petsPath, 'utf-8');
		const usersData = await fs.readFile(usersPath, 'utf-8');

		const pets = JSON.parse(petsData);
		const users = JSON.parse(usersData);

		const pet = pets.find((p: any) => p.id === petId);
		const user = users.find((u: any) => u.id === userId);

		if (!pet || pet.ownerId !== userId || !user) {
			return new Response('Invalid request', { status: 400 });
		}

		let message = '';

		if (action === 'feed') {
			if (user.budget < 5) return new Response('Not enough budget', { status: 400 });
			pet.hunger = Math.max(0, pet.hunger - 20);
			user.budget -= 5;
			message = `You fed ${pet.name}.`;
			await logAction(`${user.name} fed ${pet.name} (−$5)`);
		} else if (action === 'toy') {
			if (user.budget < 10) return new Response('Not enough budget', { status: 400 });
			pet.happiness = Math.min(100, pet.happiness + 30);
			user.budget -= 10;
			message = `You played with ${pet.name}.`;
            await logAction(`${user.name} played with ${pet.name} (−$10)`);
		} else if (action === 'return') {
			if (user.budget < 20) return new Response('Not enough budget', { status: 400 });
			pet.ownerId = null;
			pet.adopted = false;
			user.budget -= 20;
			message = `You returned ${pet.name}.`;
			await logAction(`${user.name} returned ${pet.name} (−$20)`);
		} else {
			return new Response('Unknown action', { status: 400 });
		}

		await fs.writeFile(petsPath, JSON.stringify(pets, null, 2));
		await fs.writeFile(usersPath, JSON.stringify(users, null, 2));

		return new Response(JSON.stringify({ user, message }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error(err);
		return new Response('Server error', { status: 500 });
	}
};
