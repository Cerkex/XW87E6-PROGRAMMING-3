import type { RequestHandler } from '@sveltejs/kit';
import path from 'path';

import { promises as fs } from 'fs';

const petsPath = path.resolve('static/data/pets.json');

export const GET: RequestHandler = async ({ url }) => {
	const type = url.searchParams.get('type');
    const data = await fs.readFile(petsPath, 'utf-8');
	const pets = JSON.parse(data);
	const filteredPets = type
			? pets.filter((pet: any) => pet.type.toLowerCase() === type.toLowerCase())
			: pets;
	return new Response(JSON.stringify(filteredPets), { status: 200 });
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { name, type } = await request.json();

		if (!name || !type) {
			return new Response('Name and type are required.', { status: 400 });
		}

		const petsData = await fs.readFile(petsPath, 'utf-8');
		const pets = JSON.parse(petsData);

		const newPet = {
			id: Date.now(),
			name,
			type,
			adopted: false,
			hunger: 50,
			happiness: 50,
			ownerId: null
		};

		pets.push(newPet);

		await fs.writeFile(petsPath, JSON.stringify(pets, null, 2));

		return new Response(JSON.stringify(newPet), {
			status: 201,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('Error adding pet:', err);
		return new Response('Failed to add pet.', { status: 500 });
	}
};

// TODO: Handle GET and POST requests for pets
