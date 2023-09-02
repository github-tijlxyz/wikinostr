<script lang="ts">
  import { tabs } from '$lib/state';
  import type { Tab, TabType } from '$lib/types';
  import { generateRandomNumber, scrollTabIntoView } from '$lib/utils';
  import Article from './Article.svelte';
  import Search from './Search.svelte';
  export let tab: Tab;

  function removeSelf() {
    const index = $tabs.findIndex((item) => item.id === tab.id);
    if (index !== -1) {
      const newTabs = [...$tabs];
      newTabs.splice(index, 1);
      tabs.set(newTabs);
    }
  }

  function createChild(type: TabType, data: string) {
    const index = $tabs.findIndex((item) => item.id === tab.id);
    if (index !== -1) {
      const newChild: Tab = {
        id: generateRandomNumber(),
        parent: tab.id,
        type: type,
        data: data
      };
      const newTabs = $tabs.slice(0, index + 1).concat(newChild);
      tabs.set(newTabs);
      setTimeout(() => scrollTabIntoView(String(newChild.id)), 5);
    }
  }

  function replaceSelf(newType: TabType, newData: string) {
    const index = $tabs.findIndex((item) => item.id === tab.id);
    if (index !== -1) {
      const newTabs = $tabs.slice();
      const removedChildren = newTabs.filter((item) => item.parent === tab.id);
      removedChildren.forEach((child) => {
        const childIndex = newTabs.indexOf(child);
        if (childIndex !== -1) {
          newTabs.splice(childIndex, 1);
        }
      });
      const updatedTab: Tab = {
        id: generateRandomNumber(),
        type: newType,
        data: newData
      };
      newTabs[index] = updatedTab;
      tabs.set(newTabs);
    }
  }

  let idtoload: string | undefined = undefined;
  let searchquerytoload: string | undefined = undefined;

  if (tab.type == 'welcome') {
    idtoload = 'e2f25e696746d18de3f11fc32a55b01123fc3bce10841808ad0dfdedee55c492';
  } else if (tab.type == 'articlefind') {
    searchquerytoload = tab.data;
  } else if (tab.type == 'article') {
    idtoload = tab.data;
  }
</script>

<div
  id={`wikitab-v0-${tab.id}`}
  class="
  overflow-y-auto
  overflow-x-hidden
  mx-2 p-4 mt-2
  min-w-[365px] max-w-[365px] lg:min-w-[32rem] lg:max-w-[32rem]
  rounded-lg border border-slate-500 bg-slate-50
  h-[calc(100vh_-_32px)]"
>
  <button on:click={removeSelf}
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6"
      ><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg
    ></button
  >
  {#if idtoload}
    <Article {createChild} eventid={idtoload} />
  {/if}

  {#if searchquerytoload}
    <Search {replaceSelf} query={searchquerytoload} />
  {/if}
</div>
