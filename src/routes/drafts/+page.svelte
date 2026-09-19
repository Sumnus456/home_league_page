<script>
	import { Drafts, DraftsSidebar } from '$lib/components';
	import { onMount, onDestroy } from 'svelte';
	import { sidebarContent } from '$lib/stores';

    export let data;
    const {upcomingDraftData, previousDraftsData, leagueTeamManagersData, playersData} = data;

	onMount(() => {
		sidebarContent.set(DraftsSidebar);
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
	<Drafts {upcomingDraftData} {previousDraftsData} {leagueTeamManagersData} {playersData} />
</div>