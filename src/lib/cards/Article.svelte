<script lang="ts">
  import { ndk } from '$lib/ndk';
  import { afterUpdate, onMount } from 'svelte';
  import type { NDKEvent } from '@nostr-dev-kit/ndk';
  import { formatDate, next } from '$lib/utils';
  import { parse } from '$lib/articleParser.js';
  import type { Tab } from '$lib/types';
  import { page } from '$app/stores';
  import { tabBehaviour, userPublickey } from '$lib/state';

  export let eventid: string;
  export let createChild: (tab: Tab) => void;
  export let replaceSelf: (tab: Tab) => void;
  let event: NDKEvent | null = null;
  let copied = false;

  function addClickListenerToWikilinks() {
    const elements = document.querySelectorAll('[id^="wikilink-v0-"]');

    elements.forEach((element) => {
      element.addEventListener('click', () => {
        let a = element.id.slice(12);
        if ($tabBehaviour == 'replace') {
          replaceSelf({ id: next(), type: 'find', data: a });
        } else {
          createChild({ id: next(), type: 'find', data: a });
        }
      });
    });
  }

  function shareCopy() {
    navigator.clipboard.writeText(`https://${$page.url.hostname}/article/${eventid}`);
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2500);
  }

  onMount(async () => {
    event = await $ndk.fetchEvent(eventid);
  });

  afterUpdate(() => {
    addClickListenerToWikilinks();
  });
</script>

<div>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-missing-attribute -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <article class="prose font-sans mx-auto p-2 lg:max-w-4xl">
    {#if event !== null}
      <h1 class="mb-0">
        {#if event?.tags.find((e) => e[0] == 'title')?.[0] && event?.tags.find((e) => e[0] == 'title')?.[1]}
          {event.tags.find((e) => e[0] == 'title')?.[1]}
        {:else}
          {event.tags.find((e) => e[0] == 'd')?.[1]}
        {/if}
      </h1>
      <span>
        {#await event.author?.fetchProfile()}
          by <a
            class="cursor-pointer"
            on:click={() => {
              $tabBehaviour == 'replace'
                ? replaceSelf({ type: 'user', id: next(), data: event?.author.hexpubkey() })
                : createChild({ type: 'user', id: next(), data: event?.author.hexpubkey() });
            }}>...</a
          >,
        {:then profile}
          by <a
            class="cursor-pointer"
            on:click={() => {
              $tabBehaviour == 'replace'
                ? replaceSelf({ type: 'user', id: next(), data: event?.author.hexpubkey() })
                : createChild({ type: 'user', id: next(), data: event?.author.hexpubkey() });
            }}>{profile !== null && JSON.parse(Array.from(profile)[0]?.content)?.name}</a
          >,
        {/await}
        {#if event.created_at}
          updated on {formatDate(event.created_at)}
        {/if}
        &nbsp;• &nbsp;<a
          class="cursor-pointer"
          on:click={() => {
            $tabBehaviour == 'child'
              ? createChild({ id: next(), type: 'editor', data: { forkId: event?.id } })
              : replaceSelf({ id: next(), type: 'editor', data: { forkId: event?.id } });
          }}
          >{#if $userPublickey == event.author.hexpubkey()}Edit{:else}Fork{/if}</a
        >
        &nbsp;• &nbsp;<a class="cursor-pointer" on:click={shareCopy}
          >{#if copied}Copied!{:else}Share{/if}</a
        >&nbsp;&nbsp;• &nbsp;<a
          class="cursor-pointer"
          on:click={() => {
            $tabBehaviour == 'child'
              ? createChild({
                  id: next(),
                  type: 'find',
                  data: event?.tags.find((e) => e[0] == 'd')?.[1]
                })
              : replaceSelf({
                  id: next(),
                  type: 'find',
                  data: event?.tags.find((e) => e[0] == 'd')?.[1]
                });
          }}>Versions</a
        >
      </span>

      <!-- Content -->
      {@html parse(event?.content)}
    {/if}
  </article>
</div>
