<script >
  import { createEventDispatcher } from 'svelte';
  import { eventStore } from '../stores/eventStore.js';
  import { X } from 'lucide-svelte';

  export let selectedDate = null;

  const dispatch = createEventDispatcher();

  let title = '';
  let start = selectedDate ? selectedDate.toISOString().slice(0, 16) : '';
  let end = selectedDate ? new Date(selectedDate.getTime() + 3600000).toISOString().slice(0, 16) : '';
  let color = '#818CF8';
  let description = '';
  let allDay = false;

  function handleSubmit() {
    const event = {
      id: '',
      title,
      start: new Date(start),
      end: new Date(end),
      color,
      description,
      allDay
    };

    eventStore.addEvent(event);
    dispatch('close');
  }
</script>

<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
    <div class="flex items-center justify-between p-4 border-b">
      <h2 class="text-lg font-medium">Add Event</h2>
      <button
        on:click={() => dispatch('close')}
        class="text-gray-500 hover:text-gray-700"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <form on:submit|preventDefault={handleSubmit} class="p-4 space-y-4">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          bind:value={title}
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div class="flex items-center gap-2">
        <input
          type="checkbox"
          id="allDay"
          bind:checked={allDay}
          class="rounded text-blue-600 focus:ring-blue-500"
        />
        <label for="allDay" class="text-sm font-medium text-gray-700">
          All day
        </label>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="start" class="block text-sm font-medium text-gray-700">
            Start
          </label>
          <input
            type={allDay ? "date" : "datetime-local"}
            id="start"
            bind:value={start}
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label for="end" class="block text-sm font-medium text-gray-700">
            End
          </label>
          <input
            type={allDay ? "date" : "datetime-local"}
            id="end"
            bind:value={end}
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label for="color" class="block text-sm font-medium text-gray-700">
          Color
        </label>
        <div class="mt-1 flex gap-2">
          {#each ['#818CF8', '#F472B6', '#34D399', '#FBBF24', '#F87171'] as colorOption}
            <button
              type="button"
              class="w-8 h-8 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style="background-color: {colorOption}; border-color: {color === colorOption ? 'white' : colorOption}"
              class:ring-2={color === colorOption}
              on:click={() => color = colorOption}
            />
          {/each}
        </div>
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          bind:value={description}
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        ></textarea>
      </div>

      <div class="flex justify-end gap-2">
        <button
          type="button"
          on:click={() => dispatch('close')}
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Add Event
        </button>
      </div>
    </form>
  </div>
</div>