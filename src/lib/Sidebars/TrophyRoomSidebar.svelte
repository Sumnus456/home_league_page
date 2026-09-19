<script>
	import LinearProgress from '@smui/linear-progress';
	import { getAwards, getLeagueTeamManagers, waitForAll } from '$lib/utils/helper';
	import { getTeamFromTeamManagers, renderManagerNames } from '$lib/utils/helperFunctions/universalFunctions';

	const dataPromise = waitForAll(getAwards(), getLeagueTeamManagers());
</script>

<style>
	.sidebar {
		position: relative;
		z-index: 1;
		min-height: 100%;
		background-color: var(--ebebeb);
		border-left: var(--eee);
		box-shadow: inset 8px 0px 6px -6px rgb(0 0 0 / 24%);
	}

	.banner {
		background-color: var(--blueOne);
		color: #fff;
		padding: 0.5em 0;
		font-weight: 500;
		font-size: 1.5em;
		text-align: center;
	}

	.center {
		text-align: center;
	}

	.list {
		padding: 0.5em 0.75em;
	}

	.row {
		display: flex;
		flex-direction: column;
		gap: 0.15em;
		padding: 0.5em 0;
		border-bottom: 1px solid var(--ddd);
	}

	.row:last-child {
		border-bottom: none;
	}

	.year {
		font-weight: 700;
		color: var(--blueOne);
		font-size: 0.85em;
	}

	.team {
		font-weight: 500;
		overflow-wrap: break-word;
	}

	.manager {
		color: var(--g555);
		font-size: 0.8em;
		font-style: italic;
		overflow-wrap: break-word;
	}
</style>

<div class="sidebar">
	<div class="banner">Past Champions</div>

	<div class="list">
		{#await dataPromise}
			<p class="center">Loading champions...</p>
			<LinearProgress indeterminate />
		{:then [podiums, leagueTeamManagers]}
			{#each podiums as podium (podium.year)}
				<div class="row">
					<span class="year">{podium.year}</span>
					<span class="team">{getTeamFromTeamManagers(leagueTeamManagers, podium.champion, podium.year).name}</span>
					<span class="manager">{renderManagerNames(leagueTeamManagers, podium.champion, podium.year)}</span>
				</div>
			{:else}
				<p class="center">No seasons completed yet.</p>
			{/each}
		{:catch error}
			<p class="center">Something went wrong: {error.message}</p>
		{/await}
	</div>
</div>
