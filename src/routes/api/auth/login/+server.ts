import type { RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import path from 'path';
import { logAction } from '$lib/log';
import { promises as fs } from 'fs';

const usersPath = path.resolve('static/data/users.json');

export const POST: RequestHandler = async ({ request }) => {
	const { name, password } = await request.json();

	// TODO sign-in the user if their credentials aren't invalid
	// NOTE: User 'bcrypt.compare' to check password
    if (!name || !password) {
        return new Response('Name and password are required', { status: 400 });
    }

    await logAction(`${name} made a login attempt.`);

    const data = await fs.readFile(usersPath, 'utf-8');
    const users = JSON.parse(data);

    const user = users.find((u: any) => u.name === name);


    if (!user) {
        return new Response('Invalid credentials', { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return new Response('Invalid credentials', { status: 401 });
    }

    return new Response(JSON.stringify({ id: user.id, name: user.name }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};
