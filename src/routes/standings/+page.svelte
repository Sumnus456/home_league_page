<script>
	import { onMount, onDestroy } from 'svelte';
	import { Standings, StandingsSidebar } from '$lib/components'
	import { sidebarContent } from '$lib/stores';

	export let data;
	const {standingsData, leagueTeamManagersData} = data;

	onMount(() => {
		sidebarContent.set(StandingsSidebar);
	});

	onDestroy(() => {
		sidebarContent.set(null);
	});
</script>

<style>
	.holder {
		position: relative;
		z-index: 1;
		text-align: center;
	}
</style>

<div class="holder">
	<Standings {standingsData} {leagueTeamManagersData} />
</div>
