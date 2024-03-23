<script>
	// Games import
	import DescribeImg from '$lib/Games/describe_img.svelte';

	// Web data
	export let data;
</script>

{#if data.game == 'describe_img'}
	<DescribeImg {data} />
{/if}
