<script>
	import LinearProgress from '@smui/linear-progress';
	import { getLeagueStandings, getLeagueTeamManagers, waitForAll } from '$lib/utils/helper';
	import { getTeamFromTeamManagers } from '$lib/utils/helperFunctions/universalFunctions';

	const dataPromise = waitForAll(getLeagueStandings(), getLeagueTeamManagers());

	const sortStandings = (standingsInfo) => {
		return Object.values(standingsInfo).sort((a, b) => {
			if(b.wins != a.wins) return b.wins - a.wins;
			return b.fpts - a.fpts;
		});
	}
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
		justify-content: space-between;
		align-items: baseline;
		gap: 0.5em;
		padding: 0.5em 0;
		border-bottom: 1px solid var(--ddd);
	}

	.row:last-child {
		border-bottom: none;
	}

	.name {
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.record {
		color: var(--g555);
		font-size: 0.85em;
		flex-shrink: 0;
	}

	.pts {
		color: var(--g555);
		font-size: 0.8em;
		flex-shrink: 0;
	}
</style>

<div class="sidebar">
	<div class="banner">Standings</div>

	<div class="list">
		{#await dataPromise}
			<p class="center">Loading standings...</p>
			<LinearProgress indeterminate />
		{:then [standings, leagueTeamManagers]}
			{#if standings && standings.standingsInfo}
				{#each sortStandings(standings.standingsInfo) as team}
					<div class="row">
						<span class="name">{getTeamFromTeamManagers(leagueTeamManagers, team.rosterID).name}</span>
						<span class="record">{team.wins}-{team.losses}{team.ties ? `-${team.ties}` : ''}</span>
						<span class="pts">{team.fpts} pts</span>
					</div>
				{/each}
			{:else}
				<p class="center">Standings aren't available yet.</p>
			{/if}
		{:catch error}
			<p class="center">Something went wrong: {error.message}</p>
		{/await}
	</div>
</div>
