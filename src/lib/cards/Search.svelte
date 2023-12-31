<script lang="ts">
  import { ndk } from '$lib/ndk';
  import { wikiKind } from '$lib/consts';
  import type { NDKEvent } from '@nostr-dev-kit/ndk';
  import { onMount } from 'svelte';
  import type { Tab } from '$lib/types';
  import { tabBehaviour } from '$lib/state';
  import { parsePlainText } from '$lib/articleParser';
  import { next } from '$lib/utils';

  export let query: string;
  export let replaceSelf: (tab: Tab) => void;
  export let createChild: (tab: Tab) => void;
  let results: NDKEvent[] = [];
  let tried = 0;

  async function search(query: string) {
    results = [];
    const filter = { kinds: [wikiKind], '#d': [query] };
    const events = await $ndk.fetchEvents(filter);
    if (!events) {
      tried = 1;
      results = [];
      return;
    }
    tried = 1;
    results = Array.from(events);
  }

  onMount(async () => {
    await search(query);
  });
</script>

<article class="font-sans mx-auto p-2 lg:max-w-4xl">
  <div class="prose">
    <h1 class="mb-0">{query}</h1>
    <p class="mt-0 mb-0">
      There are {#if tried == 1}{results.length}{:else}...{/if} articles with the name "{query}"
    </p>
  </div>
  {#each results as result}
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <div
      on:click={() => {
        $tabBehaviour == 'child'
          ? createChild({ id: next(), type: 'article', data: result.id })
          : replaceSelf({ id: next(), type: 'article', data: result.id });
      }}
      class="cursor-pointer px-4 py-5 bg-white border border-gray-300 hover:bg-slate-50 rounded-lg mt-2 min-h-[48px]"
    >
      <h1>
        {result.tags.find((e) => e[0] == 'title')?.[0] &&
        result.tags.find((e) => e[0] == 'title')?.[1]
          ? result.tags.find((e) => e[0] == 'title')?.[1]
          : result.tags.find((e) => e[0] == 'd')?.[1]}
      </h1>
      <p class="text-xs">
        <!-- implement published at? -->
        <!-- {#if result.tags.find((e) => e[0] == "published_at")}
              on {formatDate(result.tags.find((e) => e[0] == "published_at")[1])}
              {/if} -->
        {#await result.author?.fetchProfile()}
          by <span class="text-gray-600 font-[600]">...</span>
        {:then result}
          by {result !== null && JSON.parse(Array.from(result)[0]?.content)?.name}
        {/await}
      </p>
      <p class="text-xs">
        {#if result.tags.find((e) => e[0] == 'summary')?.[0] && result.tags.find((e) => e[0] == 'summary')?.[1]}
          {result.tags
            .find((e) => e[0] == 'summary')?.[1]
            .slice(
              0,
              192
            )}{#if String(result.tags.find((e) => e[0] == 'summary')?.[1])?.length > 192}...{/if}
        {:else}
          {result.content.length <= 192
            ? parsePlainText(result.content.slice(0, 189))
            : parsePlainText(result.content.slice(0, 189)) + '...'}
        {/if}
      </p>
    </div>
  {/each}
  {#if tried == 1}
    <div class="px-4 py-5 bg-white border border-gray-300 rounded-lg mt-2 min-h-[48px]">
      <p class="mb-2">
        {results.length < 1 ? "Can't find this article" : "Didn't find what you are looking for?"}
      </p>
      <button
        on:click={() => {
          $tabBehaviour == 'child'
            ? createChild({ id: next(), type: 'editor', data: { title: query } })
            : replaceSelf({ id: next(), type: 'editor', data: { title: query } });
        }}
        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create this article!
      </button>
      <button
        on:click={() =>
          $tabBehaviour == 'replace'
            ? replaceSelf({ id: next(), type: 'settings' })
            : createChild({ id: next(), type: 'settings' })}
        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add more relays
      </button>
    </div>
  {:else}
    <div class="px-4 py-5 rounded-lg mt-2 min-h-[48px]">Loading...</div>
  {/if}
</article>
