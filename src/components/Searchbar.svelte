<script lang="ts">
  import { tabs } from "$lib/state";
  import { generateRandomNumber, scrollTabIntoView } from "$lib/utils";
  import type { Tab } from "$lib/types";

  let query = "";

  function search() {
    if (query) {
      let newTabs = $tabs;
      const newTab: Tab = {
        id: generateRandomNumber(),
        type: "articlefind",
        data: query.toLowerCase().replaceAll(" ", "-"),
      };
      newTabs.push(newTab);
      tabs.set(newTabs);
      scrollTabIntoView(String(newTab.id));
    }
  }
</script>

<form on:submit|preventDefault={search} class="mt- flex rounded-md shadow-sm">
  <div class="relative flex items-stretch flex-grow focus-within:z-10">
    <input
      bind:value={query}
      class="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
      placeholder="article name"
    />
  </div>
  <button
    type="submit"
    class="-ml-px relative inline-flex items-center space-x-2 px-3 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
  >
    <svg
      class="h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  </button>
</form>
