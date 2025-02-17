// src/stores/calendarStore.js
import { writable } from 'svelte/store';

 const events = writable([
    { title: 'New Event', start: new Date() }
]);

 function addEvent(event) {
    events.update((currentEvents) => [...currentEvents, event]);
}

export  {events ,addEvent }