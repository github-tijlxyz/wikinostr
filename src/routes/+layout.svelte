<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { ndk } from '$lib/ndk';
  import { NDKNip07Signer } from '@nostr-dev-kit/ndk';

  import '../app.postcss';

  onMount(() => {
    if (browser) {
      const signer = new NDKNip07Signer();
      $ndk.signer = signer;
      ndk.set($ndk);
    }
  });
</script>

<svelte:head>
  <title>WikiNostr</title>
</svelte:head>

<slot />
