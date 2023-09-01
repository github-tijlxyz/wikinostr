<script lang="ts">
  import { ndk } from "$lib/ndk";
  import { wikiKind } from "$lib/consts";
  import { NDKEvent } from "@nostr-dev-kit/ndk";

  export let startName: undefined | string;
  export let startTitle: undefined | string;
  export let startSummary: undefined | string;
  export let startContent: undefined | string;

  let articleName: string = "";
  let articleTitle: string = "";
  let articleSummary: string = "";
  let articleContent: string = "";

  let success = 0;
  let error: string = "";

  if (startName) {
    articleName = startName;
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
      let event = new NDKEvent(ndk);
      event.kind = wikiKind;
      event.content = articleContent;
      event.tags.push(["d", articleName]);
      event.tags.push(["title", articleTitle]);
      event.tags.push(["summary", articleSummary]);
      await event.publish();
      success = 1;
    } catch (err) {
      console.log("failed to publish event", error);
      error = String(err);
      success = -1;
    }
  }
</script>

<!-- This component is WIP -->
<div class="mx-4 mt-2">
  <div>
    <p class="text-sm">title/slug</p>
    <input
      placeholder="example: greek-alphabet"
      bind:value={articleName} class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
    />
  </div>
  <div>
    <p class="text-sm">Title</p>
    <input
      placeholder="example: Greek alphabet"
      bind:value={articleTitle} class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
    />
  </div>
  <div>
    <p class="text-sm">Summary</p>
    <textarea
      bind:value={articleSummary}
      rows="6"
      placeholder="example: The Greek alphabet is the earliest known alphabetic script to have distict letters for vowels. The Greek alphabet existed in many local variants." class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
    />
  </div>
  <div>
    <p class="text-sm">Article</p>
    <p class="text-sm">
      Write it in markdown, use [[these]] links to link to other articles
    </p>
    <textarea
      placeholder="example: The **Greek alphabet** has been used to write the [[Greek language]] sincie the late 9th or early 8th century BC. The Greek alphabet is the ancestor of the [[Latin]] and [[Cyrillic]] scripts."
      bind:value={articleContent}
      rows="12" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
    />
  </div>

  <!-- Submit -->
  {#if success !== 1}
    <div class="mt-2 flex flex-col">
      <button
      on:click={publish} class="inline-flex justify-end ml-auto items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
