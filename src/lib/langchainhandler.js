import { json } from "@sveltejs/kit";
import { google } from "googleapis";
import { addEvent, deleteEvent, getEvents, updateEvent } from "./googleapis.js";
import { ActionFetcher } from "./ActionFetcher.js";

 async function handleCalendarAction(event) {
  const session = await event.locals.getSession();
  if (!session || !session.user) {
    return json({ error: "Not authenticated" }, { status: 401 });
  }

  const accessToken = session?.access_token;
  if (!accessToken) {
    return json({ error: "No access token" }, { status: 403 });
  }

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });


  const { command } = await event.request.json();
  const actiondd = await ActionFetcher(command);
  const results = await actiondd?.choices[0]?.message?.content?.trim(); 
  let parse = {};

  try {
    if (results) {
      parse = JSON.parse(results);
    }
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
  const ACTION = parse?.action;
  try {
    switch (ACTION) {
      case "add":
          const status = await addEvent(calendar,parse);
        return json({ msg: status ,code : "1",fetch  :true})
      case "update":
        return json({ msg: results ,code : "2"})
      // await updateEvent(calendar, actionData.eventId, actionData.eventData);
      case "delete":
        return json({ msg: results ,code : "3"})
      // await deleteEvent(calendar, actionData.eventId);
      case "fetch":
        const list =  await getEvents(calendar,  "upcoming");
        return json({ msg: list ,code : "4"})

      default:
        return json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing command:", error);
    return json({ error: "Failed to process command", details: error.message }, { status: 500 });
  }
}



export { handleCalendarAction };