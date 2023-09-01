<script lang="ts">
  import { page } from "$app/stores";
  import Editor from "../../components/Editor.svelte";

  let startD = $page.url.searchParams.get("n") || undefined;
</script>

<Editor
  startSummary={undefined}
  startTitle={undefined}
  startContent={undefined}
  {startD}
/>
