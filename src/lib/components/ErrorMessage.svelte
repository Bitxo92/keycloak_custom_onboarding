<script lang="ts">
	import { AlertTriangle } from '@lucide/svelte';
	export let message: string;
	export let title: string = 'Registration failed';
</script>

{#if message}
	<div class="mb-4 rounded-md bg-destructive/10 px-3 py-3 text-sm text-destructive">
		<div class="flex items-start gap-3">
			<AlertTriangle class="h-5 w-5 shrink-0 text-destructive" />
			<div>
				<div class="font-medium">{title}</div>
				<div class="text-sm text-destructive/80">{message}</div>
			</div>
		</div>
	</div>
{/if}
