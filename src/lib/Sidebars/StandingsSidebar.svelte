<script>
	import LinearProgress from '@smui/linear-progress';
	import { getLeagueMatchups, loadPlayers, waitForAll } from '$lib/utils/helper';

	const LIMIT = 10;

	const dataPromise = waitForAll(getLeagueMatchups(), loadPlayers(null));

	const topScorers = (matchupsResponse, players) => {
		const weekData = matchupsResponse.matchupWeeks.find((w) => w.week == matchupsResponse.week);
		if(!weekData) return [];

		const scored = [];
		for(const matchupID in weekData.matchups) {
			for(const roster of weekData.matchups[matchupID]) {
				roster.starters.forEach((playerID, i) => {
					const points = roster.points?.[i];
					if(playerID && playerID != '0' && points > 0 && players[playerID]) {
						scored.push({ playerID, points });
					}
				});
			}
		}

		return scored.sort((a, b) => b.points - a.points).slice(0, LIMIT);
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

	.posTeam {
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
	{#await dataPromise}
		<div class="banner">Top Players</div>
		<div class="list">
			<p class="center">Loading top scorers...</p>
			<LinearProgress indeterminate />
		</div>
	{:then [matchupsResponse, playersData]}
		<div class="banner">Top Players - Week {matchupsResponse.week}</div>
		<div class="list">
			{#if matchupsResponse?.matchupWeeks?.length}
				{#each topScorers(matchupsResponse, playersData.players) as scorer (scorer.playerID)}
					{@const player = playersData.players[scorer.playerID]}
					<div class="row">
						<span class="name">{player.fn} {player.ln}</span>
						<span class="posTeam">{player.pos}{player.t ? ` - ${player.t}` : ''}</span>
						<span class="pts">{scorer.points} pts</span>
					</div>
				{/each}
			{:else}
				<p class="center">No scoring data yet.</p>
			{/if}
		</div>
	{:catch error}
		<div class="banner">Top Players</div>
		<div class="list">
			<p class="center">Something went wrong: {error.message}</p>
		</div>
	{/await}
</div>
