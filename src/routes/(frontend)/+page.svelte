<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores';

	let pets = [];
	let petType: '' | 'puppy' | 'kitten' = '';

	$: user = $currentUser;
	let error = '';
	let success = '';

	async function loadPets() {
		const res = await fetch(`/api/pets${petType ? `?type=${petType}` : ''}`);
		pets = await res.json();
	}

	async function adopt(petId: number) {
        // TODO only let the user adopt if they are signed in.
        error = '';
		success = '';

		if (!user) {
			error = 'Please login to adopt a pet.';
			return;
		}

		try {
			const res = await fetch('/api/adopt', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ petId, userId: user.id })
			});

			if (res.ok) {
				const data = await res.json();
				success = data.message;
				currentUser.set(data.user); // update budget
				await loadPets();
			} else {
				error = await res.text();
			}
		} catch (err) {
			error = 'Something went wrong.';
		}
	}

	onMount(loadPets);
</script>

<h1>Browse Adoptable Pets</h1>

<!-- Filter Dropdown -->
<select bind:value={petType} on:change={loadPets}>
	<option value=''>All</option>
	<option value='puppy'>Puppy</option>
	<option value='kitten'>Kitten</option>
</select>

{#if pets.length === 0}
    <p>No pets available.</p>
{:else}
    <div>
        {#each pets as pet}
            <div style="border: 1px solid #ccc; padding: 10px; margin: 10px;">
                <h2>{pet.name}</h2>
                <p>Type: {pet.type}</p>
                <p>Status: {pet.adopted ? 'Already Adopted' : 'Available for Adoption'}</p>

                {#if !pet.adopted}
                    <button on:click={() => adopt(pet.id)}>Adopt</button>
                {/if}
            </div>
        {/each}
    </div>
{/if}

<style>
    select {
        margin-bottom: 20px;
    }
</style>
