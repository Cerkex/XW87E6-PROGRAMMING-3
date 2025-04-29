<script lang="ts">
	import { currentUser } from '$lib/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let name = '';
	let type: 'puppy' | 'kitten' = 'puppy';
	let error = '';
	let success = '';
	$: user = $currentUser;

	onMount(() => {
		// TODO: redirect to /login if there is no signed in user and redirect to root if the user is not an admin
		console.log(user.role);
		if (!user) {
			goto('/login');
		} else if (user.name !== 'admin') {
			goto('/');
		}
	});


	async function addPet() {
		// TODO post on /api/pets
		error = '';
		success = '';

		if (!name) {
			error = 'Please enter a pet name.';
			return;
		}

		try {
			const res = await fetch('/api/pets', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, type })
			});

			if (res.ok) {
				success = 'Pet added successfully!';
				name = '';
				type = 'puppy'; // reset form
			} else {
				const text = await res.text();
				error = text;
			}
		} catch (err) {
			error = 'Failed to add pet.';
		}
	}
</script>

<h1>Add a New Pet</h1>

{#if success}<p style="color: green;">{success}</p>{/if}
{#if error}<p style="color: red;">{error}</p>{/if}

<form on:submit|preventDefault={addPet}>
	<div>
		<label for="name">Name:</label>
		<input id="name" bind:value={name} />
	</div>

	<div>
		<label for="type">Type:</label>
		<select id="type" bind:value={type}>
			<option value="puppy">Puppy</option>
			<option value="kitten">Kitten</option>
		</select>
	</div>

	<button type="submit">Add Pet</button>
</form>

<style>
    form {
        display: grid;
        gap: 0.75rem;
        max-width: 300px;
    }
</style>
