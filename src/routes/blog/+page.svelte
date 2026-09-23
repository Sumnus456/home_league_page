<script>
    import { onMount, onDestroy } from 'svelte';
    import { Posts, BlogSidebar } from "$lib/components";
    import { sidebarContent } from '$lib/stores';

    export let data;
    const {postsData, queryPage, filterKey, leagueTeamManagersData} = data;

    onMount(() => {
        sidebarContent.set(BlogSidebar);
    });

    onDestroy(() => {
        sidebarContent.set(null);
    });
</script>

<style>
    #main {
        position: relative;
        z-index: 1;
        display: block;
        margin: 30px auto;
		width: 95%;
		max-width: 1000px;
        overflow-y: hidden;
    }
</style>

<div id="main">
    <Posts {postsData} {queryPage} {filterKey} {leagueTeamManagersData} />
</div>