<script lang="ts">
	// imports
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import Label from '$lib/components/ui/label/label.svelte';
	import type { ActionData } from './$types.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';

	// server data
	export let form: ActionData;
</script>

<section class="grid h-screen place-items-center">
	<div class="min-h-[16rem] md:w-[32rem]">
		<form method="POST">
			<Label>Game server code (automated)</Label>
			<Input
				name="code"
				value={crypto.randomUUID()}
				class="h-12 text-center text-xl"
				placeholder="new game server code..."
			/>
			<br />
			{#if form?.error}
				<Alert.Root variant="destructive">
					<CircleAlert class="h-4 w-4" />
					<Alert.Title>Validation Error</Alert.Title>
					<Alert.Description>{form?.error}</Alert.Description>
				</Alert.Root>
			{/if}
			<hr class="my-3" />
			<br />
			<Button type="submit" class="text-md w-full font-bold" size="lg">Start</Button>
		</form>
	</div>
</section>
