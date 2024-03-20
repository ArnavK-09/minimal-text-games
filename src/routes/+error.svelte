<script lang="ts">
	import { Button } from '$lib/components/ui/button';
</script>

<section id="hero" class="h-screen grid place-items-center">
	<div class="max-w-[32rem] text-center">
		<div>
			<h1 class="font-bold text-7xl">You Lost?</h1>
			<p class="opacity-85 my-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor minima ratione veniam ut odio, atque a libero dolorem? Non earum dignissimos delectus veniam aperiam magni alias aut voluptates commodi impedit!</p>
		</div>
		<hr />
		<div class="grid place-items-center gap-4">
			<a class="w-full" href="/" aria-label="Back Home">
				<Button variant="default" size="lg" class="text-xl w-full font-bold">Back Home</Button>
			</a>
		</div>
	</div>
</section>