<script lang="ts">
    import { onMount } from 'svelte';

    let relays: string[] = [];
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

    function saveRelays () {
        
    }
</script>

<h1>This component is WIP</h1> <!-- TODO, make a user change relays ( and also TODO display "found on" relays for articles )-->
<div class="p-6">

    <!-- Relay Selection -->
    <div class="mb-6">
        {#each relays as relay, index}
        <div>
            <button class="text-red-500" on:click={() => removeRelay(index)}> - </button> {relay}
        </div>
        {/each}
        <div>
            <button on:click={addRelay} class="text-green-500"> + </button> <input bind:value={newRelay} type="text">
        </div>
    </div>

    <!-- Save button -->
    <button on:click={saveRelays} type="button" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Save & Reload
    </button>


</div>
