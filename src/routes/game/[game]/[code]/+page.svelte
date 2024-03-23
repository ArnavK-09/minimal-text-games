<script>
	// Games import
	import DescribeImg from '$lib/Games/describe_img.svelte';
	import OwoText from '$lib/Games/owo_text.svelte';

	// Web data
	export let data;
</script>

{#if data.game == 'describe_img'}
	<DescribeImg {data} />
{:else if data.game == 'owoify_text'}
	<OwoText />
{/if}
