<script lang="ts">
  import { ndk } from '$lib/ndk';
  import { wikiKind } from '$lib/consts';
  import { NDKEvent } from '@nostr-dev-kit/ndk';
  import { onMount } from 'svelte';
  import type { Tab } from '$lib/types';
  import { userPublickey } from '$lib/state';

  export let replaceSelf: (tab: Tab) => void;
  export let data: any;
  data.title = '';
  data.summary = '';
  data.content = '';
  let forkev: NDKEvent | null;

  let success = 0;
  let error: string = '';

  onMount(async () => {
    if (data.forkId) {
      forkev = await $ndk.fetchEvent(data.forkId);
      data.title =
        forkev?.tags.find((e) => e[0] == 'title')?.[0] &&
        forkev?.tags.find((e) => e[0] == 'title')?.[1]
          ? forkev.tags.find((e) => e[0] == 'title')?.[1]
          : forkev?.tags.find((e) => e[0] == 'd')?.[1];
      data.summary =
        forkev?.tags.find((e) => e[0] == 'summary')?.[0] &&
        forkev?.tags.find((e) => e[0] == 'summary')?.[1]
          ? forkev?.tags.find((e) => e[0] == 'summary')?.[1]
          : undefined;
      data.content = forkev?.content;
    }
  });

  async function publish() {
    if (data.title && data.content) {
      try {
        let event = new NDKEvent($ndk);
        event.kind = wikiKind;
        event.content = data.content;
        event.tags.push(['d', data.title.toLowerCase().replaceAll(' ', '-')]);
        event.tags.push(['title', data.title]);
        if (data.summary) {
          event.tags.push(['summary', data.summary]);
        }
        let relays = await event.publish();
        relays.forEach((relay) => {
          relay.once('published', () => {
            console.log('published to', relay);
          });
          relay.once('publish:failed', (relay, err) => {
            console.log('publish failed to', relay, err);
          });
        });
        success = 1;
      } catch (err) {
        console.log('failed to publish event', err);
        error = String(err);
        success = -1;
      }
    }
  }
</script>

<div class="prose font-sans mx-auto p-2 lg:max-w-4xl">
  <div class="prose">
    <h1>
      {#if data.forkId && $userPublickey == forkev?.author?.hexpubkey()}Editing{:else if data.forkId}Forking{:else}Creating{/if}
      an article
    </h1>
  </div>
  <div class="mt-2">
    <label class="flex items-center"
      >Title
      <input
        placeholder="example: Greek alphabet"
        bind:value={data.title}
        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ml-2"
      /></label
    >
  </div>
  <div class="mt-2">
    <label
      >Article
      <textarea
        placeholder="The **Greek alphabet** has been used to write the [[Greek language]] sincie the late 9th or early 8th century BC. The Greek alphabet is the ancestor of the [[Latin]] and [[Cyrillic]] scripts."
        bind:value={data.content}
        rows="9"
        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
      /></label
    >
  </div>
  <div class="mt-2">
    <details>
      <summary> Add an explicit summary? </summary>
      <label
        >Summary
        <textarea
          bind:value={data.summary}
          rows="3"
          placeholder="The Greek alphabet is the earliest known alphabetic script to have distict letters for vowels. The Greek alphabet existed in many local variants."
          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        /></label
      >
    </details>
  </div>

  <!-- Submit -->
  {#if success !== 1}
    <div class="mt-2">
      <button
        on:click={publish}
        class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >Submit</button
      >
    </div>
  {/if}

  <div>
    {#if success == -1}
      <p>Something went wrong :( note that only NIP07 is supported for signing</p>
      <p>
        Error Message: {error}
      </p>
    {:else if success == 1}
      <p>Success!</p>
    {/if}
  </div>
</div>
