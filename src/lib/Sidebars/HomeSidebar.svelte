<script>
	import LinearProgress from '@smui/linear-progress';
	import { getNflState, getAwards, getLeagueTeamManagers, managers, gotoManager, waitForAll } from '$lib/utils/helper';
	import Transactions from '../Transactions/Transactions.svelte';
	import { getAvatarFromTeamManagers, getTeamFromTeamManagers, handleAvatarError } from '$lib/utils/helperFunctions/universalFunctions';

	const nflState = getNflState();
	const podiumsData = getAwards();
	const leagueTeamManagersData = getLeagueTeamManagers();
</script>

<style>
	.leagueData {
		position: relative;
		z-index: 1;
		min-height: 100%;
		background-color: var(--ebebeb);
		border-left: var(--eee);
		box-shadow: inset 8px 0px 6px -6px rgb(0 0 0 / 24%);
	}

	.transactions {
		display: block;
		width: 95%;
		margin: 10px auto;
	}

	.center {
		text-align: center;
	}

	.homeBanner {
		background-color: var(--blueOne);
		color: #fff;
		padding: 0.5em 0;
		font-weight: 500;
		font-size: 1.5em;
	}

	.homeBanner .center {
		padding: 0 0.5em;
	}

	/* champ styling */
	#currentChamp {
		padding: 25px 0;
		background-color: var(--f3f3f3);
		box-shadow: 5px 0 8px var(--champShadow);
		border-left: 1px solid var(--ddd);
	}

	#champ {
		position: relative;
		width: 150px;
		height: 150px;
		margin: 0 auto;
		cursor: pointer;
	}

	.first {
		position: absolute;
		transform: translate(-50%, -50%);
		width: 80px;
		height: 80px;
		border-radius: 100%;
		border: 1px solid #ccc;
		left: 50%;
		top: 43%;
	}

	.laurel {
		position: absolute;
		transform: translate(-50%, -50%);
		width: 135px;
		height: auto;
		left: 50%;
		top: 50%;
	}

	h4 {
		text-align: center;
		font-size: 1.8em;
		margin: 10px;
		font-style: italic;
	}

	.label {
		display: block;
		max-width: 90%;
		margin: 6px auto 10px;
		text-align: center;
		line-height: 1.1em;
		font-size: 1.7em;
		cursor: pointer;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:global(.curOwner) {
		font-size: 0.75em;
		color: #bbb;
		font-style: italic;
	}
</style>

<div class="leagueData">
	<div class="homeBanner">
		{#await nflState}
			<div class="center">Retrieving NFL state...</div>
			<LinearProgress indeterminate />
		{:then nflStateData}
			<div class="center">NFL {nflStateData.season}
				{#if nflStateData.season_type == 'pre'}
					Preseason
				{:else if nflStateData.season_type == 'post'}
					Postseason
				{:else}
					Season - {nflStateData.week > 0 ? `Week ${nflStateData.week}` : "Preseason"}
				{/if}
			</div>
		{:catch error}
			<div class="center">Something went wrong: {error.message}</div>
		{/await}
	</div>

	<div id="currentChamp">
		{#await waitForAll(podiumsData, leagueTeamManagersData)}
			<p class="center">Retrieving awards...</p>
			<LinearProgress indeterminate />
		{:then [podiums, leagueTeamManagers]}
			{#if podiums[0]}
				<h4>{podiums[0].year} Fantasy Champ</h4>
				<div id="champ" onclick={() => {if(managers.length) gotoManager({year: podiums[0].year, leagueTeamManagers, rosterID: parseInt(podiums[0].champion)})}} >
					<img src="{getAvatarFromTeamManagers(leagueTeamManagers, podiums[0].champion, podiums[0].year)}" class="first" alt="champion" onerror={handleAvatarError} />
					<img src="/laurel.png" class="laurel" alt="laurel" />
				</div>
				<span class="label" onclick={() => gotoManager({year: podiums[0].year, leagueTeamManagers, rosterID: parseInt(podiums[0].champion)})} >{getTeamFromTeamManagers(leagueTeamManagers, podiums[0].champion, podiums[0].year).name}</span>
			{:else}
				<p class="center">No former champs.</p>
			{/if}
		{:catch error}
			<p class="center">Something went wrong: {error.message}</p>
		{/await}
	</div>

	<div class="transactions" >
		<Transactions />
	</div>
</div>
