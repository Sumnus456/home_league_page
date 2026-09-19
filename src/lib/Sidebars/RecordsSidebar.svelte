<script>
	import LinearProgress from '@smui/linear-progress';
	import { getLeagueMatchups, loadPlayers, waitForAll } from '$lib/utils/helper';

	const POSITIONS = ['QB', 'RB', 'WR', 'TE'];

	const dataPromise = waitForAll(getLeagueMatchups(), loadPlayers(null));

	// getLeagueMatchups returns every week of the current season, so summing
	// each player's points across matchupWeeks gives a season-long total
	const seasonLeadersByPosition = (matchupsResponse, players) => {
		const totals = {};
		for(const weekData of matchupsResponse.matchupWeeks) {
			for(const matchupID in weekData.matchups) {
				for(const roster of weekData.matchups[matchupID]) {
					roster.starters.forEach((playerID, i) => {
						const points = roster.points?.[i];
						if(playerID && playerID != '0' && points != null && players[playerID]) {
							totals[playerID] = (totals[playerID] || 0) + points;
						}
					});
				}
			}
		}

		const leaders = {};
		for(const playerID in totals) {
			const player = players[playerID];
			if(!POSITIONS.includes(player.pos)) continue;
			if(!leaders[player.pos] || totals[playerID] > leaders[player.pos].points) {
				leaders[player.pos] = { player, points: totals[playerID] };
			}
		}

		return POSITIONS.map((pos) => ({ pos, ...leaders[pos] })).filter((l) => l.player);
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

	.pos {
		font-weight: 700;
		color: var(--blueOne);
		flex-shrink: 0;
		width: 2.2em;
	}

	.name {
		font-weight: 500;
		flex: 1;
		overflow-wrap: break-word;
	}

	.pts {
		color: var(--g555);
		font-size: 0.85em;
		flex-shrink: 0;
	}
</style>

<div class="sidebar">
	<div class="banner">Season Points Leaders</div>

	<div class="list">
		{#await dataPromise}
			<p class="center">Loading leaders...</p>
			<LinearProgress indeterminate />
		{:then [matchupsResponse, playersData]}
			{#if matchupsResponse?.matchupWeeks?.length}
				{#each seasonLeadersByPosition(matchupsResponse, playersData.players) as leader (leader.pos)}
					<div class="row">
						<span class="pos">{leader.pos}</span>
						<span class="name">{leader.player.fn} {leader.player.ln}{leader.player.t ? ` - ${leader.player.t}` : ''}</span>
						<span class="pts">{Math.round(leader.points)} pts</span>
					</div>
				{/each}
			{:else}
				<p class="center">No scoring data yet.</p>
			{/if}
		{:catch error}
			<p class="center">Something went wrong: {error.message}</p>
		{/await}
	</div>
</div>
