<script lang="ts">
  import { ndk } from "$lib/ndk.js";
  import { onMount } from "svelte";
  import Editor from "../../../components/Editor.svelte";
  import BackButton from "../../../components/BackButton.svelte";

  export let data;
  let startD: undefined | string = undefined;
  let startTitle: undefined | string = undefined;
  let startSummary: undefined | string = undefined;
  let startContent: undefined | string = undefined;

  onMount(async () => {
    const event = await $ndk.fetchEvent(data.slug);
    if (event?.tags.find((e) => e[0] == "d"))
      startD = event?.tags.find((e) => e[0] == "d")?.[1];
    if (event?.tags.find((e) => e[0] == "title"))
      startTitle = event?.tags.find((e) => e[0] == "title")?.[1];
    if (event?.tags.find((e) => e[0] == "summary"))
      startSummary = event?.tags.find((e) => e[0] == "summary")?.[1];
    if (event?.content === undefined) startContent = undefined;
    else startContent = event?.content;
  });
</script>

<BackButton />

{#if startContent}
  <Editor {startD} {startTitle} {startContent} {startSummary} />
{/if}
