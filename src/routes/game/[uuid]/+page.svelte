<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Textarea } from '$lib/components/ui/textarea';

    let image_desc_by_user: string = ""
    $: {
        if(image_desc_by_user.length >= 30) {
            image_desc_by_user = image_desc_by_user.slice(0, 30)
        }
    }
</script>

<section class="grid place-items-center">
	<div class="min-h-screen">
		<div class="max-w-lg text-center">
			<h1 class="text-4xl font-bold leading-5">Gameplay!</h1>
			<p class="py-4 text-sm opacity-90">
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis delectus voluptatum
				quibusdam dicta! Tempore incidunt eius enim nihil beatae exercitationem, itaque in sunt
				doloremque nemo optio, tempora numquam fugiat nobis?
			</p>
		</div>
		<div class="grid place-items-center">
			<Carousel.Root class="aspect-square max-w-xs">
				<Carousel.Content>
					{#each Array(5) as _, i (i)}
						<Carousel.Item>
							<div class="p-1">
								<Card.Root>
									<Card.Content class="flex aspect-square items-center justify-center p-1">
										<img class="w-full h-full rounded-sm" src="https://placehold.co/600x600/png" alt="describe this">
									</Card.Content>
								</Card.Root>
							</div>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
			</Carousel.Root>
		</div>
		<hr class="my-5" />
		<div>
			<div class="grid w-full gap-1.5">
                <form method="post">
                    <Label for="input">Describe image in your words...</Label>
                    <Textarea name="input" bind:value={image_desc_by_user} placeholder="Type your message here." id="input" />
                    <p class="text-sm text-muted-foreground">
                        Your response is 100% secured. | Text Limit :- {image_desc_by_user.length}/30
                    </p>
                    <Button disabled={image_desc_by_user.length < 5} type="submit" class="font-bold w-full my-5">Submit your Entry</Button>
                </form>
                </div>
		</div>
	</div>
</section>
