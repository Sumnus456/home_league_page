<script>
	import { onMount, onDestroy } from 'svelte';
	import { MatchupsAndBrackets, MatchupsSidebar } from '$lib/components';
	import { sidebarContent } from '$lib/stores';

	export let data;
	const {queryWeek, matchupsData, bracketsData, playersData, leagueTeamManagersData} = data;

	onMount(() => {
		sidebarContent.set(MatchupsSidebar);
	});

	onDestroy(() => {
		sidebarContent.set(null);
	});
</script>

<style>
    #main {
        position: relative;
        z-index: 1;
    }
</style>

<div id="main">
    <MatchupsAndBrackets {queryWeek} {matchupsData} {bracketsData} {playersData} {leagueTeamManagersData} />
</div>