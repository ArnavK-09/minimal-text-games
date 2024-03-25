<script lang="ts">
	// imports
	import * as Card from '$lib/components/ui/card/index';
	import { onMount } from 'svelte';
	let games: Array<{ id: string; title: string }> = [];
	import { toast } from 'svelte-sonner';
	export let data;

	const defaultGameIcon = `<svg fill="none" stroke-width="2.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" > <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z" ></path> </svg>`;

	Object.keys(data.games).forEach((x) => {
		games.push({
			id: x,
			title: data.games[x]
		});
	});

	onMount(() => {
		toast.info(`Total ${games.length} game(s) available for you...`, {
			description: 'Powered By FlagSmith!'
		});
	});
</script>

<section class="grid min-h-screen place-items-center px-3 py-10">
	<div class="-mt-5 px-4">
		<div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
			<!-- Games Card -->
			{#each games as game (game.id)}
				<div>
					<a href={`/game/${game.id}/start`} class="group cursor-pointer">
						<Card.Root
							class="contrast-105 h-fit w-[90vw] bg-background transition-transform hover:scale-105 md:w-fit"
						>
							<Card.Content class="break-words p-3 text-center">
								<div
									class="| scale-80 mx-auto grid aspect-square h-fit w-fit place-items-center rounded-full bg-white/5 p-2 [&>*]:aspect-square [&>*]:h-1/2 [&>*]:w-full"
								>
									{@html data.icons[game.id] ? data.icons[game.id] : defaultGameIcon}
								</div>
								<h1
									class="my-2 text-xl font-bold underline decoration-wavy underline-offset-8 md:px-10 md:text-3xl"
								>
									{game.title}
								</h1>
							</Card.Content>
						</Card.Root>
					</a>
				</div>
			{/each}
		</div>
	</div>
	<div class="my-0">
		<h1
			class="bg-gradient-to-br from-gray-400 to-white bg-clip-text text-center text-3xl font-bold"
		>
			Spolier: More games incoming..
		</h1>
	</div>
</section>
