<script>
	import LinearProgress from '@smui/linear-progress';
	import { getLeagueRecords } from '$lib/utils/helper';
	import { managers } from '$lib/utils/leagueInfo';

	const LIMIT = 3;

	const dataPromise = getLeagueRecords();

	const managerName = (managerID) => managers.find((m) => m.managerID == managerID)?.name ?? 'Unknown';

	const topByField = (leagueManagerRecords, field) => {
		return Object.entries(leagueManagerRecords)
			.map(([managerID, record]) => ({ managerID, ...record }))
			.sort((a, b) => b[field] - a[field])
			.slice(0, LIMIT);
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

	.sectionLabel {
		margin: 1em 0 0.25em;
		font-size: 0.7em;
		font-weight: 700;
		letter-spacing: 0.06em;
		color: var(--g555);
	}

	.sectionLabel:first-child {
		margin-top: 0.25em;
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
	<div class="banner">All-Time Leaders</div>

	<div class="list">
		{#await dataPromise}
			<p class="center">Loading records...</p>
			<LinearProgress indeterminate />
		{:then {regularSeasonData}}
			<div class="sectionLabel">Most Wins</div>
			{#each topByField(regularSeasonData.leagueManagerRecords, 'wins') as manager (manager.managerID)}
				<div class="row">
					<span class="name">{managerName(manager.managerID)}</span>
					<span class="pts">{manager.wins}-{manager.losses}{manager.ties ? `-${manager.ties}` : ''}</span>
				</div>
			{/each}

			<div class="sectionLabel">Most Points</div>
			{#each topByField(regularSeasonData.leagueManagerRecords, 'fptsFor') as manager (manager.managerID)}
				<div class="row">
					<span class="name">{managerName(manager.managerID)}</span>
					<span class="pts">{Math.round(manager.fptsFor)} pts</span>
				</div>
			{/each}
		{:catch error}
			<p class="center">Something went wrong: {error.message}</p>
		{/await}
	</div>
</div>
