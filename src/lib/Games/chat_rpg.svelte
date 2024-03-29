<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { test } from '$lib/gemini';
	import { randomNumber, updateUserScore } from '$lib/userScores';

	type ChatEntry = {
		from: 'bot' | 'player';
		content: string;
	};

	let history: ChatEntry[] = [
		{
			from: 'bot',
			content: '🎄 Hey rookie! Start your adventure now! Enter your command below....'
		}
	];

	let user_input: string = '';
	let loading = false;
	export let data: any;
	export let notHost: boolean = false;

	function submit_user_entry() {
		console.log(test());
		if (user_input.trim().length == 0) return;
		loading = true;
		history = [
			...history,
			{
				from: 'player',
				content: user_input.trim()
			}
		];
		loading = false;
		user_input = '';
		updateUserScore(randomNumber(150, 1));
	}
</script>

<svelte:head>
	<title>Playing as {notHost ? 'Player' : 'Host'} | {data.games[data.game]}</title>
</svelte:head>
<section class="mt-16 grid w-screen place-items-center overflow-x-hidden">
	<div
		class="mx-auto block min-h-screen max-w-[70%] break-words rounded-lg text-center shadow-lg contrast-125"
	>
		<div>
			<h1 class="my-4 text-4xl font-bold leading-relaxed opacity-90">Chat Game - RPG!</h1>
		</div>
		<div
			class="flex h-[50vh] max-h-[50vh] w-full max-w-[177%] flex-col overflow-y-scroll rounded-xl bg-white/5 py-4"
		>
			{#each history as chat}
				<div
					class={`${chat.from == 'bot' ? '' : 'float-right brightness-110'} text-md w-[90% ] mx-4  my-2 break-words rounded-2xl bg-primary-foreground px-4 py-2 font-semibold`}
				>
					{chat.content}
				</div>
			{/each}
		</div>
		<div>
			<Input
				disabled={loading}
				bind:value={user_input}
				placeholder="Enter command..."
				class="my-2 h-10 border-none py-4 font-semibold outline-none focus-visible:ring-0"
			/>
			<Button
				variant="default"
				disabled={loading}
				on:click={submit_user_entry}
				class="my-2 w-full py-2 font-bold tracking-wider">Enter</Button
			>
		</div>
	</div>
</section>
