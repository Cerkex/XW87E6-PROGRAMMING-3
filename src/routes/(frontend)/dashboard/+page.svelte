<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores';
	import type { Pet } from '$lib/types';
	import { goto } from '$app/navigation';

	let pets: Pet[] = [];
	let error = '';
	let success = '';

	$: user = $currentUser;

	async function loadPets() {
		// TODO load your pets
		error = '';
		try {
			const res = await fetch('/api/pets'); // gets all pets
			const allPets: Pet[] = await res.json();
			// Filter pets that belong to current user
			pets = allPets.filter(pet => pet.ownerId === user?.id);
		} catch (err) {
			error = 'Failed to load pets.';
		}
	}

	async function handleAction(petId: number, action: 'feed' | 'toy' | 'return') {
        error = '';
		success = '';
		try {
			const res = await fetch('/api/actions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ petId, action, userId: user.id })
			});

			if (res.ok) {
				const data = await res.json();
				success = data.message;
				// update current user (budget)
				currentUser.set(data.user);
				loadPets(); // reload pets after action
			} else {
				error = await res.text();
			}
		} catch (err) {
			error = 'Action failed.';
		}
	}

	onMount(() => {
		if (!user) {
			goto('/login');
		} else {
			loadPets();
		}
	});
</script>

<h1>📋 Your Adopted Pets</h1>

{#if success}<p style="color: green;">{success}</p>{/if}
{#if error}<p style="color: red;">{error}</p>{/if}
<p>💰 Budget: ${user?.budget}</p>

{#if pets.length === 0}
	<p>You haven’t adopted any pets yet.</p>
{:else}
	{#each pets as pet}
		<div style="border: 1px solid #ccc; padding: 10px; margin: 10px;">
			<h2>{pet.name} ({pet.type})</h2>
			<p>Hunger: {pet.hunger}</p>
			<p>Happiness: {pet.happiness}</p>
			<button on:click={() => handleAction(pet.id, 'feed')}>Feed (−$5)</button>
			<button on:click={() => handleAction(pet.id, 'toy')}>Play (−$10)</button>
			<button on:click={() => handleAction(pet.id, 'return')}>Return (−$20)</button>
		</div>
	{/each}
{/if}

<style>
</style>
