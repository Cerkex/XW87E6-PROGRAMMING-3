<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let name = '';
	let password = '';
	let confirmPassword = '';
	let error = '';

	async function handleRegister() {
		// NOTE: you have to confirm the password
		// NOTE: if the registration is successful sign-in the user automatically and redirect them to /dashboard
		error = '';

		if (!name || !password || !confirmPassword) {
			error = 'Please fill out all fields.';
			return;
		}

		if (password !== confirmPassword) {
			error = 'Passwords do not match.';
			return;
		}

		try {
			const res = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, password })
			});

			if (res.ok) {
				// Successful registration
				const user = await res.json();
				// TODO: set $currentUser (we'll set this up soon)
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

<h1>Register</h1>


<!--register form here-->
<form on:submit|preventDefault={handleRegister}>
	<div>
		<label for="name">Name:</label>
		<input id="name" bind:value={name} />
	</div>
	<div>
		<label for="password">Password:</label>
		<input id="password" type="password" bind:value={password} />
	</div>
	<div>
		<label for="confirmPassword">Confirm Password:</label>
		<input id="confirmPassword" type="password" bind:value={confirmPassword} />
	</div>

	{#if error}
		<p style="color:red;">{error}</p>
	{/if}

	<button type="submit">Register</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		width: 300px;
		gap: 10px;
	}
</style>