<script lang="ts">
	import { onMount } from 'svelte';
	let logs: string[] = [];
	let error = '';

	onMount(async () => {
		// TODO get logs
		try {
			const res = await fetch('/api/log');
			if (res.ok) {
				logs = await res.json();
			} else {
				error = await res.text();
			}
		} catch (err) {
			error = 'Failed to load logs.';
		}
	});
</script>

<h1>Action Log</h1>

{#if error}
	<p style="color: red;">{error}</p>
{:else if logs.length === 0}
	<p>No actions have been logged yet.</p>
{:else}
	<ul>
		{#each [...logs].reverse() as log}
			<li>{log}</li>
		{/each}
	</ul>
{/if}

<style>
</style>
