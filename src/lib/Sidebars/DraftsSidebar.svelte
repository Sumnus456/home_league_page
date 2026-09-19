<script>
	import LinearProgress from '@smui/linear-progress';
	import { getUpcomingDraft, getPreviousDrafts, getLeagueTeamManagers, loadPlayers, waitForAll } from '$lib/utils/helper';
	import { getTeamFromTeamManagers } from '$lib/utils/helperFunctions/universalFunctions';

	const DRAFT_TYPE_LABEL = { snake: 'Snake', auction: 'Auction', linear: 'Linear' };

	const loadDraftInfo = async () => {
		try {
			const upcoming = await getUpcomingDraft();
			if(upcoming && upcoming.draft) {
				return { upcoming };
			}
		} catch(err) {
			console.error(err);
		}

		const [previousDrafts, leagueTeamManagers, playersData] = await waitForAll(
			getPreviousDrafts(),
			getLeagueTeamManagers(),
			loadPlayers(null)
		).catch((err) => { console.error(err); return []; });

		const mostRecent = previousDrafts?.[0];
		if(!mostRecent) {
			return {};
		}

		if(mostRecent.draftType != 'auction') {
			return { previous: mostRecent };
		}

		const picks = [];
		mostRecent.draft.forEach((round) => {
			round.forEach((cell, col) => {
				if(cell && cell.player && cell.amount != null) {
					picks.push({ ...cell, rosterID: mostRecent.draftOrder[col] });
				}
			});
		});
		picks.sort((a, b) => b.amount - a.amount);

		return {
			previous: mostRecent,
			topPicks: picks.slice(0, 5),
			leagueTeamManagers,
			players: playersData.players,
		};
	}

	const dataPromise = loadDraftInfo();
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
		overflow-wrap: break-word;
	}

	.pts {
		color: var(--g555);
		font-size: 0.85em;
		flex-shrink: 0;
	}
</style>

<div class="sidebar">
	<div class="banner">Draft</div>

	<div class="list">
		{#await dataPromise}
			<p class="center">Loading draft info...</p>
			<LinearProgress indeterminate />
		{:then {upcoming, previous, topPicks, leagueTeamManagers, players}}
			{#if upcoming}
				<div class="row">
					<span class="name">Year</span>
					<span class="pts">{upcoming.year}</span>
				</div>
				<div class="row">
					<span class="name">Type</span>
					<span class="pts">{DRAFT_TYPE_LABEL[upcoming.draftType] ?? upcoming.draftType}</span>
				</div>
				<div class="row">
					<span class="name">Rounds</span>
					<span class="pts">{upcoming.draft.length}</span>
				</div>
			{:else if topPicks}
				<p class="center">No upcoming draft yet. Top picks from {previous.year}:</p>
				{#each topPicks as pick}
					<div class="row">
						<span class="name">
							{players[pick.player] ? `${players[pick.player].fn} ${players[pick.player].ln}` : 'Unknown player'}
							— {getTeamFromTeamManagers(leagueTeamManagers, pick.rosterID, previous.year).name}
						</span>
						<span class="pts">${pick.amount}</span>
					</div>
				{/each}
			{:else if previous}
				<p class="center">No upcoming draft yet. Most recent draft ({previous.year}) wasn't an auction.</p>
			{:else}
				<p class="center">No draft information available yet.</p>
			{/if}
		{:catch error}
			<p class="center">Something went wrong: {error.message}</p>
		{/await}
	</div>
</div>
