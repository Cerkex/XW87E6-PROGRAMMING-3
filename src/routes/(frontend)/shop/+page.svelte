<script lang="ts">
	import { currentUser } from '$lib/stores';

	let error = '';
	let success = '';
	$: user = $currentUser;

	async function buy(item: 'food' | 'toy' | 'treat') {
		// TODO implement your logic here
		error = '';
		success = '';

		if (!user) {
			error = 'Please login.';
			return;
		}

		try {
			const res = await fetch('/api/shop', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ item, userId: user.id })
			});

			if (res.ok) {
				const data = await res.json();
				success = data.message;
				currentUser.set(data.user); // update store
			} else {
				error = await res.text();
			}
		} catch (err) {
			error = 'Something went wrong.';
		}
	}
</script>

<h1>Pet Shop</h1>


{#if error}<p style="color:red;">{error}</p>{/if}
{#if success}<p style="color:green;">{success}</p>{/if}

{#if user}
	<p>Budget: ${user.budget}</p>
	<p>Inventory:</p>
	<ul>
		<li>Food: {user.inventory?.food ?? 0}</li>
		<li>Toy: {user.inventory?.toy ?? 0}</li>
		<li>Treat: {user.inventory?.treat ?? 0}</li>
	</ul>

	<button on:click={() => buy('food')}>Buy Food ($5)</button>
	<button on:click={() => buy('toy')}>Buy Toy ($10)</button>
	<button on:click={() => buy('treat')}>Buy Treat ($15)</button>
{/if}

<style>
	button {
		padding: 0.5rem;
		font-size: 1rem;
		margin-right: 10px;
		margin-bottom: 10px;
	}
</style>
