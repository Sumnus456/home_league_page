<script>
	import LinearProgress from '@smui/linear-progress';
	import { getBlogPosts, parseDate } from '$lib/utils/helper';

	const postsPromise = getBlogPosts();
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

	.title {
		font-weight: 500;
		color: var(--navActive);
		text-decoration: none;
		overflow-wrap: break-word;
	}

	.title:hover {
		text-decoration: underline;
	}

	.type {
		color: var(--g555);
		font-size: 0.8em;
		font-style: italic;
	}

	.date {
		color: var(--g555);
		font-size: 0.8em;
	}
</style>

<div class="sidebar">
	<div class="banner">Recent Blog Posts</div>

	<div class="list">
		{#await postsPromise}
			<p class="center">Loading posts...</p>
			<LinearProgress indeterminate />
		{:then postsData}
			{#each [...postsData.posts].sort((a, b) => Date.parse(b.sys.createdAt) - Date.parse(a.sys.createdAt)).slice(0, 10) as post (post.sys.id)}
				<div class="row">
					<a class="title" href="/blog/{post.sys.id}">{post.fields.title}</a>
					<span class="type">{post.fields.type}</span>
					<span class="date">{parseDate(post.sys.createdAt)}</span>
				</div>
			{:else}
				<p class="center">No blog posts yet.</p>
			{/each}
		{:catch error}
			<p class="center">Something went wrong: {error.message}</p>
		{/await}
	</div>
</div>
