<script lang="ts">
	// Games imports
	import { onMount } from 'svelte';
	import Loader from '$lib/components/Loader.svelte';

	// data
	const notHost: boolean = true;
	export let data: any;

	// eslint-disable-next-line no-undef
	let Game: ConstructorOfATypedSvelteComponent | undefined;

	onMount(async () => {
		Game = (await import(`../../../../../lib/Games/${data.game}.svelte`)).default;
	});
</script>

<svelte:head>
	<title>Joining your Minimal Text Game Room...</title>
</svelte:head>
{#if Game}
	<svelte:component this={Game} {data} {notHost} />
{:else}
	<section class="grid h-screen place-items-center">
		<div class="px-4 text-center">
			<Loader />
			<h2 class="mt-4 break-words text-2xl font-semibold opacity-95">Initiating Game...</h2>
		</div>
	</section>
{/if}
