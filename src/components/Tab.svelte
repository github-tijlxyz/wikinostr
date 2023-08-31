<script lang="ts">
  import { tabs } from "$lib/state";
  import type { Tab } from "$lib/types";
  import { generateRandomNumber, scrollTabIntoView } from "$lib/utils";
  import { onMount } from "svelte";
  import Article from "./Article.svelte";
  import Search from "./Search.svelte";
  export let tab: Tab; // this is "self"

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

  // unnecessary
  // function removeChild(tabId: number) { 
  //   // Remove Child (and child of child ect)
  //   const newTabs = $tabs.slice();
  //   function removeTabAndDescendants(tabIdToRemove: number) {
  //     const index = newTabs.findIndex((item) => item.id === tabIdToRemove);
  //     if (index !== -1) {
  //       const removedTab = newTabs.splice(index, 1)[0];
  //       const descendants = newTabs.filter(
  //         (item) => item.parent === tabIdToRemove
  //       );
  //       descendants.forEach((descendant) => {
  //         removeTabAndDescendants(descendant.id);
  //       });
  //     }
  //   }
  //   removeTabAndDescendants(tabId);
  //   tabs.set(newTabs);
  // }

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
      setTimeout(() => scrollTabIntoView(newChild.id), 5)
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

  onMount(() => {
    console.log("say hello to tab", tab);
    if (tab.type == "welcome") {
      // TODO IMPORTANT: change welcome wiki article (to a REAL wiki article)
      idtoload =
        "71d2e6dd4db41cf74d1dbda8e64802b880c1d56e08249fe26ee37c75bc48de4b";
    } else if (tab.type == "articlefind") {
      searchquerytoload = tab.data;
    } else if (tab.type == "article") {
      idtoload = tab.data;
    }
  });
</script>

<div
  class="mt-2 overflow-y-scroll overflow-x-hidden mx-2 p-4 min-w-[365px] max-w-[365px] lg:min-w-[32rem] lg:max-w-[32rem] rounded-lg border border-slate-600 h-[90vh] bg-slate-50"
>
  {#if idtoload}
    <Article {createChild} eventid={idtoload} tabid={tab.id} />
  {/if}

  {#if searchquerytoload}
    <Search {createChild} query={searchquerytoload} />
  {/if}
</div>
