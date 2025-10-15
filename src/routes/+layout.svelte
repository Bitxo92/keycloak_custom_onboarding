<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { initializeAuth } from '../stores/auth.js';
	import { browser } from '$app/environment';

	onMount(() => {
		if (browser) {
			initializeAuth();
		}
	});

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
