<script lang="ts">
	import Loader from '$lib/components/Loader.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { RPG_PROMPT, contactGemini } from '$lib/gemini';
	import { randomNumber, updateUserScore } from '$lib/userScores';
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	type ChatEntry = {
		from: 'bot' | 'player';
		content: string;
	};

	let history: Array<ChatEntry> = [];

	let user_input: string = '';
	let loading = true;
	export let data: any;
	export let notHost: boolean = false;

	onMount(() => {
		submit_user_entry(RPG_PROMPT, false);
	});

	async function submit_user_entry(
		entry: string | MouseEvent = user_input,
		addPlayerContent = true
	) {
		const message = entry.toString() as string;
		if (message.trim().length == 0) return;
		loading = true;
		const response = await contactGemini(message);
		const newhistory = [
			...history,
			await (async () => {
				if (addPlayerContent)
					return {
						from: 'player',
						content: await marked.parse(message.trim())
					};
				else return null;
			})(),
			{
				from: 'bot',
				content: await marked.parse(response.trim())
			}
		];
		history = newhistory.filter((x) => x !== null) as ChatEntry[];
		loading = false;
		user_input = '';
		updateUserScore(randomNumber(150, 1));
	}
</script>

<svelte:head>
	<title>Playing as {notHost ? 'Player' : 'Host'} | {data.games[data.game]}</title>
</svelte:head>

<svelte:document
	on:keydown={(e) => {
		if (e.key == 'Enter') {
			submit_user_entry();
		}
	}}
/>

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
			{#each history.filter((x) => x !== null) as chat}
				<div
					class={`${chat.from == 'bot' ? '' : 'float-right brightness-110'} text-md w-[90% ] prose prose-sm prose-invert mx-4 my-2 justify-center break-words rounded-2xl bg-primary-foreground px-4 py-2 font-semibold`}
				>
					{@html chat.content}
				</div>
			{/each}
			{#if history.length == 0}
				<div class="grid h-full place-items-center opacity-85">
					<Loader />
				</div>
			{/if}
		</div>
		<div>
			<Input
				autocomplete="false"
				autocorrect="true"
				spellcheck="false"
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
