<script lang="ts">
  import { page } from "$app/stores";
  import Editor from "../../components/Editor.svelte";
  import BackButton from "../../components/BackButton.svelte";

  let startD = $page.url.searchParams.get("n") || undefined;
</script>

<BackButton />

<Editor
  startSummary={undefined}
  startTitle={undefined}
  startContent={undefined}
  {startD}
/>
