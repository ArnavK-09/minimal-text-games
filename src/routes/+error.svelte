<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
</script>

<section id="hero" class="grid h-screen place-items-center">
	<div class="max-w-[32rem] text-center">
		<div>
			<h1 class="text-7xl font-bold">{$page.status}</h1>
			<p class="my-5 opacity-85">{$page.error?.message}</p>
			<hr />
			<div class="grid place-items-center gap-4">
				<a class="w-full" href="/" aria-label="Back Home">
					<Button variant="default" size="lg" class="w-full text-xl font-bold">Back Home</Button>
				</a>
			</div>
		</div>
	</div>
</section>
