<script lang="ts">
	import { CheckCircle } from '@lucide/svelte';
	export let message: string;
	export let title: string = 'Successful registration';
</script>

{#if message}
	<div class="mb-4 rounded-md bg-green-50 px-3 py-3 text-sm text-green-700">
		<div class="flex items-start gap-3">
			<CheckCircle class="h-5 w-5 shrink-0 text-green-600" />
			<div>
				<div class="font-medium">{title}</div>
				<div class="text-sm text-green-700/80">{message}</div>
			</div>
		</div>
	</div>
{/if}
