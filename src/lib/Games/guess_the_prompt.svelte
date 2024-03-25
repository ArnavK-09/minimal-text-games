<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { onMount } from 'svelte';
	import { gameState } from '$lib/store';
	import { goto } from '$app/navigation';
	import ioClient, { Socket } from 'socket.io-client';
	import Loader from '$lib/components/Loader.svelte';

	export let notHost: boolean = false;

	type Player = {
		id: string;
	};

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

	const startGame = (player: Player) => {
		PLAYER = player;
		loading = false;
	};

	let status = 'LOADING';

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

		ws.on('statusUpdate', (e) => {
			if (e.gameID == data.gameID && e.user == data.userID) {
				if (e.status == 'waiting') {
					status = 'Waiting for other player to connect...';
				}
				if (e.status == 'player_joined') {
					startGame(e.player);
				}
				if (e.status == 'loading') {
					status = 'Conecting to game....';
				}
			}
		});

		ws.on('resultsPublished', (data) => {
			console.log('RESULTS', data);
		});

		ws.onAny((e) => {
			console.log(`[SOCKET] Got event "${e}" `);
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

{#if !loading}
	<section class="grid place-items-center py-12">
		<div class="min-h-screen">
			<div class="max-w-lg text-center">
				{JSON.stringify(PLAYER)}
				<div class="grid place-items-center">
					<h1 class="text-4xl font-bold leading-relaxed">Guess the prompt!<br />(*￣3￣)╭</h1>
					<p class="py-4 text-sm opacity-90">
						Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corporis delectus voluptatum
						quibusdam dicta! Tempore incidunt eius enim nihil beatae exercitationem, itaque in sunt
						doloremque nemo optio, tempora numquam fugiat nobis?
					</p>
				</div>
			</div>
			<div class="grid place-items-center">
				<div class="aspect-square max-w-sm p-1">
					<Card.Root>
						<Card.Content class="flex aspect-square items-center justify-center p-1">
							<img
								class="h-full w-full rounded-sm"
								src="https://placehold.co/600x600/png"
								alt="describe this"
							/>
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
		<div>
			<Loader />
			<h2 class="mt-4 break-words text-2xl font-semibold opacity-95">{status}</h2>
		</div>
	</section>
{/if}
