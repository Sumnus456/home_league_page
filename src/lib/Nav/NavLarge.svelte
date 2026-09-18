<script>
	import { tabs, isExternal } from '$lib/utils/tabs';
	import { page } from '$app/state';
	import { preloadData } from '$app/navigation';
	import { enableBlog, managers, leagueName } from '$lib/utils/leagueInfo';

	let { darkTheme = $bindable(), switchTheme } = $props();

	const currentPath = $derived(page.url.pathname);
	const isChildActive = (tab) => tab.nest && tab.children.some((child) => child.dest === currentPath);

	const toggleTheme = () => {
		darkTheme = !darkTheme;
		switchTheme(darkTheme);
	}
</script>

<style>
	.mainNav {
		display: flex;
		align-items: center;
		background-color: var(--navBg);
		border-bottom: 2px solid var(--navBorder);
		padding: 0 1.5em;
		height: 64px;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.6em;
		text-decoration: none;
		flex-shrink: 0;
	}

	.leagueName {
		font-weight: 600;
		font-size: 1.1em;
		color: var(--navActive);
		white-space: nowrap;
	}

	.navItems {
		display: flex;
		align-items: center;
		list-style: none;
		margin: 0 0 0 2em;
		padding: 0;
		flex: 1;
		gap: 0.25em;
		height: 100%;
	}

	.navItem {
		position: relative;
		height: 100%;
		display: flex;
		align-items: center;
	}

	.navLink,
	.navLabel {
		display: inline-flex;
		align-items: center;
		gap: 0.3em;
		padding: 0.4em 0.2em;
		color: var(--navInactive);
		text-decoration: none;
		font-size: 0.95em;
		font-weight: 500;
		cursor: pointer;
		border-bottom: 2px solid transparent;
		transition: color 0.2s ease;
		user-select: none;
	}

	.navLink:hover {
		color: var(--navHover);
	}

	.navItem.hasSubmenu:hover .navLabel {
		color: var(--navHover);
	}

	.navItem.active > .navLink,
	.navItem.active > .navLabel {
		color: var(--navActive);
		border-bottom-color: var(--navActive);
	}

	.chevron {
		display: inline-block;
		font-size: 0.9em;
		transition: transform 0.2s ease;
	}

	.navItem.hasSubmenu:hover .chevron {
		transform: rotate(90deg);
	}

	.submenu {
		display: none;
		position: absolute;
		top: 100%;
		left: 0;
		min-width: 210px;
		list-style: none;
		margin: 0;
		padding: 0.4em 0;
		background-color: var(--navBg);
		border: 1px solid var(--navBorder);
		border-top: none;
		z-index: 5;
	}

	.navItem.hasSubmenu:hover .submenu {
		display: block;
	}

	.submenu li a {
		display: block;
		padding: 0.5em 1em;
		color: var(--navInactive);
		text-decoration: none;
		font-size: 0.9em;
		border-bottom: 2px solid transparent;
		transition: color 0.2s ease;
	}

	.submenu li a:hover {
		color: var(--navHover);
	}

	.submenu li a.active {
		color: var(--navActive);
		border-bottom-color: var(--navActive);
	}

	.themeToggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		flex-shrink: 0;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--navInactive);
		font-size: 1.4em;
		transition: color 0.2s ease;
	}

	.themeToggle:hover {
		color: var(--navHover);
	}
</style>

<div class="mainNav">
	<a href="/" class="brand">
		<img src="/badge.png" alt="league logo" style="width: 36px; height: 36px; object-fit: contain;" />
		<span class="leagueName">{leagueName}</span>
	</a>

	<ul class="navItems">
		{#each tabs as tab}
			{#if tab.nest}
				<li class="navItem hasSubmenu {isChildActive(tab) ? 'active' : ''}">
					<span class="navLabel">
						{tab.label}
						<span class="chevron">›</span>
					</span>
					<ul class="submenu">
						{#each tab.children as child}
							{#if child.label != 'Managers' || managers.length > 0}
								<li>
									<a
										href={child.dest}
										target={isExternal(child.dest) ? '_blank' : undefined}
										rel={isExternal(child.dest) ? 'noopener noreferrer' : undefined}
										onmouseover={() => { if(!isExternal(child.dest)) preloadData(child.dest); }}
										class={currentPath === child.dest ? 'active' : ''}
									>
										{child.label}
									</a>
								</li>
							{/if}
						{/each}
					</ul>
				</li>
			{:else if tab.label != 'Blog' || enableBlog}
				<li class="navItem {currentPath === tab.dest ? 'active' : ''}">
					<a href={tab.dest} onmouseover={() => preloadData(tab.dest)} class="navLink">{tab.label}</a>
				</li>
			{/if}
		{/each}
	</ul>

	<button type="button" class="themeToggle" onclick={toggleTheme} aria-label="Toggle dark mode">
		<span class="material-icons">{darkTheme ? 'light_mode' : 'dark_mode'}</span>
	</button>
</div>
