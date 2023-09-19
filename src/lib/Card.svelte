<script lang="ts">
  import { tabs } from '$lib/state';
  import type { Tab } from '$lib/types';
  import { next, scrollTabIntoView, isElementInViewport } from '$lib/utils';
  import Article from '$cards/Article.svelte';
  import Editor from '$cards/Editor.svelte';
  import Welcome from '$lib/cards/Welcome.svelte';
  import Search from '$cards/Search.svelte';
  import Settings from '$cards/Settings.svelte';
  import UserArticles from './cards/UserArticles.svelte';
  export let tab: Tab;

  function removeSelf() {
    const index = $tabs.findIndex((item) => item.id === tab.id);
    if (index !== -1) {
      const newTabs = [...$tabs];
      newTabs.splice(index, 1);
      $tabs = newTabs;
      tabs.set($tabs);
    }
  }

  function createChild(newChild: Tab) {
    const index = $tabs.findIndex((item) => item.id === tab.id);
    if (index !== -1) {
      const newTabs = $tabs.slice(0, index + 1).concat(newChild);
      tabs.set(newTabs);
      setTimeout(() => {
        if (!isElementInViewport(String(newChild.id))) {
          scrollTabIntoView(String(newChild.id), false);
        }
      }, 1);
    }
  }

  function replaceSelf(updatedTab: Tab) {
    if (updatedTab !== tab.previous) {
      updatedTab.previous = tab;
    }
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
      newTabs[index] = updatedTab;
      tabs.set(newTabs);
    }
  }

  function back() {
    if (tab.previous) {
      replaceSelf(tab.previous);
    }
  }

  function handleClick(ev: { currentTarget: HTMLElement }) {
    if (!isElementInViewport(ev.currentTarget)) scrollTabIntoView(ev.currentTarget, false);
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
<div
  id={`wikitab-v0-${tab.id}`}
  class="
  overflow-y-auto
  overflow-x-hidden
  mx-2 p-4 mt-2
  min-w-[365px] max-w-[365px] lg:min-w-[32rem] lg:max-w-[32rem]
  rounded-lg border border-slate-500 bg-slate-50
  h-[calc(100vh_-_32px)]"
  on:click={handleClick}
>
  {#if tab.previous}
    <button on:click={back}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  {/if}
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

  {#if tab.type == 'article'}
    <Article {replaceSelf} {createChild} eventid={tab.data} />
  {:else if tab.type == 'find'}
    <Search {createChild} {replaceSelf} query={tab.data} />
  {:else if tab.type == 'welcome'}
    <Welcome {replaceSelf} {createChild} />
  {:else if tab.type == 'settings'}
    <Settings />
  {:else if tab.type == 'editor'}
    <Editor {replaceSelf} data={tab.data} />
  {:else if tab.type == 'user'}
    <UserArticles {replaceSelf} {createChild} data={tab.data} />
  {/if}
</div>
