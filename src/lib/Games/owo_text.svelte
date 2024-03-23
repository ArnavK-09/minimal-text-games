<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Textarea } from '$lib/components/ui/textarea';

	let owo_txt_by_user: string = '';
</script>

<section class="grid place-items-center py-12">
	<div class="min-h-screen">
		<div class="max-w-lg text-center">
			<h1 class="text-4xl font-bold leading-relaxed">Decipher Owo-ify text! <br />＼(＾▽＾)／</h1>
			<p class="py-4 text-sm opacity-90">
				The text in the box seems to be written in "owo" format or owofied. It needs to be decoded
				with the highest level of precision and accuracy. Your objective is to decipher the text in
				the most accurate manner possible.
			</p>
		</div>
		<div class="grid max-w-lg place-items-center">
			<div class="w-full p-1">
				<Card.Root class="w-full bg-background opacity-95">
					<Card.Content class="flex w-full items-center justify-center break-words p-3">
						<h3 class="break-words text-center text-2xl font-bold tracking-wide">
							Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati delectus quasi
							blanditiis odit
						</h3>
					</Card.Content>
				</Card.Root>
			</div>
		</div>
		<hr class="my-5" />
		<div>
			<div class="grid w-full gap-1.5">
				<form method="post">
					<Label for="input">Decode the owo-fied text above...</Label>
					<Textarea
						name="input"
						bind:value={owo_txt_by_user}
						placeholder="Decoded text here..."
						id="input"
						class="text-lg font-semibold"
					/>
					<p class="text-sm text-muted-foreground">Your response is 100% verified...</p>
					<Button disabled={owo_txt_by_user.length < 5} type="submit" class="my-5 w-full font-bold"
						>Submit your Entry</Button
					>
				</form>
			</div>
		</div>
	</div>
</section>
