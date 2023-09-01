<script lang="ts">
  import { page } from "$app/stores";
  import Editor from "../../components/Editor.svelte";

  let startName = $page.url.searchParams.get("n") || undefined;
  console.log(startName);
</script>

<Editor startSummary={undefined} startTitle={undefined} startContent={undefined} startName={startName} />
