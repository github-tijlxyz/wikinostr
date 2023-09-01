<script lang="ts">
  import { tabs } from "$lib/state";
  import type { Tab } from "$lib/types";
  import { generateRandomNumber, scrollTabIntoView } from "$lib/utils";
  import { onMount } from "svelte";
  import Article from "./Article.svelte";
  import Search from "./Search.svelte";
  export let tab: Tab;

  export function removeSelf() {
    // Remove self and child
    const index = $tabs.findIndex((item) => item.id === tab.id);
    if (index !== -1) {
      const newTabs = $tabs.slice();
      const childTabs = newTabs.filter((item) => item.parent === tab.id);
      childTabs.forEach((childTab) => {
        const childIndex = newTabs.indexOf(childTab);
        if (childIndex !== -1) {
          newTabs.splice(childIndex, 1);
        }
      });
      newTabs.splice(index, 1);
      tabs.set(newTabs);
    }
  }

  function createChild(type: string, data: string) {
    // Create child
    const index = $tabs.findIndex((item) => item.id === tab.id);
    if (index !== -1) {
      const newChild = {
        id: generateRandomNumber(),
        parent: tab.id,
        type: type,
        data: data,
      };
      const newTabs = $tabs.slice(0, index + 1).concat(newChild);
      tabs.set(newTabs);
      setTimeout(() => scrollTabIntoView(String(newChild.id)), 5)
    }
  }

  // use for search?
  // function replaceSelf(newType: string, newData: string) {
  //   // Replace self (if no child)
  //   const index = $tabs.findIndex((item) => item.id === tab.id);
  //   if (index !== -1) {
  //     const newTabs = $tabs.slice();
  //     // Remove children of the current tab
  //     const removedChildren = newTabs.filter((item) => item.parent === tab.id);
  //     removedChildren.forEach((child) => {
  //       const childIndex = newTabs.indexOf(child);
  //       if (childIndex !== -1) {
  //         newTabs.splice(childIndex, 1);
  //       }
  //     });
  //     // Replace the current tab with a new tab
  //     const updatedTab = {
  //       id: generateRandomNumber(),
  //       type: newType,
  //       data: newData,
  //     };
  //     newTabs[index] = updatedTab;
  //     tabs.set(newTabs);
  //   }
  // }

  let idtoload: string | undefined = undefined;
  let searchquerytoload: string | undefined = undefined;

    if (tab.type == "welcome") {
      idtoload =
        "e2f25e696746d18de3f11fc32a55b01123fc3bce10841808ad0dfdedee55c492";
    } else if (tab.type == "articlefind") {
      searchquerytoload = tab.data;
    } else if (tab.type == "article") {
      idtoload = tab.data;
    }
</script>

<div
  id={`wikitab-v0-${tab.id}`}
  class="
  overflow-y-scroll
  overflow-x-hidden
  mx-2 p-4 mt-2
  min-w-[365px] max-w-[365px] lg:min-w-[32rem] lg:max-w-[32rem]
  rounded-lg border border-slate-500 bg-slate-50
  h-[calc(100vh_-_64px_-_32px)]"
>
  {#if idtoload}
    <Article {createChild} eventid={idtoload} tabid={tab.id} />
  {/if}

  {#if searchquerytoload}
    <Search {createChild} query={searchquerytoload} />
  {/if}
</div>
