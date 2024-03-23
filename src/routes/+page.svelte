<script lang="ts">
	import { Button } from '$lib/components/ui/button';
</script>

<section id="hero" class="grid h-screen place-items-center px-5">
	<div class="max-w-[32rem] text-center">
		<div>
			<h1 class="text-7xl font-bold">Player Like Never Before!</h1>
			<p class="my-5 opacity-85">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor minima ratione veniam ut
				odio, atque a libero dolorem? Non earum dignissimos delectus veniam aperiam magni alias aut
				voluptates commodi impedit!
			</p>
		</div>
		<hr />
		<div class="grid place-items-center gap-4">
			<a class="w-full" href="/game/join" aria-label="Join Game">
				<Button variant="default" size="lg" class="w-full text-xl font-bold">Join Game</Button>
			</a>
			<a class="w-full" aria-label="Start Game" href="/game">
				<Button variant="outline" size="lg" class="w-full text-xl font-bold">Start Game</Button>
			</a>
		</div>
	</div>
</section>
