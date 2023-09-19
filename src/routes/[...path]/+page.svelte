<script lang="ts">
  import { page } from '$app/stores';
  import { tabs } from '$lib/state';
  import { onMount } from 'svelte';
  import type { Tab } from '$lib/types';
  import { next } from '$lib/utils';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { NDKNip07Signer } from '@nostr-dev-kit/ndk';
  import { ndk } from '$lib/ndk';

  onMount(() => {
    // Load path
    const pathname = $page.url.pathname;
    const components = pathname.split('/').filter((component) => component !== '');
    let newTabs: Tab[] = [];
    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      if (component == 'welcome' || component == 'settings' || component == 'editor') {
        newTabs.push({
          id: next(),
          type: component
        });
      } else if (component == 'article' || component == 'find' || component == 'user') {
        if (components[i + 2] == 'fork') {
          newTabs.push({
            id: next(),
            type: 'editor',
            data: { forkId: components[i + 1] },
            previous: {
              id: next(),
              type: 'article',
              data: components[i + 1]
            }
          });
          i++;
        } else {
          newTabs.push({
            id: next(),
            type: component,
            data: components[i + 1]
          });
        }
        i++;
      }
    }
    if (newTabs.length > 0) {
      $tabs = newTabs;
      tabs.set($tabs);
    }

    // Save tabs in path
    tabs.subscribe((tabs) => {
      let path = '';
      tabs.forEach((tab) => {
        if (typeof tab.data == 'string') {
          path += `/${tab.type}/${tab.data}`;
        } else if (tab.data && tab.data.forkId) {
          path += `/article/${tab.data.forkId}/fork`;
        } else {
          path += `/${tab.type}`;
        }
      });
      path += '/';
      goto(path);
    });
  });
</script>
