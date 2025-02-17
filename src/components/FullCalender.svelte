<script>
	import FullCalendar, { Draggable } from "svelte-fullcalendar";
	import daygridPlugin from "@fullcalendar/daygrid";
	import timegridPlugin from "@fullcalendar/timegrid";
	import interactionPlugin from "@fullcalendar/interaction";
	import listPlugin from '@fullcalendar/list';

	import Navbar from "./Navbar.svelte";
	import PromptBox from "./PromptBox.svelte";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import {getEventColor,renderEventContent} from '../utils/EventBeautify.js'
	import {Sparkles} from 'lucide-svelte';

	let events = [];
	let StartChat = false;
	let options = {
	  dateClick: handleDateClick,
	  droppable: true,
	  editable: true,
	  events: [],
	  initialView: "dayGridMonth",
	  plugins: [daygridPlugin, timegridPlugin, interactionPlugin,listPlugin],
	  headerToolbar: {
		left: "title",
		right: "dayGridMonth,timeGridWeek,timeGridDay,listDay,listWeek,listMonth, prev,next",
	  },
	  timeZone: 'UTC',
	  views: {
      listDay: { buttonText: 'list day' },
      listWeek: { buttonText: 'list week' },
      listMonth: { buttonText: 'list month' }
    },
	  height: "100%",
	  weekends: true,
	  eventDrop: handleEventDrop,
	  eventResize: handleEventResize,
	  eventClick: handleEventClick,
	  eventContent: renderEventContent,
	  eventTimeFormat: { 
  hour: 'numeric',
  minute: '2-digit',
  meridiem: 'short'
  }
	};
	
	let calendarComponentRef;
	let isAuthenticated = $page?.data?.session?.user;
	let showModal = false;
	let newEvent = { title: "", start: "", end: "" };
	let editingEvent = null;
  
	function toggleWeekends() {
	  options = { ...options, weekends: !options.weekends };
	}
  
	function gotoPast() {
	  let calendarApi = calendarComponentRef.getAPI();
	  calendarApi.gotoDate("2000-01-01");
	}
	
	const ToggleChat = ()=>{
	 StartChat = !StartChat ;
	}
  
	function handleDateClick(arg) {
	  newEvent = { title: "", start: arg.dateStr, end: arg.dateStr };
	  showModal = true;
	  editingEvent = null;
	}
  
	function onToday() {
	  let calendarApi = calendarComponentRef.getAPI();
	  calendarApi.today();
	}
  
	async function fetchEvents() {
	  try {
		const response = await fetch("/api/calendar");
		const { list: fetchedData } = await response.json();
		 const coloredEvents = fetchedData.map(event => ({
        ...event,
        backgroundColor: getEventColor(event),
        textColor: '#ffffff' ,
      }));
		options = { ...options, events: coloredEvents };
	  } catch (error) {
		console.error("Error fetching events:", error);
	  }
	}
  
	async function addOrUpdateEvent() {
		console.log("add or update")
	  if (newEvent.title && newEvent.start) {
		try {
		  const method = editingEvent ? 'PATCH' : 'POST';
		  const url = editingEvent ? `/api/calendar/update` : '/api/calendar';
		  
		  const response = await fetch(url, {
			method,
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify(newEvent),
		  });
  
		  if (!response.ok) {
			throw new Error('Failed to add/update event');
		  }
  
		  await fetchEvents();
		  showModal = false;
		  newEvent = { title: "", start: "", end: "" };
		  editingEvent = null;
		} catch (error) {
		  console.error('Error adding/updating event:', error);
		}
	  }
	}
	
  
	async function deleteEvent() {
	  if (editingEvent) {
		try {
		  const response = await fetch(`/api/calendar/delete`, {
			method: 'DELETE',
			body: JSON.stringify({ id: editingEvent?.id }),
		  });
  
		  if (!response.ok) {
			throw new Error('Failed to delete event');
		  }
  
		  await fetchEvents();
		  showModal = false;
		  editingEvent = null;
		} catch (error) {
		  console.error('Error deleting event:', error);
		}
	  }
	}
  
	function handleEventDrop(info) {
	  updateEventDates(info.event,info?.event?._instance?.range);
	}
  
	function handleEventResize(info) {
	  updateEventDates(info.event);
	}
  
	function handleEventClick(info,add) {
		if(add){
			showModal = true;
		}else{
			editingEvent = {
				id: info?.event?._def?.publicId || "",
				title: info.event.title || "",
				start: info.event.startStr || "",
				end: info.event.endStr || info.event.startStr || "",
			};
			newEvent = { ...editingEvent };
			showModal = true;
		}
	}
    async function updateEventDates(event,date) {
    try {
		console.log( event?._def ," event?.publicId")
      const response = await fetch(`/api/calendar/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
		body: JSON.stringify({
    id: event?._def?.publicId,
    title: event?.title,
    start: date?.start ? new Date(date.start).toISOString() : null,
    end: date?.end ? new Date(date.end).toISOString() : null,
})
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }
  console.log(await response.json(),"response")
      await fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  }

  const RefreshEvents =()=>{
	fetchEvents();
  }
  
	  fetchEvents();
  </script>
  
  <div class="svelte-app">
	<Navbar onAddEvent={handleEventClick} onRefresh={RefreshEvents} onToggleWeekends={toggleWeekends} goToPast={gotoPast} {onToday} />
	{#if StartChat}
	<PromptBox fetchevents={fetchEvents} onToggle={ToggleChat}/>
	{/if}
	<div class="svelte-app-calendar w-full h-full">
	  <FullCalendar bind:this={calendarComponentRef} {options} />
	</div>
  </div>
  <div on:click={ToggleChat} class="magic-btn fixed bottom-4 right-4 bg-green-500 p-5 rounded-full flex items-center justify-center transition-all ease-in-out duration-1000 active:animate-ping z-40">
	<button><Sparkles /></button>
  </div>
  
  {#if showModal}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
	  <div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
		<h2 class="text-xl font-bold mb-4">{editingEvent ? 'Edit Event' : 'Add Event'}</h2>
		<label class="block text-sm font-medium mb-1">Event Name:</label>
		<input
		  type="text"
		  bind:value={newEvent.title}
		  placeholder="Enter event name"
		  class="w-full p-2 border rounded-md mb-3 focus:ring focus:ring-green-300"
		/>
		<label class="block text-sm font-medium mb-1">Start Date:</label>
		<input
		  type="datetime-local"
		  bind:value={newEvent.start}
		  class="w-full p-2 border rounded-md mb-3 focus:ring focus:ring-green-300"
		/>
		<label class="block text-sm font-medium mb-1">End Date:</label>
		<input
		  type="datetime-local"
		  bind:value={newEvent.end}
		  class="w-full p-2 border rounded-md mb-4 focus:ring focus:ring-green-300"
		/>
		<div class="flex justify-end space-x-2">
		  <button
			on:click={addOrUpdateEvent}
			class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
		  >
			{editingEvent ? 'Update Event' : 'Add Event'}
		  </button>
		  {#if editingEvent}
			<button
			  on:click={deleteEvent}
			  class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
			>
			  Delete Event
			</button>
		  {/if}
		  <button
			on:click={() => (showModal = false)}
			class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
		  >
			Cancel
		  </button>
		</div>
	  </div>
	</div>
  {/if}

  
<style>
  :global(* > *) {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  .svelte-app {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 14px;
  }

  .svelte-app-calendar {
    width: 100%;
    padding: 0.4rem;
  }
  :global(.draggable) {
    color: white;
    background: green;
    width: fit-content;
    cursor: pointer;
  }

  .fc-day-today {
    background-color: green !important;
  }
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
</style>
