<script lang="ts">
  import { browser } from '$app/environment';
  import { standardRelays } from '$lib/consts';
  import { ndk } from '$lib/ndk';
  import { tabBehaviour, userPublickey } from '$lib/state';
  import { NDKNip07Signer } from '@nostr-dev-kit/ndk';
  import { onMount } from 'svelte';

  let username = '...';
  let relays: string[] = [];
  let newTabBehaviour = $tabBehaviour;
  let newRelay = '';

  function removeRelay(index: number) {
    relays.splice(index, 1);
    relays = [...relays];
  }

  async function login() {
    if (browser) {
      if (!$ndk.signer) {
        const signer = new NDKNip07Signer();
        $ndk.signer = signer;
        ndk.set($ndk);
      }
      if ($ndk.signer && $userPublickey == '') {
        const newUserPublicKey = (await $ndk.signer.user()).hexpubkey();
        localStorage.setItem('wikinostr_loggedInPublicKey', newUserPublicKey);
        $userPublickey = newUserPublicKey;
        userPublickey.set($userPublickey);
      }
    }
  }

  function logout() {
    localStorage.removeItem('wikinostr_loggedInPublicKey');
    userPublickey.set('');
  }

  function addRelay() {
    if (newRelay) {
      relays.push(newRelay);
      newRelay = '';
      relays = [...relays];
    }
  }

  function saveData() {
    addRelay();
    localStorage.setItem('wikinostr_tabBehaviour', newTabBehaviour);
    localStorage.setItem('wikinostr_relays', JSON.stringify(relays));
    setTimeout(() => {
      window.location.href = '';
    }, 1);
  }

  if (browser) {
    relays = JSON.parse(localStorage.getItem('wikinostr_relays') || JSON.stringify(standardRelays));
  }

  onMount(async () => {
    // get user
    const user = await $ndk.getUser({ hexpubkey: $userPublickey });
    const profile = await user.fetchProfile();
    if (profile) {
      username = JSON.parse(Array.from(profile)[0].content).name;
    }
  });
</script>

<article class="font-sans mx-auto p-2 lg:max-w-4xl">
  <div class="prose">
    <h1 class="mt-0">Settings</h1>
  </div>

  <!-- Login Options -->
  <div class="my-6">
    <p class="text-sm">Account</p>
    {#if $userPublickey == ''}
      <p>You are not logged in!</p>
      <button
        on:click={login}
        type="button"
        class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >Login with NIP07
      </button>
    {:else}
      <p>You are logged in as <a href={`nostr://${$userPublickey}`}>{username}</a></p>
      <button
        on:click={logout}
        type="button"
        class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >Logout
      </button>
    {/if}
  </div>

  <!-- Relay Selection -->
  <div class="mb-6">
    <p class="text-sm">Relays</p>
    {#each relays as relay, index}
      <div>
        <button class="text-red-500" on:click={() => removeRelay(index)}> - </button>
        {relay}
      </div>
    {/each}
    <div>
      <button on:click={addRelay} class="text-green-500"> + </button>
      <input
        bind:value={newRelay}
        type="text"
        class="inline shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
        placeholder="wss://relay.example.com"
      />
    </div>
  </div>

  <!-- More options -->
  <div class="mb-6">
    <p class="text-sm">Tab Behaviour</p>
    <select bind:value={newTabBehaviour}>
      <option value="replace">Replace Self Everywhere</option>
      <option value="normal">Normal</option>
      <option value="child">Create Child Everywhere</option>
    </select>
  </div>

  <!-- Save button -->
  <button
    on:click={saveData}
    type="button"
    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  >
    Save & Reload
  </button>
</article>
