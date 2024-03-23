<script lang="ts">
	// imports
	import * as Card from '$lib/components/ui/card/index';
	import { onMount } from 'svelte';
	let games: Array<{ id: string; title: string }> = [];
	import { toast } from 'svelte-sonner';
	export let data;

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

<section class="mt-4 grid place-items-center">
	<div class="px-4">
		<div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
			<!-- Games Card -->
			{#each games as game (game.id)}
				<div>
					<a href={`/game/${game.id}/start`} class="group cursor-pointer">
						<Card.Root class="h-fit w-[90vw] transition-transform hover:scale-105 md:w-fit">
							<Card.Content class="break-words p-3 text-center">
								<div
									class="scale-80 mx-auto grid aspect-square h-fit w-fit place-items-center rounded-full bg-white/5 p-2"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="2.5"
										stroke="currentColor"
										class="aspect-square h-1/2 w-full"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
										/>
									</svg>
								</div>
								<h1
									class="my-2 text-xl font-bold underline decoration-wavy underline-offset-8 md:text-4xl"
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
</section>
