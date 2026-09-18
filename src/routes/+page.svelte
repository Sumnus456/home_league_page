<script>
	import { onMount, onDestroy } from 'svelte';
	import { leagueName, homepageText, enableBlog } from '$lib/utils/helper';
	import { PowerRankings, HomePost, HomeSidebar } from '$lib/components';
	import { sidebarContent } from '$lib/stores';

	onMount(() => {
		sidebarContent.set(HomeSidebar);
	});

	onDestroy(() => {
		sidebarContent.set(null);
	});
</script>

<style>
    #home {
        display: flex;
        flex-wrap: nowrap;
        position: relative;
        overflow-y: hidden;
        z-index: 1;
    }

    #main {
        flex-grow: 1;
        min-width: 320px;
        margin: 0 auto;
        padding: 60px 0;
    }

    .text {
        padding: 0 30px;
        max-width: 900px;
        margin: 0 auto;
    }

    h6 {
        text-align: center;
    }
</style>

<div id="home">
    <div id="main">
        <div class="text">
            <h6>{leagueName}</h6>
            <!-- homepageText contains the intro text for your league, this gets edited in /src/lib/utils/leagueInfo.js -->
            {@html homepageText }
            <!-- Most recent Blog Post (if enabled) -->
            {#if enableBlog}
                <HomePost />
            {/if}
        </div>
        <PowerRankings />
    </div>
</div>
