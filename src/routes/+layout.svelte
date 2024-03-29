<script lang="ts">
	// stylesheet
	import '../app.css';

	// imports
	import type { LayoutData } from './$types';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import Navbar from '$lib/components/Navbar.svelte';
	import { toast } from 'svelte-sonner';
	import { Toaster } from '$lib/components/ui/sonner';
	import { onMount } from 'svelte';
	let games: Array<{ id: string; title: string }> = [];

	// server data
	export let data: LayoutData;

	// func to check if project ready
	const isProjectReady = (): boolean => {
		const flag = data.project_ready as boolean;
		return flag ?? false;
	};
	onMount(() => {
		Object.keys(data.games).forEach((x) => {
			games.push({
				id: x,
				title: data.games[x]
			});
		});
		if (isProjectReady()) {
			toast.success('Project is ready for you!', {
				description: 'Powered By FlagSmith!'
			});
		} else {
			toast.error('Project is not available to you!', {
				description: 'Powered By FlagSmith!'
			});
		}
	});
</script>

<svelte:head>
	<title>Minimal Text Games!</title>
</svelte:head>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<header>
			<Navbar />
			<Toaster />
		</header>
		{#if isProjectReady()}
			<main class="mt-[7.5rem] px-3 py-6">
				<slot />
			</main>
		{:else}
			<!-- alert if project not ready  -->
			<AlertDialog.Root open={!isProjectReady()} onOpenChange={() => window.location.reload()}>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>You are too early ;/</AlertDialog.Title>
						<AlertDialog.Description>
							This action cannot be undone. This will permanently delete your account and remove
							your data from our servers.
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel>Contact</AlertDialog.Cancel>
						<AlertDialog.Action>OK</AlertDialog.Action>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		{/if}
	</ContextMenu.Trigger>
	<ContextMenu.Content>
		<a href="/">
			<ContextMenu.Item>
				Home
				<ContextMenu.Shortcut>/</ContextMenu.Shortcut>
			</ContextMenu.Item>
		</a>
		<ContextMenu.Separator />
		<ContextMenu.Sub>
			<ContextMenu.SubTrigger
				>Start Game<ContextMenu.Shortcut></ContextMenu.Shortcut></ContextMenu.SubTrigger
			>
			<ContextMenu.SubContent class="w-48">
				{#each games as game}
					<a href={`/game/${game.id}/start`}>
						<ContextMenu.Item>{game.title}</ContextMenu.Item>
					</a>
				{/each}
			</ContextMenu.SubContent>
		</ContextMenu.Sub>
		<ContextMenu.Separator />
		<a href="/game/join">
			<ContextMenu.Item>
				Join Game
				<ContextMenu.Shortcut>/join</ContextMenu.Shortcut>
			</ContextMenu.Item>
		</a>
	</ContextMenu.Content>
</ContextMenu.Root>
