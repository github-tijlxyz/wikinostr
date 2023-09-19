<script lang="ts">
  import '../app.postcss';
  import TabElement from '$lib/Card.svelte';
  import { tabs, userPublickey } from '$lib/state';
  import Searchbar from '$components/Searchbar.svelte';
  import { next, scrollTabIntoView } from '$lib/utils';
  import { ndk } from '$lib/ndk';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { NDKNip07Signer } from '@nostr-dev-kit/ndk';

  async function login() {
    if (browser) {
      const signer = new NDKNip07Signer();
      $ndk.signer = signer;
      ndk.set($ndk);
      if ($ndk.signer && $userPublickey == '') {
        const newUserPublicKey = (await $ndk.signer.user()).hexpubkey();
        localStorage.setItem('wikinostr_loggedInPublicKey', newUserPublicKey);
        $userPublickey = newUserPublicKey;
        userPublickey.set($userPublickey);
      }
    }
  }

  onMount(() => {
    addEventListener('load', (e) => {
      setTimeout(async () => {
        await login();
      }, 1);
    });
  });

  function openMyArticles() {
    if ($userPublickey !== '') {
      let newTabs = [...$tabs];
      newTabs.push({
        type: 'user',
        data: $userPublickey,
        id: next()
      });
      $tabs = newTabs;
      tabs.set($tabs);
    }
  }

  function openRecentArticles() {
    if (!$tabs.find((e) => e.type == 'welcome')) {
      let newTabs = [...$tabs];
      newTabs.push({
        type: 'welcome',
        id: next()
      });
      $tabs = newTabs;
      tabs.set($tabs);
    }
  }

  function openSettings() {
    if (!$tabs.find((e) => e.type == 'settings')) {
      let newTabs = [...$tabs];
      newTabs.push({
        type: 'settings',
        id: next()
      });
      $tabs = newTabs;
      tabs.set($tabs);
    }
  }
</script>

<svelte:head>
  <title>WikiNostr</title>
  <meta name="description" content={`A "wikipedia" client for nostr`} />
</svelte:head>

<!--does nothing-->
<slot />

<div class="flex overflow-x-scroll pb-2 scroll-smooth">
  {#each $tabs as tab (tab.id)}
    <TabElement {tab} />
  {/each}
  <!-- svelte-ignore a11y-no-static-element-interactions a11y-click-events-have-key-events -->
  <div
    id={`wikitab-v0-special-search`}
    class="
overflow-y-auto
overflow-x-hidden
mx-2 p-4 mt-2 relative
min-w-[365px] max-w-[365px] lg:min-w-[32rem] lg:max-w-[32rem]
rounded-lg border border-slate-500 bg-slate-50
h-[calc(100vh_-_32px)]"
    on:click={(ev) => scrollTabIntoView(ev.currentTarget, false)}
  >
    <div class="p-6"><Searchbar /></div>
    <div class=""></div>
    <div class="absolute bottom-4 w-full">
      <div class="prose text-center mx-auto">
        <div class="inline">
          <a class="cursor-pointer" on:click={openRecentArticles}>welcome</a> •
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/github-tijlxyz/wikinostr">wikinostr</a
          >
        </div>
        <div class="inline">•</div>
        <div class="inline">
          <a class="cursor-pointer" on:click={openSettings}>settings</a> •
          <a class="cursor-pointer" on:click={openMyArticles}>my articles</a>
        </div>
      </div>
    </div>
  </div>
</div>
