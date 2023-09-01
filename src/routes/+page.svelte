<script lang="ts">
  import Tab from "../components/Tab.svelte";
  import { tabs } from "$lib/state";
  import Searchbar from "../components/Searchbar.svelte";
</script>

<div class="flex overflow-x-scroll pb-2 scroll-smooth">
  {#each $tabs as tab (tab.id)}
    <Tab {tab} />
  {/each}
  <div
  id={`wikitab-v0-special-search`}
  class="
overflow-y-scroll
overflow-x-hidden
mx-2 p-4 mt-2
min-w-[365px] max-w-[365px] lg:min-w-[32rem] lg:max-w-[32rem]
rounded-lg border border-slate-500 bg-slate-50
h-[calc(100vh_-_64px_-_32px)]"
>
  <div class="p-6"><Searchbar /></div>
</div>
</div>
