<script lang="ts">
	// Games import
	import DescribeImg from '$lib/Games/guess_the_prompt.svelte';
	import OwoText from '$lib/Games/owo_text.svelte';

	// Web data
	export let data: any;
</script>

{#if data.game == 'guess_the_prompt'}
	<DescribeImg {data} />
{:else if data.game == 'owoify_text'}
	<OwoText />
{/if}
