import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import path from 'path';
import { logAction } from '$lib/log';
import { promises as fs } from 'fs';

const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request }) => {
	const { name, password } = await request.json();

	// TODO create the user
	if (!name || !password) {
			return new Response('Name and password are required', { status: 400 });
	}
	// NOTE: use 'bcrypt.hash' to hash password
	// NOTE: the user's name must be unique
	let users = [];
    try {
        const data = await fs.readFile(usersPath, 'utf-8');
        users = JSON.parse(data);
    } catch (err) {
        users = [];
    }
    const existingUser = users.find((user: any) => user.name === name);
    if (existingUser) {
        return new Response('User already exists', { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    const newUser = { id: Date.now(), name: name, budget: 1000, password: hashedPassword, role: 'user'   };

    // Save new user
    users.push(newUser);
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
    await logAction(`${newUser.name} registered.`);
    // Success
    return new Response(JSON.stringify({ id: newUser.id, name: newUser.name }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
};