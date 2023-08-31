<script lang="ts">
  import { ndk } from "$lib/ndk";
  import { afterUpdate, onMount } from "svelte";
  import type { NDKEvent } from "@nostr-dev-kit/ndk";
  import { formatDate } from "$lib/utils";
  import { parse } from "$lib/articleParser.js";

  export let eventid: string;
  export let tabid: number;
  export let createChild: (type: string, data: string) => void;
  let event: NDKEvent | null = null;

  function addClickListenerToWikilinks() {
    const elements = document.querySelectorAll('[id^="wikilink-v0-"]');

    elements.forEach((element) => {
      element.addEventListener("click", () => {
        //alert(`Clicked element with ID: ${element.id}`);
        let a = element.id.slice(12);
        createChild("articlefind", a);
      });
    });
  }

  onMount(async () => {
    event = await ndk.fetchEvent(eventid);
  });

  afterUpdate(() => {
    addClickListenerToWikilinks();
  });
</script>

<div>
  <article class="prose font-sans mx-auto p-6 lg:max-w-4xl lg:pt-6 lg:pb-28">
    {#if event !== null}
      <h1 class="mb-0">
        {#if event?.tags.find((e) => e[0] == "title")}
          {event.tags.find((e) => e[0] == "title")?.[1]}
        {:else}
          {event.tags.find((e) => e[0] == "d")?.[1]}
        {/if}
      </h1>
      <span>
        {#await event.author?.fetchProfile()}
          by <span>loading...</span>
        {:then profile}
          by <a href={`nostr://${event.author.npub}`}
            >{profile !== null &&
              JSON.parse(Array.from(profile)[0]?.content)?.name}</a
          >,
        {:catch error}
          error while loading user
        {/await}
        {#if event?.tags.find((e) => e[0] == "published_at") && !isNaN(Number(event.tags.find((e) => e[0] == "published_at")?.[1]))}
          updated on {formatDate(
            Number(event.tags.find((e) => e[0] == "published_at")?.[1])
          )}
        {/if}
        <br />
        <div class="inline">
          <a href={`/fork/${event.id}`}>Fork</a>
          <span> - </span>
          <a>Share</a>
        </div>
      </span>

      {@html parse(event?.content)}
    {/if}
  </article>
</div>
