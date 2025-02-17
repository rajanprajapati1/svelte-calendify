<script>
  import { Plus, Calendar1 ,RefreshCcw } from "lucide-svelte";

  export let onToggleWeekends = () => {};
  export let goToPast = () => {};
  export let onToday = () => {};
  export let onRefresh = () =>{};
  export let onAddEvent = () =>{};
  export let title = "Calendify";
  import { page } from "$app/stores";
  import Dropdown from "./UserDropDown.svelte";
  import { signIn } from "@auth/sveltekit/client";
  let ShowDropdown = false;

  function ToggleUser() {
    ShowDropdown = !ShowDropdown;
  }
  let isRotating = false;

  async function CallRefresh (){
  isRotating = !isRotating;
   onRefresh()
  setTimeout(() => {
    isRotating = false;
  }, 1000);
  }
</script>

<div
  class="flex items-center relative justify-between border-gray-100 border-2 px-4 mb-4 py-4"
>
  <div class="flex items-center space-x-3">
    <div class="text-2xl font-semibold text-black flex items-center gap-2">
      <Calendar1 class="w-6 h-6 bg-green-300" />
      {title}
    </div>
  </div>
  <div class="flex items-center space-x-3">
    <button
    on:click={CallRefresh}
    class:rotate-0={isRotating} 
    class:rotate-180={isRotating} 
    class:transition-transform={isRotating}
    class:duration-1000={isRotating}
    class="text-sm text-black font-medium border hover:bg-gray-50 py-2 px-2 rounded-full 
             transition-transform duration-1000"
  > 
    <RefreshCcw class="w-6 h-6" />
  </button>
  
    <button
      class="text-sm text-black font-medium border hover:bg-gray-50 py-2 px-2 rounded"
      on:click={onToday}
    >
      Today
    </button>
    <button
      class="text-sm text-black font-medium border hover:bg-gray-50 py-2 px-2 rounded"
      on:click={onToggleWeekends}
    >
      Toggle Weekends
    </button>
    <button
      class="text-sm text-black font-medium border hover:bg-gray-50 py-2 px-2 rounded"
      on:click={goToPast}
    >
      Go To Past
    </button>

    <button
    on:click={()=>onAddEvent({} , true)}
      class="text-sm text-black font-medium border hover:bg-gray-50 py-2 px-2 rounded flex items-center justify-center"
    >
      <Plus class="w-5 h-5" />
    </button>
    <button
      on:click={ToggleUser}
      class="text-sm text-black font-medium border hover:bg-gray-50 rounded-full flex items-center justify-center w-10 h-10 overflow-hidden"
    >
      <abbr
        class="bg-gray-200 rounded text-gray-600"
        title={$page?.data?.session?.user?.profile}
      >
        <img
          src={$page?.data?.session?.user?.image}
          alt={$page?.data?.session?.user?.name?.slice(0,1)}
          class="w-full h-full object-contain"
        />
      </abbr>
      {#if ShowDropdown}
        <Dropdown user={$page?.data?.session?.user?.profile} />
      {/if}
    </button>
  </div>
</div>


<style>
  .rotate-0 {
    transform: rotate(0deg);
  }

  .rotate-180 {
    transform: rotate(180deg);
  }

  </style>