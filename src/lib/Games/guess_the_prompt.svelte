<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { onMount } from 'svelte';
	import { gameState } from '$lib/store';
	import { goto } from '$app/navigation';
	import ioClient, { type Socket } from 'socket.io-client';
	import Loader from '$lib/components/Loader.svelte';
	import { toast } from 'svelte-sonner';
	import { updateUserScore } from '$lib/userScores';

	export let notHost: boolean = false;

	type Player = {
		id: string;
	};

	interface Results {
		winner: string;
		looser: string;
		game: string;
		addedScore: number;
		scores: unknown[];
	}

	export let data: {
		userID: string;
		project_ready: any;
		games: any;
		flags: {
			value: string | number | boolean | undefined;
			name: string;
		}[];
		game: string;
		gameID: string;
		game_name: any;
	};

	let PLAYER: Player;
	let loading = true;
	let ws: Socket;
	let IMG = 'https://placehold.co/600x600/png';

	const startGame = (player: Player, image_url: string) => {
		PLAYER = player;
		loading = false;
		if (image_url) IMG = image_url;
	};

	let status = 'Loading...';

	onMount(() => {
		gameState.set({
			ws: ioClient(window.location.host),
			game: data.game,
			userID: data.userID
		});

		ws = $gameState.ws as Socket;

		ws.on('connect', () => {
			ws.emit(notHost ? 'joinGame' : 'startGame', {
				game: data.game,
				gameID: data.gameID,
				userID: data.userID
			});
		});

		ws.on('serverError', (e) => {
			if (e.gameID == data.gameID) {
				loading = true;
				status = `[ERROR] ${e.message.toString() ?? 'Internal Error!'}`;
			}
		});

		ws.on('statusUpdate', (e) => {
			if (e.gameID == data.gameID && e.userID == data.userID) {
				if (e.status == 'waiting') {
					status = 'Waiting for other player to connect...';
				}
				if (e.status == 'player_joined') {
					startGame(e.player, e.meta);
				}
				if (e.status == 'loading') {
					status = 'Conecting to game....';
				}
			}
		});

		ws.on('notifyPlayer', (e: any) => {
			if (e.gameID == data.gameID && e.userID == data.userID) {
				toast.info('From Server', {
					description: e.message ?? 'Other player just submitted their entry'
				});
			}
		});

		ws.on('resultsPublished', (e: Results) => {
			if (e.winner == data.userID) updateUserScore();
			goto(`/game/results?data=${encodeURIComponent(JSON.stringify(e))}`);
		});

		ws.onAny((e) => {
			console.info(`[SOCKET] Got event "${e}" `);
		});

		ws.on('disconnect', () => {
			status = 'Disconnected from server...';
			setTimeout(() => goto('/'), 1000 * 2);
		});
	});

	const submitPlayerEntry = () => {
		ws.emit('updateUserEntry', {
			game: data.game,
			gameID: data.gameID,
			userID: data.userID,
			against: PLAYER.id,
			ENTRY_VALUE: image_desc_by_user.trim()
		});
		loading = true;
		status = 'Waiting for other player to submit entry...';
	};

	let image_desc_by_user: string = '';
	$: {
		if (image_desc_by_user.replaceAll(' ', '').length >= 100) {
			image_desc_by_user = image_desc_by_user.slice(0, 100);
		}
	}
</script>

<svelte:head>
	<title>Playing as {notHost ? 'Player' : 'Host'} | {data.games[data.game]}</title>
</svelte:head>
{#if !loading}
	<section class="grid place-items-center px-4 py-12">
		<div class="min-h-screen">
			<div class="mb-5 max-w-lg text-center">
				<div class="grid place-items-center">
					<h1 class="text-4xl font-bold leading-relaxed">Guess the prompt!<br />(*￣3￣)╭</h1>
					<p class="py-4 text-sm opacity-90">
						Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis delectus voluptatum
						quibusdam dicta! Tempore incidunt eius enim nihil beatae exercitationem, itaque in sunt
						doloremque nemo optio, tempora numquam fugiat nobis?
					</p>
					<hr />
					<p class="py-2 text-sm font-bold tracking-wide opacity-85">
						Playing Against:- {PLAYER.id}
					</p>
				</div>
			</div>
			<div class="grid place-items-center">
				<div class="aspect-square max-w-sm p-1">
					<Card.Root>
						<Card.Content class="flex aspect-square items-center justify-center p-1">
							<img class="h-full w-full rounded-sm" src={IMG} alt="describe this" />
						</Card.Content>
					</Card.Root>
				</div>
			</div>
			<hr class="my-5" />
			<div>
				<div class="grid w-full gap-1.5">
					<form on:submit|preventDefault={submitPlayerEntry}>
						<Label for="input">Describe image in your words...</Label>
						<Textarea
							name="input"
							bind:value={image_desc_by_user}
							placeholder="Type your message here."
							id="input"
							class="text-lg font-semibold"
						/>
						<p class="text-sm text-muted-foreground">
							Your response is 100% secured. | Text Limit :- {image_desc_by_user.replaceAll(' ', '')
								.length}/100
						</p>
						<Button
							disabled={image_desc_by_user.length < 5}
							type="submit"
							class="my-5 w-full font-bold">Submit your Entry</Button
						>
					</form>
				</div>
			</div>
		</div>
	</section>
{:else}
	<section class="grid h-screen place-items-center">
		<div class="px-4 text-center">
			<Loader />
			<h2 class="mt-4 break-words text-2xl font-semibold opacity-95">{status}</h2>
		</div>
	</section>
{/if}
