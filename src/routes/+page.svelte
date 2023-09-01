<script lang="ts">
  import Tab from "../components/Tab.svelte";
  import { tabs } from "$lib/state";
</script>

<div class="flex overflow-x-scroll pb-2 scroll-smooth">
  {#each $tabs as tab (tab.id)}
    <Tab {tab} />
  {/each}
</div>
