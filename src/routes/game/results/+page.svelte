<script lang="ts">
	import Loader from '$lib/components/Loader.svelte';
	import { goto } from '$app/navigation';
	import * as Table from '$lib/components/ui/table';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	let loading = true;
	let pos = '';

	type PlayerResult = {
		pos: number;
		name: string;
		accuracy: number;
		score: number;
		role: 'host' | 'against';
	};
	interface Results {
		winner: string;
		looser: string;
		addedScore: number;
		game: string;
		scores: PlayerResult[];
	}

	let results_data: Results;
	export let data;

	onMount(() => {
		try {
			results_data = JSON.parse(
				decodeURIComponent($page.url.searchParams.get('data') ?? '')
			) satisfies Results;
			if ($page.data.userID !== results_data.winner) {
				pos = 'Loose';
			} else {
				pos = 'Won';
			}
			loading = false;
		} catch (e: any) {
			goto('/?error=', e.message);
		}
	});
</script>

<svelte:head>
	<title>Checkout results of your gaming session!</title>
</svelte:head>

{#if !loading}
	<section class="mt-3 grid place-items-center py-20">
		<div class="min-h-screen w-[90vw] md:w-auto">
			<div class="max-w-lg text-center">
				<h1 class="text-4xl font-bold leading-5">Game Results!</h1>
				<h2 class="my-3 py-4 text-sm opacity-95 brightness-105">
					Game Played:- <strong>{results_data.game ?? 'Minimal Text Game'}</strong>
				</h2>
			</div>
			<div class="overflow-x-scroll">
				<Table.Root>
					<Table.Caption>Players ranked by their score and accuracy</Table.Caption>
					<Table.Header>
						<Table.Row>
							<Table.Head class="text-left">Pos.</Table.Head>
							<Table.Head class="w-[100px]">Player</Table.Head>
							<Table.Head>Accuracy</Table.Head>
							<Table.Head class="text-right">Score</Table.Head>
							<Table.Head>Role</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{@const playerS = results_data.scores.sort((a, b) => a.pos - b.pos)}
						{#each playerS ?? [] as player, i}
							<Table.Row>
								<Table.Cell class="font-extrabold"># {player.pos ?? i}</Table.Cell>
								<Table.Cell class="font-medium">{player.name}</Table.Cell>
								<Table.Cell>{player.accuracy}</Table.Cell>
								<Table.Cell>++{player.score}</Table.Cell>
								<Table.Cell class="text-right font-bold capitalize">
									{#if player.name == data.userID}
										You
									{:else if player.role == 'host'}
										Host
									{:else}
										Player
									{/if}
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
			<hr class="my-6" />
			<div class="mt-7 grid w-full place-items-center">
				<div class="mb-5 flex gap-4">
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="my-6 aspect-square h-[15vh] scale-105 rounded-full bg-white/5 p-2 md:h-[20vh]"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
							/>
						</svg>
					</div>
				</div>
				<h1
					class="text-4xl font-bold leading-5 underline decoration-wavy underline-offset-8 md:text-6xl"
				>
					You {pos}!
				</h1>
			</div>
		</div>
	</section>
{:else}
	<section class="grid h-screen place-items-center">
		<div class="px-4 text-center">
			<Loader />
			<h2 class="mt-4 break-words text-2xl font-semibold opacity-95">Loading results...</h2>
		</div>
	</section>
{/if}
