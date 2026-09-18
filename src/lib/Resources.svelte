<script>
    import List, { Item, Graphic, Separator, Text, PrimaryText, SecondaryText } from '@smui/list';
import { dynasty } from './utils/helper';

    const resources = [
        {
            name: "KeepTradeCut",
            url: "https://keeptradecut.com/trade-calculator",
            description: "Trade calculator and dynasty rankings, crowdsourced from millions of dynasty managers. Free.",
            icon: "insights",
            premium: false,
            separator: true,
        },
        {
            name: "FantasyPros Dynasty Trade Value Chart",
            url: "https://www.fantasypros.com/content/nfl/dynasty-nfl/nfl-trade-value-chart/",
            description: "Expert consensus dynasty trade values. Free tier available.",
            icon: "assessment",
            premium: true,
            separator: true,
        },
        {
            name: "FantasyPros Trade Analyzer",
            url: "https://www.fantasypros.com/nfl/myplaybook/trade-analyzer.php",
            description: "Evaluate trades using expert rankings and your league settings. Free tier available.",
            icon: "calculate",
            premium: true,
            separator: true,
        },
        {
            name: "FantasyPros Dynasty Rankings",
            url: "https://www.fantasypros.com/nfl/rankings/dynasty-overall.php",
            description: "Expert consensus dynasty rankings across all positions. Free tier available.",
            icon: "leaderboard",
            premium: true,
            separator: true,
        },
        {
            name: "Draft Sharks",
            url: "https://www.draftsharks.com",
            description: "Fantasy football rankings, projections, and tools. Free tier available.",
            icon: "insights",
            premium: true,
            separator: true,
        },
        {
            name: "Reddit Dynasty Fantasy Football",
            url: "https://www.reddit.com/r/DynastyFF",
            description: "Active community for dynasty news, advice, and discussion. Free.",
            icon: "article",
            premium: false,
            separator: false,
        },
    ];
</script>

<style>
    .pageBody {
        position: relative;
        z-index: 1;
    }

    :global(.list) {
        width: 90%;
        max-width: 800px;
        border: 1px solid
        var(--mdc-theme-text-hint-on-background, var(--d7d7d7));
        margin: 15px auto;
        padding: 0 !important;
        box-shadow: 0px 3px 3px -2px var(--boxShadowOne), 0px 3px 4px 0px var(--boxShadowTwo), 0px 1px 8px 0px var(--boxShadowThree);
    }


    :global(.linkText) {
        font-size: 1.1em;
    }

    a {
        color: var(--g555);
        font-size: 1.1em;
        text-decoration: none;
    }

    h4 {
        text-align: center;
    }

    .disclaimer {
        color: #888;
        text-align: center;
    }
</style>

<div class="pageBody">
    <div class="banner">
        <h4>Helpful Dynasty Resources</h4>
    </div>

    <List class="list" twoLine dense>
        {#each resources as resource}
            {#if resource.dynastyOnly && dynasty}
                <a target="_blank" href="{resource.url}">
                    <Item>
                        {#if resource.icon}
                            <Graphic class="material-icons">{resource.icon}</Graphic>
                        {/if}
                        <Text class="linkText">
                            <PrimaryText>{resource.name}{resource.premium ? "*" : ""}</PrimaryText>
                            {#if resource.description}
                                <SecondaryText>{resource.description}</SecondaryText>
                            {/if}
                        </Text>
                    </Item>
                    {#if resource.separator}
                        <Separator />
                    {/if}
                </a>
            {:else if resource.redraftOnly && !dynasty}
                <a target="_blank" href="{resource.url}">
                    <Item>
                        {#if resource.icon}
                            <Graphic class="material-icons">{resource.icon}</Graphic>
                        {/if}
                        <Text class="linkText">
                            <PrimaryText>{resource.name}{resource.premium ? "*" : ""}</PrimaryText>
                            {#if resource.description}
                                <SecondaryText>{resource.description}</SecondaryText>
                            {/if}
                        </Text>
                    </Item>
                    {#if resource.separator}
                        <Separator />
                    {/if}
                </a>
            {:else if !resource.redraftOnly && !resource.dynastyOnly}
                <a target="_blank" href="{resource.url}">
                    <Item>
                        {#if resource.icon}
                            <Graphic class="material-icons">{resource.icon}</Graphic>
                        {/if}
                        <Text class="linkText">
                            <PrimaryText>{resource.name}{resource.premium ? "*" : ""}</PrimaryText>
                            {#if resource.description}
                                <SecondaryText>{resource.description}</SecondaryText>
                            {/if}
                        </Text>
                    </Item>
                    {#if resource.separator}
                        <Separator />
                    {/if}
                </a>
            {/if}
        {/each}
    </List>
    <p class="disclaimer">*Some or all content on marked sites may require a paid subscription.</p>
</div>
