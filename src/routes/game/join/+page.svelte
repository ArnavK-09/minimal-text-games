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

<svelte:head>
	<title>Join Minimal Text Game Room!</title>
</svelte:head>
<section class="grid h-screen place-items-center">
	<div class="min-h-[16rem] w-full px-4 md:w-[50%]">
		<form method="POST">
			<Label>Enter Game server code to join</Label>
			<Input
				autocomplete="false"
				spellcheck="false"
				required
				name="code"
				class="h-12 text-center text-xl"
				placeholder="game server code..."
			/>
			<br />
			{#if form?.error}
				<Alert.Root variant="destructive">
					<CircleAlert class="h-4 w-4" />
					<Alert.Title>Validation Error</Alert.Title>
					<Alert.Description>{form.error}</Alert.Description>
				</Alert.Root>
			{/if}
			<hr class="my-3" />
			<br />
			<Button type="submit" class="text-md w-full font-bold" size="lg">Join</Button>
		</form>
	</div>
</section>
