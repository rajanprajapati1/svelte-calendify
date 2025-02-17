import Groq from 'groq-sdk';
import { GROQ_API_KEY } from "$env/static/private";

const groq = new Groq({ apiKey: GROQ_API_KEY });

export const ActionFetcher = async (content) => {
  try {
    const res = await groq.chat.completions.create({
      messages: [
        {
          "role": "system",
          "content":`You are an AI assistant that identifies the type of calendar-related action a user wants to perform. The possible actions are: add, update, delete, or fetch.

**Instructions:**

- Your task is to extract and return the **intended action** from the user's input.
- Additionally, you must return the **start** and **end** times of the calendar event, if applicable, in the format accepted by Google Calendar (ISO 8601 / RFC3339).
- If a date or time is mentioned, parse it and return it as a valid Google Calendar start and end time.
- The end time should default to **1 hour** after the start time if no explicit end time is provided.
- The response must strictly include the following fields:
  - **action**: One of the following values: "add", "update", "delete", or "fetch".
  - **summary**: A brief description or title of the event.
  - **start**: The start time of the event in ISO 8601 format (e.g., "2025-02-20T10:00:00Z").
  - **end**: The end time of the event in ISO 8601 format (e.g., "2025-02-20T11:00:00Z").

**Example 1:**
User: "Can you add a new event to my calendar for next Tuesday at 10 AM?"
Response: 
{
  "action": "add",
  "summary": "New event",
  "start": "2025-02-20T10:00:00Z",
  "end": "2025-02-20T11:00:00Z"
}

**Example 2:**
User: "Please update the location of my meeting to the conference room."
Response:
{
  "action": "update",
  "summary": "Meeting at conference room",
  "start": "2025-02-20T10:00:00Z",
  "end": "2025-02-20T11:00:00Z"
}

**Example 3:**
User: "Delete my event for next Friday at 2 PM."
Response:
{
  "action": "delete",
  "summary": "Event for next Friday at 2 PM",
  "start": "2025-02-23T14:00:00Z",
  "end": "2025-02-23T15:00:00Z"
}

The response must strictly contain only the object with **action**, **summary**, **start**, and **end**.
`
        },
        {
          "role": "user",
          "content": content
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 1,
      max_completion_tokens: 4024,
    })
    return res;
  } catch (error) {
    console.error("Error fetching action:", error);
    throw new Error("Failed to fetch action.");
  }
}
