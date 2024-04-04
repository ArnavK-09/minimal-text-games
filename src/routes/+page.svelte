<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { getUserScore } from '$lib/userScores';
	import { onMount } from 'svelte';

	let score = 0;

	onMount(() => {
		score = getUserScore();
	});
</script>

<section id="hero" class="grid h-screen place-items-center px-5">
	<div class="max-w-[32rem] text-center">
		<div class="mt-6">
			<h1
				class="bg-gradient-to-br from-gray-400 to-white bg-clip-text py-4 text-6xl font-extrabold text-transparent"
			>
				AI driven minmal games for you!
			</h1>
			<p class="my-5 opacity-85">
				Introducing our AI-powered player games, created with love! Our backend relies on Mongo DB
				and Sockets to provide a full real-time gaming experience. With a wide variety of
				captivating games to choose from, there's something for everyone. Dive into the world of
				multiple games and let the excitement begin!
			</p>
		</div>
		<hr />
		<div class="mt-5 grid place-items-center gap-4">
			<a class="w-full" href="/game/join" aria-label="Join Game">
				<Tooltip.Root>
					<Tooltip.Trigger class="w-full"
						><Button
							variant="default"
							size="lg"
							class="w-full bg-gradient-to-br from-gray-400 to-white text-xl font-bold"
							>Join Game</Button
						></Tooltip.Trigger
					>
					<Tooltip.Content>
						<p>Join any game on our server with game ID</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</a>
			<a class="w-full" aria-label="Start Game" href="/game">
				<Tooltip.Root>
					<Tooltip.Trigger class="w-full"
						><Button variant="outline" size="lg" class="w-full text-xl font-bold">Start Game</Button
						></Tooltip.Trigger
					>
					<Tooltip.Content>
						<p>Host any game on our server</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</a>
		</div>
		<hr />
		{#if score}
			<div class="my-7 break-words px-3">
				<h3
					class="bg-gradient-to-br from-gray-600 to-gray-300 bg-clip-text py-4 text-5xl font-extrabold text-transparent"
				>
					Your Score: {score}
				</h3>
			</div>
		{/if}
	</div>
</section>
