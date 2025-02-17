import { writable } from "svelte/store"

function createEventStore() {
  const { subscribe, set, update } = writable([
    {
      id: "1",
      title: "Team Meeting",
      start: new Date("2024-06-14T10:00:00"),
      end: new Date("2024-06-14T11:00:00"),
      color: "#818CF8",
    },
    {
      id: "2",
      title: "Project Review",
      start: new Date("2024-06-14T14:00:00"),
      end: new Date("2024-06-14T15:30:00"),
      color: "#F472B6",
    },
  ])

  return {
    subscribe,
    addEvent: (event) => update((events) => [...events, { ...event, id: crypto.randomUUID() }]),
    removeEvent: (id) => update((events) => events.filter((event) => event.id !== id)),
    updateEvent: (id, updatedEvent) =>
      update((events) => events.map((event) => (event.id === id ? { ...event, ...updatedEvent } : event))),
  }
}

export  const eventStore = createEventStore()

