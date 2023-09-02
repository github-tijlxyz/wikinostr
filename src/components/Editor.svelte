<script lang="ts">
  import { ndk } from '$lib/ndk';
  import { wikiKind } from '$lib/consts';
  import { NDKEvent } from '@nostr-dev-kit/ndk';

  export let startTitle: undefined | string;
  export let startSummary: undefined | string;
  export let startContent: undefined | string;
  export let startD: undefined | string;

  let articleTitle: string = '';
  let articleSummary: string = '';
  let articleContent: string = '';

  let success = 0;
  let error: string = '';

  if (startD) {
    articleTitle = startD;
  }
  if (startTitle) {
    articleTitle = startTitle;
  }
  if (startSummary) {
    articleSummary = startSummary;
  }
  if (startContent) {
    articleContent = startContent;
  }

  async function publish() {
    try {
      let event = new NDKEvent($ndk);
      event.kind = wikiKind;
      event.content = articleContent;
      event.tags.push(['d', articleTitle.toLowerCase().replaceAll(' ', '-')]);
      event.tags.push(['title', articleTitle]);
      event.tags.push(['summary', articleSummary]);
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
      console.log('failed to publish event', error);
      error = String(err);
      success = -1;
    }
  }
</script>

<div class="mx-4 mt-4 w-5/6 mx-auto">
  <h2 class="mt-2">Creating an article</h2>

  <div class="mt-2">
    <label class="flex items-center"
      >Title
      <input
        placeholder="example: Greek alphabet"
        bind:value={articleTitle}
        class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ml-2"
      /></label
    >
  </div>
  <div class="mt-2">
    <label
      >Article
      <textarea
        placeholder="The **Greek alphabet** has been used to write the [[Greek language]] sincie the late 9th or early 8th century BC. The Greek alphabet is the ancestor of the [[Latin]] and [[Cyrillic]] scripts."
        bind:value={articleContent}
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
          bind:value={articleSummary}
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
      <p>Something went wrong:(</p>
      <p>
        Error Message: {error}
      </p>
    {:else if success == 1}
      <p>Success</p>
    {/if}
  </div>
</div>
