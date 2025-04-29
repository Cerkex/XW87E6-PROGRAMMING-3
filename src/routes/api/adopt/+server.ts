import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';
import { logAction } from '$lib/log';
import { promises as fs } from 'fs';

const petsPath = path.resolve('static/data/pets.json');
const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request }) => {
	// TODO Assign a pet to a user upon adoption
	const { petId, userId } = await request.json();

	try {
		const petsData = await fs.readFile(petsPath, 'utf-8');
		const usersData = await fs.readFile(usersPath, 'utf-8');

		const pets = JSON.parse(petsData);
		const users = JSON.parse(usersData);

		const pet = pets.find((p: any) => p.id === petId);
		const user = users.find((u: any) => u.id === userId);

		if (!pet || pet.adopted) {
			return new Response('Pet not available', { status: 400 });
		}

		if (!user) {
			return new Response('User not found', { status: 400 });
		}

		if (user.budget < 50) {
			return new Response('Not enough budget to adopt (requires $50)', { status: 400 });
		}

		// Assign the pet
		pet.ownerId = user.id;
		pet.adopted = true;
		pet.hunger = 50;
		pet.happiness = 50;

		user.budget -= 50;

		await fs.writeFile(petsPath, JSON.stringify(pets, null, 2));
		await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
        await logAction(`${user.name} adopted ${pet.name} (−$50)`);

		return new Response(JSON.stringify({ message: `You adopted ${pet.name}!`, user }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('Adoption error:', err);
		return new Response('Internal server error', { status: 500 });
	}
};
