<script lang="ts">
  import { browser } from '$app/environment';
  import { standardRelays } from '$lib/consts';
    import { onMount } from 'svelte';

    let relays: string[] = [];
    let useNip07Signing: boolean = false;
    let newRelay = "";

    function removeRelay (index: number) {
        relays.splice(index, 1);
        relays = [...relays];
    }

    function addRelay () {
        if (newRelay) {
            relays.push(newRelay);
            newRelay = "";
            relays = [...relays];
        }
    }

    function saveData () {
        addRelay();
        localStorage.setItem("wikinostr_relays", JSON.stringify(relays));
        localStorage.setItem("wikinostr_usenip07", JSON.stringify(useNip07Signing));
        setTimeout(() => {
            window.location.href = "";
        }, 1)
    }

    if (browser) {
        relays = JSON.parse(localStorage.getItem("wikinostr_relays") || JSON.stringify(standardRelays));
        useNip07Signing = JSON.parse(localStorage.getItem("wikinostr_usenip07") || 'false');
    }
</script>

<!-- This component is WIP -->
<div class="p-6">

    <!-- Use NIP07 Login -->
    <div class="mb-6">
        <p class="text-sm">Use NIP07 signing</p>
        <input bind:checked={useNip07Signing} type="checkbox" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
    </div>

    <!-- Relay Selection -->
    <div class="mb-6">
        <p class="text-sm">Relays</p>
        {#each relays as relay, index}
        <div>
            <button class="text-red-500" on:click={() => removeRelay(index)}> - </button> {relay}
        </div>
        {/each}
        <div>
            <button on:click={addRelay} class="text-green-500"> + </button> <input bind:value={newRelay} type="text" class="inline shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md" placeholder="wss://relay.example.com">
        </div>
    </div>

    <!-- Save button -->
    <button on:click={saveData} type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Save & Reload
    </button>


</div>
