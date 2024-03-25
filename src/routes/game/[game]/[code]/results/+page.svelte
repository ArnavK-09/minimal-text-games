<script lang="ts">
	import * as Table from '$lib/components/ui/table';
</script>

<section class="mt-3 grid place-items-center py-20">
	<div class="min-h-screen">
		<div class="max-w-lg text-center">
			<h1 class="text-4xl font-bold leading-5">Game Results!</h1>
			<h2 class="my-3 py-4 text-sm opacity-95 brightness-105">
				Game Played:- <strong>Gues</strong>
			</h2>
		</div>
		<div>
			<Table.Root class="overflow-x-scroll">
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
					<Table.Row>
						<Table.Cell class="font-extrabold"># 1</Table.Cell>
						<Table.Cell class="font-medium">DOPE</Table.Cell>
						<Table.Cell>5</Table.Cell>
						<Table.Cell>0</Table.Cell>
						<Table.Cell class="text-right font-bold">Op</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</div>
		<hr class="my-6" />
		<div class="mt-7 grid w-full place-items-center">
			<div class="mb-5 flex gap-4">
				<div class="my-6 rounded-full bg-white/5">
					<img class="aspect-square w-[12rem]" src="/award.svg" alt="Award" />
				</div>
			</div>
			<h1 class="text-6xl font-bold leading-5 underline decoration-wavy underline-offset-8">
				You Won!
			</h1>
		</div>
	</div>
</section>
