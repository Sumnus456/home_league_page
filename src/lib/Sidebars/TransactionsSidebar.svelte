<script>
	import LinearProgress from '@smui/linear-progress';
	import { getLeagueTransactions, getLeagueTeamManagers, loadPlayers, waitForAll } from '$lib/utils/helper';
	import { getTeamFromTeamManagers } from '$lib/utils/helperFunctions/universalFunctions';

	const LIMIT = 5;

	const dataPromise = waitForAll(getLeagueTransactions(false), getLeagueTeamManagers(), loadPlayers(null));

	// transaction.moves is an array of "move rows", each row parallel to transaction.rosters
	// (one slot per roster involved); flatten out every slot that represents a player action
	const playerMoves = (transaction, players) => {
		const moves = [];
		for(const moveRow of transaction.moves) {
			moveRow.forEach((slot, i) => {
				if(slot && slot !== 'origin' && slot.player && players[slot.player]) {
					moves.push({
						rosterID: transaction.rosters[i],
						action: slot.type,
						player: players[slot.player],
					});
				}
			});
		}
		return moves;
	}

	const actionLabel = (action) => {
		if(action == 'Dropped') return 'Dropped';
		if(action == 'trade') return 'Traded';
		return 'Added';
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

	.transactionRow {
		display: flex;
		flex-direction: column;
		gap: 0.3em;
		padding: 0.6em 0;
		border-bottom: 1px solid var(--ddd);
	}

	.transactionRow:last-child {
		border-bottom: none;
	}

	.txHeader {
		display: flex;
		justify-content: space-between;
		gap: 0.5em;
	}

	.txType {
		font-weight: 600;
		font-size: 0.85em;
	}

	.date {
		color: var(--g999);
		font-style: italic;
		font-size: 0.7em;
	}

	.moveLine {
		font-size: 0.85em;
		color: var(--g555);
		overflow-wrap: break-word;
	}
</style>

<div class="sidebar">
	<div class="banner">Recent Transactions</div>

	<div class="list">
		{#await dataPromise}
			<p class="center">Loading transactions...</p>
			<LinearProgress indeterminate />
		{:then [{transactions}, leagueTeamManagers, playersData]}
			{#each transactions.slice(0, LIMIT) as transaction (transaction.id)}
				<div class="transactionRow">
					<div class="txHeader">
						<span class="txType">{transaction.type == 'trade' ? 'Trade' : 'Waiver'}</span>
						<span class="date">{transaction.date}</span>
					</div>
					{#each playerMoves(transaction, playersData.players) as move}
						<div class="moveLine">
							<strong>{actionLabel(move.action)}</strong>
							{move.player.fn} {move.player.ln}
							— {getTeamFromTeamManagers(leagueTeamManagers, move.rosterID, transaction.season).name}
						</div>
					{/each}
				</div>
			{:else}
				<p class="center">No transactions yet.</p>
			{/each}
		{:catch error}
			<p class="center">Something went wrong: {error.message}</p>
		{/await}
	</div>
</div>
