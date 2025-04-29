<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/stores';
	let error = '';
    let name = '';
	let password = '';

	async function handleLogin() {
		error = '';

		if (!name || !password) {
			error = 'Please fill out all fields.';
			return;
		}

		try {
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, password })
			});

			if (res.ok) {
				const user = await res.json();
				currentUser.set(user);
				// TODO: Set $currentUser here
				goto('/dashboard');
			} else {
				const text = await res.text();
				error = text;
			}
		} catch (err) {
			error = 'Something went wrong.';
		}
	}
</script>

<h1>Login</h1>

{#if error}
<p style="color: red;">{error}</p>
{/if}

<form on:submit|preventDefault={handleLogin}>
	<div>
		<label for="name">Name:</label>
		<input id="name" bind:value={name} />
	</div>
	<div>
		<label for="password">Password:</label>
		<input id="password" type="password" bind:value={password} />
	</div>

	<button type="submit">Login</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		width: 300px;
		gap: 10px;
	}
</style>