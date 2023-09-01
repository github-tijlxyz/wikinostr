<script lang="ts">
  import { ndk } from "$lib/ndk.js";
  import { onMount } from "svelte";
  import Editor from "../../../components/Editor.svelte";

  export let data;
  let startName: undefined | string = undefined;
  let startTitle: undefined | string = undefined;
  let startSummary: undefined | string = undefined;
  let startContent: undefined | string = undefined;

  onMount(async () => {
    const event = await ndk.fetchEvent(data.slug);
    if (event?.tags.find((e) => e[0] == "d")) startName = event?.tags.find((e) => e[0] == "d")?.[1];
    if (event?.tags.find((e) => e[0] == "title")) startTitle = event?.tags.find((e) => e[0] == "title")?.[1];
    if (event?.tags.find((e) => e[0] == "summary")) startSummary = event?.tags.find((e) => e[0] == "summary")?.[1];
    if (event?.content === undefined) startContent = undefined; else startContent = event?.content;
  });
</script>

{#if startContent}
  <Editor {startName} {startTitle} {startContent} {startSummary} />
{/if}
