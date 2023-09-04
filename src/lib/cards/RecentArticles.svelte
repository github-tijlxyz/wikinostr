<script lang="ts">
    import { parsePlainText } from '$lib/articleParser';
  import { wikiKind } from '$lib/consts';
  import { ndk } from '$lib/ndk';
  import type { TabType } from '$lib/types';
  import type { NDKEvent } from '@nostr-dev-kit/ndk';
  import { onMount } from 'svelte';

  let results: NDKEvent[] = [];
  export let createChild: (type: TabType, data: string) => void;

  async function search() {
    results = [];
    const filter = { kinds: [wikiKind], limit: 24 };
    const events = await $ndk.fetchEvents(filter);
    if (!events) {
      results = [];
      return;
    }
    results = Array.from(events);
  }

  onMount(async () => {
    await search();
  });
</script>

<div class="font-sans mx-auto p-6 lg:max-w-4xl lg:pt-6 lg:pb-28">
  <div class="prose">
    <h1 class="mt-0">Recent Articles</h1>
  </div>
  {#each results as result}
    <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
    <div
      on:click={() => createChild('article', result.id)}
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
          {result.content.length <= 192 ? parsePlainText(result.content.slice(0, 189)) : parsePlainText(result.content.slice(0, 189)) + '...'}
        {/if}
      </p>
    </div>
  {/each}
</div>
