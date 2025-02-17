import { json } from "@sveltejs/kit";

async function addEvent(calendar, eventData) {
  console.log(eventData,"payload")
  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: {
        summary: eventData.summary || "Meeting",
        start: { dateTime: eventData.start },
        end: { dateTime: eventData.end },
      },
    });
    console.log(response,"added msg")
    const htmlResponse = `
    <div style="border: 2px solid #4CAF50; padding: 20px; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #4CAF50; font-family: Arial, sans-serif;">Event Added Successfully! 🎉</h2>
      <p style="font-size: 16px; font-family: Arial, sans-serif;">Your event has been successfully added to your calendar. 🎉</p>
      <ul style="list-style: none; padding-left: 0; font-family: Arial, sans-serif;">
        <li><strong>Event:</strong> ${eventData?.summary || "Meeting"}</li>
        <li><strong>Start Time:</strong> ${new Date(eventData?.start).toLocaleString()}</li>
        <li><strong>End Time:</strong> ${new Date(eventData?.end).toLocaleString()}</li>
      </ul>
      <p style="font-size: 14px; font-style: italic;">Looking forward to the event!</p>
    </div>
  `;
    return { message: "Event added successfully", fetch:true , data : response?.data , html  :true , events: htmlResponse }
  } catch (error) {
    return { error: "Failed to add event", details: error.message ,status: 500}
  }
}


// not working right now
async function updateEvent(calendar, eventId, eventData) {
  try {
    const response = await calendar.events.update({
      calendarId: "primary",
      eventId,
      resource: {
        summary: eventData.summary,
        start: { dateTime: eventData.start },
        end: { dateTime: eventData.end },
      },
    });
    return json({ message: "Event updated successfully", event: response.data });
  } catch (error) {
    return json({ error: "Failed to update event", details: error.message }, { status: 500 });
  }
}

// not working right now
async function deleteEvent(calendar, eventId) {
  try {
    await calendar.events.delete({ calendarId: "primary", eventId });
    return json({ message: "Event deleted successfully" });
  } catch (error) {
    return json({ error: "Failed to delete event", details: error.message }, { status: 500 });
  }
}


async function getEvents(calendar, timeRange) {
  try {
    const now = new Date();
    const timeMin = now.toISOString(); 
    const timeMax = timeRange?.timeMax || new Date(now.setMonth(now.getMonth() + 1)).toISOString(); // Optional: Set timeMax to 1 month later or any timeRange parameter

    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin, 
      timeMax,  
      timeZone: "Asia/Kolkata", 
      maxResults: 10,
      singleEvents: true, 
      orderBy: "startTime", 
    });
    const beautify = response?.data.items?.map((val,i)=>{
      return {summary:val?.summary ,desc:val?.description ,time:{start:val?.start?.dateTime,end:val?.end?.dateTime}}
    })
    const eventsHTML = beautify.map((event) => {
      return `
        <li style="margin: 10px 0;">
          <strong>Event:</strong> ${event.summary || "No Title"}<br>
          <strong>Description:</strong> ${event.desc || "No description"}<br>
          <strong>Start Time:</strong> ${event.time.start || "N/A"}<br>
          <strong>End Time:</strong> ${event.time.end || "N/A"}
        </li>
      `;
    }).join('');

    const eventsMessage = `
    <p><strong>Here are your upcoming events:</strong></p>
    <br/>
    <ul>${eventsHTML}</ul>
    <br/>
    <p><strong>Note:</strong> The above events are based on your current calendar schedule. If you need any modifications, feel free to let me know!</p>
    <p><strong>Stay productive!</strong> 🚀</p>
  `;

    return { events: eventsMessage || []  , html : true };
  } catch (error) {
    console.error("Error fetching events:", error.message);
    return { events: [], error: error.message };
  }
}


export { getEvents , deleteEvent ,addEvent ,  updateEvent };